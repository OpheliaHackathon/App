import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useKeyboard } from "@/hooks/keyboard";
import { authClient } from "@/lib/auth";
import classNames from "classnames";
import { Link } from "expo-router";
import { useState } from "react";
import { Alert, Text, View } from "react-native";

export default function LoginScreen() {
  const keyboard = useKeyboard();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogin() {
    setIsLoading(true);

    try {
      // Prova a loggare l'utente
      const { error } = await authClient.signIn.username({
        username: username,
        password: password,
      });

      if (error) throw error;
    } catch (error: any) {
      // Se ci sono errori, mostra un alert
      Alert.alert(
        "Error",
        error.message ?? "C'è stato un errore durante il login",
      );
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <View className="flex-1 bg-background justify-end relative">
      <View
        className={classNames(
          "bg-background w-full mt-auto flex flex-col items-center justify-center rounded-3xl z-10",
          keyboard ? "h-3/4 rounded-b-none justify-start pt-10" : "h-2/5",
        )}
      >
        <View className="flex flex-row gap-2">
          <Text className="text-text text-5xl pt-2 font-bold">👋</Text>

          <View className="flex flex-col items-start justify-center">
            <Text className="text-text text-xl font-bold">Bentornato!</Text>
            <Text className="text-input text-sm">
              Accedi per continuare da dove l'hai lasciato
            </Text>
          </View>
        </View>

        <View className="w-full px-10 mt-6 flex flex-col gap-2">
          <Input
            placeholder="Username"
            keyboardType="default"
            autoCapitalize="none"
            autoComplete="username"
            returnKeyType="next"
            value={username}
            onChangeText={setUsername}
          />
          <Input
            placeholder="Password"
            autoCapitalize="none"
            autoComplete="password"
            autoCorrect={false}
            returnKeyType="done"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <Button loading={isLoading} onPress={handleLogin} label="Accedi" />
          <Text className="text-input text-center text-sm pt-2">
            Sei nuovo?{" "}
            <Link href="/register" className="text-primary">
              Registrati
            </Link>
          </Text>
        </View>
      </View>
    </View>
  );
}
