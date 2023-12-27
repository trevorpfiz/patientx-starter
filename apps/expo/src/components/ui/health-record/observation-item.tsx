import { Text, View } from "react-native";

import { Badge } from "~/components/ui/rn-ui/components/ui/badge";
import { cn } from "~/components/ui/rn-ui/lib/utils";
import { formatDateTime } from "~/utils/dates";

export default function ObservationItem({
  name,
  collectedDate,
  valueQuantity,
  components,
  first,
  last,
}: {
  name: string;
  collectedDate: string;
  valueQuantity?: { value: number; unit?: string };
  components?: { display: string; value: number | string; unit?: string }[];
  first?: boolean;
  last?: boolean;
}) {
  function formatBadgeContent(value: number | string, unit?: string) {
    return unit ? `${value} ${unit}` : `${value}`;
  }

  return (
    <View
      className={cn(
        "border-b border-gray-200 bg-white px-8 py-8",
        first ? "rounded-t-xl" : "",
        last ? "rounded-b-xl" : "",
      )}
    >
      {/* Section for Name and Collected Date */}
      <View className="flex-1 flex-row items-center justify-between">
        <View>
          <Text className="text-lg font-semibold">{name}</Text>
          <Text>Collected on {formatDateTime(new Date(collectedDate))}</Text>
        </View>
        <View>
          {valueQuantity && !components && (
            <Badge>
              {formatBadgeContent(valueQuantity.value, valueQuantity?.unit)}
            </Badge>
          )}
          {!valueQuantity && !components && <Badge>?</Badge>}
        </View>
      </View>

      {/* Separate Section for Components */}
      {components?.map((component, index) => (
        <View
          key={index}
          className="mt-2 flex-1 flex-row items-center justify-between"
        >
          <View>
            <Text className="text-base">{component.display}</Text>
          </View>
          <View>
            <Badge>
              {formatBadgeContent(component.value, component?.unit)}
            </Badge>
          </View>
        </View>
      ))}
    </View>
  );
}
