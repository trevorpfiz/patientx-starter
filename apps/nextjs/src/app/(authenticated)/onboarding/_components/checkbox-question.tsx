"use client";

import { useRouter } from "next/navigation";

import { checkboxSchema } from "@acme/api/validators";
import type { CheckboxType } from "@acme/api/validators";
import { Button } from "@acme/ui/button";
import { Checkbox } from "@acme/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@acme/ui/form";
import { useToast } from "@acme/ui/use-toast";

import { useZodForm } from "~/lib/zod-form";
import { api } from "~/trpc/react";

interface CheckboxQuestionProps {
  sectionIndex: number;
  questionIndex: number;
  questionId: string;
  templateId: string;
}

export const CheckboxQuestion = (props: CheckboxQuestionProps) => {
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

  const form = useZodForm({
    schema: checkboxSchema,
  });

  function onSubmit(formData: CheckboxType) {
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
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel className="text-base">
                    {questionJSON.label}
                  </FormLabel>
                </div>
                {questionJSON.options.map((option) => (
                  <FormField
                    key={option.id}
                    control={form.control}
                    name="options"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(option.id)}
                            onCheckedChange={(checked) => {
                              const existingValues = field.value || [];
                              return checked
                                ? field.onChange([...existingValues, option.id])
                                : field.onChange(
                                    existingValues.filter(
                                      (value) => value !== option.id,
                                    ),
                                  );
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {option.label}
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                ))}
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
