import { Text, TouchableOpacity, View } from "react-native";
import { ChevronRight } from "lucide-react-native";
import type { LucideIcon } from "lucide-react-native";

import { Card } from "~/components/ui/rn-ui/components/ui/card";

const RecordCategoryCard = ({
  icon: Icon,
  title,
  onPress,
}: {
  icon: LucideIcon;
  title: string;
  onPress: () => void;
}) => {
  return (
    <TouchableOpacity activeOpacity={0.5} onPress={onPress} className="mb-4">
      <Card className="flex-1 flex-row items-center bg-white py-9 pl-8 pr-4">
        <View className="mr-4">
          <Icon size={24} color="black" />
        </View>
        <Text className="flex-1 text-xl font-bold">{title}</Text>

        <ChevronRight size={20} strokeWidth={2} color="blue" />
      </Card>
    </TouchableOpacity>
  );
};

export { RecordCategoryCard };
