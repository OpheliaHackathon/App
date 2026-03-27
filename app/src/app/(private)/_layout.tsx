import BaseLayout from "@/components/base-layout";
import { Stack } from "expo-router";

export default function PrivateLayout() {
  return (
    <BaseLayout>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="product/[id]" />
        <Stack.Screen name="profile/[id]" />
      </Stack>
    </BaseLayout>
  );
}
