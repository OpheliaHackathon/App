import {
  ProductGridCard,
  type ProductGridCardItem,
} from "@/components/catalog/product-grid-card";
import { PrivateScreenHeader } from "@/components/layout/private-screen-header";
import { useCompanyCatalogQuery } from "@/hooks/use-catalog";
import { ActivityIndicator, AppImage, FlatList, Text, View } from "@/lib/rnw";
import type { Href } from "expo-router";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView as RNSSafeAreaView } from "react-native-safe-area-context";
import { withUniwind } from "uniwind";

const SafeAreaView = withUniwind(RNSSafeAreaView);

/**
 * Vetrina pubblica di un venditore: avatar, elenco prodotti in griglia unificata.
 */
export default function ExternalProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const publisherId = id ? String(id) : "";
  const { data, isPending, isError, error } = useCompanyCatalogQuery(
    publisherId || undefined,
  );
  const publisher = data?.publisher;
  const products = data?.products ?? [];

  const listHeader = publisher ? (
    <View className="items-center pb-4 pt-2">
      <AppImage
        source={{ uri: publisher.avatarUrl }}
        className="size-24 rounded-full border-2 border-border"
        contentFit="cover"
        transition={200}
      />
      <Text className="mt-4 text-center text-2xl font-black text-text">
        {publisher.name}
      </Text>
      <Text className="mt-4 self-stretch px-1 text-sm font-semibold text-input">
        Prodotti pubblicati ({products.length})
      </Text>
    </View>
  ) : null;

  if (!publisherId) return null;

  if (isPending) {
    return (
      <SafeAreaView
        className="flex-1 items-center justify-center bg-background"
        edges={["top", "bottom"]}
      >
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView
        className="flex-1 items-center justify-center bg-background px-6"
        edges={["top", "bottom"]}
      >
        <Text className="text-center text-base text-text">
          {error instanceof Error
            ? error.message
            : "Impossibile caricare il profilo."}
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["bottom"]}>
      <PrivateScreenHeader
        title="Profilo venditore"
        onBack={() => router.back()}
      />

      {!publisher ? (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-center text-base text-input">
            Venditore non trovato.
          </Text>
        </View>
      ) : (
        <FlatList
          data={products as ProductGridCardItem[]}
          keyExtractor={(item) => (item as ProductGridCardItem).id}
          numColumns={2}
          ListHeaderComponent={listHeader}
          ListEmptyComponent={
            <Text className="px-4 pt-4 text-center text-input">
              Nessun prodotto in vetrina.
            </Text>
          }
          columnWrapperClassName="gap-2 px-4"
          contentContainerClassName="pb-6 pt-4"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }) => {
            const row = item as ProductGridCardItem;
            return (
              <ProductGridCard item={row} href={`/product/${row.id}` as Href} />
            );
          }}
        />
      )}
    </SafeAreaView>
  );
}
