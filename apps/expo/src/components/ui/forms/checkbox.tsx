import React from "react";
import { Text, View } from "react-native";
import Checkbox from "expo-checkbox";

import { cn } from "~/components/ui/rn-ui/lib/utils";

interface Props {
  value: boolean;
  onValueChange: (newValue: boolean) => void;
  label: string;
  errorMessage?: string;
  className?: string;
}

const CustomCheckbox = React.forwardRef<View, Props>(
  ({ value, onValueChange, label, errorMessage, className }, ref) => {
    return (
      <View ref={ref} className={cn("mb-4 w-full", className)}>
        <View className="flex-row items-center">
          <Checkbox
            value={value}
            onValueChange={onValueChange}
            style={{ marginRight: 8 }}
          />
          <Text className="text-lg text-gray-700">{label}</Text>
        </View>
        {errorMessage && (
          <Text className="mt-1 text-sm text-red-500">{errorMessage}</Text>
        )}
      </View>
    );
  },
);
CustomCheckbox.displayName = "CustomCheckbox";

export { CustomCheckbox };
