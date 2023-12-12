import { Text, View } from "react-native";
import { clsx } from "clsx";
import { ActivitySquare, FlaskConical } from "lucide-react-native";

export default function ResultItem({
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
    <View
      className={clsx(
        "border-b border-gray-200 bg-white px-8",
        first ? "rounded-t-lg" : "",
        last ? "rounded-b-lg" : "",
      )}
      onTouchEnd={onPress}
    >
      <View className="flex-row items-center py-8">
        <Icon size={24} color="black" />
        <View>
          <Text className="text-lg font-semibold">{name}</Text>
          <Text>Authored: {authored}</Text>
          <Text>Issued: {issued}</Text>
        </View>
      </View>
    </View>
  );
}
