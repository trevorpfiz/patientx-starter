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
      const { api } = ctx;

      // create /PaymentNotice
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

      // Validate response
      const validatedData =
        post_CreatePaymentnotice.response.parse(paymentData);

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
  searchPayments: protectedCanvasProcedure
    .input(get_SearchPaymentnotice.parameters)
    .query(async ({ ctx, input }) => {
      const { api } = ctx;

      // search /PaymentNotice
      const paymentData = await api.get("/PaymentNotice", {
        query: {
          request: input.query.request,
        },
      });

      // Validate response
      const validatedData = get_SearchPaymentnotice.response.parse(paymentData);

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
});
