import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  get_ReadCommunication,
  get_SearchCommunicationSender,
} from "../canvas/canvas-client";
import { createTRPCRouter, protectedCanvasProcedure } from "../trpc";
import { env } from "../env.mjs";
import { BundleSchema } from "../validators";

export const communicationRouter = createTRPCRouter({
  createMsg: protectedCanvasProcedure
    .input(
      z.object({
        recipient: z.string(),
        sender: z.string(),
        payload: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { recipient, sender, payload } = input;

      const { api, canvasToken } = ctx;

      if (!canvasToken) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Canvas token is missing",
        });
      }

      try {
        await api.post("/Communication", {
          body: {
            status: "unknown",
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
      } catch (error) {
        // Handle any other errors
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An error occurred while creating message",
        });
      }
    }),
  searchSenderMsgs: protectedCanvasProcedure
    .input(get_SearchCommunicationSender.parameters)
    .query(async ({ ctx, input }) => {
      const { api, canvasToken } = ctx;
      if (!canvasToken) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Canvas token is missing",
        });
      }
      try {
        const communicationData = await api.get("/Communication", {
          query: {
            sender: input.query.sender,
          },
        });

        return communicationData;
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An error occurred while fetching communication data",
        });
      }
    }),
  searchRecipientMsgs: protectedCanvasProcedure
    .input(get_SearchCommunicationSender.parameters)
    .query(async ({ ctx, input }) => {
      const { api, canvasToken } = ctx;
      if (!canvasToken) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Canvas token is missing",
        });
      }

      try {
        const communicationData = await api.get("/Communication", {
          query: {
            recipient: input.query.recipient,
          },
        });

        return communicationData;
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An error occurred while fetching communication data",
        });
      }
    }),

  readMsg: protectedCanvasProcedure
    .input(get_ReadCommunication.parameters)
    .query(async ({ ctx, input }) => {
      const { api, canvasToken } = ctx;
      if (!canvasToken) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Canvas token is missing",
        });
      }

      try {
        const communicationData = await api.get(
          "/Communication/{communication_id}",
          {
            path: {
              communication_id: input.path.communication_id,
            },
          },
        );

        return communicationData;
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An error occurred while fetching communication data",
        });
      }
    }),

  searchMsgs: protectedCanvasProcedure
    .input(get_SearchCommunicationSender.parameters)
    .query(async ({ ctx, input }) => {
      const { api, canvasToken } = ctx;
      if (!canvasToken) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Canvas token is missing",
        });
      }

      try {
        const communicationData = await api.get("/Communication", {
          query: {
            recipient: input.query.recipient,
            sender: input.query.sender,
          },
        });

        if (communicationData.resourceType === "Bundle") {
          const { entry } = communicationData;
          return entry;
        }
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An error occurred while fetching communication data",
        });
      }
    }),
});
