import { Text, View } from "react-native";
import Animated, { FadeInDown, FadeOutUp } from "react-native-reanimated";
import { Controller } from "react-hook-form";
import type { UseFormReturn } from "react-hook-form";

import type { QuestionnaireItem } from "@acme/shared/src/validators/questionnaire";
import type { ValueCoding } from "@acme/shared/src/validators/questionnaire-response";

import { Checkbox } from "~/components/ui/rn-ui/components/ui/checkbox";
import { Label } from "~/components/ui/rn-ui/components/ui/label";

interface CheckboxQuestionProps {
  form: UseFormReturn<any, any, undefined>;
  question: QuestionnaireItem;
}

export const CheckboxQuestion = (props: CheckboxQuestionProps) => {
  const { form, question } = props;

  const handleCheckboxChange = (optionValueCoding: ValueCoding) => {
    const currentValue = form.getValues(question.linkId) ?? [];
    const isChecked = currentValue.some(
      (vc: ValueCoding) => vc.code === optionValueCoding.code,
    );
    const newValue = isChecked
      ? currentValue.filter(
          (vc: ValueCoding) => vc.code !== optionValueCoding.code,
        )
      : [...currentValue, optionValueCoding];

    form.setValue(question.linkId, newValue);
  };

  return (
    <Controller
      control={form.control}
      name={question.linkId}
      render={({
        field: { onChange, onBlur, value = [] },
        fieldState: { error },
      }) => (
        <View>
          <Text className="mb-2 text-xl font-semibold text-black">
            {question.text}
          </Text>
          {question.answerOption?.map((option, index) => (
            <View key={index} className="flex-row items-center gap-2">
              <Checkbox
                accessibilityLabelledBy={`checkLabel-${index}`}
                value={value.some(
                  (vc: ValueCoding) => vc.code === option.valueCoding?.code,
                )}
                onChange={() => handleCheckboxChange(option.valueCoding)}
              />
              <Label
                onPress={() => handleCheckboxChange(option.valueCoding)}
                nativeID={`checkLabel-${index}`}
                className="text-lg"
              >
                {option.valueCoding?.display}
              </Label>
            </View>
          ))}
          {error && (
            <Animated.Text
              entering={FadeInDown}
              exiting={FadeOutUp.duration(275)}
              className={"px-0.5 py-2 text-sm text-destructive"}
              role="alert"
            >
              {error?.message}
            </Animated.Text>
          )}
        </View>
      )}
    />
  );
};
