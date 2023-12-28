import { Text, TouchableOpacity, View } from "react-native";
import {
  ActivitySquare,
  ChevronRight,
  FlaskConical,
} from "lucide-react-native";

import { cn } from "~/components/ui/rn-ui/lib/utils";
import { formatDateTime } from "~/utils/dates";

export default function TestItem({
  name,
  authored,
  issued,
  type,
  onPress,
  first,
  last,
}: {
  name: string;
  authored: string;
  issued: string;
  type: boolean;
  onPress: () => void;
  first?: boolean;
  last?: boolean;
}) {
  // Determine which icon to use based on the type
  const Icon = type ? FlaskConical : ActivitySquare;

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
        <View className="flex-1 flex-row items-center gap-4">
          <Icon size={24} color="black" />
          <View>
            <Text className="text-lg font-semibold">{name}</Text>
            <Text>Authored: {formatDateTime(authored)}</Text>
            <Text>Issued: {formatDateTime(issued)}</Text>
          </View>
        </View>

        <ChevronRight size={20} strokeWidth={2} color="blue" />
      </View>
    </TouchableOpacity>
  );
}
