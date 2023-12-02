"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@acme/ui/form";
import { Input } from "@acme/ui/input";

interface InputQuestionProps {
  form: any;
  question: any;
}

export const InputQuestion = (props: InputQuestionProps) => {
  const { form, question } = props;

  return (
    <FormField
      control={form.control}
      name="answerOption"
      render={({ field }) => (
        <>
          {question.answerOption.map((option) => (
            <FormItem key={option.valueCoding.code}>
              <FormLabel>{option.valueCoding.display}</FormLabel>
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
