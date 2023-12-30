import {
  get_ReadMedication,
  get_SearchMedication,
  post_CreateMedicationstatement,
} from "../canvas/canvas-client";
import { handleCanvasApiResponse } from "../lib/utils";
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

      // Validate response and handle OperationOutcome
      const validatedData = handleCanvasApiResponse(
        post_CreateMedicationstatement.response,
        medicationStatementData,
      );

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

      // Validate response and handle OperationOutcome
      const validatedData = handleCanvasApiResponse(
        get_SearchMedication.response,
        medicationData,
      );

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

      // Validate response and handle OperationOutcome
      const validatedData = handleCanvasApiResponse(
        get_ReadMedication.response,
        medicationData,
      );

      return validatedData;
    }),
});
