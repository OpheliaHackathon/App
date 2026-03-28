import {
  FeedSections,
  HomeHeroHeader,
} from "@/components/feed/feed-sections";
import { recommendationsQueryKey, useRecommendationsQuery } from "@/hooks/use-recommendations";
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "@/lib/rnw";
import { router } from "expo-router";
import { useCallback } from "react";
import type { ColorValue } from "react-native";
import { SafeAreaView as RNSSafeAreaView } from "react-native-safe-area-context";
import { useQueryClient } from "@tanstack/react-query";
import { useCSSVariable, withUniwind } from "uniwind";

const SafeAreaView = withUniwind(RNSSafeAreaView);

/**
 * Home: feed raccomandazioni con pull-to-refresh e navigazione verso ricerca / prodotto.
 */
export default function HomeScreen() {
  const placeholderColor = useCSSVariable("--color-placeholder");
  const textMuted = useCSSVariable("--color-input");
  const queryClient = useQueryClient();
  const recoQuery = useRecommendationsQuery();

  const onRefresh = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: recommendationsQueryKey });
  }, [queryClient]);

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["bottom"]}>
      <ScrollView
        className="flex-1"
        contentContainerClassName="pb-8"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={recoQuery.isRefetching}
            onRefresh={onRefresh}
          />
        }
      >
        <HomeHeroHeader
          textMuted={textMuted as ColorValue}
          onSearchPress={() => router.push("/search")}
        />

        {recoQuery.isPending && (
          <View className="items-center py-20">
            <Text className="mb-3 text-4xl">🌀</Text>
            <ActivityIndicator
              size="large"
              color={placeholderColor as string}
            />
            <Text className="mt-4 text-sm font-semibold text-input">
              Stiamo assemblando la tua selezione colorata…
            </Text>
          </View>
        )}

        {!recoQuery.isPending && recoQuery.data?.kind === "unavailable" && (
          <View className="px-6 py-12">
            <Text className="text-center text-4xl">😅</Text>
            <Text className="mt-3 text-center text-base font-medium leading-6 text-text">
              {recoQuery.data.message}
            </Text>
            <Pressable
              onPress={onRefresh}
              className="mt-8 self-center rounded-full bg-primary px-8 py-3.5 active:opacity-90"
            >
              <Text className="text-center text-sm font-bold text-white">
                Riprova, dai!
              </Text>
            </Pressable>
          </View>
        )}

        {!recoQuery.isPending && recoQuery.data?.kind === "ready" && (
          <>
            {recoQuery.data.data.source === "vector_preview" &&
            recoQuery.data.data.previewMessage ? (
              <View className="mx-4 mt-5 rounded-[24px] border-2 border-secondary/40 bg-card px-5 py-4">
                <Text className="text-base font-bold text-text">
                  👋 Anteprima smart
                </Text>
                <Text className="mt-2 text-sm leading-6 text-input">
                  {recoQuery.data.data.previewMessage}
                </Text>
              </View>
            ) : null}

            {recoQuery.data.data.source === "curated" &&
            recoQuery.data.data.generatedAt ? (
              <Text className="mt-4 px-5 text-xs font-semibold text-input">
                Ultimo aggiornamento curato:{" "}
                {new Date(recoQuery.data.data.generatedAt).toLocaleString(
                  "it-IT",
                  {
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  },
                )}
              </Text>
            ) : null}

            <View className="mt-2">
              <FeedSections
                source={recoQuery.data.data.source}
                items={recoQuery.data.data.items.map((item) => ({
                  id: item.id,
                  title: item.title,
                  imageUrl: item.imageUrl,
                  price: item.price,
                  reason: item.reason ?? "",
                }))}
              />
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
