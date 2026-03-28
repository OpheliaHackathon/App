import {
  ProductGridCard,
  type ProductGridCardItem,
} from "@/components/catalog/product-grid-card";
import { PrivateScreenHeader } from "@/components/layout/private-screen-header";
import client from "@/lib/fetcher";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "@/lib/rnw";
import { assertTreatyValue } from "@/lib/treaty-utils";
import type { Href } from "expo-router";
import { useSegments } from "expo-router";
import { MessageCircle, Send, Sparkles } from "lucide-react-native";
import { useCallback, useRef, useState, type ComponentRef } from "react";
import type { ColorValue } from "react-native";
import { KeyboardAvoidingView, Modal, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useCSSVariable } from "uniwind";

type ChatTurn = {
  role: "user" | "assistant";
  content: string;
  products?: ProductGridCardItem[];
  weather?: WeatherPayload | null;
};

type WeatherPayload = {
  city: string;
  country?: string;
  temperatureC: number;
  conditionIt: string;
  humidityPct?: number;
  windKmh?: number;
};

function buildApiHistory(messages: ChatTurn[]): {
  role: "user" | "assistant";
  content: string;
}[] {
  return messages.map((m) => ({ role: m.role, content: m.content }));
}

/**
 * FAB + modale chat: assistente prodotti (agente con tool) e card meteo quando disponibile.
 */
export function ProductChatBot() {
  const segments = useSegments();
  const segs = segments as string[];
  const hideFab =
    segs.includes("onboarding") || segs.includes("product");

  const insets = useSafeAreaInsets();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatTurn[]>([]);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<ComponentRef<typeof ScrollView>>(null);

  const placeholderColor = useCSSVariable("--color-placeholder");
  const borderColor = useCSSVariable("--color-border");
  const primaryColor = useCSSVariable("--color-primary");

  const scrollToBottom = useCallback(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, []);

  async function onSend() {
    const text = input.trim();
    if (!text || sending) return;

    setError(null);
    setInput("");
    const userTurn: ChatTurn = { role: "user", content: text };
    const nextThread = [...messages, userTurn];
    setMessages(nextThread);
    setSending(true);

    requestAnimationFrame(() => scrollToBottom());

    try {
      const history = buildApiHistory(messages);
      const res = await client.assistant.chat.post({
        message: text,
        history: history.length ? history : undefined,
      });
      const data = assertTreatyValue(res);
      const products = (data.products ?? []) as ProductGridCardItem[];
      const weather = data.weather as WeatherPayload | null | undefined;
      setMessages([
        ...nextThread,
        {
          role: "assistant",
          content: data.reply,
          products,
          weather: weather ?? null,
        },
      ]);
    } catch (e) {
      const msg =
        e instanceof Error ? e.message : "Impossibile contattare l’assistente.";
      setError(msg);
      setMessages(nextThread);
    } finally {
      setSending(false);
      setTimeout(scrollToBottom, 100);
    }
  }

  if (hideFab) return null;

  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        accessibilityRole="button"
        accessibilityLabel="Apri assistente prodotti"
        className="absolute z-50 h-14 w-14 items-center justify-center rounded-full bg-primary shadow-lg active:opacity-90"
        style={{
          bottom: Math.max(insets.bottom, 12) + 16,
          right: Math.max(insets.right, 16),
        }}
      >
        <MessageCircle size={26} color="white" strokeWidth={2.2} />
      </Pressable>

      <Modal
        visible={open}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={() => setOpen(false)}
      >
        <KeyboardAvoidingView
          className="flex-1 bg-background"
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <PrivateScreenHeader
            title="Assistente prodotti"
            onBack={() => setOpen(false)}
          />

          <ScrollView
            ref={scrollRef}
            className="flex-1"
            contentContainerClassName="px-5 py-5 pb-[120px]"
            keyboardShouldPersistTaps="handled"
            onContentSizeChange={scrollToBottom}
            showsVerticalScrollIndicator={false}
          >
            {messages.length === 0 && !sending && (
              <View className="rounded-[24px] border-2 border-secondary/40 bg-card px-5 py-4">
                <View className="flex-row items-center gap-2">
                  <Sparkles
                    size={20}
                    color={(primaryColor as string) ?? "#c026d3"}
                    strokeWidth={2.2}
                  />
                  <Text className="text-sm font-black uppercase tracking-wide text-primary">
                    Consigli su misura
                  </Text>
                </View>
                <Text className="mt-3 text-base font-medium leading-7 text-input">
                  Chiedi cosa cercare: l’assistente scava nel catalogo e ti
                  propone i pezzi più rilevanti.
                </Text>
              </View>
            )}

            {messages.map((m, i) => (
              <View
                key={`${m.role}-${i}-${m.content.slice(0, 24)}`}
                className={`mb-5 ${m.role === "user" ? "items-end" : "items-start"}`}
              >
                <View
                  className={`max-w-[90%] px-4 py-3 ${
                    m.role === "user"
                      ? "rounded-[22px] bg-primary"
                      : "rounded-[22px] border-2 border-border bg-card"
                  }`}
                >
                  <Text
                    className={`text-base font-medium leading-7 ${
                      m.role === "user" ? "text-white" : "text-text"
                    }`}
                  >
                    {m.content}
                  </Text>
                </View>

                {m.role === "assistant" && m.weather ? (
                  <View className="mt-3 w-full max-w-[90%] rounded-[22px] border-2 border-primary/30 bg-card px-4 py-3">
                    <View className="flex-row items-center gap-2">
                      <Sparkles
                        size={18}
                        color={(primaryColor as string) ?? "#c026d3"}
                        strokeWidth={2.2}
                      />
                      <Text className="text-xs font-black uppercase tracking-wide text-primary">
                        Meteo
                      </Text>
                    </View>
                    <Text className="mt-2 text-base font-bold text-text">
                      {m.weather.city}
                      {m.weather.country ? ` · ${m.weather.country}` : ""}
                    </Text>
                    <Text className="mt-1 text-lg font-bold text-text">
                      {Math.round(m.weather.temperatureC)}°C —{" "}
                      {m.weather.conditionIt}
                    </Text>
                    {(m.weather.humidityPct != null ||
                      m.weather.windKmh != null) && (
                      <Text className="mt-2 text-sm font-medium text-input">
                        {m.weather.humidityPct != null
                          ? `Umidità ${Math.round(m.weather.humidityPct)}%`
                          : ""}
                        {m.weather.humidityPct != null &&
                        m.weather.windKmh != null
                          ? " · "
                          : ""}
                        {m.weather.windKmh != null
                          ? `Vento ${Math.round(m.weather.windKmh)} km/h`
                          : ""}
                      </Text>
                    )}
                  </View>
                ) : null}

                {m.role === "assistant" &&
                m.products &&
                m.products.length > 0 ? (
                  <View className="mt-2 w-full flex-row flex-wrap gap-2">
                    {m.products.map((item) => (
                      <View key={item.id} className="w-[48%]">
                        <ProductGridCard
                          item={item}
                          href={`/product/${item.id}` as Href}
                          emphasis="subtle"
                          onBeforeNavigate={() => setOpen(false)}
                        />
                      </View>
                    ))}
                  </View>
                ) : null}
              </View>
            ))}

            {sending && (
              <View className="items-start py-2">
                <ActivityIndicator
                  size="small"
                  color={(primaryColor as string) ?? "#c026d3"}
                />
              </View>
            )}

            {error ? (
              <Text className="mt-4 text-center text-sm font-semibold text-error">
                {error}
              </Text>
            ) : null}
          </ScrollView>

          <View
            className="border-t-2 border-border bg-card px-5 pt-3"
            style={{ paddingBottom: Math.max(insets.bottom, 14) }}
          >
            <View className="flex-row items-end gap-3">
              <TextInput
                value={input}
                onChangeText={setInput}
                placeholder="Scrivi un messaggio…"
                placeholderTextColor={placeholderColor as ColorValue}
                multiline
                maxLength={2000}
                editable={!sending}
                className="max-h-28 min-h-12 flex-1 rounded-full bg-background px-4 py-3 text-base font-medium text-text"
                style={{ borderWidth: 1, borderColor: borderColor as string }}
                onSubmitEditing={onSend}
              />
              <Pressable
                onPress={() => void onSend()}
                disabled={sending || !input.trim()}
                className="mb-[2px] h-12 w-12 items-center justify-center rounded-full bg-primary active:opacity-90 disabled:opacity-40"
                accessibilityRole="button"
                accessibilityLabel="Invia messaggio"
              >
                {sending ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <Send size={20} color="white" strokeWidth={2.2} />
                )}
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
}
