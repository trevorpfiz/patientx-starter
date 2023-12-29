import { Text, View } from "react-native";

import { cn } from "~/components/ui/rn-ui/lib/utils";

export default function MedicationItem({
  medication,
  status,
  dosage,
  start,
  end,
  first,
  last,
}: {
  medication: string;
  status: string;
  dosage: string;
  start: string;
  end: string;
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
        <Text className="text-lg font-semibold">{medication}</Text>
        <View>
          <Text>Status: {status}</Text>
          <Text>Dosage: {dosage}</Text>
          <Text>Start: {start}</Text>
          <Text>End: {end}</Text>
        </View>
      </View>
    </View>
  );
}
