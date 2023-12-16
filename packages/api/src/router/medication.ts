import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  get_SearchMedication,
  post_CreateMedicationstatement,
} from "../canvas/canvas-client";
import { createTRPCRouter, protectedCanvasProcedure } from "../trpc";
import { postOrPutResponseSchema } from "../validators/operation-outcome";

export const medicationRouter = createTRPCRouter({
  submitMedicationStatement: protectedCanvasProcedure
    .input(post_CreateMedicationstatement.parameters)
    .mutation(async ({ ctx, input }) => {
      const { api } = ctx;
      const { body } = input;

      const medicationStatementData = await api.post("/MedicationStatement", {
        body,
      });
      // Validate response
      const validatedData = postOrPutResponseSchema.parse(
        medicationStatementData,
      );

      // Check if response is OperationOutcome
      if (validatedData?.resourceType === "OperationOutcome") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `${JSON.stringify(validatedData)}`,
        });
      }

      return validatedData;
    }),
  searchMedications: protectedCanvasProcedure
    .input(get_SearchMedication.parameters)
    .query(async ({ ctx, input }) => {
      const { api } = ctx;
      const { query } = input;

      const medicationData = await api.get("/Medication", {
        query,
      });
      // console.log(medicationData);

      // Validate response
      const validatedData = get_SearchMedication.response.parse(medicationData);

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
