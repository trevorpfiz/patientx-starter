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

const roleSchema = z.object({
  coding: z.array(codingSchema),
});

const memberSchema = z.object({
  reference: z.string(),
  display: z.string(),
});

const participantSchema = z.object({
  role: z.array(roleSchema),
  member: memberSchema,
});

const subjectSchema = z.object({
  reference: z.string(),
  type: z.string(),
  display: z.string(),
});

export const careTeamResourceSchema = z.object({
  resourceType: z.string(),
  id: z.string(),
  status: z.string(),
  name: z.string(),
  subject: subjectSchema,
  participant: z.array(participantSchema),
});

const entrySchema = z.object({
  resource: careTeamResourceSchema,
});

export const careTeamBundleSchema = z.object({
  resourceType: z.enum(["Bundle"]),
  type: z.enum(["searchset"]),
  total: z.number(),
  link: z.array(linkSchema).optional(),
  entry: z.array(entrySchema).optional(),
});

// Usage: Validate data with bundleSchema.parse(yourDataObject)
