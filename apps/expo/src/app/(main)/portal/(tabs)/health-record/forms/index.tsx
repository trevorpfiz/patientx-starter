import { View } from "react-native";
import { router } from "expo-router";
import { FlashList } from "@shopify/flash-list";

import { SubpageCard } from "~/components/ui/cards/subpage-card";

const items = [
  {
    title: "Clinical Notes",
    onPress: () => router.push("/portal/health-record/forms/clinical-notes"),
  },
  {
    title: "Goals",
    onPress: () => router.push("/portal/health-record/forms/goals"),
  },
  {
    title: "Questionnaires",
    onPress: () => router.push("/portal/health-record/forms/questionnaires"),
  },
  {
    title: "Consents",
    onPress: () => router.push("/portal/health-record/forms/consents"),
  },
];

export default function Forms() {
  return (
    <View className="flex-1 bg-gray-100">
      <FlashList
        data={items}
        renderItem={({ item }) => (
          <SubpageCard title={item.title} onPress={item.onPress} />
        )}
        estimatedItemSize={100}
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
