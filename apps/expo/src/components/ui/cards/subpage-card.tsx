import { Text, TouchableOpacity, View } from "react-native";
import { ChevronRight } from "lucide-react-native";

const SubpageCard = ({
  title,
  onPress,
}: {
  title: string;
  onPress: () => void;
}) => {
  return (
    <TouchableOpacity activeOpacity={0.5} onPress={onPress}>
      <View className="mb-4 flex-1 flex-row items-center rounded-xl bg-white py-9 pl-8 pr-4 shadow-sm">
        <Text className="flex-1 text-xl font-bold">{title}</Text>

        <ChevronRight size={20} strokeWidth={2} />
      </View>
    </TouchableOpacity>
  );
};

export { SubpageCard };
