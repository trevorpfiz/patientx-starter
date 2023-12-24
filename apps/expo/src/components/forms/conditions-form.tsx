import { Alert, Button, SafeAreaView, Text, View } from "react-native";
import Checkbox from "expo-checkbox";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAtom } from "jotai";
import { Controller, FormProvider, useForm } from "react-hook-form";

import type { ConditionCoding } from "@acme/shared/src/validators/condition";
import type { ConditionsFormData } from "@acme/shared/src/validators/forms";
import { conditionsFormSchema } from "@acme/shared/src/validators/forms";

import { api } from "~/utils/api";
import { patientIdAtom } from "./welcome-form";

const conditions = [
  {
    system: "http://hl7.org/fhir/sid/icd-10",
    code: "I10",
    display: "Hypertension",
  },
  {
    system: "http://hl7.org/fhir/sid/icd-10",
    code: "E11",
    display: "Type 2 diabetes",
  },
  {
    system: "http://hl7.org/fhir/sid/icd-10",
    code: "J45",
    display: "Asthma",
  },
] as const;

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

  const handleCheckboxChange = (
    condition: ConditionCoding,
    isChecked: boolean,
  ) => {
    const newValue = isChecked
      ? [...form.getValues("conditions"), condition]
      : form.getValues("conditions").filter((c) => c.code !== condition.code);

    form.setValue("conditions", newValue, { shouldValidate: true });
  };

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 px-4 pb-8 pt-4">
        <FormProvider {...form}>
          <Controller
            control={form.control}
            name="conditions"
            render={({ field: { value = [] }, fieldState: { error } }) => (
              <>
                <Text
                  style={{
                    marginBottom: 8,
                    fontSize: 18,
                    fontWeight: "bold",
                    color: "#4a4a4a",
                  }}
                >
                  Conditions
                </Text>
                {conditions.map((condition, index) => (
                  <View
                    key={index}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginBottom: 8,
                    }}
                  >
                    <Checkbox
                      value={value.some((vc) => vc.code === condition.code)}
                      onValueChange={(isChecked) =>
                        handleCheckboxChange(condition, isChecked)
                      }
                    />
                    <Text style={{ marginLeft: 8, color: "#4a4a4a" }}>
                      {condition.display}
                    </Text>
                  </View>
                ))}
                {error?.message && (
                  <Text style={{ marginTop: 8, fontSize: 14, color: "red" }}>
                    {error.message}
                  </Text>
                )}
              </>
            )}
          />
        </FormProvider>
      </View>
      <Button title="Submit" onPress={form.handleSubmit(onSubmit)} />
    </SafeAreaView>
  );
};
