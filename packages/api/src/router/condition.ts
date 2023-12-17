import { TRPCError } from "@trpc/server";

import {
  get_SearchCondition,
  post_CreateCondition,
} from "../canvas/canvas-client";
import { createTRPCRouter, protectedCanvasProcedure } from "../trpc";

export const conditionRouter = createTRPCRouter({
  submitCondition: protectedCanvasProcedure
    .input(post_CreateCondition.parameters)
    .mutation(async ({ ctx, input }) => {
      const { api } = ctx;
      const { body } = input;

      // create /Condition
      const conditionData = await api.post("/Condition", {
        body,
      });

      // Validate response
      const validatedData = post_CreateCondition.response.parse(conditionData);

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
  searchConditions: protectedCanvasProcedure
    .input(get_SearchCondition.parameters)
    .query(async ({ ctx, input }) => {
      const { api } = ctx;
      const { query } = input;

      // search /Condition
      const medicationData = await api.get("/Condition", {
        query,
      });

      // Validate response
      const validatedData = get_SearchCondition.response.parse(medicationData);

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
