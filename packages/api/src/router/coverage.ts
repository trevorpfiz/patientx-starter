import { TRPCError } from "@trpc/server";

import { post_CreateCoverage } from "../canvas/canvas-client";
import { createTRPCRouter, protectedCanvasProcedure } from "../trpc";

export const coverageRouter = createTRPCRouter({
  submitCoverage: protectedCanvasProcedure
    .input(post_CreateCoverage.parameters)
    .mutation(async ({ ctx, input }) => {
      const { api } = ctx;
      const { query, body } = input;

      // create /Coverage
      const coverageData = await api.post("/Coverage", {
        query,
        body,
      });

      // Validate response
      const validatedData = post_CreateCoverage.response.parse(coverageData);

      // Check if response is OperationOutcome
      if (validatedData?.resourceType === "OperationOutcome") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `${JSON.stringify(validatedData)}`,
        });
      }

      return validatedData;
    }),
});
