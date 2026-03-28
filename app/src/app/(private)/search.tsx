import {
  ProductGridCard,
  type ProductGridCardItem,
} from "@/components/catalog/product-grid-card";
import { PrivateScreenHeader } from "@/components/layout/private-screen-header";
import { useCatalogSearchQuery } from "@/hooks/use-catalog";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import type { Href } from "expo-router";
import { router } from "expo-router";
import { useState } from "react";
import type { ColorValue } from "react-native";
import { SafeAreaView as RNSSafeAreaView } from "react-native-safe-area-context";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TextInput,
  View,
} from "@/lib/rnw";
import { useCSSVariable, withUniwind } from "uniwind";

const SafeAreaView = withUniwind(RNSSafeAreaView);

/**
 * Ricerca semantica sul catalogo (vettori di similarità lato server).
 */
export default function SearchScreen() {
  const [raw, setRaw] = useState("");
  const debounced = useDebouncedValue(raw, 400);
  const placeholderColor = useCSSVariable("--color-placeholder");
  const borderColor = useCSSVariable("--color-border");

  const { data, isFetching, isError, error } =
    useCatalogSearchQuery(debounced);

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["bottom"]}>
      <PrivateScreenHeader
        onBack={() => router.back()}
        trailing={
          <TextInput
            value={raw}
            onChangeText={setRaw}
            placeholder="Cerca prodotti, stili, idee…"
            placeholderTextColor={placeholderColor as ColorValue}
            autoFocus
            returnKeyType="search"
            className="h-11 flex-1 rounded-full bg-card px-4 text-base text-text"
            style={{ borderWidth: 1, borderColor: borderColor as string }}
            accessibilityLabel="Campo di ricerca catalogo"
          />
        }
      />

      {debounced.trim().length < 2 ? (
        <View className="flex-1 items-center justify-center px-8">
          <Text className="text-center text-4xl">🔎</Text>
          <Text className="mt-4 text-center text-lg font-bold text-text">
            Caccia al tesoro nel catalogo
          </Text>
          <Text className="mt-2 text-center text-base font-medium leading-6 text-input">
            Almeno 2 lettere: ordiniamo tutto per somiglianza intelligente
            (solo vettori, niente chat qui).
          </Text>
        </View>
      ) : (
        <FlatList
          data={(data?.items ?? []) as ProductGridCardItem[]}
          keyExtractor={(item) => (item as ProductGridCardItem).id}
          numColumns={2}
          contentContainerClassName="gap-2 px-3 pb-8 pt-3"
          columnWrapperClassName="gap-2"
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={
            isFetching ? (
              <View className="items-center py-16">
                <ActivityIndicator size="large" />
              </View>
            ) : isError ? (
              <Text className="px-2 py-8 text-center text-input">
                {error instanceof Error
                  ? error.message
                  : "Ricerca non riuscita."}
              </Text>
            ) : (
              <Text className="px-2 py-8 text-center text-input">
                Nessun risultato.
              </Text>
            )
          }
          renderItem={({ item }) => {
            const row = item as ProductGridCardItem;
            return (
              <ProductGridCard
                item={row}
                href={`/product/${row.id}` as Href}
                emphasis="subtle"
              />
            );
          }}
        />
      )}
    </SafeAreaView>
  );
}
