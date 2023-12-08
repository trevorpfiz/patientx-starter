import React from "react";
import { Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";

export default function ChatPage() {
  const { practitionerId } = useLocalSearchParams<{ practitionerId: string }>();
  return (
    <View>
      <Text>Chat Page</Text>
      <Text>{practitionerId}</Text>
    </View>
  );
}
