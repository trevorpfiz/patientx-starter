import { TRPCError } from "@trpc/server";

import {
  get_ReadPatient,
  get_SearchPatient,
  post_CreatePatient,
} from "../canvas/canvas-client";
import { createTRPCRouter, protectedCanvasProcedure } from "../trpc";

export const patientRouter = createTRPCRouter({
  searchPatients: protectedCanvasProcedure
    .input(get_SearchPatient.parameters)
    .query(async ({ ctx, input }) => {
      const { api } = ctx;
      const { query } = input;

      // search /Patient
      const patientsData = await api.get("/Patient", { query });

      // Validate response
      const validatedData = get_SearchPatient.response.parse(patientsData);

      // Check if response is OperationOutcome
      if (validatedData?.resourceType === "OperationOutcome") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `${JSON.stringify(validatedData)}`,
        });
      }

      return validatedData;
    }),
  getPatient: protectedCanvasProcedure
    .input(get_ReadPatient.parameters)
    .query(async ({ ctx, input }) => {
      const { api } = ctx;
      const { path } = input;

      // get /Patient{id}
      const patientData = await api.get("/Patient/{patient_id}", {
        path: { patient_id: path.patient_id },
      });

      // Validate response
      const validatedData = get_ReadPatient.response.parse(patientData);

      // Check if response is OperationOutcome
      if (validatedData?.resourceType === "OperationOutcome") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `${JSON.stringify(validatedData)}`,
        });
      }

      return validatedData;
    }),
  createPatient: protectedCanvasProcedure
    .input(post_CreatePatient.parameters)
    .mutation(async ({ ctx, input }) => {
      const { api } = ctx;
      const { body } = input;

      // create /Patient
      const response = await api.post("/Patient", {
        body,
      });
      console.log(response, "response");
      // Extract the Location header
      const locationHeader = response.headers.Location;

      console.log(locationHeader, "locationHeader");

      // Check if Location header is present
      if (!locationHeader) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Location header missing in response",
        });
      }

      // Extract the patient ID from the Location header
      const patientId = locationHeader.split("/").pop();

      // Validate response body
      const validatedData = post_CreatePatient.response.parse(response);

      // Check if response is OperationOutcome
      if (validatedData?.resourceType === "OperationOutcome") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `FHIR OperationOutcome Error: ${validatedData.issue
            .map(
              (issue) =>
                `${issue.severity}: ${issue.code}, ${issue.details?.text}`,
            )
            .join("; ")}`,
        });
      }

      // Return the patient ID
      return patientId;
    }),
  createPatientAndGetId: protectedCanvasProcedure
    .input(post_CreatePatient.parameters)
    .mutation(async ({ ctx, input }) => {
      const { api } = ctx;
      const { body } = input;

      // create /Patient
      const createdPatientData = await api.post("/Patient", {
        body,
      });

      // Validate response
      const validatedPatientData =
        post_CreatePatient.response.parse(createdPatientData);

      // Check if response is OperationOutcome
      if (validatedPatientData?.resourceType === "OperationOutcome") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `FHIR OperationOutcome Error: ${validatedPatientData.issue
            .map(
              (issue) =>
                `${issue.severity}: ${issue.code}, ${issue.details?.text}`,
            )
            .join("; ")}`,
        });
      }

      // search /Patient based on identifier
      const patientData = await api.get("/Patient", {
        query: {
          identifier: body?.identifier?.[0]?.value,
        },
      });

      // Validate response
      const validatedData = get_SearchPatient.response.parse(patientData);

      // TODO - if want to use more detailed error message, then need to change canvas-client.ts response
      // Check if response is OperationOutcome
      if (validatedData?.resourceType === "OperationOutcome") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `${JSON.stringify(validatedData)}`,
        });
      }

      return validatedData;
    }),
});
