import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, protectedCanvasProcedure } from "../trpc";
import { questionnaireResponseBodySchema } from "../validators";

export const questionnaireRouter = createTRPCRouter({
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
});
