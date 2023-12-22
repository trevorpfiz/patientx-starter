import { Text, View } from "react-native";
import { router } from "expo-router";
import { FlashList } from "@shopify/flash-list";
import { Receipt } from "lucide-react-native";

import { RecordCategoryCard } from "~/components/ui/cards/record-category-card";

const items = [
  {
    icon: Receipt,
    title: "Billing",
    onPress: () => router.push("/portal/(tabs)/account/billing"),
  },
];

export default function Account() {
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
