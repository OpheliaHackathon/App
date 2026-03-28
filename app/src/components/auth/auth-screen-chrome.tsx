import { AppImage, Text, View } from "@/lib/rnw";
import type { ReactNode } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type AuthScreenChromeProps = {
  eyebrow?: string;
  title: string;
  subtitle: string;
  mascotte?: boolean;
  children: ReactNode;
};

/**
 * Involucro visivo comune a login e registrazione (header viola come area privata).
 */
export function AuthScreenChrome({
  eyebrow = "Faindy",
  title,
  subtitle,
  mascotte = false,
  children,
}: AuthScreenChromeProps) {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-background">
      <View
        className="overflow-hidden rounded-b-[28px] bg-header px-6 pb-8"
        style={{ paddingTop: insets.top + 40 }}
      >
        <Text className="text-xs font-black uppercase tracking-widest text-headerMuted">
          {eyebrow}
        </Text>
        {mascotte ? (
          <View className="mt-4 flex-row items-start justify-between gap-4">
            <View className="min-w-0 flex-1 pr-1">
              <Text className="text-2xl font-black leading-8 text-white">
                {title}
              </Text>
              <Text className="mt-2 text-base font-medium leading-6 text-white/85">
                {subtitle}
              </Text>
            </View>
            <AppImage
              source={require("@/../assets/mascotte/happy.png")}
              className="size-28 shrink-0"
              contentFit="contain"
              accessibilityLabel="Mascotte Faindy"
            />
          </View>
        ) : (
          <View className="mt-4 flex-row items-start gap-3">
            <View className="flex-1">
              <Text className="text-2xl font-black leading-8 text-white">
                {title}
              </Text>
              <Text className="mt-2 text-base font-medium leading-6 text-white/85">
                {subtitle}
              </Text>
            </View>
          </View>
        )}
      </View>
      <View className="flex-1 px-6 pt-8">{children}</View>
    </View>
  );
}
