import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { makeCanvasRequest } from "../canvasApi";
import { createTRPCRouter, protectedCanvasProcedure } from "../trpc";
import { allPatientsSchema, patientSchema } from "../validators";

export const canvasRouter = createTRPCRouter({
  getAllPatients: protectedCanvasProcedure.query(async ({ ctx }) => {
    const { canvasToken } = ctx;

    if (!canvasToken) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Canvas token is missing",
      });
    }

    try {
      const patientsData = await makeCanvasRequest("/Patient");
      const validatedPatients = allPatientsSchema
        .deepPartial()
        .parse(patientsData);
      return validatedPatients;
    } catch (error) {
      console.error(error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "An error occurred while fetching patients data",
      });
    }
  }),
  getPatient: protectedCanvasProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const { canvasToken } = ctx;

      if (!canvasToken) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Canvas token is missing",
        });
      }

      try {
        const patientData = await makeCanvasRequest(`/Patient/${input.id}`);
        const validatedPatient = patientSchema.parse(patientData);
        return validatedPatient;
      } catch (error) {
        // Handle any other errors
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An error occurred while fetching patient data",
        });
      }
    }),
});
