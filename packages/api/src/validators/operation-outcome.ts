import { z } from "zod";

const operationOutcomeIssueSchema = z.object({
  severity: z.string(),
  code: z.string(),
  details: z.object({
    text: z.string(),
  }),
});

export const operationOutcomeSchema = z.object({
  resourceType: z.literal("OperationOutcome"),
  issue: z.array(operationOutcomeIssueSchema),
});

export const postOrPutResponseSchema = z.union([
  z.null(),
  operationOutcomeSchema,
]);

export function createUnionSchemaWithOperationOutcome<T extends z.ZodTypeAny>(
  schema: T,
) {
  return z.union([schema, operationOutcomeSchema]);
}
