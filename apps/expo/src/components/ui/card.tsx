import { Text, TouchableHighlight, TouchableOpacity, View } from "react-native";
import { ChevronRight } from "lucide-react-native";
import type { LucideIcon } from "lucide-react-native";

const Card = ({
  icon: Icon,
  title,
  onPress,
}: {
  icon: LucideIcon;
  title: string;
  onPress: () => void;
}) => {
  return (
    <TouchableOpacity activeOpacity={0.5} onPress={onPress}>
      <View className="mx-4 mb-4 flex-1 flex-row items-center rounded-xl bg-white py-9 pl-8 pr-4 shadow-sm">
        <View className="mr-4">
          <Icon size={24} color="black" />
        </View>
        <Text className="flex-1 text-xl font-bold">{title}</Text>

        <ChevronRight size={20} strokeWidth={2} />
      </View>
    </TouchableOpacity>
  );
};

export { Card };
