import { TRPCError } from "@trpc/server";
import type { z } from "zod";

import type {
  OperationOutcome,
  OperationOutcomeIssue,
} from "@acme/shared/src/validators/operation-outcome";

function handleCanvasApiResponse<T extends z.ZodTypeAny>(
  responseSchema: T,
  data: OperationOutcome | z.infer<T>,
): z.infer<T> {
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

export { handleCanvasApiResponse };

// TODO: Utility function for response validation and error handling. Can refactor more.
