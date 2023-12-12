import { Alert, Button, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { Controller, FormProvider } from "react-hook-form";

import type { NewPatient } from "@acme/api/src/validators/forms";
import { newPatientSchema } from "@acme/api/src/validators/forms";

import { useZodForm } from "~/lib/zod-form";
import { api } from "~/utils/api";
import { getReadableValidationErrorMessage } from "~/utils/forms";
import { TextInput } from "../ui/forms/text-input";

export const patientTestAtom = atomWithStorage("patientId", "");

export const WelcomeForm = () => {
  const [patientId, setPatientId] = useAtom(patientTestAtom);
  const router = useRouter();

  const form = useZodForm({
    schema: newPatientSchema,
    defaultValues: {
      name: "",
      address: "",
      phoneNumber: "",
    },
  });

  const mutation = api.patient.submitIntakeForm.useMutation({
    onSuccess: (data) => {
      console.log(data, "data");

      // TODO - set patientId
      //   setPatientId(data.id);

      router.push(`/onboarding/steps`);
    },
    onError: (error) => {
      console.log(error, "error");
      console.log(JSON.stringify(error));
      Alert.alert("Warning", getReadableValidationErrorMessage(error));
    },
  });

  function onSubmit(data: NewPatient) {
    console.log(JSON.stringify(data));

    const requestBody = {};

    // Submit intake form
    // mutation.mutate({
    //   body: requestBody,
    // });
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
              name="address"
              render={({
                field: { onChange, onBlur, value },
                fieldState: { error },
              }) => {
                return (
                  <TextInput
                    label="Address"
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
                    value={value}
                    onChangeText={(val) => onChange(val.toString())}
                    errorMessage={error?.message}
                  />
                );
              }}
            />

            <Button title="Submit" onPress={form.handleSubmit(onSubmit)} />
          </FormProvider>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
