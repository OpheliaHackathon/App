import { AppImage, Pressable, Text, View } from "@/lib/rnw";
import type { Href } from "expo-router";
import { router } from "expo-router";

export type ProductGridCardItem = {
  id: string;
  title: string;
  imageUrl: string;
  price: string;
};

export type ProductGridCardProps = {
  item: ProductGridCardItem;
  /** Percorso o URL per la scheda prodotto. */
  href: Href;
  /** Stile bordo: default più marcato per allineamento al feed; subtle per griglie dense. */
  emphasis?: "default" | "subtle";
};

/**
 * Scheda prodotto in griglia 2 colonne: stesso linguaggio visivo su ricerca e profilo venditore.
 */
export function ProductGridCard({
  item,
  href,
  emphasis = "default",
}: ProductGridCardProps) {
  function onPress() {
    router.push(href);
  }

  const borderClass =
    emphasis === "subtle" ? "border border-border" : "border-2 border-border";

  return (
    <Pressable
      onPress={onPress}
      className={`mb-2 flex-1 overflow-hidden rounded-[22px] bg-card active:opacity-90 ${borderClass}`}
      accessibilityRole="button"
      accessibilityLabel={item.title}
    >
      <AppImage
        source={{ uri: item.imageUrl }}
        className="aspect-square w-full bg-border"
        contentFit="cover"
        transition={200}
      />
      <View className="p-3">
        <Text
          className="text-sm font-bold leading-5 text-text"
          numberOfLines={2}
        >
          {item.title}
        </Text>
        <Text className="mt-2 text-base font-black text-primary">
          {item.price}
        </Text>
      </View>
    </Pressable>
  );
}
