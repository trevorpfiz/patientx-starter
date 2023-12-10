import { z } from "zod";

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

const valueCodingSchema = z.object({
  system: z.string(),
  code: z.string(),
  display: z.string(),
});

const answerSchema = z.object({
  valueCoding: valueCodingSchema.optional(),
  valueString: z.string().optional(),
});

const itemSchema = z.object({
  linkId: z.string(),
  text: z.string(),
  answer: z.array(answerSchema).optional(),
});

const questionnaireResponseResourceSchema = z.object({
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

// Usage: Validate data with bundleSchema.parse(yourDataObject)
