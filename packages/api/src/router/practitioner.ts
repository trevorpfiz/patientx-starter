import { TRPCError } from "@trpc/server";

import {
  get_ReadPractitioner,
  get_SearchPractitioner,
} from "../canvas/canvas-client";
import { createTRPCRouter, protectedCanvasProcedure } from "../trpc";

export const practitionerRouter = createTRPCRouter({
  searchPractitioners: protectedCanvasProcedure
    .input(get_SearchPractitioner.parameters)
    .query(async ({ ctx, input }) => {
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
            name: input.query.name ?? "",
          },
        });

        return practitionerData;
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An error occurred while fetching practitioner data",
        });
      }
    }),

  getPractitioner: protectedCanvasProcedure
    .input(get_ReadPractitioner.parameters)
    .query(async ({ ctx, input }) => {
      const { api, canvasToken } = ctx;

      if (!canvasToken) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Canvas token is missing",
        });
      }

      try {
        const practitionerData = await api.get(
          "/Practitioner/{practitioner_a_id}",
          {
            path: {
              practitioner_a_id: input.path.practitioner_a_id,
            },
          },
        );
        return practitionerData;
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An error occurred while fetching practitioner data",
        });
      }
    }),
});
