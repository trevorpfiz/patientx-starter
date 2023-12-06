import Link from "next/link";

import { Button } from "@acme/ui/button";

export function NextSteps() {
  return (
    <div>
      <p>Congratulations on finishing the onboarding!</p>
      <p>
        Your appointment has been scheduled from start time to end time on date
        with practitioner.
      </p>
      <p>
        Feel free to proceed to the patient portal where you can view your
        appointments and medical history.
      </p>
      <Link href="/dashboard">
        <Button>Proceed to Portal</Button>
      </Link>
    </div>
  );
}
