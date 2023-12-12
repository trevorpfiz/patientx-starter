import React from "react";
import { TextInput as RNTextInput, StyleSheet, Text, View } from "react-native";
import type { TextInputProps } from "react-native";

interface Props extends TextInputProps {
  errorMessage?: string;
  label: string;
}

export const TextInput: React.FC<Props> = ({
  errorMessage,
  label,
  ...textInputProps
}) => {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <RNTextInput
        style={styles.textInput}
        autoCorrect={false}
        autoCapitalize="none"
        {...textInputProps}
      />
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
  textInput: {
    height: 48,
    borderWidth: 1,
    borderColor: "#007BFF",
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#fff",
    elevation: 1,
  },
  errorMessageText: {
    color: "#B00020",
    fontSize: 12,
    fontWeight: "bold",
    marginTop: 4,
  },
  label: {
    color: "#000",
    marginBottom: 6,
    fontSize: 14,
  },
});
