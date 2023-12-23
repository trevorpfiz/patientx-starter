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

type FormData = Record<string, ValueCoding | ValueCoding[] | string>;

interface QuestionnaireProps {
  questionnaireId: string;
  onSuccess?: () => void;
}

export const QuestionnaireForm = (props: QuestionnaireProps) => {
  const { questionnaireId, onSuccess } = props;

  const [patientId] = useAtom(patientIdAtom);
  const updater = useStepStatusUpdater();

  const form = useForm<CoverageFormType>({
    resolver: zodResolver(coverageFormSchema),
    defaultValues: {},
  });

  const { isLoading, isError, data, error } =
    api.questionnaire.getQuestionnaire.useQuery({
      id: questionnaireId,
    });

  const mutation = api.questionnaire.submitQuestionnaireResponse.useMutation({
    onSuccess: (data) => {
      console.log(data, "data");

      // Update questionnaire step as complete
      updater.updateStepStatus("questionnaire", "complete");

      // Call the passed onSuccess prop if it exists
      if (onSuccess) {
        onSuccess();
      }
    },
    onError: (error) => {
      Alert.alert("Warning", JSON.stringify(error));
    },
  });

  function onSubmit(formData: FormData) {
    const transformedItems: QuestionItem[] = (items ?? []).map((question) => {
      let answers: {
        valueCoding?: ValueCoding[] | ValueCoding;
        valueString?: string;
      }[] = [];

      if (question.type === "choice") {
        if (question.repeats) {
          // For checkbox questions, formData contains an array of valueCoding objects
          const valueCodings = formData[question.linkId] as ValueCoding[];
          answers = valueCodings.map((valueCoding) => ({ valueCoding }));
        } else {
          // For radio questions, formData contains a single valueCoding object
          const valueCoding = formData[question.linkId] as ValueCoding;
          if (valueCoding) answers = [{ valueCoding }];
        }
      } else if (question.type === "text") {
        // For text questions, formData contains a string
        // Directly use the string as the valueString
        const valueString = formData[question.linkId] as string;
        if (valueString) answers = [{ valueString }];
      }

      return {
        linkId: question.linkId,
        text: question.text,
        answer: answers,
      };
    });

    const requestBody = {
      questionnaire: `Questionnaire/${questionnaireId}`,
      status: "completed",
      subject: {
        reference: `Patient/b685d0d97f604e1fb60f9ed089abc410`, // TODO
        type: "Patient",
      },
      item: transformedItems,
    };

    mutation.mutate({
      body: requestBody,
    });
  }

  if (isLoading) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <span>Error: {error.message}</span>;
  }

  return (
    <SafeAreaView className="flex-1">
      <KeyboardAwareScrollView className="px-4">
        <Text className="py-4 text-xl">Share your insurance details</Text>

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
