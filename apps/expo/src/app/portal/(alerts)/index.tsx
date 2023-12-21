import { Text, View } from "react-native";
import { router } from "expo-router";
import { FlashList } from "@shopify/flash-list";

import AlertCard from "~/components/ui/cards/alert-card";

const alerts = [
  {
    title: "New test result",
    message: "You have a new test result.",
    onPress: () => router.push("/portal/(tabs)/health-record/test-results"),
  },
  {
    title: "New appointment",
    message: "You have been scheduled for a new appointment.",

    onPress: () => router.push("/portal/(tabs)/health-record"),
  },
];

export default function AlertsPage() {
  return (
    <View className="flex-1 bg-gray-100">
      <FlashList
        data={alerts}
        renderItem={({ item, index }) => (
          <AlertCard
            title={item.title}
            preview={item.message}
            onPress={item.onPress}
            first={index === 0}
            last={index === alerts.length - 1}
          />
        )}
        estimatedItemSize={100}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{
          paddingBottom: 16,
          // paddingTop: 16,
          // paddingHorizontal: 16,
        }}
      />
    </View>
  );
}
