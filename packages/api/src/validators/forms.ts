import { z } from "zod";

import type { get_ReadQuestionnaire } from "../canvas/canvas-client";
import { valueCodingSchema } from "./questionnaire-response";

// Intake forms
export const newPatientSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  address: z.string().min(10, "Address must be at least 10 characters"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
});
export type NewPatient = z.infer<typeof newPatientSchema>;

// Consent forms
export const consentFormSchema = z.object({
  generic: z
    .boolean()
    .default(false)
    .refine((val) => val === true, {
      message: "Must grant us consent to use your health information",
    }),
  insurance: z
    .boolean()
    .default(false)
    .refine((val) => val === true, {
      message: "Must grant us consent to use your health insurance information",
    }),
});
export type ConsentForm = z.infer<typeof consentFormSchema>;

// Coverage forms
export const coverageFormSchema = z.object({
  subscriberId: z.string().refine((value) => value.length > 0, {
    message: "Can't be blank.",
  }),
  payorId: z.string().refine((value) => value.length > 0, {
    message: "Can't be blank.",
  }),
});
export type CoverageForm = z.infer<typeof coverageFormSchema>;

// Questionnaires
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
