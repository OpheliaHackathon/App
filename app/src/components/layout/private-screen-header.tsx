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

/** Allinea il titolo al centro dello schermo con il pulsante indietro a sinistra. */
const SIDE_SLOT_PX = 52;

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
      className="w-full self-stretch bg-header pb-4"
      style={{
        paddingTop: insets.top + 8,
        paddingLeft: Math.max(insets.left, 12),
        paddingRight: Math.max(insets.right, 12),
      }}
    >
      {trailing ? (
        <View className="min-h-11 flex-row items-center gap-2">
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
          <View className="min-h-11 flex-1 justify-center">{trailing}</View>
        </View>
      ) : title && onBack ? (
        <View className="min-h-11 flex-row items-center">
          <View
            className="shrink-0 items-start justify-center"
            style={{ width: SIDE_SLOT_PX }}
          >
            <Pressable
              onPress={onBack}
              className="rounded-full bg-white/15 p-2 active:opacity-70"
              hitSlop={12}
              accessibilityRole="button"
              accessibilityLabel="Indietro"
            >
              <ChevronLeft size={28} color={backIconColor} />
            </Pressable>
          </View>
          <View className="min-h-11 flex-1 justify-center px-1">
            <Text
              className="text-center text-lg font-bold leading-7 text-white"
              numberOfLines={1}
            >
              {title}
            </Text>
          </View>
          <View style={{ width: SIDE_SLOT_PX }} />
        </View>
      ) : title ? (
        <View className="min-h-11 justify-center px-1">
          <Text
            className="text-center text-lg font-bold leading-7 text-white"
            numberOfLines={1}
          >
            {title}
          </Text>
        </View>
      ) : onBack ? (
        <View className="min-h-11 flex-row items-center">
          <Pressable
            onPress={onBack}
            className="rounded-full bg-white/15 p-2 active:opacity-70"
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel="Indietro"
          >
            <ChevronLeft size={28} color={backIconColor} />
          </Pressable>
        </View>
      ) : null}
      {children}
    </View>
  );
}
