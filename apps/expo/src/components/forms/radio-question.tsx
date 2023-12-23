import { Controller } from "react-hook-form";
import type { UseFormReturn } from "react-hook-form";

import type { QuestionnaireItem } from "@acme/shared/src/validators/questionnaire";

import { Dropdown } from "../ui/forms/dropdown";

interface RadioQuestionProps {
  form: UseFormReturn<any, any, undefined>;
  question: QuestionnaireItem;
}

export const RadioQuestion = (props: RadioQuestionProps) => {
  const { form, question } = props;

  // Map the answer options to the format expected by Dropdown
  const dropdownItems =
    question.answerOption?.map((option) => ({
      label: option.valueCoding?.display ?? "Unknown question",
      value: option.valueCoding,
    })) ?? [];

  return (
    <Controller
      control={form.control}
      name={question.linkId}
      render={({
        field: { onChange, onBlur, value },
        fieldState: { error },
      }) => {
        return (
          <Dropdown
            label={question.text}
            value={value}
            onValueChange={onChange}
            items={dropdownItems}
            placeholder={{
              label: "Select an item...",
              value: null,
              color: "#9EA0A4",
            }}
            // Icon={() => {
            //   return <ChevronDown color="gray" />;
            // }}
            errorMessage={error?.message}
          />
        );
      }}
    />
  );
};
