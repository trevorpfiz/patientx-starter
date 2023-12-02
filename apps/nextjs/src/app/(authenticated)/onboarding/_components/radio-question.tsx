"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@acme/ui/form";
import { RadioGroup, RadioGroupItem } from "@acme/ui/radio-group";

interface RadioQuestionProps {
  form: any;
  question: any;
}

export const RadioQuestion = (props: RadioQuestionProps) => {
  const { form, question } = props;

  return (
    <FormField
      control={form.control}
      name="answerOption"
      render={({ field }) => (
        <FormItem className="space-y-3">
          <FormLabel>{question.text}</FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              className="flex flex-col space-y-1"
            >
              {question.answerOption.map((option) => (
                <FormItem
                  className="flex items-center space-x-3 space-y-0"
                  key={option.valueCoding.code}
                >
                  <FormControl>
                    <RadioGroupItem value={option.valueCoding.code} />
                  </FormControl>
                  <FormLabel className="font-normal">
                    {option.valueCoding.display}
                  </FormLabel>
                </FormItem>
              ))}
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
