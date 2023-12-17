import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { get_ReadObservation } from "../canvas/canvas-client";
import { createTRPCRouter, protectedCanvasProcedure } from "../trpc";

export const observationRouter = createTRPCRouter({
  getObservation: protectedCanvasProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const { api } = ctx;
      const { id } = input;

      // get /Observation/{id}
      const observationData = await api.get("/Observation/{observation_id}", {
        path: { observation_id: id },
      });

      // Validate response
      const validatedData = get_ReadObservation.response.parse(observationData);

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
