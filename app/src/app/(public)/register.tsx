import { AuthScreenChrome } from "@/components/auth/auth-screen-chrome";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useKeyboard } from "@/hooks/keyboard";
import { authClient } from "@/lib/auth";
import { Text, View } from "@/lib/rnw";
import classNames from "classnames";
import { Link } from "expo-router";
import { useState } from "react";
import { Alert } from "react-native";

/**
 * Registrazione email/password; dopo il sign-up la sessione viene gestita dal root layout.
 */
export default function RegisterScreen() {
  const keyboard = useKeyboard();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleRegister() {
    setIsLoading(true);
    try {
      const { error } = await authClient.signUp.email({
        email,
        name,
        password,
        username,
        displayUsername: username,
      });
      if (error) throw error;
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "C’è stato un errore durante la registrazione";
      Alert.alert("Registrazione non riuscita", message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthScreenChrome
      mascotte
      title="Entra in Faindy"
      subtitle="Crea l&apos;account e iniziamo a scoprire i prodotti adatti a te."
    >
      <View className={classNames("flex flex-col gap-3", keyboard && "pb-4")}>
        <Input
          placeholder="Nome"
          keyboardType="default"
          autoCapitalize="words"
          autoComplete="name"
          returnKeyType="next"
          value={name}
          onChangeText={setName}
        />
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
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          autoCorrect={false}
          returnKeyType="next"
          value={email}
          onChangeText={setEmail}
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
        <Button
          loading={isLoading}
          onPress={handleRegister}
          label="Registrati"
        />
        <Text className="pt-2 text-center text-sm text-input">
          Hai già un account?{" "}
          <Link href="/" className="text-primary font-semibold">
            Accedi
          </Link>
        </Text>
      </View>
    </AuthScreenChrome>
  );
}
