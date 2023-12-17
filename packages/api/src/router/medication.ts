import { TRPCError } from "@trpc/server";

import {
  get_ReadMedication,
  get_SearchMedication,
  post_CreateMedicationstatement,
} from "../canvas/canvas-client";
import { createTRPCRouter, protectedCanvasProcedure } from "../trpc";

export const medicationRouter = createTRPCRouter({
  // MedicationStatement
  submitMedicationStatement: protectedCanvasProcedure
    .input(post_CreateMedicationstatement.parameters)
    .mutation(async ({ ctx, input }) => {
      const { api } = ctx;
      const { body } = input;

      // create /MedicationStatement
      const medicationStatementData = await api.post("/MedicationStatement", {
        body,
      });

      // Validate response
      const validatedData = post_CreateMedicationstatement.response.parse(
        medicationStatementData,
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

  // Medication
  searchMedications: protectedCanvasProcedure
    .input(get_SearchMedication.parameters)
    .query(async ({ ctx, input }) => {
      const { api } = ctx;
      const { query } = input;

      // search /Medication
      const medicationData = await api.get("/Medication", {
        query,
      });
      console.log(medicationData);

      // Validate response
      const validatedData = get_SearchMedication.response.parse(medicationData);

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
  getMedication: protectedCanvasProcedure
    .input(get_ReadMedication.parameters)
    .query(async ({ ctx, input }) => {
      const { api } = ctx;
      const { path } = input;

      // search /Medication
      const medicationData = await api.get("/Medication/{medication_id}", {
        path: { medication_id: path.medication_id },
      });
      // console.log(medicationData);

      // Validate response
      const validatedData = get_ReadMedication.response.parse(medicationData);

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
