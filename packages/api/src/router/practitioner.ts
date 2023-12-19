import { TRPCError } from "@trpc/server";

import {
  get_ReadPractitioner,
  get_SearchPractitioner,
} from "../canvas/canvas-client";
import { createTRPCRouter, protectedCanvasProcedure } from "../trpc";

export const practitionerRouter = createTRPCRouter({
  searchPractitioners: protectedCanvasProcedure
    .input(get_SearchPractitioner.parameters)
    .query(async ({ ctx, input }) => {
      const { api } = ctx;

      // search /Practitioner
      const practitionerData = await api.get("/Practitioner", {
        query: {
          name: input.query.name ?? "",
        },
      });

      // Validate response
      const validatedData =
        get_SearchPractitioner.response.parse(practitionerData);

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

      return validatedData;
    }),
  getPractitioner: protectedCanvasProcedure
    .input(get_ReadPractitioner.parameters)
    .query(async ({ ctx, input }) => {
      const { api } = ctx;
      const { path } = input;

      // get /Practitioner{id}
      const practitionerData = await api.get(
        "/Practitioner/{practitioner_a_id}",
        {
          path: {
            practitioner_a_id: path.practitioner_a_id,
          },
        },
      );

      // Validate response
      const validatedData =
        get_ReadPractitioner.response.parse(practitionerData);

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

      return validatedData;
    }),
});
