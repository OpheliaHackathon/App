import "@/global.css";
import { authClient } from "@/lib/auth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { useState } from "react";
import { StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useUniwind } from "uniwind";

/**
 * Radice app: theming Uniwind, React Query e stack protetto in base alla sessione.
 */
function LayoutContent() {
  useUniwind();
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            retry: 2,
          },
        },
      }),
  );
  const { isPending, data: session } = authClient.useSession();

  return (
    <GestureHandlerRootView style={styles.root}>
      <QueryClientProvider client={queryClient}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Protected guard={isPending}>
            <Stack.Screen name="(loading)" />
          </Stack.Protected>

          <Stack.Protected guard={!isPending && !session}>
            <Stack.Screen name="(public)" />
          </Stack.Protected>

          <Stack.Protected guard={!isPending && !!session}>
            <Stack.Screen name="(private)" />
          </Stack.Protected>
        </Stack>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}

/** Entry Expo Router (`app/_layout.tsx`). */
export default function Layout() {
  return <LayoutContent />;
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
