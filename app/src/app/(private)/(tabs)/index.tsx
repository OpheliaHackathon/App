import { MOCK_FILTERS, MOCK_PRODUCTS } from "@/lib/mock-products";
import { router } from "expo-router";
import { Image as ExpoImage } from "expo-image";
import { Search } from "lucide-react-native";
import {
  ColorValue,
  FlatList,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCSSVariable, withUniwind } from "uniwind";

const Image = withUniwind(ExpoImage);

export default function HomeScreen() {
  const placeholderColor = useCSSVariable("--color-placeholder");
  const textMuted = useCSSVariable("--color-input");

  const header = (
    <View>
      <View className="px-4 pt-2">
        <Text className="text-2xl font-semibold tracking-tight text-text">
          Negozio
        </Text>
        <Text className="mt-1 text-sm text-input">
          Scopri prodotti e offerte per te
        </Text>
      </View>

      <View className="mt-4 px-4">
        <View className="h-11 flex-row items-center rounded-base border border-border bg-card px-3">
          <Search size={20} color={textMuted as ColorValue} strokeWidth={2} />
          <TextInput
            placeholder="Cerca prodotti, marche, categorie…"
            placeholderTextColor={placeholderColor as ColorValue}
            className="ml-2 flex-1 text-base text-text"
          />
        </View>
      </View>

      <View className="mt-4">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="gap-2 px-4"
        >
          {MOCK_FILTERS.map((label) => {
            return (
              <Pressable
                key={label}
                className="rounded-full border px-4 py-2 border-border bg-card"
              >
                <Text className="text-sm font-medium text-text">{label}</Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <View className="mt-6 px-4 pb-3">
        <Text className="text-sm font-medium text-input">
          Consigliati per te
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <FlatList
        data={MOCK_PRODUCTS}
        keyExtractor={(item) => item.id}
        numColumns={2}
        ListHeaderComponent={header}
        columnWrapperClassName="gap-2 px-4"
        contentContainerClassName="pb-4"
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
              <Pressable
                onPress={() => {
                  router.push({
                    pathname: "/profile/[id]",
                    params: { id: item.publisher.id },
                  });
                }}
                className="mt-2 flex-row items-center gap-2 active:opacity-80"
                hitSlop={{ top: 4, bottom: 4, left: 0, right: 0 }}
              >
                <Image
                  source={{ uri: item.publisher.avatarUrl }}
                  className="size-6 rounded-full"
                  contentFit="cover"
                  transition={200}
                />
                <Text
                  className="flex-1 text-xs text-input"
                  numberOfLines={1}
                >
                  {item.publisher.name}
                </Text>
              </Pressable>
              <Text className="mt-2 text-base font-semibold text-primary">
                {item.price}
              </Text>
            </View>
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
}
