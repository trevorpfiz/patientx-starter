import React from "react";
import { SafeAreaView, Text, View } from "react-native";

import QuestionnaireSteps from "~/components/ui/questionnaire-steps";

export default function QuestionnairesPage() {
  return (
    <>
      <SafeAreaView className="flex-[0] bg-white" />
      <SafeAreaView className="flex-1 bg-gray-100">
        <View className="flex-1 bg-gray-100">
          <View className="bg-white p-8 px-10">
            <Text className="text-4xl font-semibold">{`Basic medical history`}</Text>
          </View>
          <View className="flex-1">
            <QuestionnaireSteps />
          </View>
        </View>
      </SafeAreaView>
    </>
  );
}
