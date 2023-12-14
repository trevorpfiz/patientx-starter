import { TRPCError } from "@trpc/server";

import {
  get_SearchMedication,
  post_CreateMedicationstatement,
} from "../canvas/canvas-client";
import { createTRPCRouter, protectedCanvasProcedure } from "../trpc";

export const medicationRouter = createTRPCRouter({
  submitMedicationStatement: protectedCanvasProcedure
    .input(post_CreateMedicationstatement.parameters)
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
        const medicationStatementData = await api.post("/MedicationStatement", {
          body,
        });
        return medicationStatementData;
      } catch (error) {
        // Handle any other errors
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An error occurred while fetching allergy/intolerance data",
        });
      }
    }),
  searchMedications: protectedCanvasProcedure
    .input(get_SearchMedication.parameters)
    .query(async ({ ctx, input }) => {
      const { api, canvasToken } = ctx;
      const { query } = input;

      if (!canvasToken) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Canvas token is missing",
        });
      }

      try {
        const medicationData = await api.get("/Medication", {
          query,
        });
        const validatedData =
          get_SearchMedication.response.parse(medicationData);
        return validatedData;
      } catch (error) {
        // Handle any other errors
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An error occurred while fetching medication data",
        });
      }
    }),
});
