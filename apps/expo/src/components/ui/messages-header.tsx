import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { Bell, ChevronLeft, MessageSquare } from "lucide-react-native";

export function MessagesLeftHeaderBack() {
  const router = useRouter();

  return (
    <TouchableOpacity onPress={() => router.back()}>
      <View className="flex-row">
        {/* <ChevronLeft size={18} color="#3b82f6" /> */}
        <Text className="font-medium text-blue-500">Back</Text>
      </View>
    </TouchableOpacity>
  );
}

export function RightHeaderClose() {
  const router = useRouter();

  return (
    <TouchableOpacity onPress={() => router.replace("/portal/(tabs)/")}>
      <Text className="font-medium text-blue-500">Close</Text>
    </TouchableOpacity>
  );
}
