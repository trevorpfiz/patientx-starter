import React from "react";
import { useRouter } from "expo-router";

import { QuestionnaireForm } from "~/components/forms/questionnaire-form";

export default function QuestionnairePage() {
  const router = useRouter();

  return (
    <QuestionnaireForm
      questionnaireId="f62257a5-bf65-4678-b8d1-568bd298617d"
      onSuccess={() => {
        // Go to the next step in onboarding
        router.replace("/onboarding/overview");
      }}
    />
  );
}
