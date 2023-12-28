import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { FlashList } from "@shopify/flash-list";
import { useAtom } from "jotai";
import { Check } from "lucide-react-native";

import { atomWithMMKV } from "~/utils/atom-with-mmkv";
import { cn } from "./rn-ui/lib/utils";

export type HistoryStepId = "conditions" | "medications" | "allergies";
export type HistoryStepStatus = "complete" | "current";

export const initialHistorySteps = [
  {
    id: "conditions",
    name: "Conditions",
    description: "A list of your medical conditions",
    href: "/onboarding/medical-history/conditions",
    status: "current",
  },
  {
    id: "medications",
    name: "Medications",
    description: "A list of your medications",
    href: "/onboarding/medical-history/medications",
    status: "current",
  },
  {
    id: "allergies",
    name: "Allergies",
    description: "A list of your allergies",
    href: "/onboarding/medical-history/allergies",
    status: "current",
  },
];

export const historyStepsAtom = atomWithMMKV(
  "history_steps",
  initialHistorySteps,
);

export default function HistorySteps() {
  const [historySteps] = useAtom(historyStepsAtom);
  const router = useRouter();

  return (
    <View className="flex-1">
      <FlashList
        data={historySteps}
        estimatedItemSize={200}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => {
          return (
            <TouchableOpacity
              disabled={item.status !== "current"}
              onPress={() => router.push(item.href as `http${string}`)}
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
