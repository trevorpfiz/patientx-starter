import React from "react";
import { Stack, useRouter } from "expo-router";

import { ConditionsForm } from "~/components/forms/conditions-form";
import { useStepStatusUpdater } from "~/hooks/use-step-status-updater";

export default function ConditionsFormPage() {
  const updater = useStepStatusUpdater();
  const router = useRouter();

  return (
    <>
      <Stack.Screen
        options={{
          title: "Conditions",
          headerStyle: {
            backgroundColor: "#fff",
          },
          headerShown: true,
        }}
      />
      <ConditionsForm
        onSuccess={() => {
          // Update the conditions step as complete
          updater.markStepAsComplete("conditions");

          // Go to the next step in onboarding
          router.back();
        }}
      />
    </>
  );
}
