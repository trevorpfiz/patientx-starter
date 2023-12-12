import { z } from "zod";

const linkSchema = z.object({
  relation: z.string(),
  url: z.string(),
});

const codingSchema = z.object({
  system: z.string(),
  display: z.string(),
});

const categorySchema = z.object({
  coding: z.array(codingSchema),
});

const referenceSchema = z.object({
  reference: z.string(),
  type: z.string(),
});

const periodSchema = z.object({
  start: z.string(),
  end: z.string().optional(),
});

const provisionSchema = z.object({
  period: periodSchema.optional(),
});

const scopeSchema = z.object({
  text: z.string(),
});

const sourceAttachmentSchema = z.object({
  url: z.string(),
});

const consentResourceSchema = z.object({
  resourceType: z.string(),
  id: z.string(),
  status: z.string(),
  scope: scopeSchema,
  category: z.array(categorySchema),
  patient: referenceSchema,
  dateTime: z.string(),
  sourceAttachment: sourceAttachmentSchema.optional(),
  provision: provisionSchema.optional(),
});

const entrySchema = z.object({
  resource: consentResourceSchema,
});

export const consentBundleSchema = z.object({
  resourceType: z.enum(["Bundle"]),
  type: z.enum(["searchset"]),
  total: z.number(),
  link: z.array(linkSchema).optional(),
  entry: z.array(entrySchema).optional(),
});

// Usage: Validate data with bundleSchema.parse(yourDataObject)
