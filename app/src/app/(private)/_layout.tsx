import BaseLayout from "@/components/base-layout";
import { authClient } from "@/lib/auth";
import { isUserOnboardingComplete } from "@/lib/onboarding-storage";
import { ActivityIndicator, View } from "@/lib/rnw";
import type { Href } from "expo-router";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";

/**
 * Area autenticata: gating onboarding persistente e stack senza header nativo (UI custom per schermata).
 */
export default function PrivateLayout() {
  const { data: session, isPending: sessionPending } = authClient.useSession();
  const router = useRouter();
  const segments = useSegments();
  const [bootstrapped, setBootstrapped] = useState(false);

  const userId = session?.user?.id;
  const segmentKey = segments.join("/");

  // Primo avvio: determina se lo stato onboarding è già noto per l’utente corrente.
  useEffect(() => {
    if (sessionPending || !userId) {
      if (!sessionPending && !userId) setBootstrapped(true);
      return;
    }
    let cancelled = false;
    void isUserOnboardingComplete(userId).finally(() => {
      if (!cancelled) setBootstrapped(true);
    });
    return () => {
      cancelled = true;
    };
  }, [userId, sessionPending]);

  // Reindirizza verso onboarding o home in base al completamento e al segmento corrente.
  useEffect(() => {
    if (!bootstrapped || !userId || sessionPending) return;
    let cancelled = false;
    void (async () => {
      const done = await isUserOnboardingComplete(userId);
      if (cancelled) return;
      const segs = segments as string[];
      const onOnboarding = segs.includes("onboarding");
      if (!done && !onOnboarding) {
        router.replace("/onboarding" as Href);
      } else if (done && onOnboarding) {
        router.replace("/" as Href);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [bootstrapped, userId, sessionPending, segmentKey, router, segments]);

  if (sessionPending || !bootstrapped) {
    return (
      <BaseLayout>
        <View className="flex-1 items-center justify-center bg-background">
          <ActivityIndicator size="large" />
        </View>
      </BaseLayout>
    );
  }

  return (
    <BaseLayout>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="index" />
        <Stack.Screen name="search" />
        <Stack.Screen name="product/[id]" />
        <Stack.Screen name="profile/[id]" />
      </Stack>
    </BaseLayout>
  );
}
