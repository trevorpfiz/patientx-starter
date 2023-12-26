import React from "react";
import { TextInput as RNTextInput, Text, View } from "react-native";
import type { TextInputProps } from "react-native";

import { cn } from "../rn-ui/lib/utils";

interface Props extends TextInputProps {
  label?: string;
  className?: string;
  errorMessage?: string;
}

const TextInput = React.forwardRef<RNTextInput, Props>(
  ({ label, className, errorMessage, ...props }, ref) => {
    return (
      <View className={cn("mb-2 w-full", className)}>
        {label && (
          <Text className="mb-2 text-lg font-medium text-gray-900">
            {label}
          </Text>
        )}
        <RNTextInput
          ref={ref}
          className={cn(
            "h-12 rounded-xl border bg-white px-3",
            errorMessage ? "border-red-500" : "border-gray-300",
            className,
          )}
          autoCorrect={false}
          autoCapitalize="none"
          {...props}
        />
        {!!errorMessage && (
          <Text className="mt-1 text-sm text-red-500">{errorMessage}</Text>
        )}
      </View>
    );
  },
);
TextInput.displayName = "TextInput";

export { TextInput };
