import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, protectedCanvasProcedure } from "../trpc";

export const patientMedicalHistoryRouter = createTRPCRouter({
  getPatientAllergies: protectedCanvasProcedure
    .input(z.object({ patientId: z.string() }))
    .query(async ({ ctx, input }) => {
      const { api, canvasToken } = ctx;
      const { patientId } = input;

      if (!canvasToken) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Canvas token is missing",
        });
      }

      try {
        const allergiesData = await api.get("/AllergyIntolerance", {
          query: {
            patient: patientId,
          },
        });
        return allergiesData;
      } catch (error) {
        console.error(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An error occurred while fetching allergies data",
        });
      }
    }),
  getPatientAppointments: protectedCanvasProcedure
    .input(z.object({ patientId: z.string() }))
    .query(async ({ ctx, input }) => {
      const { api, canvasToken } = ctx;
      const { patientId } = input;

      if (!canvasToken) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Canvas token is missing",
        });
      }

      try {
        const appointmentsData = await api.get("/Appointment", {
          query: {
            patient: patientId,
          },
        });
        return appointmentsData;
      } catch (error) {
        console.error(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An error occurred while fetching appointments data",
        });
      }
    }),
  getPatientConditions: protectedCanvasProcedure
    .input(z.object({ patientId: z.string() }))
    .query(async ({ ctx, input }) => {
      const { api, canvasToken } = ctx;
      const { patientId } = input;

      if (!canvasToken) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Canvas token is missing",
        });
      }

      try {
        const conditionsData = await api.get("/Condition", {
          query: {
            patient: patientId,
          },
        });
        return conditionsData;
      } catch (error) {
        console.error(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An error occurred while fetching conditions data",
        });
      }
    }),
  getPatientConsents: protectedCanvasProcedure
    .input(z.object({ patientId: z.string() }))
    .query(async ({ ctx, input }) => {
      const { api, canvasToken } = ctx;
      const { patientId } = input;

      if (!canvasToken) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Canvas token is missing",
        });
      }

      try {
        const consentsData = await api.get("/Consent", {
          query: {
            patient: patientId,
          },
        });
        return consentsData;
      } catch (error) {
        console.error(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An error occurred while fetching consents data",
        });
      }
    }),
  getPatientGoals: protectedCanvasProcedure
    .input(z.object({ patientId: z.string() }))
    .query(async ({ ctx, input }) => {
      const { api, canvasToken } = ctx;
      const { patientId } = input;

      if (!canvasToken) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Canvas token is missing",
        });
      }

      try {
        const goalsData = await api.get("/Goal", {
          query: {
            patient: patientId,
          },
        });
        return goalsData;
      } catch (error) {
        console.error(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An error occurred while fetching goals data",
        });
      }
    }),
  getPatientQuestionnaireResponses: protectedCanvasProcedure
    .input(z.object({ patientId: z.string() }))
    .query(async ({ ctx, input }) => {
      const { api, canvasToken } = ctx;
      const { patientId } = input;

      if (!canvasToken) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Canvas token is missing",
        });
      }

      try {
        const questionnaireResponsesData = await api.get(
          "/QuestionnaireResponse",
          {
            query: {
              patient: patientId,
            },
            body: {}, // TODO - remove
          },
        );
        return questionnaireResponsesData;
      } catch (error) {
        console.error(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An error occurred while fetching questionnaires data",
        });
      }
    }),
  getPatientImmunizations: protectedCanvasProcedure
    .input(z.object({ patientId: z.string() }))
    .query(async ({ ctx, input }) => {
      const { api, canvasToken } = ctx;
      const { patientId } = input;

      if (!canvasToken) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Canvas token is missing",
        });
      }

      try {
        const immunizationsData = await api.get("/Immunization", {
          query: {
            patient: patientId,
          },
        });
        return immunizationsData;
      } catch (error) {
        console.error(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An error occurred while fetching immunizations data",
        });
      }
    }),
  getPatientMedications: protectedCanvasProcedure
    .input(z.object({ patientId: z.string() }))
    .query(async ({ ctx, input }) => {
      const { api, canvasToken } = ctx;
      const { patientId } = input;

      if (!canvasToken) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Canvas token is missing",
        });
      }

      try {
        const medicationsData = await api.get("/MedicationRequest", {
          query: {
            patient: patientId,
          },
        });
        return medicationsData;
      } catch (error) {
        console.error(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An error occurred while fetching medications data",
        });
      }
    }),
  getPatientDiagnosticReports: protectedCanvasProcedure
    .input(z.object({ patientId: z.string() }))
    .query(async ({ ctx, input }) => {
      const { api, canvasToken } = ctx;
      const { patientId } = input;

      if (!canvasToken) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Canvas token is missing",
        });
      }

      try {
        const diagnosticReportsData = await api.get("/DiagnosticReport", {
          query: {
            patient: patientId,
          },
        });
        return diagnosticReportsData;
      } catch (error) {
        console.error(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An error occurred while fetching diagnostic reports data",
        });
      }
    }),
  getPatientDocuments: protectedCanvasProcedure
    .input(z.object({ patientId: z.string() }))
    .query(async ({ ctx, input }) => {
      const { api, canvasToken } = ctx;
      const { patientId } = input;

      if (!canvasToken) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Canvas token is missing",
        });
      }

      try {
        const documentsData = await api.get("/DocumentReference", {
          query: {
            patient: patientId, // TODO - add patient to query parameters
          },
        });
        return documentsData;
      } catch (error) {
        console.error(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An error occurred while fetching documents data",
        });
      }
    }),
  getPatientObservations: protectedCanvasProcedure
    .input(z.object({ patientId: z.string() }))
    .query(async ({ ctx, input }) => {
      const { api, canvasToken } = ctx;
      const { patientId } = input;

      if (!canvasToken) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Canvas token is missing",
        });
      }

      try {
        const observationsData = await api.get("/Observation", {
          query: {
            patient: patientId,
          },
        });
        return observationsData;
      } catch (error) {
        console.error(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An error occurred while fetching observations data",
        });
      }
    }),
});
