import Link from "next/link";
import { useAtom } from "jotai";

import { Button } from "@acme/ui/button";

import Steps, { stepsAtom } from "~/components/ui/steps";

export function Overview() {
  const [steps] = useAtom(stepsAtom);

  // Check if all steps are complete
  const allStepsComplete = steps.every((step) => step.status === "complete");

  return (
    <div className="flex flex-col items-center justify-between">
      <Steps />
      <Link
        href="/onboarding?step=schedule"
        style={{
          pointerEvents: !allStepsComplete ? "none" : "auto",
        }}
      >
        <Button disabled={!allStepsComplete}>Schedule Appointment</Button>
      </Link>
    </div>
  );
}
