import React from "react";
import { Text, View } from "react-native";
import RNPickerSelect from "react-native-picker-select";
import type { PickerSelectProps } from "react-native-picker-select";
import clsx from "clsx";

interface Props extends PickerSelectProps {
  label?: string;
  className?: string;
  items: { label: string; value: string }[];
  errorMessage?: string;
}

const Dropdown = React.forwardRef<RNPickerSelect, Props>(
  ({ label, className, items, errorMessage, ...props }, ref) => {
    return (
      <View className={clsx("mb-4 w-full", className)}>
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
              borderColor: "#d9d9d9",
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
              borderColor: "#d9d9d9",
              borderWidth: 1,
              paddingVertical: 0,
              paddingHorizontal: 12,
              fontSize: 14,
              color: "black",
              paddingRight: 30, // to ensure the text is never behind the icon
              marginVertical: 0,
            },
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
