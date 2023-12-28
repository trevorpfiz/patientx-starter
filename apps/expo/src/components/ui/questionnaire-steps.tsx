import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { FlashList } from "@shopify/flash-list";
import { useAtom } from "jotai";
import { Check } from "lucide-react-native";

import { cn } from "~/components/ui/rn-ui/lib/utils";
import { atomWithMMKV } from "~/utils/atom-with-mmkv";

export type QuestionnaireStepId = "brief" | "diabetes";
export type QuestionnaireStepStatus = "complete" | "current";

export const initialQuestionnaireSteps = [
  {
    id: "brief",
    name: "Brief",
    description: "Our brief intake questionnaire",
    href: "/onboarding/questionnaires/f62257a5-bf65-4678-b8d1-568bd298617d",
    status: "current",
  },
  {
    id: "diabetes",
    name: "Diabetes",
    description: "A few questions about your diabetes",
    href: "/onboarding/questionnaires/ff570765-271a-4908-b4cd-6d0ea4fa279c",
    status: "current",
  },
];

export const questionnaireStepsAtom = atomWithMMKV(
  "questionnaire_steps",
  initialQuestionnaireSteps,
);

export default function QuestionnaireSteps() {
  const [questionnaireSteps] = useAtom(questionnaireStepsAtom);
  const router = useRouter();

  return (
    <View className="flex-1">
      <FlashList
        data={questionnaireSteps}
        estimatedItemSize={200}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => {
          return (
            <TouchableOpacity
              disabled={item.status !== "current"}
              onPress={() =>
                router.push({
                  pathname: item.href as `http${string}`,
                  params: {
                    stepId: item.id,
                    name: item.name,
                  },
                })
              }
            >
              <View
                className={cn(
                  "m-4 mb-2 ml-8 flex-row items-center rounded-2xl border-2 bg-white",
                  {
                    "border-green-500 bg-green-50": item.status === "complete",
                    "border-blue-500 bg-white": item.status === "current",
                  },
                )}
              >
                {item.status === "complete" && (
                  <View
                    className={cn(
                      "absolute -left-[18px] z-10 flex h-10 w-10 items-center justify-center rounded-full",
                      {
                        "bg-green-500": item.status === "complete",
                        // "border-2 border-blue-500 bg-white":
                        //   item.status === "current",
                      },
                    )}
                  >
                    {item.status === "complete" && (
                      <Check size={20} color="white" />
                    )}
                    {/* {item.status === "current" && (
                    <Text className="font-bold text-blue-600">{index + 1}</Text>
                  )} */}
                  </View>
                )}
                <View
                  className={cn(
                    "flex-1 flex-col justify-between gap-2 py-8 pl-12 pr-8",
                    {
                      "pl-12": item.status === "complete",
                      "pl-8": item.status === "current",
                    },
                  )}
                >
                  <View className="flex-row items-center justify-between">
                    <Text
                      className={cn("text-xl font-semibold", {
                        "text-green-600": item.status === "complete",
                        "text-black": item.status === "current",
                      })}
                    >
                      {item.name}
                    </Text>
                    <View>
                      {item.status === "complete" && (
                        <Text className="font-bold text-green-600">
                          Complete
                        </Text>
                      )}
                      {item.status === "current" && (
                        <Text className="font-bold text-blue-500">Start</Text>
                      )}
                    </View>
                  </View>
                  <Text
                    className={cn("w-3/4 text-lg ", {
                      "text-green-600": item.status === "complete",
                      "text-gray-500": item.status === "current",
                    })}
                  >
                    {item.description}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}
