import { TRPCError } from "@trpc/server";

import {
  get_ReadPatient,
  get_SearchPatient,
  post_CreatePatient,
} from "../canvas/canvas-client";
import { createTRPCRouter, protectedCanvasProcedure } from "../trpc";

export const patientRouter = createTRPCRouter({
  // Patient procedures
  getAllPatients: protectedCanvasProcedure
    .input(get_SearchPatient.parameters)
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
        const patientsData = await api.get("/Patient", { query });
        const validatedData = get_SearchPatient.response.parse(patientsData);
        return validatedData;
      } catch (error) {
        console.error(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An error occurred while fetching patients data",
        });
      }
    }),
  getPatient: protectedCanvasProcedure
    .input(get_ReadPatient.parameters)
    .query(async ({ ctx, input }) => {
      const { api, canvasToken } = ctx;
      const { path } = input;

      if (!canvasToken) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Canvas token is missing",
        });
      }

      try {
        const patientData = await api.get("/Patient/{patient_id}", {
          path: { patient_id: path.patient_id },
        });
        const validatedData = get_ReadPatient.response.parse(patientData);
        if (validatedData.resourceType === "OperationOutcome") {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Patient not found",
          });
        }
        return validatedData;
      } catch (error) {
        // Handle any other errors
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An error occurred while fetching patient data",
        });
      }
    }),
  createPatient: protectedCanvasProcedure
    .input(post_CreatePatient.parameters)
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
        return await api.post("/Patient", {
          body,
        });
      } catch (error) {
        // Handle any other errors
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An error occurred while fetching patient data",
        });
      }
    }),
});
