import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { get_ReadConsent, post_CreateConsent } from "../canvas/canvas-client";
import { createTRPCRouter, protectedCanvasProcedure } from "../trpc";

export const consentRouter = createTRPCRouter({
  getConsent: protectedCanvasProcedure
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
        const consentData = await api.get("/Consent/{consent_id}", {
          path: { consent_id: id },
        });
        const validatedData = get_ReadConsent.response.parse(consentData);
        return validatedData;
      } catch (error) {
        // Handle any other errors
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An error occurred while fetching consent data",
        });
      }
    }),
  submitConsent: protectedCanvasProcedure
    .input(post_CreateConsent.parameters)
    .mutation(async ({ ctx, input }) => {
      const { api, canvasToken } = ctx;
      const { body } = input;

      if (!canvasToken) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Canvas token is missing",
        });
      }

      try {
        const consentData = await api.post("/Consent", {
          body,
        });
        return consentData;
      } catch (error) {
        // Handle any other errors
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An error occurred while fetching consent data",
        });
      }
    }),
});
