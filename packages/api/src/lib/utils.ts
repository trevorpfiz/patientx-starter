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

// messages helper functions
async function fetchPersonDetails(api, reference) {
  if (!reference) return null;
  const [type, id] = reference.split("/");
  const response = await api.get(`/${type}/{id}`, { path: { id } });
  return response; // Assuming response has the structure { id, name }
}

const getAvatarUrl = () => {
  return `https://files.oaiusercontent.com/file-qn1PnhbqEv2cNvNw6N6LPAN0?se=2023-12-17T02%3A15%3A29Z&sp=r&sv=2021-08-06&sr=b&rscc=max-age%3D31536000%2C%20immutable&rscd=attachment%3B%20filename%3D76788262-6f59-4406-88cb-6f38c74327c9.webp&sig=hAOqj/xKCiKa%2BiJFNn53F5F3TUXScoEZtdxuc9tT7w8%3D`; // Placeholder
};

async function processSingleMessage(api, msg, isSender): Promise<IMessage> {
  const personData = await fetchPersonDetails(
    api,
    isSender
      ? msg.resource.sender?.reference
      : msg.resource.recipient[0]?.reference,
  );

  // Assuming the avatar URL logic is implemented in getAvatarUrl function
  const avatarUrl = getAvatarUrl();

  return {
    _id: msg.resource.id,
    text: msg.resource.payload[0]?.contentString,
    createdAt: new Date(msg.resource.sent),
    user: {
      _id: isSender ? 1 : 2, // Use actual IDs if available
      name: personData?.name[0]?.use ?? (isSender ? "Sender" : "Recipient"),
      avatar: avatarUrl,
    },
  };
}

export {
  handleCanvasApiResponse,
  handleOperationOutcomeError,
  validateApiResponse,
  processSingleMessage,
};
