import { TRPCError } from "@trpc/server";

import { createTRPCRouter, protectedCanvasProcedure } from "../trpc";
import { get_SearchPractitioner } from "../canvas/canvas-client";

export const practitionerRouter = createTRPCRouter({
  searchPractitioner: protectedCanvasProcedure.input(get_SearchPractitioner.parameters).query(async ({ ctx, input }) => {
    const { api, canvasToken } = ctx;
    if (!canvasToken) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Canvas token is missing",
      });
    }
    try {
      const practitionerData = await api.get("/Practitioner", {
        query: {
          name: input.query.name,
        },
      });

      if (practitionerData.resourceType === "OperationOutcome") {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Practitioner not found",
        });
      }
      return practitionerData;
    } catch (e) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "An error occurred while fetching practitioner data",
      })
    }
  }),
})
