import { TRPCError } from "@trpc/server";

import {
  get_ReadPatient,
  get_SearchPatient,
  post_CreatePatient,
} from "../canvas/canvas-client";
import { createTRPCRouter, protectedCanvasProcedure } from "../trpc";
import { newPatientSchema } from "../validators/forms";

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
  submitIntakeForm: protectedCanvasProcedure
    .input(newPatientSchema)
    .mutation(async ({ ctx, input }) => {
      const { api, canvasToken } = ctx;
      const { name, address, phoneNumber } = input;

      if (!canvasToken) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Canvas token is missing",
        });
      }

      try {
        return await api.post("/Patient", {
          body: {
            name: [
              {
                use: "official",
                family: name.split(" ")[1],
                given: [name.split(" ")[0]],
              },
            ],
            address: [
              {
                use: "home",
                line: [address],
              },
            ],
            telecom: [
              {
                system: "phone",
                value: phoneNumber,
              },
            ],
          },
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
