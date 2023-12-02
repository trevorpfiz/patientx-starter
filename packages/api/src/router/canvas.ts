import { TRPCClientError } from "@trpc/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  get_ReadPatient,
  get_SearchPatient,
  post_CreatePatient,
} from "../canvas/canvas-client";
import { env } from "../env.mjs";
import { createTRPCRouter, protectedCanvasProcedure } from "../trpc";

export const canvasRouter = createTRPCRouter({
  getAllPatients: protectedCanvasProcedure.query(async ({ ctx }) => {
    const { api, canvasToken } = ctx;

    if (!canvasToken) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Canvas token is missing",
      });
    }

    try {
      const patientsData = await api.get("/Patient", { query: {} });
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
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const { api, canvasToken } = ctx;

      if (!canvasToken) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Canvas token is missing",
        });
      }

      try {
        // const patientData = await api.get("/Patient/{patient_id}", {
        //   path: { patient_id: input.id },
        // });
        // console.log("Data", patientData);
        // const validatedData = get_ReadPatient.response.parse(patientData);
        // return validatedData;
        const patientData = await fetch(
          `${env.FUMAGE_BASE_URL}/Patient/${input.id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${canvasToken}`,
              Accept: "application/json",
            },
          },
        );
        const validateData =
          (await patientData.json()) as (typeof get_ReadPatient)["response"]["shape"];

        const parsedData = get_ReadPatient.response.parse(validateData);
        if (parsedData.resourceType === "OperationOutcome") {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Patient not found",
          });
        }
        return parsedData;
      } catch (error) {
        // Handle any other errors
        throw new TRPCClientError("INTERNAL_SERVER_ERROR", {
          cause: error as Error,
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
