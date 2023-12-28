import { useAtom } from "jotai";

import { historyStepsAtom } from "~/components/ui/history-steps";
import type { HistoryStepId } from "~/components/ui/history-steps";
import { stepsAtom } from "~/components/ui/steps";
import type { StepId, StepStatus } from "~/components/ui/steps";

const useStepStatusUpdater = () => {
  const [steps, setSteps] = useAtom(stepsAtom);
  const [historySteps, setHistorySteps] = useAtom(historyStepsAtom);

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

  const markStepAsComplete = (stepId: StepId | HistoryStepId) => {
    // Update historySteps
    const updatedHistorySteps = historySteps.map((step) =>
      step.id === stepId ? { ...step, status: "complete" } : step,
    );
    setHistorySteps(updatedHistorySteps);

    // Check if the last historyStep was marked as complete
    const isLastHistoryStepComplete = updatedHistorySteps.every(
      (step) => step.status === "complete",
    );

    // Update steps
    const updatedSteps = steps.map((step) => {
      if (step.id === stepId) {
        return { ...step, status: "complete" };
      }
      if (step.id === "medical-history" && isLastHistoryStepComplete) {
        // If the last historyStep is complete, mark medical-history as complete
        return { ...step, status: "complete" };
      }
      return step;
    });
    setSteps(updatedSteps);
  };

  return { updateStepStatus, markStepAsComplete };
};

export { useStepStatusUpdater };
