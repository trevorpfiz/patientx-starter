"use client";

import { useSearchParams } from "next/navigation";
import { AnimatePresence } from "framer-motion";

import { Done } from "./_components/done";
import Questionnaire from "./_components/questionnaire";
import Welcome from "./_components/welcome";

export function Onboarding(props: { templateId: string }) {
  const { templateId } = props;

  const search = useSearchParams();
  const step = search.get("step");

  return (
    <div className="mx-auto flex h-[calc(100vh-8rem)] w-full max-w-4xl flex-col items-center">
      <AnimatePresence mode="wait">
        {!step && <Welcome key="welcome" />}
        {step === "consent" && <div>test</div>}
        {step === "questionnaire" && ( // can increment query param for each section
          <div key="questionnaire">
            <Questionnaire />
          </div>
        )}
        {step === "review" && <div>test</div>}
        {step === "schedule-appointment" && <div>test</div>}
        {step === "next-steps" && <div>test</div>}
        {step === "done" && <Done key="done" />}
      </AnimatePresence>
    </div>
  );
}
