import { Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";

export function LeftHeaderDone() {
  const router = useRouter();

  return (
    <TouchableOpacity onPress={() => router.back()}>
      <Text className="font-medium text-blue-500">Done</Text>
    </TouchableOpacity>
  );
}
