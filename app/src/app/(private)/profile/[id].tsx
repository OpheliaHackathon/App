import {
  getProductsByPublisherId,
  getPublisherById,
} from "@/lib/mock-products";
import { Image as ExpoImage } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import {
  ColorValue,
  FlatList,
  Pressable,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCSSVariable, withUniwind } from "uniwind";

const Image = withUniwind(ExpoImage);

export default function ExternalProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const publisherId = id ? String(id) : "";
  const publisher = publisherId ? getPublisherById(publisherId) : undefined;
  const products = publisherId
    ? getProductsByPublisherId(publisherId)
    : [];
  const textMuted = useCSSVariable("--color-input");

  const listHeader = publisher ? (
    <View className="items-center pb-4 pt-2">
      <Image
        source={{ uri: publisher.avatarUrl }}
        className="size-24 rounded-full border-2 border-border"
        contentFit="cover"
        transition={200}
      />
      <Text className="mt-4 text-center text-2xl font-semibold text-text">
        {publisher.name}
      </Text>
      <Text className="mt-4 self-stretch px-4 text-sm font-medium text-input">
        Prodotti pubblicati ({products.length})
      </Text>
    </View>
  ) : null;

  if (!publisherId) return null;

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <View className="flex-row items-center border-b border-border px-2 pb-2">
        <Pressable
          onPress={() => router.back()}
          className="flex-row items-center rounded-base p-2 active:opacity-70"
          hitSlop={12}
        >
          <ChevronLeft size={28} color={textMuted as ColorValue} />
        </Pressable>
        <Text
          className="ml-1 flex-1 text-base font-medium text-text"
          numberOfLines={1}
        >
          Profilo venditore
        </Text>
      </View>

      {!publisher ? (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-center text-base text-input">
            Venditore non trovato.
          </Text>
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
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
          renderItem={({ item }) => (
            <Pressable
              onPress={() => {
                router.push({
                  pathname: "/product/[id]",
                  params: { id: item.id },
                });
              }}
              className="mb-3 flex-1 overflow-hidden rounded-base border border-border bg-card active:opacity-90"
            >
              <Image
                source={{ uri: item.imageUrl }}
                className="aspect-square w-full"
                contentFit="cover"
                transition={200}
              />
              <View className="p-3">
                <Text
                  className="text-sm font-medium leading-5 text-text"
                  numberOfLines={2}
                >
                  {item.title}
                </Text>
                <Text className="mt-2 text-base font-semibold text-primary">
                  {item.price}
                </Text>
              </View>
            </Pressable>
          )}
        />
      )}
    </SafeAreaView>
  );
}
