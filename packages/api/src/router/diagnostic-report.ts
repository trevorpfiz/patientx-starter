import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { get_ReadDiagnosticreport } from "../canvas/canvas-client";
import { createTRPCRouter, protectedCanvasProcedure } from "../trpc";

export const diagnosticReportRouter = createTRPCRouter({
  getDiagnosticReport: protectedCanvasProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const { api } = ctx;
      const { id } = input;

      // get /DiagnosticReport/{id}
      const diagnosticreportData = await api.get(
        "/DiagnosticReport/{diagnostic_report_id}",
        {
          path: { diagnostic_report_id: id },
        },
      );

      // Validate response
      const validatedData =
        get_ReadDiagnosticreport.response.parse(diagnosticreportData);

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
