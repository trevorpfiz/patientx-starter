import { TRPCError } from "@trpc/server";

import {
  get_SearchPaymentnotice,
  post_CreatePaymentnotice,
} from "../canvas/canvas-client";
import { createTRPCRouter, protectedCanvasProcedure } from "../trpc";

export const paymentRouter = createTRPCRouter({
  createPayment: protectedCanvasProcedure
    .input(post_CreatePaymentnotice.parameters)
    .mutation(async ({ ctx, input }) => {
      try {
        const { api, canvasToken } = ctx;

        if (!canvasToken) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Canvas token is missing",
          });
        }

        const paymentData = await api.post("/PaymentNotice", {
          body: {
            status: "active",
            request: {
              reference: input.body.request?.reference,
            },
            created: new Date().toISOString(),
            payment: {},
            recipient: {},
            amount: {
              currency: "USD",
              value: input.body.amount?.value,
            },
          },
        });

        // @ts-ignore
        if (paymentData?.resourceType === "OperationOutcome") {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            // @ts-ignore
            message: paymentData?.issue[0]?.details.text,
          });
        }
        return paymentData;
      } catch (e) {
        if (e instanceof TRPCError) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: e.message,
          });
        }
      }
    }),

  searchPayments: protectedCanvasProcedure
    .input(get_SearchPaymentnotice.parameters)
    .query(async ({ ctx, input }) => {
      try {
        const { api, canvasToken } = ctx;

        if (!canvasToken) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Canvas token is missing",
          });
        }

        const paymentData = await api.get("/PaymentNotice", {
          query: {
            request: input.query.request,
          },
        });

        const validatedData =
          get_SearchPaymentnotice.response.parse(paymentData);

        return validatedData;
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An error occurred while creating payment",
        });
      }
    }),
});
