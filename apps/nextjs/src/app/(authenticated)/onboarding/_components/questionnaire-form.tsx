"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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
  onSuccess?: () => void;
}

export function QuestionnaireForm(props: QuestionnaireProps) {
  const { questionnaireId, onSuccess } = props;

  const { isLoading, isError, data, error } =
    api.canvas.getQuestionnaire.useQuery({
      id: questionnaireId,
    });

  const router = useRouter();
  const toaster = useToast();

  const [dynamicSchema, setDynamicSchema] = useState(null);

  useEffect(() => {
    if (data) {
      const questionnaireSchema = generateQuestionnaireSchema(data);
      setDynamicSchema(questionnaireSchema);
    }
  }, [data]);

  const form = useZodForm({
    schema: dynamicSchema,
    defaultValues: {},
  });

  async function onSubmit(data: any) {
    try {
      console.log(data, "data");
      //   const projectId = await api.project.create.mutate(data); TODO
      if (onSuccess) {
        onSuccess();
      } else {
        router.push(`/onboarding`);
      }
      toaster.toast({
        title: "You submitted the following values:",
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">{JSON.stringify(data, null, 2)}</code>
          </pre>
        ),
      });
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

  const items = data?.item;

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
