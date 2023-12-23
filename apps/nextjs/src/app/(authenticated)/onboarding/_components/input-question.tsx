"use client";

import type { UseFormReturn } from "react-hook-form";

import type { QuestionnaireItem } from "@acme/shared/src/validators/questionnaire";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@acme/ui/form";
import { Input } from "@acme/ui/input";

interface InputQuestionProps {
  form: UseFormReturn<any, any, undefined>;
  question: QuestionnaireItem;
}

export const InputQuestion = (props: InputQuestionProps) => {
  const { form, question } = props;

  return (
    <FormField
      control={form.control}
      name={question.linkId}
      render={({ field }) => (
        <>
          {question.answerOption?.map((option) => (
            <FormItem key={option.valueCoding?.code}>
              <FormLabel>{option.valueCoding?.display}</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          ))}
        </>
      )}
    />
  );
};
