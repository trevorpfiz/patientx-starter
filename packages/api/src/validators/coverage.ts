import { z } from "zod";

const linkSchema = z.object({
  relation: z.string(),
  url: z.string(),
});

const referenceSchema = z.object({
  reference: z.string(),
  type: z.string(),
  display: z.string().optional(),
});

const codingSchema = z.object({
  system: z.string(),
  code: z.string(),
  display: z.string(),
});

const relationshipSchema = z.object({
  coding: z.array(codingSchema),
  text: z.string(),
});

const periodSchema = z.object({
  start: z.string(),
  // Include 'end' if it can be part of the response
});

const coverageResourceSchema = z.object({
  resourceType: z.string(),
  id: z.string(),
  status: z.string(),
  subscriber: referenceSchema,
  subscriberId: z.string(),
  beneficiary: referenceSchema,
  relationship: relationshipSchema,
  period: periodSchema,
  payor: z.array(referenceSchema),
  order: z.number(),
});

const entrySchema = z.object({
  resource: coverageResourceSchema,
});

export const coverageBundleSchema = z.object({
  resourceType: z.enum(["Bundle"]),
  type: z.enum(["searchset"]),
  total: z.number(),
  link: z.array(linkSchema).optional(),
  entry: z.array(entrySchema).optional(),
});

// Usage: Validate data with bundleSchema.parse(yourDataObject)