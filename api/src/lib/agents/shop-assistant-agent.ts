import { openai } from "@ai-sdk/openai";
import { Output, tool, ToolLoopAgent } from "ai";
import { z } from "zod";
import {
  embedForSearch,
  findSimilarArticles,
  type ArticleCandidate,
} from "../product-retrieval";
import { fetchCurrentWeatherForCity } from "../weather/open-meteo";

const CATALOG_SEARCH_MIN_LEN = 2;

export const shopAssistantOutputSchema = z.object({
  reply: z.string().min(1),
  suggestedProductIds: z.array(z.string()).max(12),
});

export type ShopAssistantOutput = z.infer<typeof shopAssistantOutputSchema>;

export function createShopAssistantAgent(profileSummaryLines: string | null) {
  const profileBlock =
    profileSummaryLines?.trim() ??
    "(Profilo utente non disponibile o vuoto — usa solo ciò che dice l'utente.)";

  const searchCatalog = tool({
    description:
      "Ricerca semantica nel catalogo prodotti. Chiamalo con l'intento dell'utente (parole chiave o frase in italiano/inglese). Restituisce candidati con id, titolo, prezzo, categoria, similarità.",
    inputSchema: z.object({
      query: z.string().describe("Testo di ricerca / intento prodotto."),
      limit: z
        .number()
        .int()
        .min(4)
        .max(48)
        .optional()
        .describe("Numero massimo candidati (default 24)."),
    }),
    execute: async ({ query, limit = 24 }) => {
      const q = query.trim();
      if (q.length < CATALOG_SEARCH_MIN_LEN) {
        return {
          candidates: [] as ArticleCandidate[],
          error: `La query deve avere almeno ${CATALOG_SEARCH_MIN_LEN} caratteri.`,
        };
      }
      try {
        const vector = await embedForSearch(q);
        const candidates = await findSimilarArticles(vector, limit);
        return { candidates };
      } catch (e) {
        const message =
          e instanceof Error ? e.message : "Ricerca catalogo non riuscita";
        return { candidates: [] as ArticleCandidate[], error: message };
      }
    },
  });

  const getWeather = tool({
    description:
      "Meteo attuale per una città (Open-Meteo). Usalo se l'utente chiede il tempo o per contestualizzare consigli (es. pioggia, caldo).",
    inputSchema: z.object({
      city: z.string().describe("Nome città, es. Milano, Roma."),
    }),
    execute: async ({ city }) => {
      const result = await fetchCurrentWeatherForCity(city);
      if (!result.ok) {
        return { error: result.error };
      }
      return { weather: result.data };
    },
  });

  return new ToolLoopAgent({
    model: openai("gpt-5.4-mini"),
    instructions: `Sei un assistente shopping in italiano per un marketplace B2B/catalogo prodotti.

Contesto profilo utente (opzionale):
${profileBlock}

Regole:
- Rispondi sempre in italiano, tono cordiale e conciso.
- Per suggerire prodotti reali DEVI chiamare searchCatalog con una query adeguata all'ultima richiesta dell'utente (puoi rifinire la query in più passaggi iterando il tool).
- Se serve meteo o contesto climatico, chiama getWeather con la città indicata o quella più probabile dalla conversazione.
- Nel campo suggestedProductIds dell'output strutturato inserisci SOLO id articolo che compaiono tra i candidati restituiti da searchCatalog nelle tue chiamate tool. Non inventare id.
- Se non hai candidati utili, lascia suggestedProductIds vuoto e spiega nel reply cosa serve (es. query più specifica).
- Ordina suggestedProductIds dalla proposta più rilevante alla meno rilevante (max 12).`,
    tools: { searchCatalog, getWeather },
    output: Output.object({ schema: shopAssistantOutputSchema }),
  });
}
