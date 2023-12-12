import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { get_ReadDiagnosticreport } from "../canvas/canvas-client";
import { createTRPCRouter, protectedCanvasProcedure } from "../trpc";

export const diagnosticReportRouter = createTRPCRouter({
  getDiagnosticReport: protectedCanvasProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const { api, canvasToken } = ctx;
      const { id } = input;

      if (!canvasToken) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Canvas token is missing",
        });
      }

      try {
        const diagnosticreportData = await api.get(
          "/DiagnosticReport/{diagnostic_report_id}",
          {
            path: { diagnostic_report_id: id },
          },
        );
        const validatedData =
          get_ReadDiagnosticreport.response.parse(diagnosticreportData);
        return validatedData;
      } catch (error) {
        // Handle any other errors
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An error occurred while fetching diagnosticreport data",
        });
      }
    }),
});
