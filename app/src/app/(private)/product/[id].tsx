import { PrivateScreenHeader } from "@/components/layout/private-screen-header";
import { Button } from "@/components/ui/button";
import { useArticleQuery } from "@/hooks/use-catalog";
import {
  ActivityIndicator,
  AppImage,
  Pressable,
  ScrollView,
  Text,
  View,
} from "@/lib/rnw";
import type { Href } from "expo-router";
import { router, useLocalSearchParams } from "expo-router";
import { Sparkles } from "lucide-react-native";
import { Alert, Linking } from "react-native";
import {
  SafeAreaView as RNSSafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useCSSVariable, withUniwind } from "uniwind";

const SafeAreaView = withUniwind(RNSSafeAreaView);

/**
 * Dettaglio articolo con CTA verso il checkout esterno (URL validato lato client prima dell'apertura).
 */
export default function ProductDetailScreen() {
  const params = useLocalSearchParams<{
    id: string;
    pickReason?: string;
    pickSource?: string;
  }>();
  const productId = params.id ? String(params.id) : undefined;
  const pickReasonRaw =
    params.pickReason != null ? String(params.pickReason) : "";
  const pickSource = params.pickSource != null ? String(params.pickSource) : "";

  const {
    data: product,
    isPending,
    isError,
    error,
  } = useArticleQuery(productId);
  const primary = useCSSVariable("--color-primary");
  const insets = useSafeAreaInsets();

  const fromDailyPick =
    pickSource === "curated" || pickSource === "vector_preview";

  const pickExplanation =
    pickReasonRaw.trim() ||
    (pickSource === "vector_preview"
      ? "È qui perché somiglia tantissimo al tuo profilo."
      : fromDailyPick
        ? "Fa parte dei 15 pezzi che abbiamo scelto per te oggi, in linea con i tuoi gusti."
        : "");

  async function openExternalCheckout() {
    const url = product?.checkoutUrl?.trim();
    if (!url) {
      Alert.alert(
        "Link non disponibile",
        "Non abbiamo ancora un indirizzo di acquisto per questo articolo.",
      );
      return;
    }
    try {
      const can = await Linking.canOpenURL(url);
      if (!can) {
        Alert.alert(
          "Link non valido",
          "L’indirizzo di acquisto non può essere aperto su questo dispositivo.",
        );
        return;
      }
      await Linking.openURL(url);
    } catch {
      Alert.alert(
        "Errore",
        "Non siamo riusciti ad aprire il link. Riprova tra poco.",
      );
    }
  }

  if (!productId) return null;

  if (isPending) {
    return (
      <SafeAreaView
        className="flex-1 items-center justify-center bg-background"
        edges={["top", "bottom"]}
      >
        <Text className="mb-3 text-4xl">⏳</Text>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  if (isError || !product) {
    return (
      <SafeAreaView
        className="flex-1 items-center justify-center bg-background px-6"
        edges={["top", "bottom"]}
      >
        <Text className="text-center text-base font-medium text-text">
          {error instanceof Error ? error.message : "Prodotto non trovato."}
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["bottom"]}>
      <PrivateScreenHeader
        title="Scheda prodotto"
        onBack={() => router.back()}
      />

      <ScrollView
        className="flex-1"
        contentContainerClassName="pb-6"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View className="relative">
          <AppImage
            source={{ uri: product.imageUrl }}
            className="aspect-square w-full bg-border"
            contentFit="cover"
            transition={200}
          />
          {fromDailyPick ? (
            <View className="absolute bottom-4 left-4 right-4 rounded-3xl border-2 border-primary/30 bg-card/95 px-4 py-3">
              <View className="flex-row items-center gap-2">
                <Sparkles
                  size={20}
                  color={(primary as string) ?? "#c026d3"}
                  strokeWidth={2.2}
                />
                <Text className="text-xs font-black uppercase tracking-wide text-primary">
                  Perché l’abbiamo messo per te
                </Text>
              </View>
              <Text className="mt-2 text-sm font-medium leading-6 text-text">
                {pickExplanation}
              </Text>
            </View>
          ) : null}
        </View>

        <View className="px-5 pt-6">
          <View className="self-start rounded-full bg-tertiary px-3 py-1">
            <Text className="text-xs font-bold uppercase tracking-wide text-[#292524]">
              {product.category}
            </Text>
          </View>
          <Text className="mt-3 text-3xl font-black leading-9 text-text">
            {product.title}
          </Text>

          <Pressable
            onPress={() => {
              router.push(`/profile/${product.publisher.id}` as Href);
            }}
            className="mt-5 flex-row items-center rounded-[22px] border-2 border-secondary/40 bg-playSurface p-4 active:opacity-90"
            accessibilityRole="button"
            accessibilityLabel={`Apri profilo ${product.publisher.name}`}
          >
            <AppImage
              source={{ uri: product.publisher.avatarUrl }}
              className="size-14 rounded-2xl bg-border"
              contentFit="cover"
              transition={200}
            />
            <View className="ml-3 flex-1">
              <Text className="text-xs font-bold uppercase tracking-wide text-input">
                Chi lo propone
              </Text>
              <Text className="mt-1 text-lg font-bold text-text">
                {product.publisher.name}
              </Text>
            </View>
            <Text className="text-2xl text-primary">→</Text>
          </Pressable>

          <Text className="mt-6 text-4xl font-black text-primary">
            {product.price}
          </Text>

          {!fromDailyPick ? (
            <View className="mt-5 rounded-[22px] border-2 border-dashed border-border bg-card px-4 py-3">
              <Text className="text-sm font-semibold text-input">
                💡 Se apri questo prodotto dalla home, vedrai anche il motivo
                della scelta nella tua selezione da 15.
              </Text>
            </View>
          ) : null}

          <View className="mt-8">
            <Text className="text-sm font-black uppercase tracking-wider text-input">
              Racconto del prodotto
            </Text>
            <Text className="mt-3 text-base font-medium leading-7 text-text">
              {product.description}
            </Text>
          </View>
        </View>
      </ScrollView>

      <View
        className="border-t-2 border-border bg-card px-5 pt-4"
        style={{ paddingBottom: Math.max(insets.bottom, 14) }}
      >
        <Button
          label="Acquista sul sito del venditore ↗"
          size="lg"
          className="w-full rounded-full"
          onPress={() => {
            void openExternalCheckout();
          }}
        />
      </View>
    </SafeAreaView>
  );
}
