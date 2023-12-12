import { z } from "zod";

const codingSchema = z.object({
  system: z.string(),
  code: z.string(),
});

const paymentStatusSchema = z.object({
  coding: z.array(codingSchema),
});

const amountSchema = z.object({
  value: z.number(),
  currency: z.string(),
});

const resourceSchema = z.object({
  resourceType: z.string(),
  id: z.string(),
  status: z.string(),
  request: z.object({
    reference: z.string(),
    type: z.string(),
  }),
  created: z.string(),
  payment: z.object({
    display: z.string(),
  }),
  recipient: z.object({
    display: z.string(),
  }),
  amount: amountSchema,
  paymentStatus: paymentStatusSchema,
});

const linkSchema = z.object({
  relation: z.string(),
  url: z.string(),
});

export const searchPaymentNoticeBundleSchema = z.object({
  resourceType: z.literal("Bundle"),
  type: z.string(),
  total: z.number(),
  link: z.array(linkSchema).optional(),
  entry: z
    .array(
      z.object({
        resource: resourceSchema,
      }),
    )
    .optional(),
});

// Usage example
// const jsonResponse = /* the provided JSON response */
// export const parsedPaymentNotice = bundleSchema.parse(jsonResponse);
