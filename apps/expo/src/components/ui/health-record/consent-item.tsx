import { Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { ChevronRight } from "lucide-react-native";

import { cn } from "~/components/ui/rn-ui/lib/utils";

export default function ConsentItem({
  consent,
  status,
  start,
  end,
  source,
  first,
  last,
}: {
  consent: string;
  status: string;
  start: string;
  end: string;
  source: string;
  first?: boolean;
  last?: boolean;
}) {
  const router = useRouter();

  return (
    <TouchableOpacity
      onPress={() =>
        router.push({
          pathname: "/portal/(modals)/pdf",
          params: {
            url: source,
          },
        })
      }
      className={cn(
        "border-b border-gray-200 bg-white py-8 pl-8 pr-4",
        first ? "rounded-t-xl" : "",
        last ? "rounded-b-xl" : "",
      )}
      activeOpacity={0.5}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex justify-between">
          <Text className="text-lg font-semibold">{consent}</Text>
          <View>
            <Text>Status: {status}</Text>
            <Text>Start: {start}</Text>
            <Text>End: {end}</Text>
          </View>
        </View>

        <ChevronRight size={20} strokeWidth={2} color="blue" />
      </View>
    </TouchableOpacity>
  );
}
