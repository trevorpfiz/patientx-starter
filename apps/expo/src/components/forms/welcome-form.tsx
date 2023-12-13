import { Alert, Button, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Crypto from "expo-crypto";
import { useRouter } from "expo-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { Controller, FormProvider, useForm } from "react-hook-form";

import type { PatientIntake } from "@acme/api/src/validators/forms";
import { patientIntakeSchema } from "@acme/api/src/validators/forms";

import { api } from "~/utils/api";
import { CustomCheckbox } from "../ui/forms/checkbox";
import { TextInput } from "../ui/forms/text-input";
import { uploadTestPdf } from "./upload-test";

export const patientTestAtom = atomWithStorage("patientId", "");
const UUID = Crypto.randomUUID();

export const WelcomeForm = () => {
  const [patientId, setPatientId] = useAtom(patientTestAtom);
  const router = useRouter();

  const form = useForm<PatientIntake>({
    resolver: zodResolver(patientIntakeSchema),
    defaultValues: {
      name: "",
      line: "",
      city: "",
      state: "",
      postalCode: "",
      phoneNumber: "",
      genericConsent: false,
      insuranceConsent: false,
    },
  });

  const patientMutation = api.patient.createPatient.useMutation({
    onSuccess: (data) => {
      console.log(data, "data");

      // set patient id in Async Storage with Jotai
      setPatientId(UUID);
    },
    onError: (error) => {
      console.log(error, "error");
      console.log(JSON.stringify(error));
      Alert.alert("Warning", JSON.stringify(error));
    },
  });

  const consentMutation = api.consent.submitConsent.useMutation({
    onSuccess: (data) => {
      console.log(data, "data");

      router.push(`/onboarding/steps`);
    },
    onError: (error) => {
      console.log(error, "error");
      console.log(JSON.stringify(error));
      Alert.alert("Warning", JSON.stringify(error));
    },
  });

  async function onSubmit(data: PatientIntake) {
    const {
      name,
      line,
      city,
      state,
      postalCode,
      phoneNumber,
      genericConsent,
      insuranceConsent,
    } = data;
    console.log(JSON.stringify(data));

    // Calculate start and end dates
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setFullYear(startDate.getFullYear() + 1);

    // split name into given and family
    const fullNameParts = name.trim().split(/\s+/);
    const givenName = fullNameParts.slice(0, -1); // All names except the last word
    const familyName = fullNameParts.slice(-1)[0]; // The last word

    // patient request body
    const patientRequestBody = {
      id: UUID,
      name: [
        {
          use: "official",
          family: familyName,
          given: givenName,
        },
      ],
      address: [
        {
          use: "home",
          type: "both",
          text: `${line}, ${city}, ${state} ${postalCode}`, // Combine into one string
          line: [line],
          city: city,
          state: state,
          postalCode: postalCode,
        },
      ],
      telecom: [
        {
          system: "phone",
          value: phoneNumber,
        },
      ],
    };

    // Submit intake form
    await patientMutation.mutateAsync({
      body: patientRequestBody,
    });

    // generic consent request body
    const genericConsentRequestBody = {
      status: "active",
      scope: {},
      category: [
        {
          coding: [
            {
              system: "LOINC",
              code: "64285-0",
              display: "Medical history screening form",
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

    // Submit first consent
    if (genericConsent)
      consentMutation.mutate({
        body: genericConsentRequestBody,
      });

    // insurance consent request body
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
        reference: `Patient/${patientId}`, // TODO: replace with patient id
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

    // Submit second consent
    if (insuranceConsent)
      consentMutation.mutate({
        body: insuranceConsentRequestBody,
      });
  }

  return (
    <SafeAreaView>
      <ScrollView>
        <Text>Welcome!</Text>
        <View>
          <FormProvider {...form}>
            <Controller
              control={form.control}
              name="name"
              render={({
                field: { onChange, onBlur, value },
                fieldState: { error },
              }) => {
                return (
                  <TextInput
                    label="Name"
                    onBlur={onBlur}
                    value={value}
                    onChangeText={onChange}
                    errorMessage={error?.message}
                  />
                );
              }}
            />

            <Controller
              control={form.control}
              name="line"
              render={({
                field: { onChange, onBlur, value },
                fieldState: { error },
              }) => (
                <TextInput
                  label="Street Address"
                  onBlur={onBlur}
                  value={value}
                  onChangeText={onChange}
                  errorMessage={error?.message}
                />
              )}
            />

            <Controller
              control={form.control}
              name="city"
              render={({
                field: { onChange, onBlur, value },
                fieldState: { error },
              }) => (
                <TextInput
                  label="City"
                  onBlur={onBlur}
                  value={value}
                  onChangeText={onChange}
                  errorMessage={error?.message}
                />
              )}
            />

            <Controller
              control={form.control}
              name="state"
              render={({
                field: { onChange, onBlur, value },
                fieldState: { error },
              }) => (
                <TextInput
                  label="State"
                  onBlur={onBlur}
                  value={value}
                  onChangeText={onChange}
                  errorMessage={error?.message}
                />
              )}
            />

            <Controller
              control={form.control}
              name="postalCode"
              render={({
                field: { onChange, onBlur, value },
                fieldState: { error },
              }) => (
                <TextInput
                  label="Zip Code"
                  onBlur={onBlur}
                  value={value}
                  onChangeText={onChange}
                  errorMessage={error?.message}
                />
              )}
            />

            <Controller
              control={form.control}
              name="phoneNumber"
              render={({
                field: { onChange, onBlur, value },
                fieldState: { error },
              }) => {
                return (
                  <TextInput
                    label="Phone number"
                    onBlur={onBlur}
                    keyboardType="decimal-pad"
                    maxLength={10}
                    value={value}
                    onChangeText={(val) => onChange(val.toString())}
                    errorMessage={error?.message}
                  />
                );
              }}
            />

            <Controller
              control={form.control}
              name="genericConsent"
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <CustomCheckbox
                  label="Generic Consent"
                  value={value}
                  onValueChange={onChange}
                  errorMessage={error?.message}
                />
              )}
            />

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

            <Button title="Submit" onPress={form.handleSubmit(onSubmit)} />
          </FormProvider>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
