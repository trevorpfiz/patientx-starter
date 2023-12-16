import { z } from "zod";

import { createUnionSchemaWithOperationOutcome } from "./operation-outcome";

const linkSchema = z.object({
  relation: z.string(),
  url: z.string(),
});

const codingSchema = z.object({
  system: z.string(),
  code: z.string(),
});

const paymentStatusSchema = z.object({
  coding: z.array(codingSchema),
});

const referenceSchema = z.object({
  reference: z.string(),
  type: z.string(),
});

const amountSchema = z.object({
  value: z.number(),
  currency: z.string(),
});

const paymentNoticeResourceSchema = z.object({
  resourceType: z.literal("PaymentNotice"),
  id: z.string(),
  status: z.string(),
  request: referenceSchema,
  created: z.string(),
  payment: z.object({ display: z.string() }),
  recipient: z.object({ display: z.string() }),
  amount: amountSchema,
  paymentStatus: paymentStatusSchema,
});

const entrySchema = z.object({
  resource: paymentNoticeResourceSchema,
});

const paymentNoticeBundleSchema = z.object({
  resourceType: z.literal("Bundle"),
  type: z.literal("searchset"),
  total: z.number(),
  link: z.array(linkSchema).optional(),
  entry: z.array(entrySchema).optional(),
});

export const readPaymentNoticeResponseSchema =
  createUnionSchemaWithOperationOutcome(paymentNoticeResourceSchema);

export const searchPaymentNoticeResponseSchema =
  createUnionSchemaWithOperationOutcome(paymentNoticeBundleSchema);

// Usage: Validate data with responseSchema.parse(yourDataObject)
