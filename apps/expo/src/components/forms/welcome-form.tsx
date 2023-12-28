import { useEffect, useState } from "react";
import { Alert, SafeAreaView, Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Animated, { FadeInDown, FadeOutUp } from "react-native-reanimated";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAtom } from "jotai";
import { ChevronDown } from "lucide-react-native";
import { Controller, FormProvider, useForm } from "react-hook-form";

import type { PatientIntake } from "@acme/shared/src/validators/forms";
import { patientIntakeSchema } from "@acme/shared/src/validators/forms";

import { Button } from "~/components/ui/rn-ui/components/ui/button";
import { Checkbox } from "~/components/ui/rn-ui/components/ui/checkbox";
import { Input } from "~/components/ui/rn-ui/components/ui/input";
import { Label } from "~/components/ui/rn-ui/components/ui/label";
import { cn } from "~/components/ui/rn-ui/lib/utils";
import { US_STATES } from "~/lib/constants";
import { api } from "~/utils/api";
import { atomWithMMKV } from "~/utils/atom-with-mmkv";
import { DatePicker } from "../ui/forms/date-picker";
import { Dropdown } from "../ui/forms/dropdown";
import { uploadTestPdf } from "./upload-test";

export const patientIdAtom = atomWithMMKV("patient_id", "");

export const WelcomeForm = (props: { onSuccess?: () => void }) => {
  const [, setPatientId] = useAtom(patientIdAtom);
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

      // Trigger consent mutations
      if (genericConsent) {
        consentMutation.mutate({
          body: genericConsentRequestBody,
        });
      }
    } else {
      // Show an error alert
      Alert.alert("Something went wrong. Please try again.");
    }
  }

  useEffect(() => {
    if (consentsCompleted === 1) {
      // Navigate to the next step
      if (props.onSuccess) {
        props.onSuccess();
      }
    }
  }, [consentsCompleted, props]);

  return (
    <SafeAreaView className="flex-1">
      <Text className="px-6 py-6 text-3xl font-bold">{`Let's get you signed up`}</Text>

      <KeyboardAwareScrollView keyboardOpeningTime={10}>
        <View className="flex-1 px-6">
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
                    <View>
                      <Label
                        className={cn(error && "text-destructive", "pb-2.5")}
                        nativeID="nameLabel"
                      >
                        Name
                      </Label>
                      <Input
                        placeholder="John Doe"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        accessibilityLabel="name"
                        accessibilityLabelledBy="nameLabel"
                      />
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
                  );
                }}
              />

              <View className="flex-1 flex-row items-center justify-between gap-4 pt-4">
                <Controller
                  control={form.control}
                  name="birthDate"
                  render={({
                    field: { onChange, onBlur, value },
                    fieldState: { error },
                  }) => {
                    return (
                      <View className="flex-[2]">
                        <DatePicker
                          label="Date of Birth"
                          value={value}
                          placeholder="Select a date..."
                          onDateChange={(date) => {
                            onChange(date);
                          }}
                          errorMessage={error?.message}
                        />
                      </View>
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
                      <View className="flex-1">
                        <Dropdown
                          label="Gender"
                          value={value}
                          onValueChange={(value) => console.log(value)}
                          items={[
                            { label: "male", value: "male" },
                            { label: "female", value: "female" },
                            { label: "other", value: "other" },
                            { label: "unknown", value: "unknown" },
                          ]}
                          placeholder={{
                            label: "Select...",
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

              <View>
                <Controller
                  control={form.control}
                  name="line"
                  render={({
                    field: { onChange, onBlur, value },
                    fieldState: { error },
                  }) => (
                    <View>
                      <Label
                        className={cn(error && "text-destructive", "pb-2.5")}
                        nativeID="lineLabel"
                      >
                        Street Address
                      </Label>
                      <Input
                        placeholder="e.g. 123 Main St"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        accessibilityLabel="Street Address"
                        accessibilityLabelledBy="lineLabel"
                      />
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

                <View className="flex-1 flex-row items-center justify-between gap-4">
                  <Controller
                    control={form.control}
                    name="city"
                    render={({
                      field: { onChange, onBlur, value },
                      fieldState: { error },
                    }) => (
                      <View className="flex-[2]">
                        <Label
                          className={cn(error && "text-destructive", "pb-2.5")}
                          nativeID="nameLabel"
                        >
                          City
                        </Label>
                        <Input
                          placeholder="e.g. New York"
                          value={value}
                          onChangeText={onChange}
                          onBlur={onBlur}
                          accessibilityLabel="City"
                          accessibilityLabelledBy="cityLabel"
                        />
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

                  <Controller
                    control={form.control}
                    name="state"
                    render={({
                      field: { onChange, onBlur, value },
                      fieldState: { error },
                    }) => (
                      <View className="mt-4 flex-1">
                        <Dropdown
                          label="State"
                          value={value}
                          onValueChange={onChange}
                          items={US_STATES}
                          placeholder={{
                            label: "Select...",
                            value: null,
                            color: "#9EA0A4",
                          }}
                          // Icon={() => {
                          //   return <ChevronDown color="gray" />;
                          // }}
                          errorMessage={error?.message}
                        />
                      </View>
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
                    <View>
                      <Label
                        className={cn(error && "text-destructive", "pb-2.5")}
                        nativeID="zipCodeLabel"
                      >
                        Zip Code
                      </Label>
                      <Input
                        placeholder="e.g. 10001"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        accessibilityLabel="Zip Code"
                        accessibilityLabelledBy="zipCodeLabel"
                        maxLength={10}
                      />
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
              </View>

              <View>
                <Controller
                  control={form.control}
                  name="phoneNumber"
                  render={({
                    field: { onChange, onBlur, value },
                    fieldState: { error },
                  }) => {
                    return (
                      <View className="pt-4">
                        <Label
                          className={cn(error && "text-destructive", "pb-2.5")}
                          nativeID="phoneNumberLabel"
                        >
                          Phone Number
                        </Label>
                        <Input
                          placeholder="2125550123"
                          value={value}
                          onChangeText={(val) => onChange(val.toString())}
                          onBlur={onBlur}
                          accessibilityLabel="Phone Number"
                          accessibilityLabelledBy="phoneNumberLabel"
                          maxLength={10}
                          keyboardType="decimal-pad"
                          scrollEnabled={false}
                        />
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
                    );
                  }}
                />
              </View>

              <View className="mt-4">
                <Controller
                  control={form.control}
                  name="genericConsent"
                  render={({
                    field: { onChange, value },
                    fieldState: { error },
                  }) => (
                    <View>
                      <View className="flex-row items-center gap-2">
                        <Checkbox
                          accessibilityLabelledBy="checkLabel"
                          value={value}
                          onChange={onChange}
                        />
                        <Label
                          onPress={() => onChange(!value)}
                          nativeID="checkLabel"
                          className="text-base"
                        >
                          I grant generic consent
                        </Label>
                        <View>
                          <Link href={"/onboarding/(modals)/pdf"}>
                            <Text className="text-blue-500 underline">
                              Consent PDF
                            </Text>
                          </Link>
                        </View>
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
              </View>
            </View>
          </FormProvider>
        </View>
      </KeyboardAwareScrollView>
      <View className="px-12 pb-4">
        <Button onPress={form.handleSubmit(onSubmit)}>Continue</Button>
      </View>
    </SafeAreaView>
  );
};
