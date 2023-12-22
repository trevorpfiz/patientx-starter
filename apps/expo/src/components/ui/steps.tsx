import React from "react";
import { Text, View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { useAtom } from "jotai";
import { Check } from "lucide-react-native";

import { atomWithMMKV } from "~/utils/atom-with-mmkv";

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
    href: "/onboarding/medical-history",
    status: "current",
  },
  {
    id: "coverage",
    name: "Coverage",
    description: "Health insurance information.",
    href: "/onboarding/coverage",
    status: "upcoming",
  },
  {
    id: "questionnaire",
    name: "Questionnaires",
    description: "Fill out necessary questionnaires.",
    href: "/onboarding/questionnaire",
    status: "upcoming",
  },
  {
    id: "schedule",
    name: "Schedule",
    description: "Scheudle an appointment with our care team.",
    href: "/onboarding/schedule",
    status: "upcoming",
  },
];

export const stepsAtom = atomWithMMKV("onboardingSteps", initialSteps);

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
  const [steps, setSteps] = useAtom(stepsAtom);

  const StepIndicator = ({ status, index }) => (
    <View
      className={`h-8 w-8 items-center justify-center rounded-full ${
        status === "complete"
          ? "bg-indigo-600"
          : status === "current"
            ? "bg-blue-500"
            : "bg-gray-300"
      }`}
    >
      {status === "complete" ? (
        <Check size={20} color="white" />
      ) : (
        <Text className="font-bold text-white">{index + 1}</Text>
      )}
    </View>
  );

  return (
    <View className="flex-1">
      <FlashList
        data={steps}
        renderItem={({ item, index }) => (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <View
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor:
                  item.status === "complete"
                    ? "green"
                    : item.status === "current"
                      ? "blue"
                      : "gray",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {item.status === "complete" ? (
                <Check size={24} color="white" />
              ) : (
                <Text>{index + 1}</Text>
              )}
            </View>
            <View style={{ marginLeft: 16 }}>
              <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                {item.name}
              </Text>
              <Text style={{ fontSize: 14, color: "gray" }}>
                {item.description}
              </Text>
            </View>
          </View>
        )}
        estimatedItemSize={200}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingVertical: 16,
        }}
      />
    </View>
  );
}
