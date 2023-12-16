import { TRPCError } from "@trpc/server";

import {
  get_SearchAllergen,
  post_CreateAllergyintolerance,
} from "../canvas/canvas-client";
import { createTRPCRouter, protectedCanvasProcedure } from "../trpc";

export const allergyIntoleranceRouter = createTRPCRouter({
  submitAllergyIntolerance: protectedCanvasProcedure
    .input(post_CreateAllergyintolerance.parameters)
    .mutation(async ({ ctx, input }) => {
      const { api } = ctx;
      const { body } = input;

      // create /AllergyIntolerance
      const allergyIntoleranceData = await api.post("/AllergyIntolerance", {
        body,
      });

      // Validate response
      const validatedData = post_CreateAllergyintolerance.response.parse(
        allergyIntoleranceData,
      );

      // Check if response is OperationOutcome
      if (validatedData?.resourceType === "OperationOutcome") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `${JSON.stringify(validatedData)}`,
        });
      }

      return validatedData;
    }),
  searchAllergens: protectedCanvasProcedure
    .input(get_SearchAllergen.parameters)
    .query(async ({ ctx, input }) => {
      const { api } = ctx;
      const { query } = input;

      // search /Allergen
      const allergenData = await api.get("/Allergen", {
        query,
      });

      // Validate response
      const validatedData = get_SearchAllergen.response.parse(allergenData);

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
