import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  get_ReadQuestionnaire,
  get_ReadQuestionnaireresponse,
  post_CreateQuestionnaireresponse,
} from "../canvas/canvas-client";
import { createTRPCRouter, protectedCanvasProcedure } from "../trpc";

export const questionnaireRouter = createTRPCRouter({
  // Questionnaire
  getQuestionnaire: protectedCanvasProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const { api } = ctx;
      const { id } = input;

      // get /Questionnaire{id}
      const questionnaireData = await api.get(
        "/Questionnaire/{questionnaire_id}",
        {
          path: { questionnaire_id: id },
        },
      );

      // Validate response
      const validatedData =
        get_ReadQuestionnaire.response.parse(questionnaireData);

      // Check if response is OperationOutcome
      if (validatedData?.resourceType === "OperationOutcome") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `${JSON.stringify(validatedData)}`,
        });
      }

      return validatedData;
    }),

  // QuestionnaireResponse
  getQuestionnaireResponse: protectedCanvasProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const { api } = ctx;
      const { id } = input;

      // get /QuestionnaireResponse{id}
      const questionnaireResponseData = await api.get(
        "/QuestionnaireResponse/{questionnaire_response_id}",
        {
          path: { questionnaire_response_id: id },
        },
      );

      // Validate response
      const validatedData = get_ReadQuestionnaireresponse.response.parse(
        questionnaireResponseData,
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
  submitQuestionnaireResponse: protectedCanvasProcedure
    .input(post_CreateQuestionnaireresponse.parameters)
    .mutation(async ({ ctx, input }) => {
      const { api } = ctx;
      const { body } = input;

      // create /QuestionnaireResponse
      const questionnaireResponseData = await api.post(
        "/QuestionnaireResponse",
        {
          body,
        },
      );

      // Validate response
      const validatedData = post_CreateQuestionnaireresponse.response.parse(
        questionnaireResponseData,
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
});
