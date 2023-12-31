import { Text, TouchableOpacity, View } from "react-native";
import { ChevronRight } from "lucide-react-native";

import { cn } from "~/components/ui/rn-ui/lib/utils";

export default function AlertCard({
  title,
  preview,
  onPress,
  first,
  last,
}: {
  title: string;
  preview: string;
  onPress: () => void;
  first?: boolean;
  last?: boolean;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={cn(
        "border-b border-gray-200 bg-white",
        first ? "" : "",
        last ? "" : "",
      )}
      activeOpacity={0.5}
    >
      <View className="flex-row items-center justify-between py-9 pl-8 pr-4">
        <View className="flex justify-between">
          <Text className="font-semibold leading-6 text-gray-900">{title}</Text>
          <View className="w-60 flex-row">
            <Text className="flex-1 text-gray-900" numberOfLines={3}>
              {preview}
            </Text>
          </View>
        </View>

        <ChevronRight size={20} strokeWidth={2} color="blue" />
      </View>
      {/* ChevronRightIcon or similar icon */}
    </TouchableOpacity>
  );
}
