import { z } from "zod";

import type { get_ReadQuestionnaire } from "../canvas/canvas-client";
import { valueCodingSchema } from "./questionnaire-response";

// Intake forms
export const patientIntakeSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  birthDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Birth date must be in YYYY-MM-DD format"),
  gender: z
    .enum(["", "male", "female", "other", "unknown"])
    .refine((val) => ["male", "female", "other", "unknown"].includes(val), {
      message: "Please select an option",
    }),
  line: z.string().min(1, "Street address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(2, "State is required"), // Assuming state abbreviations
  postalCode: z
    .string()
    .min(5, "Zip code must be at least 5 digits")
    .max(10, "Zip code must be no more than 10 characters") // To account for ZIP+4 format
    .regex(/^\d{5}(-\d{4})?$/, "Invalid zip code format"), // Validates standard US ZIP and ZIP+4
  phoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^\d{10}$/, "Invalid phone number format"), // Validates a 10-digit phone number
  genericConsent: z.boolean().refine((val) => val, {
    message: "Must grant us consent to use your health information",
  }),
  insuranceConsent: z.boolean().refine((val) => val, {
    message: "Must grant us consent to use your health insurance information",
  }),
});
export type PatientIntake = z.infer<typeof patientIntakeSchema>;

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
