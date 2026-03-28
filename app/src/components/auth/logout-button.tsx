import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth";

/**
 * Disconnette la sessione Better Auth (storage Expo incluso) e torna al flusso pubblico.
 */
export function LogoutButton() {
  return (
    <Button
      variant="ghost"
      label="Esci"
      size="sm"
      onPress={async () => await authClient.signOut()}
      accessibilityLabel="Esci dall'account"
      className="min-w-0 shrink-0 px-2"
    />
  );
}
