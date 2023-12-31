import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  get_SearchAllergyintolerance,
  get_SearchCondition,
  get_SearchConsent,
  get_SearchDiagnosticreport,
  get_SearchDocumentreference,
  get_SearchGoal,
  get_SearchImmunization,
  get_SearchMedicationstatement,
  get_SearchObservation,
  get_UpdateQuestionnaireresponse,
} from "../canvas/canvas-client";
import { createTRPCRouter, protectedCanvasProcedure } from "../trpc";

export const patientMedicalHistoryRouter = createTRPCRouter({
  getPatientAllergies: protectedCanvasProcedure
    .input(z.object({ patientId: z.string() }))
    .query(async ({ ctx, input }) => {
      const { api } = ctx;
      const { patientId } = input;

      // search /AllergyIntolerance for a patient's allergies
      const allergiesData = await api.get("/AllergyIntolerance", {
        query: {
          patient: patientId,
        },
      });

      // Validate response
      const validatedData =
        get_SearchAllergyintolerance.response.parse(allergiesData);

      // Check if response is OperationOutcome
      if (validatedData?.resourceType === "OperationOutcome") {
        const issues = validatedData.issue
          .map(
            (issue) =>
              `${issue.severity}: ${issue.code}, ${issue.details?.text}`,
          )
          .join("; ");
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `FHIR OperationOutcome Error: ${issues}`,
        });
      }

      return validatedData;
    }),
  getPatientConditions: protectedCanvasProcedure
    .input(z.object({ patientId: z.string() }))
    .query(async ({ ctx, input }) => {
      const { api } = ctx;
      const { patientId } = input;

      // search /Condition for a patient's conditions
      const conditionsData = await api.get("/Condition", {
        query: {
          patient: patientId,
        },
      });

      // Validate response
      const validatedData = get_SearchCondition.response.parse(conditionsData);

      // Check if response is OperationOutcome
      if (validatedData?.resourceType === "OperationOutcome") {
        const issues = validatedData.issue
          .map(
            (issue) =>
              `${issue.severity}: ${issue.code}, ${issue.details?.text}`,
          )
          .join("; ");
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `FHIR OperationOutcome Error: ${issues}`,
        });
      }

      return validatedData;
    }),
  getPatientConsents: protectedCanvasProcedure
    .input(z.object({ patientId: z.string() }))
    .query(async ({ ctx, input }) => {
      const { api } = ctx;
      const { patientId } = input;

      // search /Consent for a patient's consents
      const consentsData = await api.get("/Consent", {
        query: {
          patient: patientId,
        },
      });

      // Validate response
      const validatedData = get_SearchConsent.response.parse(consentsData);

      // Check if response is OperationOutcome
      if (validatedData?.resourceType === "OperationOutcome") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `${JSON.stringify(validatedData)}`,
        });
      }

      return validatedData;
    }),
  getPatientGoals: protectedCanvasProcedure
    .input(z.object({ patientId: z.string() }))
    .query(async ({ ctx, input }) => {
      const { api } = ctx;
      const { patientId } = input;

      // search /Goal for a patient's goals
      const goalsData = await api.get("/Goal", {
        query: {
          patient: patientId,
        },
      });

      // Validate response
      const validatedData = get_SearchGoal.response.parse(goalsData);

      // Check if response is OperationOutcome
      if (validatedData?.resourceType === "OperationOutcome") {
        const issues = validatedData.issue
          .map(
            (issue) =>
              `${issue.severity}: ${issue.code}, ${issue.details?.text}`,
          )
          .join("; ");
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `FHIR OperationOutcome Error: ${issues}`,
        });
      }

      return validatedData;
    }),
  getPatientQuestionnaireResponses: protectedCanvasProcedure
    .input(z.object({ patientId: z.string() }))
    .query(async ({ ctx, input }) => {
      const { api } = ctx;
      const { patientId } = input;

      // search /QuestionnaireResponse for a patient's questionnaire responses
      const questionnaireResponsesData = await api.get(
        "/QuestionnaireResponse",
        {
          query: {
            patient: patientId,
          },
          body: {}, // TODO - remove
        },
      );

      // Validate response
      const validatedData = get_UpdateQuestionnaireresponse.response.parse(
        questionnaireResponsesData,
      );

      // Check if response is OperationOutcome
      if (validatedData?.resourceType === "OperationOutcome") {
        const issues = validatedData.issue
          .map(
            (issue) =>
              `${issue.severity}: ${issue.code}, ${issue.details?.text}`,
          )
          .join("; ");
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `FHIR OperationOutcome Error: ${issues}`,
        });
      }

      return validatedData;
    }),
  getPatientImmunizations: protectedCanvasProcedure
    .input(z.object({ patientId: z.string() }))
    .query(async ({ ctx, input }) => {
      const { api } = ctx;
      const { patientId } = input;

      // search /Immunization for a patient's immunizations
      const immunizationsData = await api.get("/Immunization", {
        query: {
          patient: patientId,
        },
      });

      // Validate response
      const validatedData =
        get_SearchImmunization.response.parse(immunizationsData);

      // Check if response is OperationOutcome
      if (validatedData?.resourceType === "OperationOutcome") {
        const issues = validatedData.issue
          .map(
            (issue) =>
              `${issue.severity}: ${issue.code}, ${issue.details?.text}`,
          )
          .join("; ");
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `FHIR OperationOutcome Error: ${issues}`,
        });
      }

      return validatedData;
    }),
  getPatientMedications: protectedCanvasProcedure
    .input(z.object({ patientId: z.string() }))
    .query(async ({ ctx, input }) => {
      const { api } = ctx;
      const { patientId } = input;

      // search /MedicationStatement for a patient's medications
      const medicationsData = await api.get("/MedicationStatement", {
        query: {
          patient: patientId,
        },
      });

      // Validate response
      const validatedData =
        get_SearchMedicationstatement.response.parse(medicationsData);

      // Check if response is OperationOutcome
      if (validatedData?.resourceType === "OperationOutcome") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `${JSON.stringify(validatedData)}`,
        });
      }

      return validatedData;
    }),
  getPatientDiagnosticReports: protectedCanvasProcedure
    .input(z.object({ patientId: z.string() }))
    .query(async ({ ctx, input }) => {
      const { api } = ctx;
      const { patientId } = input;

      // search /DiagnosticReport for a patient's diagnostic reports
      const diagnosticReportsData = await api.get("/DiagnosticReport", {
        query: {
          patient: patientId,
        },
      });

      // Validate response
      const validatedData = get_SearchDiagnosticreport.response.parse(
        diagnosticReportsData,
      );

      // Check if response is OperationOutcome
      if (validatedData?.resourceType === "OperationOutcome") {
        const issues = validatedData.issue
          .map(
            (issue) =>
              `${issue.severity}: ${issue.code}, ${issue.details?.text}`,
          )
          .join("; ");
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `FHIR OperationOutcome Error: ${issues}`,
        });
      }

      return validatedData;
    }),
  getPatientDocuments: protectedCanvasProcedure
    .input(z.object({ patientId: z.string() }))
    .query(async ({ ctx, input }) => {
      const { api } = ctx;
      const { patientId } = input;

      // search /DocumentReference for a patient's documents
      const documentsData = await api.get("/DocumentReference", {
        query: {
          patient: patientId,
          // type: "http://loinc.org|11502-2", // FIXME - not working for documents other than lab reports and bills?
        },
      });

      // Validate response
      const validatedData =
        get_SearchDocumentreference.response.parse(documentsData);

      // Check if response is OperationOutcome
      if (validatedData?.resourceType === "OperationOutcome") {
        const issues = validatedData.issue
          .map(
            (issue) =>
              `${issue.severity}: ${issue.code}, ${issue.details?.text}`,
          )
          .join("; ");
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `FHIR OperationOutcome Error: ${issues}`,
        });
      }

      return validatedData;
    }),
  getPatientObservations: protectedCanvasProcedure
    .input(z.object({ patientId: z.string() }))
    .query(async ({ ctx, input }) => {
      const { api } = ctx;
      const { patientId } = input;

      // search /Observation for a patient's observations
      const observationsData = await api.get("/Observation", {
        query: {
          patient: patientId,
          category: "vital-signs",
        },
      });

      // Validate response
      const validatedData =
        get_SearchObservation.response.parse(observationsData);

      // Check if response is OperationOutcome
      if (validatedData?.resourceType === "OperationOutcome") {
        const issues = validatedData.issue
          .map(
            (issue) =>
              `${issue.severity}: ${issue.code}, ${issue.details?.text}`,
          )
          .join("; ");
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `FHIR OperationOutcome Error: ${issues}`,
        });
      }

      return validatedData;
    }),
});
