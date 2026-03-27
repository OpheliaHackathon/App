import { Button } from "@/components/ui/button";
import { getProductById } from "@/lib/mock-products";
import { Image as ExpoImage } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { ColorValue, Pressable, ScrollView, Text, View } from "react-native";
import {
  SafeAreaView as RNSSafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useCSSVariable, withUniwind } from "uniwind";

const Image = withUniwind(ExpoImage);
const SafeAreaView = withUniwind(RNSSafeAreaView);

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const product = id ? getProductById(String(id)) : undefined;
  const textMuted = useCSSVariable("--color-input");
  const insets = useSafeAreaInsets();

  if (!product) return null;

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
          Dettaglio
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="pb-4"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Image
          source={{ uri: product.imageUrl }}
          className="aspect-square w-full"
          contentFit="cover"
          transition={200}
        />

        <View className="px-4 pt-4">
          <Text className="text-xs font-medium uppercase tracking-wide text-primary">
            {product.category}
          </Text>
          <Text className="mt-2 text-2xl font-semibold leading-8 text-text">
            {product.title}
          </Text>

          <Pressable
            onPress={() => {
              router.push({
                pathname: "/profile/[id]",
                params: { id: product.publisher.id },
              });
            }}
            className="mt-4 flex-row items-center rounded-base border border-border bg-card p-3"
          >
            <Image
              source={{ uri: product.publisher.avatarUrl }}
              className="size-12 rounded-full"
              contentFit="cover"
              transition={200}
            />
            <View className="ml-3 flex-1">
              <Text className="text-xs font-medium uppercase tracking-wide text-input">
                Pubblicato da
              </Text>
              <Text className="mt-0.5 text-base font-semibold text-text">
                {product.publisher.name}
              </Text>
            </View>
          </Pressable>

          <Text className="mt-4 text-3xl font-bold text-primary">
            {product.price}
          </Text>

          <View className="mt-6">
            <Text className="text-sm font-semibold uppercase tracking-wide text-input">
              Descrizione
            </Text>
            <Text className="mt-2 text-base leading-6 text-text">
              {product.description}
            </Text>
          </View>
        </View>
      </ScrollView>

      <View
        className={`border-t border-border bg-background px-4 py-6 ${Math.max(insets.bottom, 8)}`}
      >
        <Button label="Acquista ora" size="lg" className="w-full" />
      </View>
    </SafeAreaView>
  );
}
