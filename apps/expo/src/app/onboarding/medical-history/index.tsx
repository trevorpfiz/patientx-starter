import React from "react";
import { SafeAreaView, Text, View } from "react-native";

import HistorySteps from "~/components/ui/history-steps";

export default function MedicalHistoryPage() {
  return (
    <>
      <SafeAreaView className="flex-[0] bg-white" />
      <SafeAreaView className="flex-1 bg-transparent">
        <View className="flex-1 bg-gray-100">
          <View className="bg-white p-8 px-10">
            <Text className="text-4xl font-semibold">{`Basic medical history`}</Text>
          </View>
          <View className="flex-1">
            <HistorySteps />
          </View>
        </View>
      </SafeAreaView>
    </>
  );
}
