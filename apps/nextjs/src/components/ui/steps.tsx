import Link from "next/link";
import { CheckIcon } from "@heroicons/react/20/solid";
import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";

import { cn } from "@acme/ui";

type StepId =
  | "welcome"
  | "medical-history"
  | "coverage"
  | "questionnaire"
  | "schedule";
type StepStatus = "complete" | "current" | "upcoming";

const initialSteps = [
  {
    id: "welcome",
    name: "Welcome",
    description: "Basic info.",
    href: "/onboarding",
    status: "complete",
  },
  {
    id: "medical-history",
    name: "Basic Medical History",
    description: "A few questions about your medical history.",
    href: "/onboarding?step=medical-history",
    status: "current",
  },
  {
    id: "coverage",
    name: "Coverage",
    description: "Health insurance information.",
    href: "/onboarding?step=coverage",
    status: "upcoming",
  },
  {
    id: "questionnaire",
    name: "Questionnaires",
    description: "Fill out necessary questionnaires.",
    href: "/onboarding?step=questionnaire",
    status: "upcoming",
  },
  {
    id: "schedule",
    name: "Schedule",
    description: "Scheudle an appointment with our care team.",
    href: "/onboarding?step=schedule",
    status: "upcoming",
  },
];

export const stepsAtom = atomWithStorage(
  "onboardingSteps",
  initialSteps,
  undefined,
  {
    getOnInit: true,
  },
);

export const useStepStatusUpdater = () => {
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

  return { updateStepStatus };
};

export default function Steps() {
  const [steps] = useAtom(stepsAtom);

  return (
    <nav aria-label="Progress">
      <ol className="overflow-hidden">
        {steps.map((step, stepIdx) => (
          <li
            key={step.name}
            className={cn(
              stepIdx !== steps.length - 1 ? "pb-10" : "",
              "relative",
            )}
          >
            {step.status === "complete" ? (
              <>
                {stepIdx !== steps.length - 1 ? (
                  <div
                    className="absolute left-4 top-4 -ml-px mt-0.5 h-full w-0.5 bg-indigo-600"
                    aria-hidden="true"
                  />
                ) : null}
                <div className="group relative flex items-start">
                  <span className="flex h-9 items-center">
                    <span className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 group-hover:bg-indigo-800">
                      <CheckIcon
                        className="h-5 w-5 text-white"
                        aria-hidden="true"
                      />
                    </span>
                  </span>
                  <span className="ml-4 flex min-w-0 flex-col">
                    <span className="text-sm font-medium">{step.name}</span>
                    <span className="text-sm text-gray-500">
                      {step.description}
                    </span>
                  </span>
                </div>
              </>
            ) : step.status === "current" ? (
              <>
                {stepIdx !== steps.length - 1 ? (
                  <div
                    className="absolute left-4 top-4 -ml-px mt-0.5 h-full w-0.5 bg-gray-300"
                    aria-hidden="true"
                  />
                ) : null}
                <Link
                  href={step.href}
                  className="group relative flex items-start"
                  aria-current="step"
                >
                  <span className="flex h-9 items-center" aria-hidden="true">
                    <span className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 border-indigo-600 bg-white">
                      <span className="h-2.5 w-2.5 rounded-full bg-indigo-600" />
                    </span>
                  </span>
                  <span className="ml-4 flex min-w-0 flex-col">
                    <span className="text-sm font-medium text-indigo-600">
                      {step.name}
                    </span>
                    <span className="text-sm text-gray-500">
                      {step.description}
                    </span>
                  </span>
                </Link>
              </>
            ) : (
              <>
                {stepIdx !== steps.length - 1 ? (
                  <div
                    className="absolute left-4 top-4 -ml-px mt-0.5 h-full w-0.5 bg-gray-300"
                    aria-hidden="true"
                  />
                ) : null}
                <div className="group relative flex items-start">
                  <span className="flex h-9 items-center" aria-hidden="true">
                    <span className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-300 bg-white group-hover:border-gray-400">
                      <span className="h-2.5 w-2.5 rounded-full bg-transparent group-hover:bg-gray-300" />
                    </span>
                  </span>
                  <span className="ml-4 flex min-w-0 flex-col">
                    <span className="text-sm font-medium text-gray-500">
                      {step.name}
                    </span>
                    <span className="text-sm text-gray-500">
                      {step.description}
                    </span>
                  </span>
                </div>
              </>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
