import { z } from "zod";

const codingSchema = z.object({
  system: z.string(),
  code: z.string(),
  display: z.string(),
});

const vaccineCodeSchema = z.object({
  coding: z.array(codingSchema),
});

const patientSchema = z.object({
  reference: z.string(),
  type: z.string(),
});

// TODO - optional fields
const immunizationResourceSchema = z.object({
  resourceType: z.string(),
  id: z.string(),
  status: z.string(),
  vaccineCode: vaccineCodeSchema,
  patient: patientSchema,
  occurrenceDateTime: z.string(),
  primarySource: z.boolean(),
});

const linkSchema = z.object({
  relation: z.string(),
  url: z.string(),
});

export const searchImmunizationsBundleSchema = z.object({
  resourceType: z.enum(["Bundle"]),
  type: z.enum(["searchset"]),
  total: z.number(),
  link: z.array(linkSchema).optional(),
  entry: z
    .array(
      z.object({
        resource: immunizationResourceSchema,
      }),
    )
    .optional(),
});

// Usage: Validate data with bundleSchema.parse(yourDataObject)
