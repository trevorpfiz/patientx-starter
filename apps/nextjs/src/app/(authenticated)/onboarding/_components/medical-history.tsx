"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { Balancer } from "react-wrap-balancer";

import { AllergiesForm } from "./allergies-form";
import { ConditionsForm } from "./conditions-form";
import { GoalsForm } from "./goals-form";
import { MedicationsForm } from "./medications-form";

export const historyStepAtom = atomWithStorage(
  "historyStep",
  "allergies",
  undefined,
  {
    getOnInit: true,
  },
);

export default function MedicalHistory() {
  const [historyStep, setHistoryStep] = useAtom(historyStepAtom);
  const router = useRouter();

  if (historyStep === "complete")
    return router.push("/onboarding?step=overview");

  return (
    <motion.div
      className="my-auto flex h-full w-full flex-col items-center justify-center"
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
          {historyStep === "goals" && <Balancer>{`Goals`}</Balancer>}
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
            <AllergiesForm onSuccess={() => setHistoryStep("goals")} />
          )}
          {historyStep === "goals" && (
            <GoalsForm
              onSuccess={() => {
                setHistoryStep("complete");
                router.push("/onboarding?step=overview");
              }}
            />
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
