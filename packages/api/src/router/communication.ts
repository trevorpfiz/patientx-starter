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
      const { api } = ctx;

      // create /Communication
      const communicationData = await api.post("/Communication", {
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

      // Validate response
      const validatedData =
        post_CreateCommunication.response.parse(communicationData);

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
  searchSenderMsgs: protectedCanvasProcedure
    .input(get_SearchCommunicationSender.parameters)
    .query(async ({ ctx, input }) => {
      const { api } = ctx;

      // search /Communication
      const communicationData = await api.get("/Communication", {
        query: {
          sender: input.query.sender,
        },
      });

      // Validate response
      const validatedData =
        get_SearchCommunicationSender.response.parse(communicationData);

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
  // TODO - might be duplicate?
  searchRecipientMsgs: protectedCanvasProcedure
    .input(get_SearchCommunicationSender.parameters)
    .query(async ({ ctx, input }) => {
      const { api } = ctx;

      // search /Communication
      const communicationData = await api.get("/Communication", {
        query: {
          recipient: input.query.recipient,
        },
      });

      // Validate response
      const validatedData =
        get_SearchCommunicationSender.response.parse(communicationData);

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
  readMsg: protectedCanvasProcedure
    .input(get_ReadCommunication.parameters)
    .query(async ({ ctx, input }) => {
      const { api } = ctx;

      // get /Communication/{communication_id}
      const communicationData = await api.get(
        "/Communication/{communication_id}",
        {
          path: {
            communication_id: input.path.communication_id,
          },
        },
      );

      // Validate response
      const validatedData =
        get_ReadCommunication.response.parse(communicationData);

      // Check if response is OperationOutcome
      if (validatedData?.resourceType === "OperationOutcome") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `${JSON.stringify(validatedData)}`,
        });
      }

      return validatedData;
    }),
  // TODO - might be duplicate?
  searchMsgs: protectedCanvasProcedure
    .input(get_SearchCommunicationSender.parameters)
    .query(async ({ ctx, input }) => {
      const { api } = ctx;

      // search /Communication
      const communicationData = await api.get("/Communication", {
        query: {
          recipient: input.query.recipient,
          sender: input.query.sender,
        },
      });

      // Validate response
      const validatedData =
        get_SearchCommunicationSender.response.parse(communicationData);

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

      // TODO - not needed?
      if (communicationData.resourceType === "Bundle") {
        const { entry } = communicationData;
        return entry;
      }

      return validatedData;
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

        if (
          communicationData.resourceType === "Bundle" &&
          communicationData.total > 0
        ) {
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

            if (recipient.resourceType === "Practitioner") {
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

            // Verify if the recipient is already in the msgs array otherwise add it and add the messages
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
