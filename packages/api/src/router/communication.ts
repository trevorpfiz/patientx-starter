import type { IMessage } from "react-native-gifted-chat";
import { TRPCError } from "@trpc/server";
import compareAsc from "date-fns/compareAsc";

import {
  get_ReadCommunication,
  get_SearchCommunicationSender,
  post_CreateCommunication,
} from "../canvas/canvas-client";
import { processSingleMessage } from "../lib/utils";
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
  searchCommunications: protectedCanvasProcedure
    .input(get_SearchCommunicationSender.parameters)
    .query(async ({ ctx, input }) => {
      const { api } = ctx;
      const { query } = input;

      // search /Communication
      const communicationData = await api.get("/Communication", {
        query,
      });

      // Validate resposne
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

      // Validate response
      const validatedData =
        get_ReadCommunication.response.parse(communicationData);

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
  senderMsgs: protectedCanvasProcedure
    .input(get_SearchCommunicationSender.parameters)
    .query(async ({ ctx, input }) => {
      const { api } = ctx;
      const { query } = input;

      // Reuse the searchCommunications logic
      const communicationData = await api.get("/Communication", { query });

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

      // Process messages
interface Msg {
  recipient: {
    name: string;
    id: string;
  };
  messages: string[];
}

async function processMessages(api, communicationData): Promise<Msg[]> {
  const msgs: Msg[] = [];

  if (communicationData.resourceType === "Bundle" && communicationData.total > 0) {
    for (const msg of communicationData.entry!) {
      const recipient = await api.get("/Practitioner/{practitioner_a_id}", {
        path: {
          practitioner_a_id: msg.resource.recipient[0]?.reference?.split("/")[1]!,
        },
      });

      if (recipient.resourceType === "Practitioner") {
        const recipientIndex = msgs.findIndex((m) => m.recipient.id === recipient.id);

        if (recipientIndex === -1) {
          msgs.push({
            recipient: {
              name: recipient.name[0]?.text!,
              id: recipient.id,
            },
            messages: [msg.resource.payload[0]?.contentString!],
          });
        } else {
          msgs[recipientIndex]?.messages.push(msg.resource.payload[0]?.contentString!);
        }
      }
    }
  }

  return msgs;
}

if (validatedData?.total > 0) {
  return processMessages(api, validatedData);
}

return [];
}),
  msgs: protectedCanvasProcedure
    .input(get_SearchCommunicationSender.parameters)
    .query(async ({ ctx, input }) => {
      const { api } = ctx;
      const { query } = input;

      const communicationData = await api.get("/Communication", {
        query: { sender: query.sender, recipient: query.recipient },
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

      if (validatedData.total > 0) {
        return Promise.all(
          validatedData.entry!.map((msg) => processSingleMessage(api, msg)),
        );
      }
      return [];
    }),
  chatMsgs: protectedCanvasProcedure
    .input(get_SearchCommunicationSender.parameters)
    .query(async ({ ctx, input }) => {
      const { api } = ctx;
      const { query } = input;

      // Get messages sent by sender
      const senderMsgsData = await api.get("/Communication", {
        query: { sender: query.sender, recipient: query.recipient },
      });
      const recipientMsgsData = await api.get("/Communication", {
        query: { sender: query.recipient, recipient: query.sender },
      });

      // Validate responses
      const validatedSenderMsgs =
        get_SearchCommunicationSender.response.parse(senderMsgsData);
      const validatedRecipientMsgs =
        get_SearchCommunicationSender.response.parse(recipientMsgsData);

      // Check if responses are OperationOutcome
      if (
        validatedSenderMsgs?.resourceType === "OperationOutcome" ||
        validatedRecipientMsgs?.resourceType === "OperationOutcome"
      ) {
        const issues = [
          ...(validatedSenderMsgs?.issue || []),
          ...(validatedRecipientMsgs?.issue || []),
        ]
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

      // Process messages
      const processedSenderMsgs = await Promise.all(
        validatedSenderMsgs.entry!.map((msg) =>
          processSingleMessage(api, msg, true),
        ),
      );
      const processedRecipientMsgs = await Promise.all(
        validatedRecipientMsgs.entry!.map((msg) =>
          processSingleMessage(api, msg, false),
        ),
      );

      const allMsgs: IMessage[] = [
        ...processedSenderMsgs,
        ...processedRecipientMsgs,
      ];
      // Sort messages by date and return
      return allMsgs.sort(
        (a, b) => compareAsc(new Date(a.sent), new Date(b.sent)) || 0,
      );
    }),
});
