import React from "react";
import { SafeAreaView } from "react-native";
import { Stack, useRouter } from "expo-router";

import { MedicationsForm } from "~/components/forms/medications-form";
import { useStepStatusUpdater } from "~/hooks/use-step-status-updater";

export default function MedicationsFormPage() {
  const updater = useStepStatusUpdater();
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <Stack.Screen
        options={{
          title: "Medications",
          headerTitleAlign: "center",
        }}
      />
      <MedicationsForm
        onSuccess={() => {
          // Update the medications step as complete
          updater.markStepAsComplete("medications");

          // Go back to the medical history page
          router.back();
        }}
      />
    </SafeAreaView>
  );
}
