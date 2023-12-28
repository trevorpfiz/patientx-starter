import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAtom } from "jotai";
import { Loader2, X } from "lucide-react-native";
import {
  Controller,
  FormProvider,
  useFieldArray,
  useForm,
} from "react-hook-form";

import type { AllergiesFormData } from "@acme/shared/src/validators/forms";
import { allergiesFormSchema } from "@acme/shared/src/validators/forms";

import { Button } from "~/components/ui/rn-ui/components/ui/button";
import { api } from "~/utils/api";
import { Dropdown } from "../ui/forms/dropdown";
import AllergenSelector from "./allergen-selector";
import { patientIdAtom } from "./welcome-form";

export const AllergiesForm = (props: { onSuccess?: () => void }) => {
  const [patientId] = useAtom(patientIdAtom);

  const mutation = api.allergyIntolerance.submitAllergyIntolerance.useMutation({
    onSuccess: (data) => {
      // Call the passed onSuccess prop if it exists
      if (props.onSuccess) {
        props.onSuccess();
      }
    },
    onError: (error) => {
      Alert.alert("Warning", JSON.stringify(error));
    },
  });

  const form = useForm<AllergiesFormData>({
    resolver: zodResolver(allergiesFormSchema),
    defaultValues: {
      allergyEntries: [],
    },
    mode: "onSubmit",
  });

  const { fields, append, remove } = useFieldArray({
    name: "allergyEntries",
    control: form.control,
  });

  function onSubmit(data: AllergiesFormData) {
    // Allow patient to submit if they don't have any allergies
    if (!data.allergyEntries || data.allergyEntries.length === 0) {
      // Call the passed onSuccess prop if it exists
      if (props.onSuccess) {
        props.onSuccess();
      }
      return;
    }

    let submitCount = 0;

    data.allergyEntries.forEach((entry) => {
      const requestBody = {
        clinicalStatus: {
          coding: [
            {
              system:
                "http://terminology.hl7.org/CodeSystem/allergyintolerance-clinical",
              code: "active",
              display: "Active",
            },
          ],
          text: "Active",
        },
        verificationStatus: {
          coding: [
            {
              system:
                "http://terminology.hl7.org/CodeSystem/allergyintolerance-verification",
              code: "confirmed",
              display: "Confirmed",
            },
          ],
          text: "Confirmed",
        },
        type: entry.type, // 'allergy' or 'intolerance'
        code: {
          coding: [
            {
              system: entry.allergen.system,
              code: entry.allergen.code,
              display: entry.allergen.display,
            },
          ],
          text: entry.allergen.display,
        },
        patient: {
          reference: `Patient/${patientId}`,
        },
        reaction: [
          {
            manifestation: [
              {
                coding: [
                  {
                    system:
                      "http://terminology.hl7.org/CodeSystem/data-absent-reason",
                    code: "unknown",
                    display: "Unknown",
                  },
                ],
                text: "Unknown",
              },
            ],
            severity: entry.severity, // 'mild', 'moderate', or 'severe'
          },
        ],
      };
      console.log(JSON.stringify(requestBody), "requestBody");
      // Submit each allergy intolerance entry
      mutation.mutate(
        { body: requestBody },
        {
          onSuccess: () => {
            submitCount += 1;
            // Check if all conditions have been submitted
            if (submitCount === data.allergyEntries.length) {
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

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        enabled
      >
        <ScrollView
          nestedScrollEnabled
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
          contentInsetAdjustmentBehavior="automatic"
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          <View className="flex-1">
            <AllergenSelector
              onAllergenSelected={(allergen) => append(allergen)}
            />

            <View className="flex-1">
              <FormProvider {...form}>
                {fields.map((field, index) => (
                  <View
                    key={field.id}
                    className="border-b border-gray-200 bg-white px-8"
                  >
                    <View className="flex-row items-center justify-between py-4">
                      <View className="mr-4 flex-1 flex-col justify-between gap-4">
                        <Text className="text-lg font-semibold">
                          {field.allergen.display}
                        </Text>
                        <View className="flex-1 flex-row items-center gap-2">
                          <Controller
                            control={form.control}
                            name={`allergyEntries.${index}.type`}
                            render={({
                              field: { onChange, onBlur, value },
                              fieldState: { error },
                            }) => {
                              return (
                                <View className="flex-1">
                                  <Dropdown
                                    label="Type"
                                    value={value}
                                    onValueChange={onChange}
                                    items={[
                                      { label: "allergy", value: "allergy" },
                                      {
                                        label: "intolerance",
                                        value: "intolerance",
                                      },
                                    ]}
                                    placeholder={{
                                      label: "Select an item...",
                                      value: null,
                                      color: "#9EA0A4",
                                    }}
                                    errorMessage={error?.message}
                                  />
                                </View>
                              );
                            }}
                          />
                          <Controller
                            control={form.control}
                            name={`allergyEntries.${index}.severity`}
                            render={({
                              field: { onChange, onBlur, value },
                              fieldState: { error },
                            }) => {
                              return (
                                <View className="flex-1">
                                  <Dropdown
                                    label="Severity"
                                    value={value}
                                    onValueChange={onChange}
                                    items={[
                                      { label: "mild", value: "mild" },
                                      { label: "moderate", value: "moderate" },
                                      { label: "severe", value: "severe" },
                                    ]}
                                    placeholder={{
                                      label: "Select an item...",
                                      value: null,
                                      color: "#9EA0A4",
                                    }}
                                    errorMessage={error?.message}
                                  />
                                </View>
                              );
                            }}
                          />
                        </View>
                      </View>
                      <TouchableOpacity
                        onPress={() => remove(index)}
                        className="flex-shrink-0 p-2"
                      >
                        <X size={20} color="black" />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </FormProvider>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
          ) : fields && fields.length > 0 ? (
            "Submit allergies"
          ) : (
            "I don't have any allergies"
          )}
        </Button>
      </View>
    </SafeAreaView>
  );
};
