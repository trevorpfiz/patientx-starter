import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  get_ReadCommunication,
  get_ReadPractitioner,
  get_SearchCommunicationSender,
} from "../canvas/canvas-client";
import { createTRPCRouter, protectedCanvasProcedure } from "../trpc";

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

  senderMsgs: protectedCanvasProcedure
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

        interface Msg {
          recipient: {
            name: string;
            id: string;
          };
          messages: string[];
        }

        if (communicationData.total > 0) {
          const msgs: Msg[] = [];

          for (const msg of communicationData.entry!) {
            const recipient = await api.get(
              "/Practitioner/{practitioner_a_id}",
              {
                path: {
                  practitioner_a_id:
                    msg.resource.recipient[0]?.reference?.split("/")[1]!,
                },
              },
            );
            // Verify if the recipient is already in the msgs array otherwise add it and add the messages
            const recipientIndex = msgs.findIndex(
              (msg) => msg.recipient.id === recipient.id,
            );

            if (recipientIndex === -1) {
              msgs.push({
                recipient: {
                  name: recipient.name[0]?.text!,
                  id: recipient.id,
                },
                messages: [msg.resource.payload[0]?.contentString!],
              });
            } else {
              msgs[recipientIndex]?.messages.push(
                msg.resource.payload[0]?.contentString!,
              );
            }
          }

          return msgs;
        }
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An error occurred while fetching communication data",
        });
      }
    }),

  msgs: protectedCanvasProcedure
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
            recipient: input.query.recipient,
          },
        });

        const { query } = input;

        // Get the sender info eg: Sender type: Patient or Practitioner and sender Id: 1
        const senderInfo = query.sender?.split("/");
        const recipientInfo = query.recipient?.split("/");

        if (communicationData.total > 0) {
          const msgs = [];

          for (const msg of communicationData.entry!) {
            let recipient;
            let sender;

            if (senderInfo![0] === "Practitioner") {
              const senderData = await api.get(
                "/Practitioner/{practitioner_a_id}",
                {
                  path: {
                    practitioner_a_id: senderInfo![1]!,
                  },
                },
              );

              sender = senderData;
            } else {
              const senderData = await api.get("/Patient/{patient_id}", {
                path: {
                  patient_id: msg.resource.sender?.reference?.split("/")[1]!,
                },
              });

              sender = senderData;
            }

            if (recipientInfo![0] === "Practitioner") {
              const recipientData = await api.get(
                "/Practitioner/{practitioner_a_id}",
                {
                  path: {
                    practitioner_a_id: recipientInfo![1]!,
                  },
                },
              );

              recipient = recipientData;
            } else {
              const recipientData = await api.get("/Patient/{patient_id}", {
                path: {
                  patient_id: recipientInfo![1]!,
                },
              });

              recipient = recipientData;
            }

            msgs.push({
              id: msg.resource.id,
              sent: msg.resource.sent,
              message: msg.resource.payload[0]?.contentString,
              sender: {
                name: sender?.name[0]?.use,
                id: sender.id,
              },
              recipient: {
                name: recipient?.name[0]?.text,
                id: recipient.id,
              },
            });
          }

          return msgs;
        }
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An error occurred while fetching communication data",
        });
      }
    }),
});
