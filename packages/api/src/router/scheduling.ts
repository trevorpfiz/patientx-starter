import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  get_SearchAppointment,
  get_SearchCareteam,
  get_SearchSchedule,
  get_SearchSlot,
  post_CreateAppointment,
  put_UpdateAppointment,
} from "../canvas/canvas-client";
import { createTRPCRouter, protectedCanvasProcedure } from "../trpc";

export const schedulingRouter = createTRPCRouter({
  getPatientCareTeam: protectedCanvasProcedure
    .input(z.object({ patientId: z.string() }))
    .query(async ({ ctx, input }) => {
      const { api } = ctx;
      const { patientId } = input;

      // search /CareTeam for patient's care team
      const careTeamData = await api.get("/CareTeam", {
        query: {
          patient: patientId,
        },
      });

      // Validate response
      const validatedData = get_SearchCareteam.response.parse(careTeamData);

      // Check if response is OperationOutcome
      if (validatedData?.resourceType === "OperationOutcome") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `FHIR OperationOutcome Error: ${validatedData.issue
            .map(
              (issue) =>
                `${issue.severity}: ${issue.code}, ${issue.details?.text}`,
            )
            .join("; ")}`,
        });
      }

      return validatedData;
    }),
  getSchedules: protectedCanvasProcedure.query(async ({ ctx }) => {
    const { api } = ctx;

    // search /Schedule
    const scheduleData = await api.get("/Schedule");

    // Validate response
    const validatedData = get_SearchSchedule.response.parse(scheduleData);

    // Check if response is OperationOutcome
    if (validatedData?.resourceType === "OperationOutcome") {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: `FHIR OperationOutcome Error: ${validatedData.issue
          .map(
            (issue) =>
              `${issue.severity}: ${issue.code}, ${issue.details?.text}`,
          )
          .join("; ")}`,
      });
    }

    return validatedData;
  }),
  getSlots: protectedCanvasProcedure
    .input(get_SearchSlot.parameters)
    .query(async ({ ctx, input }) => {
      const { api } = ctx;
      const { query } = input;

      // search /Slot
      const slotData = await api.get("/Slot", {
        query,
      });

      // Validate response
      const validatedData = get_SearchSlot.response.parse(slotData);

      // Check if response is OperationOutcome
      if (validatedData?.resourceType === "OperationOutcome") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `FHIR OperationOutcome Error: ${validatedData.issue
            .map(
              (issue) =>
                `${issue.severity}: ${issue.code}, ${issue.details?.text}`,
            )
            .join("; ")}`,
        });
      }

      return validatedData;
    }),
  createAppointment: protectedCanvasProcedure
    .input(post_CreateAppointment.parameters)
    .mutation(async ({ ctx, input }) => {
      const { api } = ctx;
      const { body } = input;

      // create /Appointment
      const appointmentData = await api.post("/Appointment", {
        body,
      });

      // Validate response
      const validatedData =
        post_CreateAppointment.response.parse(appointmentData);

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
  updateAppointment: protectedCanvasProcedure
    .input(put_UpdateAppointment.parameters)
    .mutation(async ({ ctx, input }) => {
      const { api } = ctx;
      const { path, body } = input;

      // update /Appointment{id}
      const appointmentData = await api.put("/Appointment/{appointment_id}", {
        path,
        body,
      });

      // Validate response
      const validatedData =
        put_UpdateAppointment.response.parse(appointmentData);

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
  searchAppointments: protectedCanvasProcedure
    .input(get_SearchAppointment.parameters)
    .query(async ({ ctx, input }) => {
      const { api } = ctx;
      const { query } = input;

      // search /Appointment
      const appointmentData = await api.get("/Appointment", {
        query,
      });

      // Validate response
      const validatedData =
        get_SearchAppointment.response.parse(appointmentData);

      // Check if response is OperationOutcome
      if (validatedData?.resourceType === "OperationOutcome") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `FHIR OperationOutcome Error: ${validatedData.issue
            .map(
              (issue) =>
                `${issue.severity}: ${issue.code}, ${issue.details?.text}`,
            )
            .join("; ")}`,
        });
      }

      return validatedData;
    }),
});
