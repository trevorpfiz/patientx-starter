import { z } from "zod";

const textSchema = z.object({
  status: z.string(),
  div: z.string(),
});

const actorSchema = z.object({
  reference: z.string(),
  type: z.string(),
});

const scheduleResourceSchema = z.object({
  resourceType: z.string(),
  id: z.string(),
  text: textSchema,
  actor: z.array(actorSchema),
  comment: z.string(),
});

const entrySchema = z.object({
  resource: scheduleResourceSchema,
});

export const scheduleBundleSchema = z.object({
  resourceType: z.enum(["Bundle"]),
  type: z.enum(["searchset"]),
  total: z.number(),
  entry: z.array(entrySchema),
});

// Usage: Validate data with bundleSchema.parse(yourDataObject)
