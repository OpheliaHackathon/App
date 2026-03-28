# Faindy

Monorepo **Bun** + **Turbo** che include:

- **`api`**: backend [Elysia](https://elysiajs.com/) su porta **3000**, autenticazione [Better Auth](https://www.better-auth.com/) con adapter Prisma, catalogo prodotti, sincronizzazione, raccomandazioni assistite da AI e job interni.
- **`app`**: client mobile **[Expo](https://expo.dev/)** (~55) con **Expo Router**, **React Native**, **Uniwind** (Tailwind) e client type-safe verso l’API tramite **Eden**.

Nome pacchetto root: `faindy`. Deep link / scheme app: **`faindy://`**.

---

## Prerequisiti

- Bun
- PostgreSQL
- Account **Google Cloud** (OAuth) con Client ID/Secret per login Google e scope YouTube indicati nel codice.
- Account **Spotify Developer** per login social Spotify.
- Chiave **OpenAI** per embedding, agente shop assistant e generazione raccomandazioni.
- (Opzionale) Negozio **Shopify** e token Admin API per import prodotti da CLI.

---

## Installazione

Dalla root del repository:

```bash
bun install
```

Turbo installerà le dipendenze di **`app`** e **`api`** come workspace.

---

## Variabili d’ambiente

### API (`api/.env`)

Copia il template e compila i valori:

```bash
cp api/.env.example api/.env
```

| Variabile                                     | Obbligatorio      | Descrizione                                                                                                                              |
| --------------------------------------------- | ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `DATABASE_URL`                                | Sì                | Connection string PostgreSQL (con pgvector disponibile).                                                                                 |
| `BETTER_AUTH_SECRET`                          | Sì                | Segreto per firmare sessioni Better Auth (stringa lunga e casuale in produzione).                                                        |
| `BETTER_AUTH_URL`                             | Sì in prod        | URL pubblico dell’API, es. `http://localhost:3000` in locale. Deve coincidere con ciò che la app usa come base URL (vedi sotto).         |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`   | Per Google OAuth  | Se vuoti, configura comunque il provider solo se usi Google.                                                                             |
| `SPOTIFY_CLIENT_ID` / `SPOTIFY_CLIENT_SECRET` | Per Spotify OAuth | Come sopra per Spotify.                                                                                                                  |
| `OPENAI_API_KEY`                              | Per funzioni AI   | Embedding articoli, assistente, batch raccomandazioni.                                                                                   |
| `SHOPIFY_SHOP` / `SHOPIFY_ADMIN_ACCESS_TOKEN` | Opzionale         | Comodo per `shopify:fetch-products` senza passare shop/token da CLI.                                                                     |
| `CRON_SECRET`                                 | Opzionale         | Bearer condiviso per chiamare `POST /internal/jobs/nightly-recommendations`. Se assente, la route non espone il job (risposta generica). |

### App Expo (`app/.env`)

```bash
cp app/.env.example app/.env
```

| Variabile             | Descrizione                                                                                                                                                                                                                                                                                                                                               |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `EXPO_PUBLIC_API_URL` | URL base dell’API **esattamente** come la raggiunge il dispositivo/emulatore. In locale spesso `http://localhost:3000` va bene solo per **web** o emulatori che condividono la rete del PC. Su **telefono fisico** usa l’IP LAN del Mac/PC (es. `http://192.168.1.x:3000`) oppure un tunnel (**ngrok**, Cloudflare Tunnel, ecc.) e incolla quell’URL qui. |

Se non imposti nulla, in codice il fallback è `http://localhost:3000` (vedi `app/src/lib/constants.ts`).

**OAuth e deep link:** il server è configurato con `trustedOrigins` che includono `faindy://` e, in sviluppo, schemi `exp://...` tipici di Expo. Assicurati che **`BETTER_AUTH_URL`** punti all’host raggiungibile dal client che completa il flusso OAuth.

---

## Database: migration e seed

Dalla cartella **`api`**:

1. **Applicare le migration** (Prisma 7):

   ```bash
   cd api
   bunx prisma migrate deploy
   ```

   In sviluppo, per creare/aggiornare il DB interattivamente:

   ```bash
   bunx prisma migrate dev
   ```

2. **Popolare dati di esempio** (aziende + articoli):

   ```bash
   bun run db:seed
   ```

3. **Embedding degli articoli** (richiede `OPENAI_API_KEY` e colonne vector già migrate):

   ```bash
   bun run db:embed-articles
   ```

---

## Avvio in sviluppo

### Tutto insieme (root)

```bash
bun dev
```

Avvia in parallelo i task `dev` di **`api`** e **`app`** tramite Turbo (API in watch su porta 3000, Expo dev server per la app).

### Singolarmente

**API:**

```bash
cd api && bun run dev
```

**App Expo:**

```bash
cd app && bun run dev
```

Comandi utili dalla **`app`**:

- `bun run android` — build/run nativo Android
- `bun run ios` — build/run nativo iOS
- `bun run web` — Expo web

---

## Script API aggiuntivi

Esegui da **`api`**:

| Comando                                | Scopo                                                                        |
| -------------------------------------- | ---------------------------------------------------------------------------- |
| `bun run start`                        | Avvio produzione (senza watch): `src/index.ts`.                              |
| `bun run jobs:nightly-recommendations` | Esegue il batch che rigenera le raccomandazioni per tutti gli utenti.        |
| `bun run shopify:fetch-products`       | Sincronizza/importa prodotti da Shopify (shop/token da env o argomenti CLI). |

---

## Endpoint e funzioni principali dell’API

- **`GET /`**: health minimale (`{ online: true }`).
- **Better Auth**: montato sull’app Elysia (`/api/auth/...` secondo convenzione Better Auth — verifica i path esatti nella documentazione Better Auth o ispezionando `auth.handler`).
- **`/catalog`**, **`/sync`**, **`/recommendations`**, **`/assistant`**: route di dominio (catalogo, sync client, raccomandazioni, assistente conversazionale).
- **`POST /internal/jobs/nightly-recommendations`**: job protetto da `Authorization: Bearer <CRON_SECRET>`.

L’API applica header di sicurezza di base su ogni risposta (`X-Content-Type-Options`, `X-Frame-Options`, ecc.).

---

## Utilizzo dell’app mobile

1. Avvia l’**API** e verifica `GET http://<tuo-host>:3000/`.
2. Imposta **`EXPO_PUBLIC_API_URL`** su un URL che il **dispositivo** raggiunge (LAN o tunnel).
3. Avvia **`bun dev`** nella root o solo nella **`app`**.
4. Autenticazione: l’app usa **`authClient.useSession()`** nello stack Expo Router: schermate **pubbliche** finché non c’è sessione, **private** dopo il login (email/password e/o social se configurati sul server).
5. Deep link **`faindy://`**: allineato a `app.json` e al plugin Expo di Better Auth.

---

## Struttura del repository (sintesi)

```
├── api/                 # Backend Elysia + Prisma
│   ├── prisma/          # schema, migrations, seed
│   └── src/
│       ├── lib/         # auth, prisma, shopify, weather, recommendations, agents
│       └── routes/      # catalog, sync, recommendations, assistant, internal-jobs
├── app/                 # Expo Router + React Native
│   └── src/
│       ├── app/         # route file-based (public/private)
│       ├── components/
│       └── lib/         # auth client, constants, API helpers
├── package.json         # workspaces + turbo dev
└── turbo.json
```

---

## Risoluzione problemi comuni

- **`401`/sessione assente sulle route protette:** cookie o sessione non validi; controlla che `BETTER_AUTH_URL` e `EXPO_PUBLIC_API_URL` puntino allo stesso backend raggiungibile e che il tempo di sistema non sia fuori sync eccessivo.
- **Telefono non raggiunge `localhost`:** usa IP LAN o tunnel; aggiorna `.env` dell’app e riavvia Expo.
- **Errori su `vector`:** installa/abilita **pgvector** sul server PostgreSQL e riesegui le migration.
- **OAuth redirect errato:** verifica URI di redirect consentiti nel provider (Google/Spotify) e URL pubblico dell’API.
