import React from "react";
import { SafeAreaView } from "react-native";
import { Stack, useRouter } from "expo-router";

import { AllergiesForm } from "~/components/forms/allergies-form";
import { useStepStatusUpdater } from "~/hooks/use-step-status-updater";

export default function AllergiesFormPage() {
  const updater = useStepStatusUpdater();
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <Stack.Screen
        options={{
          title: "Allergies",
          headerTitleAlign: "center",
        }}
      />
      <AllergiesForm
        onSuccess={() => {
          // Update the allergies step as complete
          updater.markStepAsComplete("allergies");

          // Go back to the medical history page
          router.back();
        }}
      />
    </SafeAreaView>
  );
}
