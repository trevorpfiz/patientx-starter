import { z } from "zod";

import { createUnionSchemaWithOperationOutcome } from "./operation-outcome";

const linkSchema = z.object({
  relation: z.string(),
  url: z.string(),
});

const referenceSchema = z.object({
  reference: z.string(),
  type: z.string(),
});

const payloadSchema = z.object({
  contentString: z.string(),
});

export const communicationResourceSchema = z.object({
  resourceType: z.string(),
  id: z.string(),
  status: z.string(),
  sent: z.string(),
  received: z.string(),
  recipient: z.array(referenceSchema),
  sender: referenceSchema,
  payload: z.array(payloadSchema),
});

const entrySchema = z.object({
  resource: communicationResourceSchema,
});

export const communicationBundleSchema = z.object({
  resourceType: z.enum(["Bundle"]),
  type: z.enum(["searchset"]),
  total: z.number(),
  link: z.array(linkSchema).optional(),
  entry: z.array(entrySchema).optional(),
});

export const readCommunicationResponseSchema =
  createUnionSchemaWithOperationOutcome(communicationResourceSchema);

export const searchCommunicationResponseSchema =
  createUnionSchemaWithOperationOutcome(communicationBundleSchema);

// Usage: Validate data with responseSchema.parse(yourDataObject)
