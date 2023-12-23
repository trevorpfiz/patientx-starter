import { Text, View } from "react-native";
import Checkbox from "expo-checkbox";
import { Controller } from "react-hook-form";
import type { UseFormReturn } from "react-hook-form";

import type { QuestionnaireItem } from "@acme/shared/src/validators/questionnaire";
import type { ValueCoding } from "@acme/shared/src/validators/questionnaire-response";

interface CheckboxQuestionProps {
  form: UseFormReturn<any, any, undefined>;
  question: QuestionnaireItem;
}

export const CheckboxQuestion = (props: CheckboxQuestionProps) => {
  const { form, question } = props;

  return (
    <Controller
      control={form.control}
      name={question.linkId}
      render={({
        field: { onChange, onBlur, value = [] },
        fieldState: { error },
      }) => {
        const handleCheckboxChange = (
          optionValueCoding: ValueCoding,
          checked: boolean,
        ) => {
          const newValue = checked
            ? [...value, optionValueCoding] // Add the valueCoding object to the array
            : value.filter(
                (vc: ValueCoding) => vc.code !== optionValueCoding.code,
              ); // Remove the valueCoding object from the array
          onChange(newValue);
        };

        return (
          <>
            <Text className="mb-2 text-lg font-semibold text-gray-700">
              {question.text}
            </Text>
            {question.answerOption?.map((option, index) => (
              <View key={index} className="mb-2 flex-row items-center">
                <Checkbox
                  value={value.some(
                    (vc: ValueCoding) => vc.code === option.valueCoding?.code,
                  )}
                  onValueChange={(checked) =>
                    handleCheckboxChange(option.valueCoding, checked)
                  }
                />
                <Text className="ml-2 text-gray-700">
                  {option.valueCoding?.display}
                </Text>
              </View>
            ))}
            {error?.message && (
              <Text className="mt-1 text-sm text-red-500">
                {error?.message}
              </Text>
            )}
          </>
        );
      }}
    />
  );
};
