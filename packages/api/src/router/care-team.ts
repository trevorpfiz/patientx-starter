import { TRPCError } from "@trpc/server";

import { get_ReadCareteam } from "../canvas/canvas-client";
import { createTRPCRouter, protectedCanvasProcedure } from "../trpc";

export const careTeamRouter = createTRPCRouter({
  getCareTeam: protectedCanvasProcedure
    .input(get_ReadCareteam.parameters)
    .query(async ({ ctx, input }) => {
      const { api } = ctx;
      const { path } = input;

      // get /CareTeam/{id}
      const careTeamData = await api.get("/CareTeam/{care_team_id}", {
        path: { care_team_id: path.care_team_id },
      });

      // Validate response
      const validatedData = get_ReadCareteam.response.parse(careTeamData);

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
