import React from "react";
import { Stack, useRouter } from "expo-router";

import { AllergiesForm } from "~/components/forms/allergies-form";
import { useStepStatusUpdater } from "~/hooks/use-step-status-updater";

export default function AllergiesFormPage() {
  const updater = useStepStatusUpdater();
  const router = useRouter();

  return (
    <>
      <Stack.Screen
        options={{
          title: "Allergies",
          headerStyle: {
            backgroundColor: "#fff",
          },
          headerShown: true,
        }}
      />
      <AllergiesForm
        onSuccess={() => {
          // Update the allergies step as complete
          //   updater.markStepAsComplete("allergies");

          // Go to the next step in onboarding
          router.replace("/onboarding/overview");
        }}
      />
    </>
  );
}
