"use client";

import { useRouter } from "next/navigation";

import { radioGroupSchema } from "@acme/api/validators";
import type { RadioGroupType } from "@acme/api/validators";
import { Button } from "@acme/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@acme/ui/form";
import { RadioGroup, RadioGroupItem } from "@acme/ui/radio-group";
import { useToast } from "@acme/ui/use-toast";

import { useZodForm } from "~/lib/zod-form";
import { api } from "~/trpc/react";

interface RadioQuestionProps {
  sectionIndex: number;
  questionIndex: number;
  questionId: string;
  templateId: string;
}

export const RadioQuestion = (props: RadioQuestionProps) => {
  const { sectionIndex, questionIndex, questionId, templateId } = props;

  const { isPending, isError, data, error } =
    api.assessmentInstance.byId.useQuery({ templateId });

  const updateResponse = api.assessmentInstance.update.useMutation({
    onSuccess: (data, variables, context) => {
      toaster.toast({
        title: "Submission Successful",
        description: JSON.stringify(data, null, 2),
      });
    },
    onError: (err, variables, context) => {
      toaster.toast({
        title: "Error submitting answer",
        variant: "destructive",
        description:
          "An issue occurred while submitting answer. Please try again.",
      });
    },
  });

  const router = useRouter();
  const toaster = useToast();

  const defaultOptions = data?.response?.responses.find(
    (response) => response.questionId === questionId,
  )?.response;

  const form = useZodForm({
    schema: radioGroupSchema,
    defaultValues: {
      options: defaultOptions as string,
    },
  });

  function onSubmit(formData: RadioGroupType) {
    console.log("Submitting the following data:", formData);

    const currentResponses = data?.response?.responses ?? [];

    // Merge new response with current responses
    const updatedResponses = currentResponses.map((response) =>
      response.questionId === questionId
        ? { ...response, response: formData.options }
        : response,
    );

    // If the current question response does not exist in the current responses, add it
    if (
      !updatedResponses.find((response) => response.questionId === questionId)
    ) {
      updatedResponses.push({ questionId, response: formData.options });
    }

    // Construct the full response object to be submitted
    const fullResponse = {
      ...data?.response, // include other properties of the response object if necessary
      responses: updatedResponses,
    };

    // Submit the full response object
    updateResponse.mutate({ templateId: templateId, response: fullResponse });
  }

  if (isPending) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <span>Error: {error.message}</span>;
  }

  const questionJSON =
    data?.assessmentTemplate.template[sectionIndex]?.questions[questionIndex];

  return (
    <Form {...form}>
      {questionJSON && (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="options"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>{questionJSON.label}</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    {questionJSON.options.map((option, index) => (
                      <FormItem
                        className="flex items-center space-x-3 space-y-0"
                        key={option.id}
                      >
                        <FormControl>
                          <RadioGroupItem value={option.id} />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {option.label}
                        </FormLabel>
                      </FormItem>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      )}
    </Form>
  );
};
