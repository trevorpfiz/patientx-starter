import { useAtom } from "jotai";

import { historyStepsAtom } from "~/components/ui/history-steps";
import type { HistoryStepId } from "~/components/ui/history-steps";
import type { QuestionnaireStepId } from "~/components/ui/questionnaire-steps";
import { questionnaireStepsAtom } from "~/components/ui/questionnaire-steps";
import { stepsAtom } from "~/components/ui/steps";
import type { StepId, StepStatus } from "~/components/ui/steps";

const useStepStatusUpdater = () => {
  const [steps, setSteps] = useAtom(stepsAtom);
  const [historySteps, setHistorySteps] = useAtom(historyStepsAtom);
  const [questionnaireSteps, setQuestionnaireSteps] = useAtom(
    questionnaireStepsAtom,
  );

  const updateStepStatus = (stepId: StepId, newStatus: StepStatus) => {
    const stepIndex = steps.findIndex((step) => step.id === stepId);
    if (stepIndex === -1) return; // Step not found

    const updatedSteps = steps.map((step, index) => {
      if (index === stepIndex) {
        // Update the current step
        return { ...step, status: newStatus };
      } else if (index === stepIndex + 1 && newStatus === "complete") {
        // Update the next step to 'current' if the current step is marked as complete
        return { ...step, status: "current" };
      }
      return step;
    });

    setSteps(updatedSteps);
  };

  const markStepAsComplete = (
    stepId: StepId | HistoryStepId | QuestionnaireStepId,
  ) => {
    // Update historySteps
    const updatedHistorySteps = historySteps.map((step) =>
      step.id === stepId ? { ...step, status: "complete" } : step,
    );
    setHistorySteps(updatedHistorySteps);

    // Update questionnaireSteps
    const updatedQuestionnaireSteps = questionnaireSteps.map((step) =>
      step.id === stepId ? { ...step, status: "complete" } : step,
    );
    setQuestionnaireSteps(updatedQuestionnaireSteps);

    // Check if all historySteps or questionnaireSteps are complete
    const isLastHistoryStepComplete = updatedHistorySteps.every(
      (step) => step.status === "complete",
    );
    const isLastQuestionnaireStepComplete = updatedQuestionnaireSteps.every(
      (step) => step.status === "complete",
    );

    // Update steps
    const updatedSteps = steps.map((step, index, array) => {
      if (step.id === "medical-history" && isLastHistoryStepComplete) {
        // Mark 'medical-history' as complete and set the next step to 'current'
        const nextStep = array[index + 1];
        if (nextStep && nextStep.status === "upcoming") {
          array[index + 1] = { ...nextStep, status: "current" };
        }
        return { ...step, status: "complete" };
      } else if (
        step.id === "questionnaires" &&
        isLastQuestionnaireStepComplete
      ) {
        // Mark 'questionnaires' as complete and set the next step to 'current'
        const nextStep = array[index + 1];
        if (nextStep && nextStep.status === "upcoming") {
          array[index + 1] = { ...nextStep, status: "current" };
        }
        return { ...step, status: "complete" };
      }
      return step;
    });

    setSteps(updatedSteps);
  };

  return { updateStepStatus, markStepAsComplete };
};

export { useStepStatusUpdater };
