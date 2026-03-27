import BaseLayout from "@/components/base-layout";
import { authClient } from "@/lib/auth";
import { NativeTabs } from "expo-router/unstable-native-tabs";

export default function PrivateLayout() {
  const { data: session } = authClient.useSession();

  return (
    <BaseLayout>
      <NativeTabs>
        <NativeTabs.Trigger name="index">
          <NativeTabs.Trigger.Label>Chats</NativeTabs.Trigger.Label>
          <NativeTabs.Trigger.Icon sf="message.fill" />
        </NativeTabs.Trigger>

        <NativeTabs.Trigger name="profile">
          <NativeTabs.Trigger.Label>
            {session?.user.name ?? "Profilo"}
          </NativeTabs.Trigger.Label>
          <NativeTabs.Trigger.Icon sf="person.fill" />
        </NativeTabs.Trigger>
      </NativeTabs>
    </BaseLayout>
  );
}
