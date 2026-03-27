import { Loading } from "@/components/loading";
import { View } from "react-native";

export default function LoadingScreen() {
  return (
    <View className="flex-1 bg-background justify-end relative">
      <View className="bg-background w-full h-1/2 mt-auto flex flex-col items-center justify-center rounded-3xl z-10">
        <Loading message="Caricamento..." />
      </View>
    </View>
  );
}
