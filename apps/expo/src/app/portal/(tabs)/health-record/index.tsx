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

import { RecordCategoryCard } from "~/components/ui/cards/record-category-card";

const items = [
  {
    icon: TestTube,
    title: "Test results",
    onPress: () => router.push("/portal/(tabs)/health-record/test-results"),
  },
  {
    icon: FileText,
    title: "Clinical Notes & Forms",
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
          <RecordCategoryCard
            icon={item.icon}
            title={item.title}
            onPress={item.onPress}
          />
        )}
        estimatedItemSize={200}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{
          paddingBottom: 16,
          paddingTop: 16,
          paddingHorizontal: 16,
        }}
      />
    </View>
  );
}
