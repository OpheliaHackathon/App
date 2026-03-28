import { LogoutButton } from "@/components/auth/logout-button";
import { Button } from "@/components/ui/button";
import { SafeAreaView } from "@/components/ui/safe-area-view";
import client from "@/lib/fetcher";
import { authClient } from "@/lib/auth";
import { setUserOnboardingComplete } from "@/lib/onboarding-storage";
import type { ComponentRef, ReactNode } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { Href } from "expo-router";
import { router, useFocusEffect } from "expo-router";
import { Music2, Sparkles, Store, Tv } from "lucide-react-native";
import { withUniwind } from "uniwind";

const UniwindView = withUniwind(View);
const UniwindText = withUniwind(Text);
const UniwindPressable = withUniwind(Pressable);
const UniwindFlatList = withUniwind(FlatList);
const UniwindActivityIndicator = withUniwind(ActivityIndicator);

/** Padding orizzontale equivalente a `px-5` sul contenitore storie (20 + 20). */
const STORY_HORIZONTAL_PAD = 40;

const STORY_PAGES: {
  icon: ReactNode;
  title: string;
  body: string;
  foot: string;
}[] = [
  {
    icon: <Sparkles size={40} color="#fed7aa" strokeWidth={2} />,
    title: "Benvenuto in Faindy",
    body: "Un negozio che impara da te: musica, video e preferenze si trasformano in consigli intelligenti.",
    foot: "Iniziamo in allegria.",
  },
  {
    icon: <Store size={40} color="#ea580c" strokeWidth={2} />,
    title: "Scopri il Negozio",
    body: "Sfoglia il catalogo, apri una scheda prodotto e scopri chi l’ha pubblicato. Un tap per entrare nel dettaglio.",
    foot: "Tutto parte dalla home.",
  },
  {
    icon: (
      <UniwindView className="flex-row gap-1">
        <Tv size={36} color="#c2410c" strokeWidth={2} />
        <Music2 size={36} color="#c2410c" strokeWidth={2} />
      </UniwindView>
    ),
    title: "Il tuo gusto, in due flussi",
    body: "Collega Google per i Mi piace su YouTube e Spotify per le canzoni che ascolti di più. Servono entrambi per il profilo magico.",
    foot: "Niente spam: solo token per leggere i gusti.",
  },
  {
    icon: <Sparkles size={40} color="#c2410c" strokeWidth={2} />,
    title: "Sync e consigli",
    body: "Il server unisce YouTube + Spotify e crea umore, personalità e interessi. Poi un agente AI può proporti prodotti in linea con te.",
    foot: "Un tap su sincronizza aggiorna tutto.",
  },
];

type ProviderId = "google" | "spotify";

function accountProviders(
  accounts: { providerId: string }[] | undefined,
): Record<ProviderId, boolean> {
  const ids = new Set((accounts ?? []).map((a) => a.providerId));
  return {
    google: ids.has("google"),
    spotify: ids.has("spotify"),
  };
}

/**
 * Onboarding: tour introduttivo, collegamento OAuth Google/Spotify e sync profilo prima della home.
 */
export default function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  const { data: session } = authClient.useSession();
  const userId = session?.user?.id;
  const { width: windowWidth } = useWindowDimensions();
  const storyPageWidth = Math.max(200, windowWidth - STORY_HORIZONTAL_PAD);

  const [storyIndex, setStoryIndex] = useState(0);
  const [phase, setPhase] = useState<"story" | "accounts">("story");
  const [accounts, setAccounts] = useState<{ providerId: string }[] | null>(
    null,
  );
  const [accountsLoading, setAccountsLoading] = useState(true);
  const [linkBusy, setLinkBusy] = useState<ProviderId | null>(null);
  const [syncBusy, setSyncBusy] = useState(false);
  const [syncDone, setSyncDone] = useState(false);

  const bounce = useRef(new Animated.Value(0)).current;
  const storyRef = useRef<ComponentRef<typeof UniwindFlatList> | null>(null);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounce, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(bounce, {
          toValue: 0,
          duration: 900,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [bounce]);

  const loadAccounts = useCallback(async () => {
    setAccountsLoading(true);
    try {
      const res = await authClient.listAccounts();
      if (res.error) throw res.error;
      setAccounts(res.data ?? []);
    } catch (e) {
      console.error(e);
      setAccounts([]);
    } finally {
      setAccountsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadAccounts();
    }, [loadAccounts]),
  );

  const linked = accountProviders(accounts ?? []);

  async function linkProvider(p: ProviderId) {
    setLinkBusy(p);
    try {
      const { error } = await authClient.linkSocial({
        provider: p,
        callbackURL: "/onboarding",
      });
      if (error) throw error;
      await loadAccounts();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Collegamento non riuscito";
      Alert.alert("Oops", msg);
    } finally {
      setLinkBusy(null);
    }
  }

  async function runSync() {
    setSyncBusy(true);
    try {
      const res = await client.sync.get();
      if (res.error != null) {
        const body = res.error.value as { error?: string } | undefined;
        const msg =
          typeof body?.error === "string"
            ? body.error
            : "Controlla di aver collegato Google e Spotify.";
        throw new Error(msg);
      }
      setSyncDone(true);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Sincronizzazione fallita";
      Alert.alert("Sync", msg);
    } finally {
      setSyncBusy(false);
    }
  }

  async function finish() {
    if (!userId) return;
    await setUserOnboardingComplete(userId);
    router.replace("/" as Href);
  }

  function onStoryMomentumEnd(e: NativeSyntheticEvent<NativeScrollEvent>) {
    const x = e.nativeEvent.contentOffset.x;
    setStoryIndex(Math.round(x / storyPageWidth));
  }

  function goNextStory() {
    if (storyIndex < STORY_PAGES.length - 1) {
      const next = storyIndex + 1;
      storyRef.current?.scrollToOffset({
        offset: next * storyPageWidth,
        animated: true,
      });
      setStoryIndex(next);
    } else {
      setPhase("accounts");
    }
  }

  if (!userId) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-background">
        <UniwindActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["bottom"]}>
      <UniwindView
        className="flex-1 px-5"
        style={{ paddingTop: insets.top + 8 }}
      >
        {phase === "story" ? (
          <>
            <UniwindView className="mb-4 flex-row items-center justify-between gap-2">
              <UniwindText
                className="min-w-0 flex-1 text-3xl font-black text-text"
                numberOfLines={2}
              >
                Ciao{session?.user?.name ? `, ${session.user.name}` : ""}!
              </UniwindText>
              <LogoutButton />
            </UniwindView>

            <UniwindFlatList
              ref={storyRef}
              data={STORY_PAGES}
              keyExtractor={(_, i) => String(i)}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={onStoryMomentumEnd}
              decelerationRate="fast"
              style={{ flex: 1, width: "100%" }}
              getItemLayout={(_, index) => ({
                length: storyPageWidth,
                offset: storyPageWidth * index,
                index,
              })}
              renderItem={({ item }) => {
                const story = item as (typeof STORY_PAGES)[number];
                return (
                  <UniwindView
                    style={{ width: storyPageWidth }}
                    className="flex-1"
                  >
                    <UniwindView>
                      <UniwindText className="text-2xl font-bold leading-8 text-text">
                        {story.title}
                      </UniwindText>
                      <UniwindText className="mt-3 text-base leading-6 text-input">
                        {story.body}
                      </UniwindText>
                      <UniwindText className="mt-5 text-sm font-semibold text-primary">
                        {story.foot}
                      </UniwindText>
                    </UniwindView>
                  </UniwindView>
                );
              }}
            />

            <UniwindView className="my-4 flex-row items-center justify-center gap-2">
              {STORY_PAGES.map((_, i) => (
                <UniwindView
                  key={i}
                  className={`h-2 rounded-full ${
                    i === storyIndex ? "w-6 bg-primary" : "w-2 bg-border"
                  }`}
                />
              ))}
            </UniwindView>

            <Button
              label={
                storyIndex < STORY_PAGES.length - 1
                  ? "Avanti"
                  : "Collega i servizi"
              }
              size="lg"
              className="w-full"
              onPress={goNextStory}
            />
            <UniwindPressable
              onPress={() => setPhase("accounts")}
              className="mt-3 py-2"
            >
              <UniwindText className="text-center text-sm text-input">
                {storyIndex < STORY_PAGES.length - 1
                  ? "Salta il tour"
                  : "Salta al collegamento"}
              </UniwindText>
            </UniwindPressable>
          </>
        ) : (
          <>
            <UniwindView className="flex-row items-start justify-between gap-2">
              <UniwindView className="min-w-0 flex-1">
                <UniwindText className="text-2xl font-bold text-text">
                  Collega Google & Spotify
                </UniwindText>
                <UniwindText className="mt-2 text-base leading-6 text-input">
                  Due tap per dare colore al tuo profilo. Poi sincronizziamo
                  gusti e interessi.
                </UniwindText>
              </UniwindView>
              <LogoutButton />
            </UniwindView>

            <UniwindView className="mt-6 gap-3">
              <UniwindPressable
                onPress={() =>
                  !linkBusy && linked.google === false && linkProvider("google")
                }
                disabled={!!linkBusy || linked.google}
                className={`rounded-2xl border-2 border-border bg-card p-4 active:opacity-85 ${
                  linked.google ? "opacity-60" : ""
                }`}
              >
                <UniwindText className="text-lg font-bold text-text">
                  YouTube via Google
                </UniwindText>
                <UniwindText className="mt-1 text-sm text-input">
                  Leggiamo i Mi piace per capire cosa ti ispira.
                </UniwindText>
                <UniwindText className="mt-3 text-xs font-medium text-primary">
                  {accountsLoading
                    ? "Controllo account…"
                    : linked.google
                      ? "Collegato"
                      : linkBusy === "google"
                        ? "Apertura browser…"
                        : "Tocca per collegare"}
                </UniwindText>
              </UniwindPressable>

              <UniwindPressable
                onPress={() =>
                  !linkBusy &&
                  linked.spotify === false &&
                  linkProvider("spotify")
                }
                disabled={!!linkBusy || linked.spotify}
                className={`rounded-2xl border-2 border-border bg-card p-4 active:opacity-85 ${
                  linked.spotify ? "opacity-60" : ""
                }`}
              >
                <UniwindText className="text-lg font-bold text-text">
                  Spotify top tracks
                </UniwindText>
                <UniwindText className="mt-1 text-sm text-input">
                  La tua musica recente completa il ritratto.
                </UniwindText>
                <UniwindText className="mt-3 text-xs font-medium text-primary">
                  {accountsLoading
                    ? "Controllo account…"
                    : linked.spotify
                      ? "Collegato"
                      : linkBusy === "spotify"
                        ? "Apertura browser…"
                        : "Tocca per collegare"}
                </UniwindText>
              </UniwindPressable>
            </UniwindView>

            <UniwindView className="mt-8 flex-1 justify-end gap-3 pb-2">
              {syncDone ? (
                <>
                  <UniwindView className="items-center rounded-2xl border border-primary/40 bg-primary/10 px-4 py-5">
                    <UniwindText className="text-center text-4xl">
                      🪄
                    </UniwindText>
                    <UniwindText className="mt-2 text-center text-base font-semibold text-text">
                      Profilo aggiornato!
                    </UniwindText>
                    <UniwindText className="mt-1 text-center text-sm text-input">
                      Ora il backend conosce i tuoi mood e interessi. In negozio
                      potrai ricevere picks più pertinenti.
                    </UniwindText>
                  </UniwindView>
                  <Button
                    label="Entra nel Negozio"
                    size="lg"
                    className="w-full"
                    onPress={finish}
                  />
                </>
              ) : (
                <>
                  <Button
                    label="Sincronizza il mio profilo"
                    size="lg"
                    className="w-full"
                    loading={syncBusy}
                    disabled={
                      !linked.google || !linked.spotify || accountsLoading
                    }
                    onPress={runSync}
                  />
                  <Button
                    variant="ghost"
                    label="Torna al tour"
                    className="w-full"
                    onPress={() => setPhase("story")}
                  />
                </>
              )}
            </UniwindView>
          </>
        )}
      </UniwindView>
    </SafeAreaView>
  );
}
