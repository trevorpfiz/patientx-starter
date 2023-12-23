import { Controller } from "react-hook-form";
import type { UseFormReturn } from "react-hook-form";

import type { QuestionnaireItem } from "@acme/shared/src/validators/questionnaire";

import { TextInput } from "../ui/forms/text-input";

interface InputQuestionProps {
  form: UseFormReturn<any, any, undefined>;
  question: QuestionnaireItem;
}

export const InputQuestion = (props: InputQuestionProps) => {
  const { form, question } = props;

  return (
    <Controller
      control={form.control}
      name={question.linkId}
      render={({
        field: { onChange, onBlur, value },
        fieldState: { error },
      }) => {
        return (
          <>
            {question.answerOption?.map((option) => (
              <TextInput
                key={option.valueCoding?.code}
                label={option.valueCoding?.display}
                onBlur={onBlur}
                value={value}
                placeholder=""
                onChangeText={onChange}
                errorMessage={error?.message}
              />
            ))}
          </>
        );
      }}
    />
  );
};
