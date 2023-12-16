import { z } from "zod";

import { createUnionSchemaWithOperationOutcome } from "./operation-outcome";

const linkSchema = z.object({
  relation: z.string(),
  url: z.string(),
});

const codingSchema = z.object({
  system: z.string(),
  code: z.string(),
  display: z.string(),
});

const valueCodingSchema = z.object({
  system: z.string(),
  code: z.string(),
  display: z.string(),
});

const answerOptionSchema = z.object({
  valueCoding: valueCodingSchema,
});

const itemSchema = z.object({
  linkId: z.string(),
  code: z.array(codingSchema),
  text: z.string(),
  type: z.string(),
  repeats: z.boolean(),
  answerOption: z.array(answerOptionSchema).optional(),
});

const questionnaireResourceSchema = z.object({
  resourceType: z.string(),
  id: z.string(),
  name: z.string(),
  status: z.string(),
  description: z.string(),
  code: z.array(codingSchema).optional(),
  item: z.array(itemSchema).optional(),
});

const entrySchema = z.object({
  resource: questionnaireResourceSchema,
});

export const questionnaireBundleSchema = z.object({
  resourceType: z.enum(["Bundle"]),
  type: z.enum(["searchset"]),
  total: z.number(),
  link: z.array(linkSchema).optional(),
  entry: z.array(entrySchema).optional(),
});

export const readQuestionnaireResponseSchema =
  createUnionSchemaWithOperationOutcome(questionnaireResourceSchema);

export const searchQuestionnaireResponseSchema =
  createUnionSchemaWithOperationOutcome(questionnaireBundleSchema);

// Usage: Validate data with responseSchema.parse(yourDataObject)
