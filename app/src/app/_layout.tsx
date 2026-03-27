import "@/global.css";
import { authClient } from "@/lib/auth";
import { db } from "@/lib/db";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { Alert } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import migrations from "../../drizzle/migrations";

function LayoutContent() {
  const { success, error } = useMigrations(db, migrations);

  const { isPending, data: session } = authClient.useSession();

  useEffect(() => {
    if (!success && error) {
      Alert.alert(
        "Error",
        "C'è stato un errore durante la migrazione del database",
      );
      console.error(error);
    }
  }, [success, error]);

  return (
    <GestureHandlerRootView>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Protected guard={isPending || !success}>
          <Stack.Screen name="(loading)" />
        </Stack.Protected>

        <Stack.Protected guard={!isPending && !session}>
          <Stack.Screen name="(public)" />
        </Stack.Protected>

        <Stack.Protected guard={!isPending && !!session}>
          <Stack.Screen name="(private)" />
        </Stack.Protected>
      </Stack>
    </GestureHandlerRootView>
  );
}

export default function Layout() {
  return <LayoutContent />;
}
