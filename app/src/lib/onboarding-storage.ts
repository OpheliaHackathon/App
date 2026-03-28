import * as SecureStore from "expo-secure-store";

const key = (userId: string) => `faindy_onboarding_v1_${userId}`;

const memoryDone = new Set<string>();

export async function isUserOnboardingComplete(userId: string): Promise<boolean> {
  if (memoryDone.has(userId)) return true;
  const v = await SecureStore.getItemAsync(key(userId));
  const done = v === "1";
  if (done) memoryDone.add(userId);
  return done;
}

export async function setUserOnboardingComplete(userId: string): Promise<void> {
  memoryDone.add(userId);
  await SecureStore.setItemAsync(key(userId), "1");
}
