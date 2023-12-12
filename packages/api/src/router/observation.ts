import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { get_ReadObservation } from "../canvas/canvas-client";
import { createTRPCRouter, protectedCanvasProcedure } from "../trpc";

export const observationRouter = createTRPCRouter({
  getObservation: protectedCanvasProcedure
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
        const observationData = await api.get("/Observation/{observation_id}", {
          path: { observation_id: id },
        });
        const validatedData =
          get_ReadObservation.response.parse(observationData);
        return validatedData;
      } catch (error) {
        // Handle any other errors
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An error occurred while fetching observation data",
        });
      }
    }),
});
