import {
  Alert,
  Button,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Checkbox from "expo-checkbox";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAtom } from "jotai";
import {
  Controller,
  FormProvider,
  useFieldArray,
  useForm,
} from "react-hook-form";

import type { ConditionCoding } from "@acme/shared/src/validators/condition";
import type { MedicationsFormData } from "@acme/shared/src/validators/forms";
import { medicationsFormSchema } from "@acme/shared/src/validators/forms";

import { api } from "~/utils/api";
import MedicationSelector from "./medication-selector";
import { patientIdAtom } from "./welcome-form";

export const MedicationsForm = (props: { onSuccess?: () => void }) => {
  const [patientId] = useAtom(patientIdAtom);

  const mutation = api.medication.submitMedicationStatement.useMutation({
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

  const form = useForm<MedicationsFormData>({
    resolver: zodResolver(medicationsFormSchema),
    defaultValues: {
      medicationStatementEntries: [
        {
          medication: { reference: "", display: "" },
          duration: "",
        },
      ],
    },
    mode: "onSubmit",
  });

  const { fields, append, remove } = useFieldArray({
    name: "medicationStatementEntries",
    control: form.control,
  });

  function onSubmit(data: MedicationsFormData) {
    let submitCount = 0;

    data.medicationStatementEntries.forEach((entry) => {
      const requestBody = {
        status: "active",
        medicationReference: entry.medication,
        subject: {
          reference: `Patient/${patientId}`,
        },
        // effectivePeriod: {}
        // dosage: []
      };

      // Submit each medication statement entry
      mutation.mutate(
        { body: requestBody },
        {
          onSuccess: () => {
            submitCount += 1;
            // Check if all conditions have been submitted
            if (submitCount === data.medicationStatementEntries.length) {
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
    <SafeAreaView className="flex-1">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        enabled
      >
        <ScrollView
          nestedScrollEnabled
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
          contentInsetAdjustmentBehavior="automatic"
          contentContainerStyle={{ paddingBottom: 0 }}
          style={styles.scrollContainer}
        >
          <View className="flex-1 px-4 py-8 pb-20">
            <FormProvider {...form}>
              {fields.map((field, index) => (
                <View key={field.id} className="mb-4 flex-row justify-between">
                  <MedicationSelector
                    form={form}
                    name={`medicationStatementEntries.${index}.medication`}
                  />
                  {index !== 0 && (
                    <Button title="Remove" onPress={() => remove(index)} />
                  )}
                </View>
              ))}
              <Button
                title="Add Medication"
                onPress={() =>
                  append({
                    medication: { reference: "", display: "" },
                    duration: "",
                  })
                }
              />
            </FormProvider>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <Button title="Submit" onPress={form.handleSubmit(onSubmit)} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
  },
  container: {
    padding: 20,
  },
  title: {
    textAlign: "center",
    fontSize: 25,
    marginBottom: 50,
  },
  section: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontWeight: "bold",
    marginBottom: 3,
  },
});
