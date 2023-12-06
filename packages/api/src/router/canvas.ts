import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  get_ReadConsent,
  get_ReadPatient,
  get_SearchPatient,
  post_CreateAppointment,
  post_CreateConsent,
  post_CreateCoverage,
  post_CreatePatient,
} from "../canvas/canvas-client";
import { env } from "../env.mjs";
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
        const validatedData = get_ReadConsent.response.parse(consentData);
        return validatedData;
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

  // Coverage procedures
  submitCoverage: protectedCanvasProcedure
    .input(post_CreateCoverage.parameters)
    .mutation(async ({ ctx, input }) => {
      const { api, canvasToken } = ctx;
      const { query, body } = input;

      if (!canvasToken) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Canvas token is missing",
        });
      }

      try {
        const coverageData = await api.post("/Coverage", {
          query,
          body,
        });
        return coverageData;
      } catch (error) {
        // Handle any other errors
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An error occurred while fetching coverage data",
        });
      }
    }),

  // Medical history procedures
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

  // Appointment procedures
  getPatientCareTeam: protectedCanvasProcedure
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
        const careTeamData = await api.get("/CareTeam", {
          query: {
            patient: patientId,
          },
        });
        return careTeamData;
      } catch (error) {
        console.error(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            "An error occurred while fetching care team appointments data",
        });
      }
    }),
  getSchedules: protectedCanvasProcedure.query(async ({ ctx }) => {
    const { api, canvasToken } = ctx;

    if (!canvasToken) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Canvas token is missing",
      });
    }

    try {
      const scheduleData = await api.get("/Schedule");
      return scheduleData;
    } catch (error) {
      console.error(error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "An error occurred while fetching provider schedule data",
      });
    }
  }),
  getSlots: protectedCanvasProcedure
    .input(
      z.object({ scheduleId: z.string(), duration: z.string().optional() }),
    )
    .query(async ({ ctx, input }) => {
      const { api, canvasToken } = ctx;
      const { scheduleId, duration } = input;

      if (!canvasToken) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Canvas token is missing",
        });
      }

      try {
        const slotData = await api.get("/Slot", {
          query: {
            schedule: scheduleId,
            duration: duration ?? "20", // TODO - will set the duration of the appointment, but seems to affect the interval between slots returned?
          },
        });

        return slotData;
      } catch (error) {
        console.error(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An error occurred while fetching provider schedule data",
        });
      }
    }),
  createAppointment: protectedCanvasProcedure
    .input(post_CreateAppointment.parameters)
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
        const appointmentData = await api.post("/Appointment", {
          body,
        });
        return appointmentData;
      } catch (error) {
        // Handle any other errors
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An error occurred while fetching appointment data",
        });
      }
    }),

  // Message procedures

  // Payment procedures
});
