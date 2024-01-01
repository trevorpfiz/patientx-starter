import { Text, TouchableOpacity, View } from "react-native";
import { ChevronRight } from "lucide-react-native";

import { cn } from "~/components/ui/rn-ui/lib/utils";

export default function ChatPreviewCard({
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
        "border border-gray-200 bg-white shadow-sm",
        first ? "rounded-t-xl" : "",
        last ? "rounded-b-xl" : "",
      )}
      activeOpacity={0.5}
    >
      <View className="flex-row items-center justify-between py-9 pl-8 pr-4">
        <View className="flex-row items-center">
          <View className="mr-4 h-12 w-12 rounded-full bg-slate-700"></View>

          <View className="flex justify-between">
            <Text className="font-semibold leading-6 text-gray-900">
              {title}
            </Text>
            <View className="w-60 flex-row">
              <Text className="flex-1 text-gray-900" numberOfLines={3}>
                {preview}
              </Text>
            </View>
          </View>
        </View>

        <ChevronRight size={20} strokeWidth={2} color="blue" />
      </View>
      {/* ChevronRightIcon or similar icon */}
    </TouchableOpacity>
  );
}
