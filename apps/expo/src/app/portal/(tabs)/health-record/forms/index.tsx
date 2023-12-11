import { View } from "react-native";
import { router } from "expo-router";
import { FlashList } from "@shopify/flash-list";

import { SubpageCard } from "~/components/ui/subpage-card";

const items = [
  {
    title: "Goals",
    onPress: () => router.push("/portal/(tabs)/health-record/forms/goals"),
  },
  {
    title: "Questionnaires",
    onPress: () =>
      router.push("/portal/(tabs)/health-record/forms/questionnaires"),
  },
  {
    title: "Consents",
    onPress: () => router.push("/portal/(tabs)/health-record/forms/consents"),
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
