import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { post_CreateAppointment } from "../canvas/canvas-client";
import { createTRPCRouter, protectedCanvasProcedure } from "../trpc";

export const schedulingRouter = createTRPCRouter({
  getPatientCareTeam: protectedCanvasProcedure
    .input(z.object({ patientId: z.string() }))
    .query(async ({ ctx, input }) => {
      const { api } = ctx;
      const { patientId } = input;

      try {
        const careTeamData = await api.get("/CareTeam", {
          query: {
            patient: patientId,
          },
        });
        return careTeamData;
      } catch (error) {
        console.error(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            "An error occurred while fetching care team appointments data",
        });
      }
    }),
  getSchedules: protectedCanvasProcedure.query(async ({ ctx }) => {
    const { api } = ctx;

    if (!canvasToken) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Canvas token is missing",
      });
    }

    try {
      const scheduleData = await api.get("/Schedule");
      return scheduleData;
    } catch (error) {
      console.error(error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "An error occurred while fetching provider schedule data",
      });
    }
  }),
  getSlots: protectedCanvasProcedure
    .input(
      z.object({ scheduleId: z.string(), duration: z.string().optional() }),
    )
    .query(async ({ ctx, input }) => {
      const { api } = ctx;
      const { scheduleId, duration } = input;

      try {
        const slotData = await api.get("/Slot", {
          query: {
            schedule: scheduleId,
            duration: duration ?? "20", // TODO - will set the duration of the appointment, but seems to affect the interval between slots returned?
          },
        });

        return slotData;
      } catch (error) {
        console.error(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An error occurred while fetching provider schedule data",
        });
      }
    }),
  createAppointment: protectedCanvasProcedure
    .input(post_CreateAppointment.parameters)
    .mutation(async ({ ctx, input }) => {
      const { api } = ctx;
      const { body } = input;

      try {
        const appointmentData = await api.post("/Appointment", {
          body,
        });
        return appointmentData;
      } catch (error) {
        // Handle any other errors
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An error occurred while fetching appointment data",
        });
      }
    }),
});
