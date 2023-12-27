import { Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";

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

export function MessagesRightHeaderClose() {
  const router = useRouter();

  return (
    <TouchableOpacity onPress={() => router.back()}>
      <View className="w-11">
        <Text className="font-medium text-blue-500">Close</Text>
      </View>
    </TouchableOpacity>
  );
}

export function ChatRightHeaderClose() {
  const router = useRouter();

  return (
    <TouchableOpacity
      onPress={() => {
        while (router.canGoBack()) {
          // Pop from stack until one element is left
          router.back();
        }
        router.replace("/portal/(tabs)/"); // Replace the last remaining stack element
      }}
    >
      <View className="w-11">
        <Text className="font-medium text-blue-500">Close</Text>
      </View>
    </TouchableOpacity>
  );
}
