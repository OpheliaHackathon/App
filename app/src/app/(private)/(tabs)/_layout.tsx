import BaseLayout from "@/components/base-layout";
import { NativeTabs } from "expo-router/unstable-native-tabs";

export default function PrivateLayout() {
  return (
    <BaseLayout>
      <NativeTabs>
        <NativeTabs.Trigger name="index">
          <NativeTabs.Trigger.Label>Chats</NativeTabs.Trigger.Label>
          <NativeTabs.Trigger.Icon sf="message.fill" />
        </NativeTabs.Trigger>
      </NativeTabs>
    </BaseLayout>
  );
}
