import { Text, TouchableOpacity, View } from "react-native";
import { ChevronRight } from "lucide-react-native";

import { cn } from "~/components/ui/rn-ui/lib/utils";
import { formatDateTime } from "~/utils/dates";

export default function QuestionnaireItem({
  questionnaireName,
  questionnaireStatus,
  status,
  authored,
  onPress,
  first,
  last,
}: {
  questionnaireName: string;
  questionnaireStatus: string;
  status: string;
  authored: string;
  onPress: () => void;
  first?: boolean;
  last?: boolean;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={cn(
        "border-b border-gray-200 bg-white py-8 pl-8 pr-4",
        first ? "rounded-t-xl" : "",
        last ? "rounded-b-xl" : "",
      )}
      activeOpacity={0.5}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex justify-between">
          <Text className="text-lg font-semibold">{questionnaireName}</Text>
          <View>
            <Text>Status: {questionnaireStatus}</Text>
            <Text>Authored: {formatDateTime(authored)}</Text>
          </View>
        </View>

        <ChevronRight size={20} strokeWidth={2} color="blue" />
      </View>
    </TouchableOpacity>
  );
}
