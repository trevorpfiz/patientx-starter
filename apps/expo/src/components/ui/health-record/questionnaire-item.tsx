import { Text, TouchableOpacity, View } from "react-native";
import { clsx } from "clsx";
import { ChevronRight } from "lucide-react-native";

export default function QuestionnaireItem({
  questionnaireResponse,
  status,
  authored,
  onPress,
  first,
  last,
}: {
  questionnaireResponse: string;
  status: string;
  authored: string;
  onPress: () => void;
  first?: boolean;
  last?: boolean;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={clsx(
        "border-b border-gray-200 bg-white py-8 pl-8 pr-4",
        first ? "rounded-t-xl" : "",
        last ? "rounded-b-xl" : "",
      )}
      activeOpacity={0.5}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex justify-between">
          <Text className="text-lg font-semibold">{questionnaireResponse}</Text>
          <View>
            <Text>Status: {status}</Text>
            <Text>Authored: {authored}</Text>
          </View>
        </View>

        <ChevronRight size={20} strokeWidth={2} />
      </View>
    </TouchableOpacity>
  );
}
