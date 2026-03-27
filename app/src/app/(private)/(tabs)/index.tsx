import { Header } from "@/components/header";
import { Link } from "expo-router";
import { MessageCircleIcon, PlusIcon } from "lucide-react-native";
import { ColorValue, Text, TouchableOpacity, View } from "react-native";
import { useCSSVariable } from "uniwind";

export default function ChatsScreen() {
  const textColor = useCSSVariable("--color-text");

  return (
    <View className="flex-1 bg-background">
      <Header>
        <Text className="text-text text-2xl font-bold flex justify-center items-center gap-2">
          <MessageCircleIcon
            color={(textColor as ColorValue) ?? "white"}
            size={20}
          />{" "}
          Chats
        </Text>

        <Link href="/chats/new" asChild>
          <TouchableOpacity>
            <PlusIcon color={(textColor as ColorValue) ?? "white"} size={20} />
          </TouchableOpacity>
        </Link>
      </Header>
    </View>
  );
}
