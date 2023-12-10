import { TRPCError } from "@trpc/server";

import { get_ReadCareteam } from "../canvas/canvas-client";
import { createTRPCRouter, protectedCanvasProcedure } from "../trpc";

export const careTeamRouter = createTRPCRouter({
  getCareTeam: protectedCanvasProcedure
    .input(get_ReadCareteam.parameters)
    .query(async ({ ctx, input }) => {
      const { api, canvasToken } = ctx;
      const { path } = input;

      if (!canvasToken) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Canvas token is missing",
        });
      }
      try {
        const careTeamData = await api.get("/CareTeam/{care_team_id}", {
          path: { care_team_id: path.care_team_id },
        });
        const validatedData = get_ReadCareteam.response.parse(careTeamData);
        return validatedData;
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An error occurred while fetching care team data",
        });
      }
    }),
});
