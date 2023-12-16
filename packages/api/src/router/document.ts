import { TRPCError } from "@trpc/server";

import {
  get_ReadDocumentreference,
  get_SearchDocumentreference,
} from "../canvas/canvas-client";
import { createTRPCRouter, protectedCanvasProcedure } from "../trpc";

export const documentRouter = createTRPCRouter({
  getDocument: protectedCanvasProcedure
    .input(get_ReadDocumentreference.parameters)
    .query(async ({ ctx, input }) => {
      const { api } = ctx;

      // get /DocumentReference/{id}
      const documentReferenceData = await api.get(
        "/DocumentReference/{document_reference_id}",
        {
          path: {
            document_reference_id: input.path.document_reference_id,
          },
        },
      );

      // Validate response
      const validatedData = get_ReadDocumentreference.response.parse(
        documentReferenceData,
      );

      // Check if response is OperationOutcome
      if (validatedData?.resourceType === "OperationOutcome") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `${JSON.stringify(validatedData)}`,
        });
      }

      return validatedData;
    }),
  searchBillDocument: protectedCanvasProcedure
    .input(get_SearchDocumentreference.parameters)
    .query(async ({ ctx, input }) => {
      const { api } = ctx;

      // search /DocumentReference

      // @link: https://postman.com/canvasmedical/workspace/canvas-medical-public-documentation/request/17030070-e85e9dc7-3dd7-4a4f-a648-f21d291c4b59
      const documentsData = await api.get("/DocumentReference", {
        query: {
          status: "current",
          type: "http://loinc.org|94093-2",
          subject: input.query.subject,
          category: "invoicefull",
        },
      });

      // Validate response
      const validatedData =
        get_SearchDocumentreference.response.parse(documentsData);

      // Check if response is OperationOutcome
      if (validatedData?.resourceType === "OperationOutcome") {
        const issues = validatedData.issue
          .map(
            (issue) =>
              `${issue.severity}: ${issue.code}, ${issue.details?.text}`,
          )
          .join("; ");
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `FHIR OperationOutcome Error: ${issues}`,
        });
      }

      return validatedData;
    }),
});
