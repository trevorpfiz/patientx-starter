import { TRPCError } from "@trpc/server";

import {
  get_ReadDocumentreference,
  get_SearchDocumentreference,
} from "../canvas/canvas-client";
import { createTRPCRouter, protectedCanvasProcedure } from "../trpc";

export const documentRouter = createTRPCRouter({
  getDocument: protectedCanvasProcedure
    .input(get_ReadDocumentreference.parameters)
    .query(async ({ ctx, input }) => {
      const { api } = ctx;

      const data = await api.get("/DocumentReference/{document_reference_id}", {
        path: {
          document_reference_id: input.path.document_reference_id,
        },
      });

      return data;
    }),

  searchBillDocument: protectedCanvasProcedure
    .input(get_SearchDocumentreference.parameters)
    .query(async ({ ctx, input }) => {
      try {
        const { api } = ctx;

        if (!canvasToken) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Canvas token is missing",
          });
        }

        // @link: https://postman.com/canvasmedical/workspace/canvas-medical-public-documentation/request/17030070-e85e9dc7-3dd7-4a4f-a648-f21d291c4b59
        const documentsData = await api.get("/DocumentReference", {
          query: {
            status: "current",
            type: "http://loinc.org|94093-2",
            subject: input.query.subject,
            category: "invoicefull",
          },
        });

        const validatedData =
          get_SearchDocumentreference.response.parse(documentsData);

        return validatedData;
      } catch (e) {
        if (e instanceof TRPCError) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: e.message,
          });
        }
      }
    }),
});
