import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  get_ReadPatient,
  get_SearchPatient,
  post_CreateConsent,
  post_CreatePatient,
} from "../canvas/canvas-client";
import { createTRPCRouter, protectedCanvasProcedure } from "../trpc";
import { questionnaireResponseBodySchema } from "../validators";

export const canvasRouter = createTRPCRouter({
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

  // Questionnaire procedures
  getQuestionnaire: protectedCanvasProcedure
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
        const questionnaireData = await api.get(
          "/Questionnaire/{questionnaire_id}",
          {
            path: { questionnaire_id: id },
          },
        );
        return questionnaireData;
      } catch (error) {
        // Handle any other errors
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An error occurred while fetching questionnaire data",
        });
      }
    }),
  submitQuestionnaireResponse: protectedCanvasProcedure
    .input(z.object({ body: questionnaireResponseBodySchema }))
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
        const questionnaireResponseData = await api.post(
          "/QuestionnaireResponse",
          {
            body, // TODO - will have to update types to include valueString
          },
        );
        console.log(questionnaireResponseData, "questionnaireResponseData");
        return questionnaireResponseData;
      } catch (error) {
        // Handle any other errors
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An error occurred while fetching questionnaire data",
        });
      }
    }),

  // Consent procedures
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
        return consentData;
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
