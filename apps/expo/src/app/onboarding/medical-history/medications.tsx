import React from "react";
import { Stack, useRouter } from "expo-router";

import { MedicationsForm } from "~/components/forms/medications-form";
import { useStepStatusUpdater } from "~/hooks/use-step-status-updater";

export default function MedicationsFormPage() {
  const updater = useStepStatusUpdater();
  const router = useRouter();

  return (
    <>
      <Stack.Screen
        options={{
          title: "Medications",
          headerStyle: {
            backgroundColor: "#fff",
          },
          headerShown: true,
        }}
      />
      <MedicationsForm
        onSuccess={() => {
          // Update the medications step as complete
          //   updater.markStepAsComplete("medications");

          // Go to the next step in onboarding
          router.back();
        }}
      />
    </>
  );
}
