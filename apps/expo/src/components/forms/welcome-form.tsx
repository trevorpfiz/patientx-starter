import { useEffect, useState } from "react";
import { Alert, Button, SafeAreaView, Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as Crypto from "expo-crypto";
import { Link } from "expo-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAtom } from "jotai";
import { ChevronDown } from "lucide-react-native";
import { Controller, FormProvider, useForm } from "react-hook-form";

import type { PatientIntake } from "@acme/shared/src/validators/forms";
import { patientIntakeSchema } from "@acme/shared/src/validators/forms";

import { api } from "~/utils/api";
import { atomWithMMKV } from "~/utils/atom-with-mmkv";
import { CustomCheckbox } from "../ui/forms/checkbox";
import { DatePicker } from "../ui/forms/date-picker";
import { Dropdown } from "../ui/forms/dropdown";
import { TextInput } from "../ui/forms/text-input";
import { uploadTestPdf } from "./upload-test";

export const patientIdAtom = atomWithMMKV("patient_id", "");

const UUID = Crypto.randomUUID();

export const WelcomeForm = (props: { onSuccess?: () => void }) => {
  const [patientId, setPatientId] = useAtom(patientIdAtom);
  const [consentsCompleted, setConsentsCompleted] = useState(0);

  const form = useForm<PatientIntake>({
    resolver: zodResolver(patientIntakeSchema),
    defaultValues: {
      name: "",
      birthDate: "",
      gender: "",
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

      // Increment consentsCompleted
      setConsentsCompleted((count) => count + 1);
    },
    onError: (error) => {
      console.log(error, "error");
      console.log(JSON.stringify(error));
      Alert.alert("Warning", JSON.stringify(error));
    },
  });

  // function to map gender to birthsex valueCode for extension on request body
  function mapGenderToBirthSex(gender: string) {
    switch (gender.toLowerCase()) {
      case "male":
        return "M";
      case "female":
        return "F";
      case "other":
        return "OTH";
      case "unknown":
        return "UNK";
      default:
        return "UNK"; // Default case if gender is not recognized
    }
  }

  async function onSubmit(data: PatientIntake) {
    const {
      name,
      birthDate,
      gender,
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

    // map gender to birthsex
    const birthSexValue = mapGenderToBirthSex(gender);

    // patient request body
    const patientRequestBody = {
      name: [
        {
          use: "official",
          family: familyName,
          given: givenName,
        },
      ],
      birthDate: birthDate,
      gender: gender,
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
      extension: [
        {
          url: "http://hl7.org/fhir/us/core/StructureDefinition/us-core-birthsex",
          valueCode: birthSexValue,
        },
      ],
      identifier: [
        {
          use: "temp",
          system:
            "UUID used to query patient to set patient id in localStorage",
          value: UUID,
        },
      ],
    };

    // Submit intake form
    const response = await patientMutation.mutateAsync({
      body: patientRequestBody,
    });

    const patientDataId = response;

    if (patientDataId) {
      // Set patientId in MMKV
      setPatientId(patientDataId);

      // Prepare consent request bodies
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
          reference: `Patient/${patientDataId}`,
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
          reference: `Patient/${patientDataId}`,
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

      // Trigger consent mutations
      if (genericConsent) {
        consentMutation.mutate({
          body: genericConsentRequestBody,
        });
      }

      if (insuranceConsent) {
        consentMutation.mutate({
          body: insuranceConsentRequestBody,
        });
      }
    } else {
      // Show an error alert
      Alert.alert("Something went wrong. Please try again.");
    }
  }

  useEffect(() => {
    if (consentsCompleted === 2) {
      // Navigate to the next step
      if (props.onSuccess) {
        props.onSuccess();
      }
    }
  }, [consentsCompleted, props]);

  return (
    <SafeAreaView className="flex-1 px-4">
      <Text className="py-4 text-xl">New patient onboarding</Text>

      <KeyboardAwareScrollView>
        <View className="flex-1">
          <FormProvider {...form}>
            <View className="flex flex-col">
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
                      placeholder="John Doe"
                      onChangeText={onChange}
                      errorMessage={error?.message}
                    />
                  );
                }}
              />

              <Controller
                control={form.control}
                name="birthDate"
                render={({
                  field: { onChange, onBlur, value },
                  fieldState: { error },
                }) => {
                  return (
                    <DatePicker
                      label="Date of Birth"
                      value={value}
                      placeholder="Select a date..."
                      onDateChange={(date) => {
                        onChange(date);
                      }}
                      errorMessage={error?.message}
                    />
                  );
                }}
              />

              <Controller
                control={form.control}
                name="gender"
                render={({
                  field: { onChange, onBlur, value },
                  fieldState: { error },
                }) => {
                  return (
                    <Dropdown
                      label="Gender"
                      value={value}
                      onValueChange={onChange}
                      items={[
                        { label: "male", value: "male" },
                        { label: "female", value: "female" },
                        { label: "other", value: "other" },
                        { label: "unknown", value: "unknown" },
                      ]}
                      placeholder={{
                        label: "Select an item...",
                        value: null,
                        color: "#9EA0A4",
                      }}
                      // Icon={() => {
                      //   return <ChevronDown color="gray" />;
                      // }}
                      errorMessage={error?.message}
                    />
                  );
                }}
              />

              <View>
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
                      placeholder="e.g. 123 Main St"
                      onChangeText={onChange}
                      errorMessage={error?.message}
                    />
                  )}
                />

                <View className="flex flex-row items-center justify-between">
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
                        placeholder="e.g. New York"
                        onChangeText={onChange}
                        errorMessage={error?.message}
                        className="mr-2 flex-[4]"
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
                        placeholder="e.g. NY"
                        onChangeText={onChange}
                        errorMessage={error?.message}
                        maxLength={2}
                        className="flex-[2]"
                      />
                    )}
                  />
                </View>

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
                      placeholder="e.g. 10001"
                      onChangeText={onChange}
                      errorMessage={error?.message}
                      maxLength={10}
                    />
                  )}
                />
              </View>

              <Controller
                control={form.control}
                name="phoneNumber"
                render={({
                  field: { onChange, onBlur, value },
                  fieldState: { error },
                }) => {
                  return (
                    <TextInput
                      label="Phone Number"
                      onBlur={onBlur}
                      keyboardType="decimal-pad"
                      maxLength={10}
                      placeholder="2125550123"
                      value={value}
                      onChangeText={(val) => onChange(val.toString())}
                      errorMessage={error?.message}
                    />
                  );
                }}
              />

              <View className="mt-4">
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
                      className="mb-4"
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
