import { TRPCError } from "@trpc/server";

import { post_CreateCoverage } from "../canvas/canvas-client";
import { createTRPCRouter, protectedCanvasProcedure } from "../trpc";

export const coverageRouter = createTRPCRouter({
  submitCoverage: protectedCanvasProcedure
    .input(post_CreateCoverage.parameters)
    .mutation(async ({ ctx, input }) => {
      const { api, canvasToken } = ctx;
      const { query, body } = input;

      if (!canvasToken) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Canvas token is missing",
        });
      }

      try {
        const coverageData = await api.post("/Coverage", {
          query,
          body,
        });
        return coverageData;
      } catch (error) {
        // Handle any other errors
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An error occurred while fetching coverage data",
        });
      }
    }),
});
