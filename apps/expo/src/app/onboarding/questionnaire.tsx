import React from "react";
import { useRouter } from "expo-router";

import { QuestionnaireForm } from "~/components/forms/questionnaire-form";

export default function QuestionnairePage() {
  const router = useRouter();

  return (
    <QuestionnaireForm
      questionnaireId="d40f338d-fdb6-4d53-9d67-f48751bdabb1"
      onSuccess={() => {
        // Go to the next step in onboarding
        router.replace("/onboarding/overview");
      }}
    />
  );
}
