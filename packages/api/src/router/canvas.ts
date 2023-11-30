import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  createApiClient,
  get_ReadPatient,
  get_SearchPatient,
} from "../canvas.client";
import { env } from "../env.mjs";
import { createTRPCRouter, protectedCanvasProcedure } from "../trpc";

export const canvasRouter = createTRPCRouter({
  getAllPatients: protectedCanvasProcedure.query(async ({ ctx }) => {
    const { canvasToken } = ctx;

    if (!canvasToken) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Canvas token is missing",
      });
    }

    const api = createApiClient(
      (method, url) =>
        fetch(url, {
          method,
          headers: { Authorization: `Bearer ${canvasToken}` },
        }).then((res) => res.json()),
      env.FUMAGE_BASE_URL,
    );

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
      const { canvasToken } = ctx;

      if (!canvasToken) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Canvas token is missing",
        });
      }

      const api = createApiClient(
        (method, url) =>
          fetch(url, {
            method,
            headers: { Authorization: `Bearer ${canvasToken}` },
          }).then((res) => res.json()),
        env.FUMAGE_BASE_URL,
      );

      try {
        const patientData = await api.get("/Patient/{patient_id}", {
          path: { patient_id: input.id },
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
});
