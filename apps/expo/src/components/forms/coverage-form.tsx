import { Alert, Button, SafeAreaView, Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Link } from "expo-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAtom } from "jotai";
import { Controller, FormProvider, useForm } from "react-hook-form";

import { coverageFormSchema } from "@acme/shared/src/validators/forms";
import type { CoverageFormType } from "@acme/shared/src/validators/forms";

import { api } from "~/utils/api";
import { CustomCheckbox } from "../ui/forms/checkbox";
import { TextInput } from "../ui/forms/text-input";
import { useStepStatusUpdater } from "../ui/steps";
import { uploadTestPdf } from "./upload-test";
import { patientIdAtom } from "./welcome-form";

export const CoverageForm = (props: { onSuccess?: () => void }) => {
  const [patientId] = useAtom(patientIdAtom);
  const updater = useStepStatusUpdater();

  const form = useForm<CoverageFormType>({
    resolver: zodResolver(coverageFormSchema),
    defaultValues: {
      subscriberId: "",
      payorId: "",
      insuranceConsent: false,
    },
  });

  const coverageMutation = api.coverage.submitCoverage.useMutation({
    onSuccess: (data) => {
      console.log(data, "data");
    },
    onError: (error) => {
      Alert.alert("Warning", JSON.stringify(error));
    },
  });

  const consentMutation = api.consent.submitConsent.useMutation({
    onSuccess: (data) => {
      console.log(data, "data");

      // Update the coverage step as complete
      updater.updateStepStatus("coverage", "complete");

      // Call the passed onSuccess prop if it exists
      if (props.onSuccess) {
        props.onSuccess();
      }
    },
    onError: (error) => {
      console.log(error, "error");
      console.log(JSON.stringify(error));
      Alert.alert("Warning", JSON.stringify(error));
    },
  });

  async function onSubmit(data: CoverageFormType) {
    const { subscriberId, payorId, insuranceConsent } = data;
    console.log(JSON.stringify(data));

    // Calculate start and end dates
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setFullYear(startDate.getFullYear() + 1);

    // coverage request body
    const coverageRequestBody = {
      status: "active",
      subscriber: {
        reference: `Patient/${patientId}`,
      },
      subscriberId: `${subscriberId}`,
      beneficiary: {
        reference: `Patient/${patientId}`,
      },
      relationship: {
        coding: [
          {
            system: "http://hl7.org/fhir/ValueSet/subscriber-relationship",
            code: "self",
          },
        ],
      },
      payor: [
        {
          identifier: {
            system: "https://www.claim.md/services/era/",
            value: `${payorId}`,
          },
          display: "Insurer company name",
        },
      ],
      order: 1,
    };

    // TODO - can change logic to run both mutations in parallel
    // Submit intake form
    await coverageMutation.mutateAsync({
      query: {},
      body: coverageRequestBody,
    });

    // Prepare insurance consent request body
    const insuranceConsentRequestBody = {
      status: "active",
      scope: {},
      category: [
        {
          coding: [
            {
              system: "LOINC",
              code: "64290-0",
              display: "Health insurance card",
            },
          ],
        },
      ],
      patient: {
        reference: `Patient/${patientId}`,
      },
      dateTime: startDate.toISOString(),
      sourceAttachment: {
        contentType: "application/pdf",
        title: "UploadTest.pdf",
        data: uploadTestPdf,
      },
      provision: {
        period: {
          start: startDate.toISOString().split("T")[0],
          end: endDate.toISOString().split("T")[0],
        },
      },
    };

    // Trigger consent mutation
    if (insuranceConsent) {
      consentMutation.mutate({
        body: insuranceConsentRequestBody,
      });
    }
  }

  return (
    <SafeAreaView className="flex-1 px-4">
      <Text className="py-4 text-xl">Share your insurance details</Text>

      <KeyboardAwareScrollView>
        <View className="flex-1">
          <FormProvider {...form}>
            <View className="flex flex-col">
              <Controller
                control={form.control}
                name="subscriberId"
                render={({
                  field: { onChange, onBlur, value },
                  fieldState: { error },
                }) => {
                  return (
                    <TextInput
                      label="Subscriber ID"
                      onBlur={onBlur}
                      value={value}
                      placeholder=""
                      onChangeText={onChange}
                      errorMessage={error?.message}
                    />
                  );
                }}
              />

              <Controller
                control={form.control}
                name="payorId"
                render={({
                  field: { onChange, onBlur, value },
                  fieldState: { error },
                }) => {
                  return (
                    <TextInput
                      label="Payor ID"
                      onBlur={onBlur}
                      value={value}
                      placeholder=""
                      onChangeText={onChange}
                      errorMessage={error?.message}
                    />
                  );
                }}
              />

              <View className="flex flex-col">
                <Controller
                  control={form.control}
                  name="insuranceConsent"
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <CustomCheckbox
                      label="Insurance Consent"
                      value={value}
                      onValueChange={onChange}
                      errorMessage={error?.message}
                    />
                  )}
                />

                <Link href={"/onboarding/(modals)/pdf"}>Consent PDF</Link>
              </View>
            </View>
          </FormProvider>
        </View>
      </KeyboardAwareScrollView>
      <Button title="Submit" onPress={form.handleSubmit(onSubmit)} />
    </SafeAreaView>
  );
};
