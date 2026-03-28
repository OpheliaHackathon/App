import { AuthScreenChrome } from "@/components/auth/auth-screen-chrome";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useKeyboard } from "@/hooks/keyboard";
import { authClient } from "@/lib/auth";
import classNames from "classnames";
import { Link } from "expo-router";
import { useState } from "react";
import { Alert } from "react-native";
import { Text, View } from "@/lib/rnw";

/**
 * Accesso con username/password (Better Auth).
 */
export default function LoginScreen() {
  const keyboard = useKeyboard();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogin() {
    setIsLoading(true);
    try {
      const { error } = await authClient.signIn.username({
        username,
        password,
      });
      if (error) throw error;
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "C’è stato un errore durante il login";
      Alert.alert("Accesso non riuscito", message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthScreenChrome
      mascotte
      title="Bentornato!"
      subtitle="Accedi per scoprire i prodotti adatti a te."
    >
      <View
        className={classNames(
          "flex flex-col gap-3",
          keyboard && "pb-4",
        )}
      >
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
        <Text className="pt-2 text-center text-sm text-input">
          Sei nuovo?{" "}
          <Link href="/register" className="text-primary font-semibold">
            Registrati
          </Link>
        </Text>
      </View>
    </AuthScreenChrome>
  );
}
