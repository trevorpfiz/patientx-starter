import { TRPCError } from "@trpc/server";
import type { z } from "zod";

import type {
  OperationOutcome,
  OperationOutcomeIssue,
} from "@acme/shared/src/validators/operation-outcome";

// TODO: Utility functions for response validation and error handling. Will have to refactor more before we can use them.

function handleCanvasApiResponse<Z extends z.ZodTypeAny>(
  responseSchema: Z,
  data: Z,
): z.infer<Z> {
  const parsedData = responseSchema.parse(data);

  if (parsedData?.resourceType === "OperationOutcome") {
    const issues = parsedData.issue
      .map(
        (issue: OperationOutcomeIssue) =>
          `${issue.severity}: ${issue.code}, ${issue.details?.text}`,
      )
      .join("; ");
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `FHIR OperationOutcome Error: ${issues}`,
    });
  }

  return parsedData;
}

/**
 * Checks if the response data is an OperationOutcome and throws an error if it is.
 * @param data - The data to check.
 * @param schema - The zod schema to validate the data against.
 * @returns - The validated data if not an OperationOutcome, with the correct TypeScript type.
 * @throws {TRPCError} - Throws an error if the data is an OperationOutcome or validation fails.
 */
function handleOperationOutcomeError<Z extends z.ZodTypeAny>(
  data: any,
  schema: Z,
): z.infer<Z> {
  // Validate the data against the provided schema
  const result = schema.safeParse(data);

  if (!result.success) {
    if (data?.resourceType === "OperationOutcome" && data.issue) {
      const issues = data.issue
        .map(
          (issue) => `${issue.severity}: ${issue.code}, ${issue.details?.text}`,
        )
        .join("; ");
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: `FHIR OperationOutcome Error: ${issues}`,
      });
    } else {
      // If not an OperationOutcome, throw a generic error
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "An error occurred while processing the request",
      });
    }
  }

  // Return the validated data with the correct type
  return result.data;
}

// Utility function to validate API response data
function validateApiResponse<Z extends z.ZodTypeAny>(
  data: any,
  schema: Z,
): z.infer<Z> {
  // Validate the response data against the provided Zod schema
  const validatedData = schema.parse(data);

  // Check for special case 'OperationOutcome'
  if (validatedData?.resourceType === "OperationOutcome") {
    const issues = validatedData.issue
      .map(
        (issue) => `${issue.severity}: ${issue.code}, ${issue.details?.text}`,
      )
      .join("; ");
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `FHIR OperationOutcome Error: ${issues}`,
    });
  }

  return validatedData;
}

export {
  handleCanvasApiResponse,
  handleOperationOutcomeError,
  validateApiResponse,
};
