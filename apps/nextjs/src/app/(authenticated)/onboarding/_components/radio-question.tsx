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
import { RadioGroup, RadioGroupItem } from "@acme/ui/radio-group";

interface RadioQuestionProps {
  form: UseFormReturn<any, any, undefined>;
  question: QuestionnaireItem;
}

export const RadioQuestion = (props: RadioQuestionProps) => {
  const { form, question } = props;

  const handleValueChange = (selectedCode: string) => {
    const selectedOption = question.answerOption?.find(
      (option) => option.valueCoding?.code === selectedCode,
    );
    if (selectedOption?.valueCoding) {
      form.setValue(question.linkId, selectedOption.valueCoding);
    }
  };

  return (
    <FormField
      control={form.control}
      name={question.linkId}
      render={({ field }) => (
        <FormItem className="space-y-3">
          <FormLabel>{question.text}</FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={handleValueChange}
              defaultValue={field.value?.code} // TODO - confirm this works
              className="flex flex-col space-y-1"
            >
              {question.answerOption?.map((option) => {
                // Handle undefined valueCoding or code
                if (option.valueCoding?.code === undefined) {
                  return null; // Skip rendering this option
                }

                return (
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
                );
              })}
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
