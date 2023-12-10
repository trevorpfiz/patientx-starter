import { z } from "zod";

const linkSchema = z.object({
  relation: z.string(),
  url: z.string(),
});

const codingSchema = z.object({
  system: z.string(),
  code: z.string(),
  display: z.string(),
});

const categorySchema = z.object({
  coding: z.array(codingSchema),
});

const codeSchema = z.object({
  coding: z.array(codingSchema),
});

const referenceSchema = z.object({
  reference: z.string(),
  type: z.string(),
});

export const diagnosticReportResourceSchema = z.object({
  resourceType: z.string(),
  id: z.string(),
  status: z.string(),
  category: z.array(categorySchema).optional(),
  code: codeSchema,
  subject: referenceSchema,
  effectiveDateTime: z.string(),
  issued: z.string(),
  performer: z.array(referenceSchema).optional(),
});

const entrySchema = z.object({
  resource: diagnosticReportResourceSchema,
});

export const diagnosticReportBundleSchema = z.object({
  resourceType: z.enum(["Bundle"]),
  type: z.enum(["searchset"]),
  total: z.number(),
  link: z.array(linkSchema).optional(),
  entry: z.array(entrySchema).optional(),
});

// Usage: Validate data with bundleSchema.parse(yourDataObject)
