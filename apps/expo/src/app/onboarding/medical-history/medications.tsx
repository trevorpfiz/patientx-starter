import React from "react";
import { useRouter } from "expo-router";

import { MedicationsForm } from "~/components/forms/medications-form";
import { useStepStatusUpdater } from "~/hooks/use-step-status-updater";

export default function MedicationsFormPage() {
  const updater = useStepStatusUpdater();
  const router = useRouter();

  return (
    <>
      <MedicationsForm
        onSuccess={() => {
          // Update the medications step as complete
          updater.markStepAsComplete("medications");

          // Go to the next step in onboarding
          router.back();
        }}
      />
    </>
  );
}
