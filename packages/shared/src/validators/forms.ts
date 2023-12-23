import { z } from "zod";

import type { QuestionnaireResource } from "./questionnaire";
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

// Coverage forms
export const coverageFormSchema = z.object({
  subscriberId: z.string().refine((value) => value.length > 0, {
    message: "Can't be blank.",
  }),
  payorId: z.string().refine((value) => value.length > 0, {
    message: "Can't be blank.",
  }),
  insuranceConsent: z.boolean().refine((val) => val, {
    message: "Must grant us consent to use your health insurance information",
  }),
});
export type CoverageFormType = z.infer<typeof coverageFormSchema>;

// --- Medical history forms
// allergies
const allergenSchema = z.object({
  system: z.string(),
  code: z.string().min(1, "Allergen code is required"),
  display: z.string(),
});
const allergyEntrySchema = z.object({
  allergen: allergenSchema,
  type: z
    .enum(["allergy", "intolerance"])
    .refine((val) => ["allergy", "intolerance"].includes(val), {
      message: "Please select an option",
    }),
  severity: z
    .enum(["mild", "moderate", "severe"])
    .refine((val) => ["mild", "moderate", "severe"].includes(val), {
      message: "Please select an option",
    }),
  // TODO - can add reaction
  // reaction: z.string().min(1, "Reaction is required"),
});
export const allergiesFormSchema = z.object({
  allergyEntries: z.array(allergyEntrySchema),
});
export type AllergiesFormData = z.infer<typeof allergiesFormSchema>;

// conditions
const conditionSchema = z.object({
  system: z.string(),
  code: z.string().min(1, "Condition code is required"),
  display: z.string(),
});
export const conditionsFormSchema = z.object({
  conditions: z
    .array(conditionSchema)
    .refine((value) => value.some((condition) => condition), {
      message: "You have to select at least one condition.",
    }),
});
export type ConditionsFormData = z.infer<typeof conditionsFormSchema>;

// medications
const medicationSchema = z.object({
  reference: z.string(),
  display: z.string(),
});
const medicationStatementEntrySchema = z.object({
  medication: medicationSchema,
  duration: z.string().optional(),
});
export const medicationsFormSchema = z.object({
  medicationStatementEntries: z.array(medicationStatementEntrySchema),
});
export type MedicationsFormData = z.infer<typeof medicationsFormSchema>;

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
  questionnaire: QuestionnaireResource,
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
