import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedCanvasProcedure } from "../trpc";
import { get_ReadDocumentreference, get_SearchDocumentreference } from "../canvas/canvas-client";

export const documentRouter = createTRPCRouter({
  getDocument: protectedCanvasProcedure.input(get_ReadDocumentreference.parameters).query(async ({ ctx, input }) => {

    const { api, canvasToken } = ctx;

    if (!canvasToken) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Canvas token is missing",
      });
    }

    const data = await api.get("/DocumentReference/{document_reference_id}", {
      path: {
        document_reference_id: input.path.document_reference_id,
      },
    })

    console.log("DATA", data)

    return data
  }),

  searchDocument: protectedCanvasProcedure.input(get_SearchDocumentreference.parameters).query(async ({ ctx, input }) => {

    try {

      const { api, canvasToken } = ctx;

      if (!canvasToken) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Canvas token is missing",
        });
      }

      // @link: https://postman.com/canvasmedical/workspace/canvas-medical-public-documentation/request/17030070-e85e9dc7-3dd7-4a4f-a648-f21d291c4b59
      const data = await api.get("/DocumentReference", {
        query: {
          status: "current",
          type: "http://loinc.org|94093-2",
          subject: input.query.subject,
          category: "invoicefull",
        }
      })

      return data.entry

    } catch (e) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "An error occurred while fetching communication data",
      })
    }
  }),
})
