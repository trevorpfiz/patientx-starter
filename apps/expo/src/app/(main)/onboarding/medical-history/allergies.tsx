import React from "react";
import { useRouter } from "expo-router";

import { AllergiesForm } from "~/components/forms/allergies-form";
import { useStepStatusUpdater } from "~/hooks/use-step-status-updater";

export default function AllergiesFormPage() {
  const updater = useStepStatusUpdater();
  const router = useRouter();

  return (
    <>
      <AllergiesForm
        onSuccess={() => {
          // Update the allergies step as complete
          updater.markStepAsComplete("allergies");

          // Go to the next step in onboarding
          router.back();
        }}
      />
    </>
  );
}
