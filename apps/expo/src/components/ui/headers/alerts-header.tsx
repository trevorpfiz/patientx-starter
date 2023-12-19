import { TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { X } from "lucide-react-native";

export function AlertsRightHeaderClose() {
  const router = useRouter();

  return (
    <TouchableOpacity onPress={() => router.back()}>
      <X size={24} color="black" strokeWidth={2} />
    </TouchableOpacity>
  );
}
