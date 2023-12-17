import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { get_ReadConsent, post_CreateConsent } from "../canvas/canvas-client";
import { createTRPCRouter, protectedCanvasProcedure } from "../trpc";

export const consentRouter = createTRPCRouter({
  getConsent: protectedCanvasProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const { api } = ctx;
      const { id } = input;

      // get /Consent/{id}
      const consentData = await api.get("/Consent/{consent_id}", {
        path: { consent_id: id },
      });

      // Validate response
      const validatedData = get_ReadConsent.response.parse(consentData);

      // Check if response is OperationOutcome
      if (validatedData?.resourceType === "OperationOutcome") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `${JSON.stringify(validatedData)}`,
        });
      }

      return validatedData;
    }),
  submitConsent: protectedCanvasProcedure
    .input(post_CreateConsent.parameters)
    .mutation(async ({ ctx, input }) => {
      const { api } = ctx;
      const { body } = input;

      // create /Consent
      const consentData = await api.post("/Consent", {
        body,
      });

      // Validate response
      const validatedData = post_CreateConsent.response.parse(consentData);

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
