import { Text, View } from "react-native";

import { cn } from "../rn-ui/lib/utils";

export default function AllergyItem({
  allergen,
  type,
  severity,
  reaction,
  first,
  last,
}: {
  allergen: string;
  type: string;
  severity: string;
  reaction: string;
  first?: boolean;
  last?: boolean;
}) {
  return (
    <View
      className={cn(
        "border-b border-gray-200 bg-white px-8",
        first ? "" : "",
        last ? "" : "",
      )}
    >
      <View className="flex py-8">
        <Text className="text-lg font-semibold">{allergen}</Text>
        <View>
          <Text>
            {type} - {severity} - {reaction}
          </Text>
        </View>
      </View>
    </View>
  );
}
