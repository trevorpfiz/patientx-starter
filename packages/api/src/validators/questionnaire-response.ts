import { z } from "zod";

import { createUnionSchemaWithOperationOutcome } from "./operation-outcome";

const linkSchema = z.object({
  relation: z.string(),
  url: z.string(),
});

const extensionSchema = z.object({
  url: z.string(),
  valueString: z.string().optional(),
});

const referenceSchema = z.object({
  reference: z.string(),
  type: z.string(),
});

export const valueCodingSchema = z.object({
  system: z.string(),
  code: z.string(),
  display: z.string(),
});
export type ValueCoding = z.infer<typeof valueCodingSchema>;

const answerSchema = z.object({
  valueCoding: valueCodingSchema.optional(),
  valueString: z.string().optional(),
});

const itemSchema = z.object({
  linkId: z.string(),
  text: z.string(),
  answer: z.array(answerSchema).optional(),
});

export const questionnaireResponseResourceSchema = z.object({
  resourceType: z.string(),
  id: z.string(),
  extension: z.array(extensionSchema).optional(),
  questionnaire: z.string(),
  status: z.string(),
  subject: referenceSchema,
  encounter: referenceSchema.optional(),
  authored: z.string(),
  author: referenceSchema.optional(),
  item: z.array(itemSchema).optional(),
});
export type QuestionnaireResponseResource = z.infer<
  typeof questionnaireResponseResourceSchema
>;

const entrySchema = z.object({
  resource: questionnaireResponseResourceSchema,
});

export const questionnaireResponseBundleSchema = z.object({
  resourceType: z.enum(["Bundle"]),
  type: z.enum(["searchset"]),
  total: z.number(),
  link: z.array(linkSchema).optional(),
  entry: z.array(entrySchema).optional(),
});

export const readQuestionnaireResponseResponseSchema =
  createUnionSchemaWithOperationOutcome(questionnaireResponseResourceSchema);

export const searchQuestionnaireResponseResponseSchema =
  createUnionSchemaWithOperationOutcome(questionnaireResponseBundleSchema);

// Usage: Validate data with responseSchema.parse(yourDataObject)
