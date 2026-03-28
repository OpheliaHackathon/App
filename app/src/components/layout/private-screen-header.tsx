import { Pressable, Text, View } from "@/lib/rnw";
import { ChevronLeft } from "lucide-react-native";
import type { ReactNode } from "react";
import type { ColorValue } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export type PrivateScreenHeaderProps = {
  title?: string;
  onBack?: () => void;
  trailing?: ReactNode;
  children?: ReactNode;
};

const backIconColor: ColorValue = "#e2e8f0";

/**
 * Barra superiore unificata per schermate private secondarie
 */
export function PrivateScreenHeader({
  title,
  onBack,
  trailing,
  children,
}: PrivateScreenHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="overflow-hidden rounded-b-[28px] bg-header px-3 pb-4"
      style={{ paddingTop: insets.top + 8 }}
    >
      <View className="flex-row items-center gap-2">
        {onBack ? (
          <Pressable
            onPress={onBack}
            className="rounded-full bg-white/15 p-2 active:opacity-70"
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel="Indietro"
          >
            <ChevronLeft size={28} color={backIconColor} />
          </Pressable>
        ) : null}
        {trailing ? (
          <View className="min-h-11 flex-1 justify-center">{trailing}</View>
        ) : title ? (
          <Text
            className="min-h-11 flex-1 text-lg font-bold leading-7 text-white"
            numberOfLines={1}
          >
            {title}
          </Text>
        ) : null}
      </View>
      {children}
    </View>
  );
}
