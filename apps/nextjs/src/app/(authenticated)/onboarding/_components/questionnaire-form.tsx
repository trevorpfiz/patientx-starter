"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import type { ZodSchema } from "zod";

import { generateQuestionnaireSchema } from "@acme/api/src/validators";
import { Button } from "@acme/ui/button";
import { Form } from "@acme/ui/form";
import { useToast } from "@acme/ui/use-toast";

import { useZodForm } from "~/lib/zod-form";
import { api } from "~/trpc/react";
import { CheckboxQuestion } from "./checkbox-question";
import { InputQuestion } from "./input-question";
import { RadioQuestion } from "./radio-question";

interface QuestionnaireProps {
  questionnaireId: string;
  onSuccess: () => void;
}

export function QuestionnaireForm(props: QuestionnaireProps) {
  const { questionnaireId, onSuccess } = props;

  const { isLoading, isError, data, error } =
    api.canvas.getQuestionnaire.useQuery({
      id: questionnaireId,
    });

  const mutation = api.canvas.submitQuestionnaireResponse.useMutation();

  const router = useRouter();
  const toaster = useToast();

  const [dynamicSchema, setDynamicSchema] = useState<ZodSchema | null>(null);

  useEffect(() => {
    if (data) {
      const questionnaireSchema = generateQuestionnaireSchema(data);
      setDynamicSchema(questionnaireSchema);
    }
  }, [data]);

  const form = useZodForm({
    schema: dynamicSchema ?? z.any(),
    defaultValues: {},
  });

  const items = data?.item;

  function onSubmit(formData: unknown) {
    const transformedItems = items?.map((question) => {
      let answers;

      if (question.type === "choice") {
        if (question.repeats) {
          // For checkbox questions, formData contains an array of valueCoding objects
          answers = formData[question.linkId].map((valueCoding) => ({
            valueCoding,
          }));
        } else {
          // For radio questions, formData contains a single valueCoding object
          answers = [{ valueCoding: formData[question.linkId] }];
        }
      } else if (question.type === "text") {
        // For text questions, formData contains a string
        answers = [{ valueString: formData[question.linkId] }];
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

    try {
      console.log(data, "data");
      console.log(formData, "formData");
      console.log(transformedItems, "transformedItems");
      mutation.mutate({
        body: requestBody,
      });
      if (mutation.isSuccess) {
        toaster.toast({
          title: "You submitted the following values:",
          description: (
            <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
              <code className="text-white">
                {JSON.stringify(data, null, 2)}
              </code>
            </pre>
          ),
        });
        onSuccess();
      } else {
        // router.push(`/onboarding`);
      }
    } catch (error) {
      toaster.toast({
        title: "Error submitting answer",
        variant: "destructive",
        description:
          "An issue occurred while submitting answer. Please try again.",
      });
    }
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
