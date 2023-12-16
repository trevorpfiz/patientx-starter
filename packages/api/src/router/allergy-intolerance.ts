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

      try {
        const allergyIntoleranceData = await api.post("/AllergyIntolerance", {
          body,
        });
        return allergyIntoleranceData;
      } catch (error) {
        // Handle any other errors
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An error occurred while fetching allergy/intolerance data",
        });
      }
    }),
  searchAllergens: protectedCanvasProcedure
    .input(get_SearchAllergen.parameters)
    .query(async ({ ctx, input }) => {
      const { api } = ctx;
      const { query } = input;

      try {
        const allergenData = await api.get("/Allergen", {
          query,
        });
        const validatedData = get_SearchAllergen.response.parse(allergenData);
        return validatedData;
      } catch (error) {
        // Handle any other errors
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An error occurred while fetching allergen data",
        });
      }
    }),
});
