import { z } from "zod";

import { createUnionSchemaWithOperationOutcome } from "./operation-outcome";

const scheduleReferenceSchema = z.object({
  reference: z.string(),
  type: z.enum(["Schedule"]),
});

const slotResourceSchema = z.object({
  resourceType: z.literal("Slot"),
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
  resourceType: z.literal("Bundle"),
  type: z.literal("searchset"),
  total: z.number(),
  entry: z.array(slotEntrySchema).optional(),
});

export const readSlotResponseSchema =
  createUnionSchemaWithOperationOutcome(slotResourceSchema);

export const searchSlotResponseSchema =
  createUnionSchemaWithOperationOutcome(slotBundleSchema);

// Usage: Validate data with responseSchema.parse(yourDataObject)
