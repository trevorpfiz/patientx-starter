import { Text, View } from "react-native";

import { cn } from "~/components/ui/rn-ui/lib/utils";

export default function ConditionItem({
  condition,
  status,
  onset,
  abatement,
  first,
  last,
}: {
  condition: string;
  status: string;
  onset: string;
  abatement: string;
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
        <Text className="text-lg font-semibold">{condition}</Text>
        <View>
          <Text className="text-sm text-gray-500">Status: {status}</Text>
          <Text className="text-sm text-gray-500">Onset: {onset}</Text>
          <Text className="text-sm text-gray-500">Abatement: {abatement}</Text>
        </View>
      </View>
    </View>
  );
}
