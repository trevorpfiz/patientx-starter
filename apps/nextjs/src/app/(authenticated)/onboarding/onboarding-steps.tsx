"use client";

import { useSearchParams } from "next/navigation";
import { AnimatePresence } from "framer-motion";

import Consent from "./_components/consent";
import Coverage from "./_components/coverage";
import { Done } from "./_components/done";
import { NextSteps } from "./_components/next-steps";
import Questionnaire from "./_components/questionnaire";
import { ScheduleAppointment } from "./_components/schedule-appointment";
import Welcome from "./_components/welcome";

export function OnboardingSteps(props: { templateId: string }) {
  const { templateId } = props;

  const search = useSearchParams();
  const step = search.get("step");

  return (
    <div className="mx-auto flex h-[calc(100vh-8rem)] w-full max-w-4xl flex-col items-center">
      <AnimatePresence mode="wait">
        {!step && <Welcome key="welcome" />}
        {step === "coverage" && <Coverage key="coverage" />}
        {step === "consent" && <Consent key="consent" />}
        {step === "questionnaire" && ( // can increment query param for each section
          <div key="questionnaire">
            <Questionnaire />
          </div>
        )}
        {step === "review" && <div>test</div>}
        {step === "schedule" && <ScheduleAppointment key="schedule" />}
        {step === "next-steps" && <NextSteps key="next-steps" />}
        {step === "done" && <Done key="done" />}
      </AnimatePresence>
    </div>
  );
}
