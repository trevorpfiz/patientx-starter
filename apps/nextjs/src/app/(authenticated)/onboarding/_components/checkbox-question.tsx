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
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value?.includes(option.valueCoding?.code)}
                      onCheckedChange={(checked) => {
                        const existingValues: string[] = field.value || [];
                        return checked
                          ? field.onChange([
                              ...existingValues,
                              option.valueCoding?.code,
                            ])
                          : field.onChange(
                              existingValues.filter(
                                (value) => value !== option.valueCoding?.code,
                              ),
                            );
                      }}
                    />
                  </FormControl>
                  <FormLabel className="font-normal">
                    {option.valueCoding?.display}
                  </FormLabel>
                </FormItem>
              )}
            />
          ))}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
