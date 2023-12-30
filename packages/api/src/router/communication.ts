import type { IMessage } from "react-native-gifted-chat";
import { TRPCError } from "@trpc/server";
import compareAsc from "date-fns/compareAsc";
import { z } from "zod";

import {
  get_ReadCommunication,
  get_ReadPractitioner,
  get_SearchCommunicationSender,
  post_CreateCommunication,
} from "../canvas/canvas-client";
import { handleCanvasApiResponse } from "../lib/utils";
import { createTRPCRouter, protectedCanvasProcedure } from "../trpc";

export const communicationRouter = createTRPCRouter({
  createCommunication: protectedCanvasProcedure
    .input(post_CreateCommunication.parameters)
    .mutation(async ({ ctx, input }) => {
      const { api } = ctx;
      const { body } = input;

      // create /Communication
      const communicationData = await api.post("/Communication", {
        body,
      });

      // Validate response and handle OperationOutcome
      const validatedData = handleCanvasApiResponse(
        post_CreateCommunication.response,
        communicationData,
      );

      return validatedData;
    }),
  searchCommunications: protectedCanvasProcedure
    .input(get_SearchCommunicationSender.parameters)
    .query(async ({ ctx, input }) => {
      const { api } = ctx;
      const { query } = input;

      // search /Communication
      const communicationData = await api.get("/Communication", {
        query,
      });

      // Validate response and handle OperationOutcome
      const validatedData = handleCanvasApiResponse(
        get_SearchCommunicationSender.response,
        communicationData,
      );

      return validatedData;
    }),
  readCommunication: protectedCanvasProcedure
    .input(get_ReadCommunication.parameters)
    .query(async ({ ctx, input }) => {
      const { api } = ctx;
      const { path } = input;

      // get /Communication/{communication_id}
      const communicationData = await api.get(
        "/Communication/{communication_id}",
        {
          path: {
            communication_id: path.communication_id,
          },
        },
      );

      // Validate response and handle OperationOutcome
      const validatedData = handleCanvasApiResponse(
        get_ReadCommunication.response,
        communicationData,
      );

      return validatedData;
    }),
  senderMsgs: protectedCanvasProcedure
    .input(get_SearchCommunicationSender.parameters)
    .query(async ({ ctx, input }) => {
      const { api } = ctx;
      const { query } = input;

      // Reuse the searchCommunications logic
      const communicationData = await api.get("/Communication", { query });

      const validatedData = handleCanvasApiResponse(
        get_SearchCommunicationSender.response,
        communicationData,
      );

      interface Msg {
        recipient: {
          name: string;
          id: string;
        };
        messages: string[];
      }

      async function processMessages(api, communicationData): Promise<Msg[]> {
        const msgs: Msg[] = [];

        for (const msg of communicationData.entry!) {
          const recipient = await api.get("/Practitioner/{practitioner_a_id}", {
            path: {
              practitioner_a_id:
                msg.resource.recipient[0]?.reference?.split("/")[1]!,
            },
          });

          const recipientIndex = msgs.findIndex(
            (m) => m.recipient.id === recipient.id,
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

      if (
        validatedData?.resourceType === "Bundle" &&
        validatedData?.total > 0
      ) {
        return processMessages(api, validatedData);
      }

      return [];
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
  chatMsgs: protectedCanvasProcedure
    .input(
      z.object({
        sender: z.string(),
        recipient: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { api, canvasToken } = ctx;
      if (!canvasToken) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Canvas token is missing",
        });
      }

      const senderMsgs = await api.get("/Communication", {
        query: {
          sender: input.sender,
          recipient: input.recipient,
        },
      });

      const senderImgs: IMessage[] = [];
      for (const msg of senderMsgs.entry!) {
        senderImgs.push({
          _id: msg.resource.id,
          text: msg.resource.payload[0]?.contentString!,
          createdAt: new Date(msg.resource.sent),
          user: {
            _id: 1,
            name: "Sender",
            avatar:
              "https://files.oaiusercontent.com/file-qn1PnhbqEv2cNvNw6N6LPAN0?se=2023-12-17T02%3A15%3A29Z&sp=r&sv=2021-08-06&sr=b&rscc=max-age%3D31536000%2C%20immutable&rscd=attachment%3B%20filename%3D76788262-6f59-4406-88cb-6f38c74327c9.webp&sig=hAOqj/xKCiKa%2BiJFNn53F5F3TUXScoEZtdxuc9tT7w8%3D",
          },
        });
      }

      const recipientMsgs = await api.get("/Communication", {
        query: {
          sender: input.recipient,
          recipient: input.sender,
        },
      });

      const recipientImgs: IMessage[] = [];
      for (const msg of recipientMsgs.entry!) {
        recipientImgs.push({
          _id: msg.resource.id,
          text: msg.resource.payload[0]?.contentString!,
          createdAt: new Date(msg.resource.sent),
          user: {
            _id: 2,
            name: "Recipient",
            avatar:
              "https://files.oaiusercontent.com/file-8fd3YZuYUxt16rEQR4gRPNlg?se=2023-12-17T02%3A20%3A32Z&sp=r&sv=2021-08-06&sr=b&rscc=max-age%3D31536000%2C%20immutable&rscd=attachment%3B%20filename%3D9bf189ea-8ae3-4577-ac0c-0570b9beaf20.webp&sig=4HwB3Y%2BmqC8iklxdr0NEvFM1FaV9VT9zO7/KOxH2Zcc%3D",
          },
        });
      }

      const allMsgs = [...senderImgs, ...recipientImgs];

      // oldest message will be last
      const sortedMsgs = allMsgs.sort((a, b) => {
        return compareAsc(new Date(a.createdAt), new Date(b.createdAt)) || 0;
      });

      return sortedMsgs;
    }),
});
