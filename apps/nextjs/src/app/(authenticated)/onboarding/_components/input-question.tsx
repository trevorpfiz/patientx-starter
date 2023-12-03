"use client";

import type { UseFormReturn } from "react-hook-form";
import type { z } from "zod";

import type { get_ReadQuestionnaire } from "@acme/api/src/canvas/canvas-client";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@acme/ui/form";
import { Input } from "@acme/ui/input";

export type Question = z.infer<
  typeof get_ReadQuestionnaire.response.shape.item._def.innerType.element
>;

interface InputQuestionProps {
  form: UseFormReturn<any, any, undefined>;
  question: Question;
}

export const InputQuestion = (props: InputQuestionProps) => {
  const { form, question } = props;

  return (
    <FormField
      control={form.control}
      name={question.linkId!}
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
