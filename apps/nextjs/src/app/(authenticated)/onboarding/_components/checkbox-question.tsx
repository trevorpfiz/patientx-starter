"use client";

import type { UseFormReturn } from "react-hook-form";

import { Checkbox } from "@acme/ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@acme/ui/form";

import type { Question } from "./input-question";

interface CheckboxQuestionProps {
  form: UseFormReturn<any, any, undefined>;
  question: Question;
}

export const CheckboxQuestion = (props: CheckboxQuestionProps) => {
  const { form, question } = props;

  return (
    <FormField
      control={form.control}
      name={question.linkId!}
      render={() => (
        <FormItem>
          <div className="mb-4">
            <FormLabel className="text-base">{question.text}</FormLabel>
          </div>
          {question.answerOption?.map((option) => (
            <FormField
              key={option.valueCoding?.code}
              control={form.control}
              name={question.linkId!}
              render={({ field }) => {
                const isChecked = field.value?.some(
                  (selectedOption) =>
                    selectedOption.code === option.valueCoding?.code,
                );
                return (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={isChecked}
                        onCheckedChange={(checked) => {
                          const existingValues = field.value || [];
                          if (checked) {
                            field.onChange([
                              ...existingValues,
                              option.valueCoding,
                            ]);
                          } else {
                            field.onChange(
                              existingValues.filter(
                                (selectedOption) =>
                                  selectedOption.code !==
                                  option.valueCoding?.code,
                              ),
                            );
                          }
                        }}
                      />
                    </FormControl>
                    <FormLabel className="font-normal">
                      {option.valueCoding?.display}
                    </FormLabel>
                  </FormItem>
                );
              }}
            />
          ))}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
