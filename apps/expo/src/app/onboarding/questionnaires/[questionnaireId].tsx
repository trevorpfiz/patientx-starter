import React from "react";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";

import { QuestionnaireForm } from "~/components/forms/questionnaire-form";
import type { QuestionnaireStepId } from "~/components/ui/questionnaire-steps";
import { useStepStatusUpdater } from "~/hooks/use-step-status-updater";

export default function QuestionnairePage() {
  const { questionnaireId, stepId, name } = useLocalSearchParams<{
    questionnaireId: string;
    stepId: QuestionnaireStepId;
    name: string;
  }>();
  const router = useRouter();
  const updater = useStepStatusUpdater();

  return (
    <>
      <Stack.Screen
        options={{
          title: name,
        }}
      />
      <QuestionnaireForm
        questionnaireId={questionnaireId}
        onSuccess={() => {
          // Update questionnaire step as complete
          updater.markStepAsComplete(stepId);

          // Go to the next step in onboarding
          router.back();
        }}
      />
    </>
  );
}
