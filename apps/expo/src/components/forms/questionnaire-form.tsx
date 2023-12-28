import { Alert, Button, SafeAreaView, Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAtom } from "jotai";
import { FormProvider, useForm } from "react-hook-form";

import { generateQuestionnaireSchema } from "@acme/shared/src/validators/forms";
import type {
  QuestionnaireResponseAnswer,
  QuestionnaireResponseItem,
  ValueCoding,
} from "@acme/shared/src/validators/questionnaire-response";

import { api } from "~/utils/api";
import { CheckboxQuestion } from "./checkbox-question";
import { InputQuestion } from "./input-question";
import { RadioQuestion } from "./radio-question";
import { patientIdAtom } from "./welcome-form";

type FormData = Record<string, ValueCoding | ValueCoding[] | string>;

interface QuestionnaireProps {
  questionnaireId: string;
  name: string;
  onSuccess?: () => void;
}

export const QuestionnaireForm = (props: QuestionnaireProps) => {
  const { questionnaireId, name, onSuccess } = props;

  const [patientId] = useAtom(patientIdAtom);

  const { isLoading, isError, data, error } =
    api.questionnaire.getQuestionnaire.useQuery({
      id: questionnaireId,
    });

  // derived state from data
  const items = data?.item;
  const dynamicSchema =
    !isLoading && data?.item ? generateQuestionnaireSchema(data.item) : null;

  const mutation = api.questionnaire.submitQuestionnaireResponse.useMutation({
    onSuccess: (data) => {
      console.log(data, "data");

      // Call the passed onSuccess prop if it exists
      if (onSuccess) {
        onSuccess();
      }
    },
    onError: (error) => {
      Alert.alert("Warning", JSON.stringify(error));
    },
  });

  const form = useForm({
    resolver: dynamicSchema ? zodResolver(dynamicSchema) : undefined,
    defaultValues: {},
    mode: "onSubmit",
  });

  function onSubmit(formData: FormData) {
    const transformedItems: QuestionnaireResponseItem[] =
      items?.map((question) => {
        let answers: QuestionnaireResponseAnswer[] = [];

        // Handle choice questions (checkboxes)
        if (question.type === "choice" && question.repeats) {
          // For checkbox questions, formData contains an array of valueCoding objects
          const checkboxAnswers = formData[question.linkId] as ValueCoding[];
          if (checkboxAnswers) {
            answers = checkboxAnswers.map((valueCoding) => ({ valueCoding }));
          }
        }
        // Handle radio questions (single select)
        else if (question.type === "choice" && !question.repeats) {
          // For radio questions, formData contains a single valueCoding object
          const radioAnswer = formData[question.linkId] as ValueCoding;
          if (radioAnswer) {
            answers = [{ valueCoding: radioAnswer }];
          }
        }
        // Handle text questions
        else if (question.type === "text") {
          // For text questions, formData contains a string
          const textAnswer = formData[question.linkId] as string;
          if (textAnswer) {
            answers = [{ valueString: textAnswer }];
          }
        }

        return {
          linkId: question.linkId,
          text: question.text,
          answer: answers,
        };
      }) ?? [];

    const requestBody = {
      questionnaire: `Questionnaire/${questionnaireId}`,
      status: "completed",
      subject: {
        reference: `Patient/${patientId}`,
        type: "Patient",
      },
      item: transformedItems,
    };

    mutation.mutate({
      body: requestBody,
    });
  }

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (isError) {
    return <Text>Error: {error.message}</Text>;
  }

  return (
    <SafeAreaView className="flex-1">
      <KeyboardAwareScrollView>
        <View className="flex-1 px-4 pb-8 pt-4">
          {dynamicSchema && (
            <FormProvider {...form}>
              <View className="flex flex-col">
                {items?.map((question, index) => {
                  switch (question.type) {
                    case "choice":
                      return question.repeats ? (
                        <CheckboxQuestion
                          key={index}
                          form={form}
                          question={question}
                        />
                      ) : (
                        <RadioQuestion
                          key={index}
                          form={form}
                          question={question}
                        />
                      );
                    case "text":
                      return (
                        <InputQuestion
                          key={index}
                          form={form}
                          question={question}
                        />
                      );
                    default:
                      console.warn("Unsupported question type:", question.type);
                      return <Text>Error</Text>;
                  }
                })}
              </View>
            </FormProvider>
          )}
        </View>
      </KeyboardAwareScrollView>
      <Button title="Submit" onPress={form.handleSubmit(onSubmit)} />
    </SafeAreaView>
  );
};
