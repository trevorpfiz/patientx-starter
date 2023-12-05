"use client";

import { api } from "~/trpc/react";

export function ScheduleAppointment() {
  const schedules = api.canvas.getSchedules.useQuery();
  const slots = api.canvas.getSlots.useQuery(
    {
      scheduleId: schedules.data.entry?.[0].resource.id,
    },
    { enabled: !!schedules.data?.entry?.[0].resource.id },
  );

  if (schedules.isLoading || slots.isLoading) {
    return <span>Loading...</span>;
  }

  if (schedules.isError || slots.isError) {
    <span>
      Error: {schedules.error?.message} {slots.error?.message}
    </span>;
  }

  return (
    <pre>
      {JSON.stringify(
        {
          schedules: schedules.data ?? null,
          slots: slots.data ?? null,
        },
        null,
        4,
      )}
    </pre>
  );
}
