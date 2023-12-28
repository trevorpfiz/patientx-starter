import React, { forwardRef, useState } from "react";
import {
  TextInput as RNTextInput,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import type { TextInputProps } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { formatISO } from "date-fns";

import { cn } from "~/components/ui/rn-ui/lib/utils";

interface DatePickerProps extends TextInputProps {
  label?: string;
  className?: string;
  onDateChange: (date: string) => void;
  errorMessage?: string;
  value: string;
}

const DatePicker = forwardRef<RNTextInput, DatePickerProps>(
  ({ label, className, onDateChange, errorMessage, value, ...props }, ref) => {
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    const showDatePicker = () => {
      setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
      setDatePickerVisibility(false);
    };

    const handleConfirm = (date: Date) => {
      // formats the date to "YYYY-MM-DD" format
      onDateChange(formatISO(date, { representation: "date" }));
      hideDatePicker();
    };

    const handleChange = (date: Date) => {
      // formats the date to "YYYY-MM-DD" format
      onDateChange(formatISO(date, { representation: "date" }));
    };

    return (
      <View className={cn("mb-4", className)}>
        {label && (
          <Text className="mb-2 text-lg font-medium text-gray-900">
            {label}
          </Text>
        )}
        <TouchableOpacity
          onPress={showDatePicker}
          className={cn(
            "h-12 flex-row items-center justify-between rounded-xl border bg-white px-3",
            errorMessage ? "border-red-500" : "border-gray-200",
            className,
          )}
        >
          <RNTextInput ref={ref} editable={false} {...props}>
            {value}
          </RNTextInput>
          {/* You can use an icon here */}
        </TouchableOpacity>
        {!!errorMessage && (
          <Text className="mt-1 text-sm text-red-500">{errorMessage}</Text>
        )}
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
          onChange={handleChange}
          textColor="#000"
        />
      </View>
    );
  },
);
DatePicker.displayName = "DatePicker";

export { DatePicker };
