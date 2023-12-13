import React from "react";
import { StyleSheet, Text, View } from "react-native";
import type { StyleProp, ViewStyle } from "react-native";
import Checkbox from "expo-checkbox";

interface Props {
  value: boolean;
  onValueChange: (newValue: boolean) => void;
  label: string;
  errorMessage?: string;
  style?: StyleProp<ViewStyle>;
}

export const CustomCheckbox: React.FC<Props> = ({
  value,
  onValueChange,
  label,
  errorMessage,
  style,
}) => {
  return (
    <View style={[styles.wrapper, style]}>
      <View style={styles.checkboxContainer}>
        <Checkbox
          value={value}
          onValueChange={onValueChange}
          style={styles.checkbox}
        />
        <Text style={styles.label}>{label}</Text>
      </View>
      {!!errorMessage && (
        <Text style={styles.errorMessageText}>{errorMessage}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    marginBottom: 4,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    marginRight: 8,
  },
  label: {
    color: "#000",
    fontSize: 14,
  },
  errorMessageText: {
    color: "#B00020",
    fontSize: 12,
    fontWeight: "bold",
    marginTop: 4,
  },
});
