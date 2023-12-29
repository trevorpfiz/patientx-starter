import { Text, View } from "react-native";

import { cn } from "~/components/ui/rn-ui/lib/utils";

export default function QuestionItem({
  text,
  answer,
  first,
  last,
}: {
  text: string;
  answer: string;
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
        <Text className="text-lg font-semibold">{text}</Text>
        <Text>{answer}</Text>
      </View>
    </View>
  );
}
