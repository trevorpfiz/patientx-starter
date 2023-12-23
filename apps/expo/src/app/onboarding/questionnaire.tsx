import React from "react";
import { useRouter } from "expo-router";

import { QuestionnaireForm } from "~/components/forms/questionnaire-form";

export default function QuestionnairePage() {
  const router = useRouter();

  return (
    <QuestionnaireForm
      onSuccess={() => {
        // Go to the next step in onboarding
        router.replace("/onboarding/overview");
      }}
    />
  );
}
