import { AppImage, Pressable, ScrollView, Text, View } from "@/lib/rnw";
import { router } from "expo-router";
import { Search, Sparkles } from "lucide-react-native";
import type { ColorValue } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useCSSVariable } from "uniwind";

export type FeedItem = {
  id: string;
  title: string;
  imageUrl: string;
  price: string;
  reason: string;
};

/** Fonte del feed: curato dall'agente o anteprima vettoriale. */
export type FeedSource = "curated" | "vector_preview";

/**
 * Apre la scheda prodotto passando il contesto della raccomandazione (motivo e origine).
 */
export function openProductFromFeed(item: FeedItem, source: FeedSource) {
  router.push({
    pathname: "/product/[id]",
    params: {
      id: item.id,
      pickReason: item.reason ?? "",
      pickSource: source,
    },
  });
}

function ReasonSnippet({ text }: { text: string }) {
  const accent = useCSSVariable("--color-primary");
  if (!text) return null;
  return (
    <View className="mt-2 flex-row items-start gap-2 rounded-2xl bg-playSurface px-3 py-2.5">
      <Sparkles
        size={16}
        color={(accent as string) ?? "#c026d3"}
        strokeWidth={2.2}
      />
      <Text
        className="flex-1 text-[13px] font-medium leading-5 text-input"
        numberOfLines={4}
      >
        {text}
      </Text>
    </View>
  );
}

/**
 * Sezioni del feed home: hero, carosello orizzontale e griglia — stesso design system ovunque.
 */
export function FeedSections({
  items,
  source,
}: {
  items: FeedItem[];
  source: FeedSource;
}) {
  if (items.length === 0) return null;

  const [hero, ...rest] = items;
  const row = rest.slice(0, 4);
  const grid = rest.slice(4);

  return (
    <View className="gap-8 pb-10">
      <Pressable
        onPress={() => openProductFromFeed(hero, source)}
        className="mx-4 overflow-hidden rounded-[28px] border-[3px] border-secondary/35 bg-card active:opacity-95"
        style={{
          shadowColor: "#6d28d9",
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.18,
          shadowRadius: 16,
          elevation: 8,
        }}
      >
        <View className="absolute left-4 top-4 z-10 rounded-full bg-tertiary px-3 py-1">
          <Text className="text-xs font-extrabold uppercase tracking-wide text-[#292524]">
            Top pick
          </Text>
        </View>
        <AppImage
          source={{ uri: hero.imageUrl }}
          className="aspect-16/10 w-full bg-border"
          contentFit="cover"
          transition={200}
        />
        <View className="p-5">
          <View className="flex-row flex-wrap items-center gap-2">
            <Text className="text-lg">✨</Text>
            <Text className="text-xs font-bold uppercase tracking-wider text-primary">
              {source === "curated"
                ? "Scelto per te oggi"
                : "Abbinato al tuo profilo"}
            </Text>
          </View>
          <Text
            className="mt-2 text-xl font-bold leading-7 text-text"
            numberOfLines={2}
          >
            {hero.title}
          </Text>
          <ReasonSnippet text={hero.reason} />
          <Text className="mt-4 text-2xl font-black text-primary">
            {hero.price}
          </Text>
        </View>
      </Pressable>

      {row.length > 0 ? (
        <View>
          <View className="mb-4 flex-row items-center gap-2 px-4">
            <Text className="text-lg">💫</Text>
            <Text className="text-lg font-bold text-text">Altre idee</Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerClassName="gap-4 px-4 pb-1"
          >
            {row.map((item, i) => (
              <Pressable
                key={item.id}
                onPress={() => openProductFromFeed(item, source)}
                className="w-[156px] overflow-hidden rounded-[22px] border-2 border-primary/20 bg-card active:opacity-92"
                style={{
                  transform: [{ rotate: i % 2 === 0 ? "-1.5deg" : "1.5deg" }],
                }}
              >
                <AppImage
                  source={{ uri: item.imageUrl }}
                  className="aspect-square w-full bg-border"
                  contentFit="cover"
                  transition={200}
                />
                <View className="p-3">
                  <Text
                    className="text-xs font-bold leading-4 text-text"
                    numberOfLines={2}
                  >
                    {item.title}
                  </Text>
                  {item.reason ? (
                    <Text
                      className="mt-1.5 text-[10px] font-medium leading-4 text-primary"
                      numberOfLines={2}
                    >
                      {item.reason}
                    </Text>
                  ) : null}
                  <Text className="mt-2 text-sm font-black text-secondary">
                    {item.price}
                  </Text>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      ) : null}

      {grid.length > 0 ? (
        <View className="px-4">
          <View className="mb-4 flex-row items-center gap-2">
            <Text className="text-lg">🎁</Text>
            <Text className="text-lg font-bold text-text">
              Ancora da scoprire
            </Text>
          </View>
          <View className="flex-row flex-wrap justify-between gap-y-5">
            {grid.map((item, i) => (
              <Pressable
                key={item.id}
                onPress={() => openProductFromFeed(item, source)}
                className="w-[48%] overflow-hidden rounded-[22px] border-2 border-border bg-card active:opacity-92"
                style={{
                  borderColor:
                    i % 3 === 0
                      ? "rgba(192, 38, 211, 0.35)"
                      : i % 3 === 1
                        ? "rgba(13, 148, 136, 0.35)"
                        : "rgba(245, 158, 11, 0.45)",
                }}
              >
                <AppImage
                  source={{ uri: item.imageUrl }}
                  className="aspect-square w-full bg-border"
                  contentFit="cover"
                  transition={200}
                />
                <View className="p-3">
                  {item.reason ? (
                    <View className="mb-1.5 rounded-lg bg-pickGlow px-2 py-1">
                      <Text
                        className="text-[10px] font-semibold leading-4 text-primary"
                        numberOfLines={2}
                      >
                        {item.reason}
                      </Text>
                    </View>
                  ) : null}
                  <Text
                    className="text-xs font-bold leading-4 text-text"
                    numberOfLines={2}
                  >
                    {item.title}
                  </Text>
                  <Text className="mt-2 text-sm font-black text-primary">
                    {item.price}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>
        </View>
      ) : null}
    </View>
  );
}

type HomeHeroHeaderProps = {
  textMuted: ColorValue | string;
  onSearchPress: () => void;
};

/**
 * Blocco hero in cima alla home (non una schermata con back): ricerca come CTA principale.
 */
export function HomeHeroHeader({
  textMuted,
  onSearchPress,
}: HomeHeroHeaderProps) {
  const insets = useSafeAreaInsets();
  return (
    <View
      className="overflow-hidden rounded-b-[32px] bg-header px-5 pb-6"
      style={{ paddingTop: insets.top + 12 }}
    >
      <View className="flex-row items-start justify-between">
        <View className="flex-1 pr-3">
          <Text className="text-sm font-black uppercase tracking-widest text-headerMuted">
            Faindy
          </Text>
          <Text className="mt-2 text-3xl font-black leading-9 text-white">
            I prodotti scelti per te
          </Text>
          <Text className="mt-2 text-base font-medium leading-6 text-white/85">
            Ecco cosa il nostro agente ha selezionato per te oggi.
          </Text>
        </View>
        <AppImage
          source={require("@/../assets/mascotte/happy.png")}
          className="size-30"
          contentFit="cover"
        />
      </View>

      <Pressable
        onPress={onSearchPress}
        className="mt-5 h-12 flex-row items-center rounded-full bg-white px-4"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.12,
          shadowRadius: 8,
          elevation: 4,
        }}
        accessibilityRole="button"
        accessibilityLabel="Cerca nel catalogo"
      >
        <Search size={22} color={textMuted as ColorValue} strokeWidth={2.2} />
        <Text className="ml-3 flex-1 text-base font-medium text-input">
          Cosa ti va di esplorare?
        </Text>
      </Pressable>
    </View>
  );
}
