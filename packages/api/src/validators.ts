import * as z from "zod";

import type { get_ReadQuestionnaire } from "./canvas/canvas-client";

// Forms
export const newPatientSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  address: z.string().min(10, "Address must be at least 10 characters"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
});
export type NewPatient = z.infer<typeof newPatientSchema>;

// Consent
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

// Coverage
export const coverageFormSchema = z.object({
  subscriberId: z.string().refine((value) => value.length > 0, {
    message: "Can't be blank.",
  }),
  payorId: z.string().refine((value) => value.length > 0, {
    message: "Can't be blank.",
  }),
});
export type CoverageForm = z.infer<typeof coverageFormSchema>;

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

// CareTeam
export const codingSchema = z.object({
  system: z.string(),
  code: z.string(),
  display: z.string(),
});

export const roleSchema = z.object({
  coding: z.array(codingSchema),
});

export const memberSchema = z.object({
  reference: z.string(),
  display: z.string(),
});

export const participantSchema = z.object({
  role: z.array(roleSchema),
  member: memberSchema,
});

export const subjectSchema = z.object({
  reference: z.string(),
  type: z.string(),
  display: z.string(),
});

export const careTeamSchema = z.object({
  resourceType: z.string(),
  id: z.string(),
  status: z.string(),
  name: z.string(),
  subject: subjectSchema,
  participant: z.array(participantSchema),
});

// Communication
export const LinkSchema = z.object({
  relation: z.string(),
  url: z.string(),
});

export const RecipientSchema = z.object({
  reference: z.string(),
  type: z.enum(["Patient"]),
});

export const SenderSchema = z.object({
  reference: z.string(),
  type: z.enum(["Practitioner"]),
});

export const PayloadSchema = z.object({
  contentString: z.string(),
});

export const ResourceSchema = z.object({
  resourceType: z.enum(["Communication"]),
  id: z.string(),
  status: z.enum(["unknown"]),
  sent: z.string(),
  received: z.string(),
  recipient: z.array(RecipientSchema),
  sender: SenderSchema,
  payload: z.array(PayloadSchema),
});

export const EntrySchema = z.object({
  resource: ResourceSchema,
});

export const BundleSchema = z.object({
  resourceType: z.enum(["Bundle"]),
  type: z.enum(["searchset"]),
  total: z.number(),
  link: z.array(LinkSchema),
  entry: z.array(EntrySchema),
});

// Practitioner
export const linkSchema = z.object({
  relation: z.string(),
  url: z.string(),
});

export const identifierSchema = z.object({
  system: z.string(),
  value: z.string(),
});

export const nameSchema = z.object({
  use: z.string(),
  text: z.string(),
  family: z.string(),
  given: z.array(z.string()),
});

export const addressSchema = z.object({
  use: z.string(),
  line: z.array(z.string()),
  city: z.string(),
  state: z.string(),
  postalCode: z.string(),
  country: z.string(),
});

export const codeSchema = z.object({
  text: z.string(),
});

export const periodSchema = z.object({
  start: z.string(),
  end: z.string(),
});

export const issuerExtensionSchema = z.object({
  url: z.string(),
  valueString: z.string(),
});

export const issuerSchema = z.object({
  extension: z.array(issuerExtensionSchema),
  display: z.string(),
});

export const qualificationSchema = z.object({
  identifier: z.array(identifierSchema),
  code: codeSchema,
  period: periodSchema,
  issuer: issuerSchema,
});

export const practitionerSchema = z.object({
  resourceType: z.string(),
  id: z.string(),
  identifier: z.array(identifierSchema),
  name: z.array(nameSchema),
  address: z.array(addressSchema),
  qualification: z.array(qualificationSchema),
});

export const entrySchema = z.object({
  resource: practitionerSchema,
});

export const bundleSchema = z.object({
  resourceType: z.string(),
  type: z.string(),
  total: z.number(),
  link: z.array(linkSchema),
  entry: z.array(entrySchema),
});

// Schedule
const scheduleTextSchema = z.object({
  status: z.string(),
  div: z.string(),
});

const scheduleActorSchema = z.object({
  reference: z.string(),
  type: z.enum(["Practitioner"]),
});

const scheduleResourceSchema = z.object({
  resourceType: z.enum(["Schedule"]),
  id: z.string(),
  text: scheduleTextSchema,
  actor: z.array(scheduleActorSchema),
  comment: z.string(),
});

const scheduleEntrySchema = z.object({
  resource: scheduleResourceSchema,
});

export const scheduleBundleSchema = z.object({
  resourceType: z.enum(["Bundle"]),
  type: z.enum(["searchset"]),
  total: z.number(),
  entry: z.array(scheduleEntrySchema),
});

// Slot
const scheduleReferenceSchema = z.object({
  reference: z.string(),
  type: z.enum(["Schedule"]),
});

const slotResourceSchema = z.object({
  resourceType: z.enum(["Slot"]),
  schedule: scheduleReferenceSchema,
  status: z.string(),
  start: z.string(),
  end: z.string(),
});
export type SlotResource = z.infer<typeof slotResourceSchema>;

const slotEntrySchema = z.object({
  resource: slotResourceSchema,
});

export const slotBundleSchema = z.object({
  resourceType: z.enum(["Bundle"]),
  type: z.enum(["searchset"]),
  total: z.number(),
  entry: z.array(slotEntrySchema),
});
