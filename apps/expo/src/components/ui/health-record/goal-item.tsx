import { Text, View } from "react-native";

import { cn } from "~/components/ui/rn-ui/lib/utils";

export default function GoalItem({
  goal,
  status,
  start,
  priority,
  first,
  last,
}: {
  goal: string;
  status: string;
  start: string;
  priority: string;
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
        <Text className="text-lg font-semibold">{goal}</Text>
        <View>
          <Text>Status: {status}</Text>
          <Text>Start: {start}</Text>
          <Text>Priority: {priority}</Text>
        </View>
      </View>
    </View>
  );
}
