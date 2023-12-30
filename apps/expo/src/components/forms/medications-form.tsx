import {
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
import { useForm } from "react-hook-form";

import type { MedicationsFormData } from "@acme/shared/src/validators/forms";
import { medicationsFormSchema } from "@acme/shared/src/validators/forms";

import { patientIdAtom } from "~/app/(main)";
import { Button } from "~/components/ui/rn-ui/components/ui/button";
import { api } from "~/utils/api";
import MedicationSelector, {
  selectedMedicationsAtom,
} from "./medication-selector";

export const MedicationsForm = (props: { onSuccess?: () => void }) => {
  const [patientId] = useAtom(patientIdAtom);
  const [selectedMedications, setSelectedMedications] = useAtom(
    selectedMedicationsAtom,
  );

  const mutation = api.medication.submitMedicationStatement.useMutation({
    onSuccess: (data) => {
      // Call the passed onSuccess prop if it exists
      if (props.onSuccess) {
        props.onSuccess();
      }
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
    // Allow patient to submit if they aren't taking any medications
    if (!selectedMedications || selectedMedications.length === 0) {
      // Call the passed onSuccess prop if it exists
      if (props.onSuccess) {
        props.onSuccess();
      }
      return;
    }

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
    <SafeAreaView className="flex-1 bg-gray-50">
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
                <View className="flex-1 flex-row items-center justify-between py-8">
                  <View className="mr-4 flex-1">
                    <Text className="text-lg font-semibold">
                      {entry.medication.display}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => handleRemoveMedication(index)}
                    className="flex-shrink-0 p-2"
                  >
                    <X size={20} color="black" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
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
          ) : selectedMedications && selectedMedications.length > 0 ? (
            "Submit medications"
          ) : (
            "I'm not taking any medications"
          )}
        </Button>
      </View>
    </SafeAreaView>
  );
};
