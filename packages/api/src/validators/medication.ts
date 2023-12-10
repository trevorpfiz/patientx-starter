import { z } from "zod";

const codingSchema = z.object({
  system: z.string(),
  code: z.string(),
  display: z.string(),
});

const textSchema = z.object({
  status: z.string(),
  div: z.string(),
});

const codeSchema = z.object({
  coding: z.array(codingSchema),
  text: z.string(),
});

const medicationResourceSchema = z.object({
  resourceType: z.string(),
  id: z.string(),
  text: textSchema,
  code: codeSchema,
});

const linkSchema = z.object({
  relation: z.string(),
  url: z.string(),
});

export const searchMedicationBundleSchema = z.object({
  resourceType: z.enum(["Bundle"]),
  type: z.enum(["searchset"]),
  total: z.number(),
  link: z.array(linkSchema).optional(),
  entry: z
    .array(
      z.object({
        resource: medicationResourceSchema,
      }),
    )
    .optional(),
});

// Usage: Validate data with bundleSchema.parse(yourDataObject)
