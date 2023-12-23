"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { generateQuestionnaireSchema } from "@acme/shared/src/validators/forms";
import type {
  QuestionnaireResponseAnswer,
  QuestionnaireResponseItem,
  ValueCoding,
} from "@acme/shared/src/validators/questionnaire-response";
import { Button } from "@acme/ui/button";
import { Form } from "@acme/ui/form";
import { useToast } from "@acme/ui/use-toast";

import { useStepStatusUpdater } from "~/components/ui/steps";
import { api } from "~/trpc/react";
import { CheckboxQuestion } from "./checkbox-question";
import { InputQuestion } from "./input-question";
import { RadioQuestion } from "./radio-question";

type FormData = Record<string, ValueCoding | ValueCoding[] | string>;

interface QuestionnaireProps {
  questionnaireId: string;
  onSuccess?: () => void;
}

export function QuestionnaireForm(props: QuestionnaireProps) {
  const { questionnaireId, onSuccess } = props;

  const toaster = useToast();
  const updater = useStepStatusUpdater();

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
      toaster.toast({
        title: "You submitted the following values:",
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">{JSON.stringify(data, null, 2)}</code>
          </pre>
        ),
      });

      updater.updateStepStatus("questionnaire", "complete");

      // Call the passed onSuccess prop if it exists
      if (onSuccess) {
        onSuccess();
      }
    },
    onError: (error) => {
      // Show an error toast
      toaster.toast({
        title: "Error submitting consent",
        description: "An issue occurred while submitting. Please try again.",
        variant: "destructive",
      });
    },
  });

  const form = useForm({
    resolver: dynamicSchema ? zodResolver(dynamicSchema) : undefined,
    defaultValues: {},
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
    <>
      {dynamicSchema && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-2/3 space-y-6"
          >
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
                  return null;
              }
            })}
            <Button type="submit" variant="outline">
              Submit
            </Button>
          </form>
        </Form>
      )}
    </>
  );
}
