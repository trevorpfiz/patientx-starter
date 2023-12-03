import * as z from "zod";

import type { get_ReadQuestionnaire } from "./canvas/canvas-client";

// Forms
export const newPatientSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  address: z.string().min(10, "Address must be at least 10 characters"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
});
export type NewPatient = z.infer<typeof newPatientSchema>;

export const radioGroupSchema = z.object({
  answerOption: z.string().refine((value) => value.length > 0, {
    message: "You have to select an option.",
  }),
});
export type RadioGroupType = z.infer<typeof radioGroupSchema>;

export const checkboxSchema = z.object({
  answerOption: z
    .array(z.string())
    .refine((value) => value.some((item) => item), {
      message: "You have to select at least one item.",
    }),
});
export type CheckboxType = z.infer<typeof checkboxSchema>;

export const inputSchema = z.object({
  answerOption: z.string().refine((value) => value.length > 0, {
    message: "Can't be blank.",
  }),
});
export type InputType = z.infer<typeof inputSchema>;

// Questionnaire
export const valueCodingSchema = z.object({
  code: z.string(),
  display: z.string(),
  system: z.string(),
});
export type ValueCoding = z.infer<typeof valueCodingSchema>;

export const questionItemSchema = z.object({
  linkId: z.string(),
  text: z.string(),
  answer: z.array(
    z.object({
      valueCoding: z
        .union([valueCodingSchema, z.array(valueCodingSchema)])
        .optional(),
      valueString: z.string().optional(),
    }),
  ),
});
export type QuestionItem = z.infer<typeof questionItemSchema>;

export const questionnaireResponseBodySchema = z.object({
  questionnaire: z.string(),
  status: z.string(),
  subject: z.object({
    reference: z.string(),
    type: z.string(),
  }),
  item: z.array(questionItemSchema),
});
export type QuestionnaireResponseBody = z.infer<
  typeof questionnaireResponseBodySchema
>;

export function generateQuestionnaireSchema(
  questionnaire: z.infer<typeof get_ReadQuestionnaire.response>,
) {
  const schemaObject: Record<string, any> = {};

  questionnaire.item?.forEach((question) => {
    if (question.linkId) {
      switch (question.type) {
        case "choice":
          if (question.repeats) {
            // Define the schema for checkbox (multi-select) questions
            schemaObject[question.linkId] = z
              .array(valueCodingSchema)
              .refine((value) => value.some((item) => item), {
                message: "You have to select at least one item.",
              });
          } else {
            // Define the schema for radio (single-select) questions
            schemaObject[question.linkId] = valueCodingSchema;
          }
          break;
        case "text":
          // Define the schema for text input questions
          schemaObject[question.linkId] = z
            .string()
            .refine((value) => value.length > 0, {
              message: "Can't be blank.",
            });
          break;
        default:
          console.warn("Unsupported question type:", question.type);
      }
    }
  });

  return z.object(schemaObject);
}
