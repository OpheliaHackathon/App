import { createHash } from "node:crypto";

export function profileFingerprint(user: {
  mood: string[];
  personality: string[];
  interests: string[];
}): string {
  const payload = JSON.stringify({
    mood: [...user.mood].sort(),
    personality: [...user.personality].sort(),
    interests: [...user.interests].sort(),
  });
  return createHash("sha256").update(payload).digest("hex");
}
