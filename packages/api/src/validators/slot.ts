import { z } from "zod";

const scheduleReferenceSchema = z.object({
  reference: z.string(),
  type: z.enum(["Schedule"]),
});

const slotResourceSchema = z.object({
  resourceType: z.enum(["Slot"]),
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
  resourceType: z.enum(["Bundle"]),
  type: z.enum(["searchset"]),
  total: z.number(),
  entry: z.array(slotEntrySchema).optional(),
});
