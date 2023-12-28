import { Alert, SafeAreaView, Text, View } from "react-native";
import Animated, { FadeInDown, FadeOutUp } from "react-native-reanimated";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAtom } from "jotai";
import { Loader2 } from "lucide-react-native";
import { Controller, FormProvider, useForm } from "react-hook-form";

import type { ConditionCoding } from "@acme/shared/src/validators/condition";
import type { ConditionsFormData } from "@acme/shared/src/validators/forms";
import { conditionsFormSchema } from "@acme/shared/src/validators/forms";

import { Button } from "~/components/ui/rn-ui/components/ui/button";
import { Checkbox } from "~/components/ui/rn-ui/components/ui/checkbox";
import { Label } from "~/components/ui/rn-ui/components/ui/label";
import { CONDITIONS } from "~/lib/constants";
import { api } from "~/utils/api";
import { patientIdAtom } from "./welcome-form";

export const ConditionsForm = (props: { onSuccess?: () => void }) => {
  const [patientId] = useAtom(patientIdAtom);

  const mutation = api.condition.submitCondition.useMutation({
    onSuccess: (data) => {
      console.log(data, "data");

      // Call the passed onSuccess prop if it exists
      if (props.onSuccess) {
        props.onSuccess();
      }
    },
    onError: (error) => {
      Alert.alert("Warning", JSON.stringify(error));
    },
  });

  const form = useForm<ConditionsFormData>({
    resolver: zodResolver(conditionsFormSchema),
    defaultValues: {
      conditions: [],
    },
    mode: "onSubmit",
  });

  function onSubmit(data: ConditionsFormData) {
    // Allow patient to submit if they don't have any conditions
    if (!data.conditions || data.conditions.length === 0) {
      // Call the passed onSuccess prop if it exists
      if (props.onSuccess) {
        props.onSuccess();
      }
      return;
    }

    let submitCount = 0;

    data.conditions.map((condition) => {
      // Build the request body
      const requestBody = {
        clinicalStatus: {
          // TODO - is this correct?
          coding: [
            {
              system:
                "http://terminology.hl7.org/CodeSystem/condition-clinical",
              code: "active",
              display: "Active",
            },
          ],
        },
        verificationStatus: {
          // TODO - is this correct?
          coding: [
            {
              system:
                "http://terminology.hl7.org/CodeSystem/condition-ver-status",
              code: "confirmed",
              display: "Confirmed",
            },
          ],
          text: "Confirmed",
        },
        category: [
          // TODO - is this correct?
          {
            coding: [
              {
                system:
                  "http://terminology.hl7.org/CodeSystem/condition-category",
                code: "encounter-diagnosis",
                display: "Encounter Diagnosis",
              },
            ],
            text: "Encounter Diagnosis",
          },
        ],
        code: {
          coding: [
            {
              system: condition.system,
              code: condition.code,
              display: condition.display,
            },
          ],
          text: condition.display,
        },
        subject: {
          reference: `Patient/${patientId}`,
        },
      };

      // Submit each medication statement entry
      // console.log(requestBody);
      mutation.mutate(
        { body: requestBody },
        {
          onSuccess: () => {
            submitCount += 1;
            // Check if all conditions have been submitted
            if (submitCount === data.conditions.length) {
              // Call the passed onSuccess prop if it exists
              if (props.onSuccess) {
                props.onSuccess();
              }
            }
          },
        },
      );
    });
  }

  const handleCheckboxChange = (condition: ConditionCoding) => {
    const currentValues = form.getValues("conditions");
    const isChecked = currentValues.some((c) => c.code === condition.code);
    const newValue = isChecked
      ? currentValues.filter((c) => c.code !== condition.code)
      : [...currentValues, condition];

    form.setValue("conditions", newValue, { shouldValidate: true });
  };

  // Use the watch function to monitor changes in the 'conditions' field
  const watchedConditions = form.watch("conditions");

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <View className="flex-1 px-6 pb-8 pt-4">
        <FormProvider {...form}>
          <Controller
            control={form.control}
            name="conditions"
            render={({ field: { value = [] }, fieldState: { error } }) => (
              <View>
                <Text className="mb-4 text-2xl font-semibold text-black">
                  {"Do you have any of the following conditions?"}
                </Text>
                <View className="flex-col gap-2">
                  {CONDITIONS.map((condition, index) => (
                    <View key={index} className="flex-row items-center gap-2">
                      <Checkbox
                        accessibilityLabelledBy="checkLabel"
                        value={value.some((vc) => vc.code === condition.code)}
                        onChange={() => handleCheckboxChange(condition)}
                      />
                      <Label
                        onPress={() => handleCheckboxChange(condition)}
                        nativeID="checkLabel"
                        className="text-lg"
                      >
                        {condition.display}
                      </Label>
                    </View>
                  ))}
                </View>
                {error && (
                  <Animated.Text
                    entering={FadeInDown}
                    exiting={FadeOutUp.duration(275)}
                    className={"px-0.5 py-2 text-sm text-destructive"}
                    role="alert"
                  >
                    {error?.message}
                  </Animated.Text>
                )}
              </View>
            )}
          />
        </FormProvider>
      </View>
      <View className="px-12 pb-4">
        <Button onPress={form.handleSubmit(onSubmit)} textClass="text-center">
          {mutation.isLoading ? (
            <View className="flex-row items-center justify-center gap-3">
              <Loader2
                size={24}
                color="white"
                strokeWidth={3}
                className="animate-spin"
              />
              <Text className="text-xl font-medium text-primary-foreground">
                Submitting...
              </Text>
            </View>
          ) : watchedConditions && watchedConditions.length > 0 ? (
            "Submit"
          ) : (
            "I don't have any of the listed conditions"
          )}
        </Button>
      </View>
    </SafeAreaView>
  );
};
