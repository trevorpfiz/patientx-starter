import { useAtom } from "jotai";

import type { HistoryStepId } from "~/components/ui/history-steps";
import { stepsAtom } from "~/components/ui/steps";
import type { StepId, StepStatus } from "~/components/ui/steps";

const useStepStatusUpdater = () => {
  const [steps, setSteps] = useAtom(stepsAtom);

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
    const updatedSteps = steps.map((step) =>
      step.id === stepId ? { ...step, status: "complete" } : step,
    );

    setSteps(updatedSteps);
  };

  return { updateStepStatus, markStepAsComplete };
};

export { useStepStatusUpdater };
