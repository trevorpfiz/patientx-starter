import React from "react";
import { Text, View } from "react-native";
import RNPickerSelect from "react-native-picker-select";
import type { PickerSelectProps } from "react-native-picker-select";
import { ChevronDown } from "lucide-react-native";

import { cn } from "~/components/ui/rn-ui/lib/utils";

interface Props extends PickerSelectProps {
  label?: string;
  className?: string;
  items: { label: string; value: any }[];
  errorMessage?: string;
}

const Dropdown = React.forwardRef<RNPickerSelect, Props>(
  ({ label, className, items, errorMessage, ...props }, ref) => {
    return (
      <View className={cn("mb-4", className)}>
        {label && (
          <Text className="mb-2 text-lg font-medium text-gray-900">
            {label}
          </Text>
        )}
        <RNPickerSelect
          ref={ref}
          items={items}
          style={{
            inputIOS: {
              height: 44, // 48 is bigger than TextInput?
              borderRadius: 12,
              backgroundColor: "#fff",
              borderColor: "#e5e7eb",
              borderWidth: 1,
              paddingVertical: 0,
              paddingHorizontal: 12,
              fontSize: 14,
              color: "black",
              paddingRight: 30, // to ensure the text is never behind the icon
              marginVertical: 0,
            },
            inputAndroid: {
              height: 44,
              borderRadius: 12,
              backgroundColor: "#fff",
              borderColor: "#e5e7eb",
              borderWidth: 1,
              paddingVertical: 0,
              paddingHorizontal: 12,
              fontSize: 14,
              color: "black",
              paddingRight: 30, // to ensure the text is never behind the icon
              marginVertical: 0,
            },
            iconContainer: {
              top: 11,
              right: 8,
            },
          }}
          // @ts-expect-error @link https://github.com/lawnstarter/react-native-picker-select/issues/478
          Icon={() => {
            return <ChevronDown color="gray" />;
          }}
          {...props}
        />
        {!!errorMessage && (
          <Text className="mt-1 text-sm text-red-500">{errorMessage}</Text>
        )}
      </View>
    );
  },
);
Dropdown.displayName = "Dropdown";

export { Dropdown };
