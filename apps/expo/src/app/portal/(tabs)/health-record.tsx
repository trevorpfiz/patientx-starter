import React from "react";
import { View } from "react-native";
import { router } from "expo-router";
import { FlashList } from "@shopify/flash-list";
import {
  FileText,
  Leaf,
  Pill,
  Stethoscope,
  Syringe,
  TestTube,
} from "lucide-react-native";

import { Card } from "~/components/ui/card";

const items = [
  {
    icon: TestTube,
    title: "Test results",
    onPress: () => router.push("/portal/(tabs)/health-record/test-results"),
  },
  {
    icon: FileText,
    title: "Forms",
    onPress: () => router.push("/portal/(tabs)/health-record/forms"),
  },
  {
    icon: Pill,
    title: "Medications",
    onPress: () => router.push("/portal/(tabs)/health-record/medications"),
  },
  {
    icon: Stethoscope,
    title: "Conditions",
    onPress: () => router.push("/portal/(tabs)/health-record/conditions"),
  },
  {
    icon: Leaf,
    title: "Allergies",
    onPress: () => router.push("/portal/(tabs)/health-record/allergies"),
  },
  {
    icon: Syringe,
    title: "Immunizations",
    onPress: () => router.push("/portal/(tabs)/health-record/immunizations"),
  },
];

export default function HealthRecord() {
  return (
    <View className="flex-1 bg-gray-100">
      <FlashList
        data={items}
        renderItem={({ item }) => (
          <Card icon={item.icon} title={item.title} onPress={item.onPress} />
        )}
        estimatedItemSize={100}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{ paddingBottom: 16, paddingTop: 16 }}
      />
    </View>
  );
}
