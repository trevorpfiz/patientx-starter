import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { env } from "../env.mjs";
import { createTRPCRouter, protectedCanvasProcedure } from "../trpc";
import { patientSchema } from "../validators";

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
      const response = await fetch(`${env.FUMAGE_BASE_URL}/Patient`, {
        headers: { Authorization: `Bearer ${canvasToken}` },
      });

      if (!response.ok) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to fetch patients: ${response.statusText}`,
        });
      }

      const patientsData = await response.json();
      return patientsData;

      // Validate the response data with Zod
      //   const validatedPatients = z.array(patientSchema).parse(patientsData);
      //   return validatedPatients;
    } catch (error) {
      // Handle any other errors
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
        const response = await fetch(
          `${env.FUMAGE_BASE_URL}/Patient/${input.id}`,
          {
            headers: { Authorization: `Bearer ${canvasToken}` },
          },
        );

        if (!response.ok) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: `Failed to fetch patient: ${response.statusText}`,
          });
        }

        const patientData = await response.json();
        console.log(patientData);
        // Validate the response data with Zod
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
