"use client";

import { redirect, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { Balancer } from "react-wrap-balancer";

import { useStepStatusUpdater } from "~/components/ui/steps";
import { AllergiesForm } from "./allergies-form";
import { ConditionsForm } from "./conditions-form";
import { MedicationsForm } from "./medications-form";

export const historyStepAtom = atomWithStorage("historyStep", "conditions");

export default function MedicalHistory() {
  const [historyStep, setHistoryStep] = useAtom(historyStepAtom);
  const updater = useStepStatusUpdater();
  const router = useRouter();

  if (historyStep === "complete") {
    redirect("/onboarding?step=overview");
  }

  return (
    <motion.div
      className="flex h-full w-full flex-col items-center"
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, type: "spring" }}
    >
      <motion.div
        variants={{
          show: {
            transition: {
              staggerChildren: 0.2,
            },
          },
        }}
        initial="hidden"
        animate="show"
        className="flex flex-col rounded-xl bg-background/60 p-8"
      >
        <motion.h1
          className="mb-4 font-cal text-2xl font-bold transition-colors sm:text-3xl"
          variants={{
            hidden: { opacity: 0, x: 250 },
            show: {
              opacity: 1,
              x: 0,
              transition: { duration: 0.4, type: "spring" },
            },
          }}
        >
          {/* change title based on historyStep */}
          {historyStep === "conditions" && <Balancer>{`Conditions`}</Balancer>}
          {historyStep === "medications" && (
            <Balancer>{`Medications`}</Balancer>
          )}
          {historyStep === "allergies" && <Balancer>{`Allergies`}</Balancer>}
          {!historyStep && <Balancer>{`Medical History`}</Balancer>}
        </motion.h1>
        <motion.div
          variants={{
            hidden: { opacity: 0, x: 100 },
            show: {
              opacity: 1,
              x: 0,
              transition: { duration: 0.4, type: "spring" },
            },
          }}
        >
          {historyStep === "conditions" && (
            <ConditionsForm onSuccess={() => setHistoryStep("medications")} />
          )}
          {historyStep === "medications" && (
            <MedicationsForm onSuccess={() => setHistoryStep("allergies")} />
          )}
          {historyStep === "allergies" && (
            <AllergiesForm
              onSuccess={() => {
                updater.updateStepStatus("medical-history", "complete");
                setHistoryStep("complete");
              }}
            />
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
