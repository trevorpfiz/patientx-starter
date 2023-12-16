import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  get_ReadCommunication,
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
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `${JSON.stringify(validatedData)}`,
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
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `${JSON.stringify(validatedData)}`,
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
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `${JSON.stringify(validatedData)}`,
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
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `${JSON.stringify(validatedData)}`,
        });
      }

      // TODO - not needed?
      if (communicationData.resourceType === "Bundle") {
        const { entry } = communicationData;
        return entry;
      }

      return validatedData;
    }),
});
