import {
  Alert,
  Button,
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
import { X } from "lucide-react-native";
import { useForm } from "react-hook-form";

import type { MedicationsFormData } from "@acme/shared/src/validators/forms";
import { medicationsFormSchema } from "@acme/shared/src/validators/forms";

import { api } from "~/utils/api";
import MedicationSelector, {
  selectedMedicationsAtom,
} from "./medication-selector";
import { patientIdAtom } from "./welcome-form";

export const MedicationsForm = (props: { onSuccess?: () => void }) => {
  const [patientId] = useAtom(patientIdAtom);
  const [selectedMedications, setSelectedMedications] = useAtom(
    selectedMedicationsAtom,
  );

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

  const handleRemoveMedication = (index: number) => {
    setSelectedMedications((prev) => prev.filter((_, i) => i !== index));
  };

  function onSubmit() {
    let submitCount = 0;

    selectedMedications.forEach((entry) => {
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
            if (submitCount === selectedMedications.length) {
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
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        enabled
      >
        <ScrollView
          nestedScrollEnabled
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
          contentInsetAdjustmentBehavior="automatic"
          contentContainerStyle={{ paddingBottom: 0 }}
        >
          <View className="flex-1">
            <MedicationSelector />

            {selectedMedications.map((entry, index) => (
              <View
                key={index}
                className="border-b border-gray-200 bg-white px-8"
              >
                <View className="flex flex-row items-center justify-between py-8">
                  <Text className="text-lg font-semibold">
                    {entry.medication.display}
                  </Text>
                  <TouchableOpacity
                    onPress={() => handleRemoveMedication(index)}
                    className="p-2"
                  >
                    <X size={16} color="black" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <Button
        title={
          selectedMedications.length > 0
            ? "Submit medications"
            : "I'm not taking any medications"
        }
        onPress={form.handleSubmit(onSubmit)}
      />
    </SafeAreaView>
  );
};
