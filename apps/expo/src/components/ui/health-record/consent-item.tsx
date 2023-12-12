import { Text, View } from "react-native";
import { clsx } from "clsx";

export default function ConsentItem({
  consent,
  status,
  start,
  end,
  first,
  last,
}: {
  consent: string;
  status: string;
  start: string;
  end: string;
  first?: boolean;
  last?: boolean;
}) {
  return (
    <View
      className={clsx(
        "border-b border-gray-200 bg-white px-8",
        first ? "" : "",
        last ? "" : "",
      )}
    >
      <View className="flex py-8">
        <Text className="text-lg font-semibold">{consent}</Text>
        <View>
          <Text>Status: {status}</Text>
          <Text>Start: {start}</Text>
          <Text>End: {end}</Text>
        </View>
      </View>
    </View>
  );
}
