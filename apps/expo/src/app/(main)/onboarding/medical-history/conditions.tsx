import React from "react";
import { SafeAreaView } from "react-native";
import { Stack, useRouter } from "expo-router";

import { ConditionsForm } from "~/components/forms/conditions-form";
import { useStepStatusUpdater } from "~/hooks/use-step-status-updater";

export default function ConditionsFormPage() {
  const updater = useStepStatusUpdater();
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <Stack.Screen
        options={{
          title: "Conditions",
          headerTitleAlign: "center",
        }}
      />
      <ConditionsForm
        onSuccess={() => {
          // Update the conditions step as complete
          updater.markStepAsComplete("conditions");

          // Go back to the medical history page
          router.back();
        }}
      />
    </SafeAreaView>
  );
}
