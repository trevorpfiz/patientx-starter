import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, protectedCanvasProcedure } from "../trpc";

export const communicationRouter = createTRPCRouter({
  createMsg: protectedCanvasProcedure
    .input(
      z.object({
        status: z.string(),
        recipient: z.string(),
        sender: z.string(),
        payload: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { status, recipient, sender, payload } = input;

      const { api, canvasToken } = ctx;

      if (!canvasToken) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Canvas token is missing",
        });
      }

      try {
        const msgData = await api.post("/Communication", {
          body: {
            status,
            recipient: [
              {
                reference: recipient,
              },
            ],
            resourceType: "Communication",
            sender: {
              reference: sender,
            },
            payload: [
              {
                contentString: payload,
              },
            ],
          },
        });

        console.log(msgData);
        return msgData;
      } catch (error) {
        // Handle any other errors
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An error occurred while creating message",
        });
      }
    }),
});