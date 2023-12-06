"use client";

import { atom, useAtom } from "jotai";

import { api } from "~/trpc/react";

export const selectedScheduleIdAtom = atom("");

export function ScheduleAppointment() {
  const [selectedScheduleId] = useAtom(selectedScheduleIdAtom);

  return (
    <div>
      <AvailableProviders />
      {selectedScheduleId && <AvailableSlots />}
    </div>
  );
}

function AvailableProviders() {
  const [selectedScheduleId, setSelectedScheduleId] = useAtom(
    selectedScheduleIdAtom,
  );

  const {
    data: schedules,
    isLoading,
    isError,
    error,
  } = api.canvas.getSchedules.useQuery();

  if (isLoading) {
    return <span>Loading Schedules...</span>;
  }

  if (isError) {
    return <span>Error: {error?.message}</span>;
  }

  return (
    <div>
      {schedules.entry?.map((schedule, index) => (
        <button
          key={index}
          onClick={() => setSelectedScheduleId(schedule.resource.id)}
        >
          {schedule.resource.comment} {/* Assuming you have a provider name */}
        </button>
      ))}
    </div>
  );
}

function AvailableSlots() {
  const [selectedScheduleId] = useAtom(selectedScheduleIdAtom);

  const {
    data: slots,
    isLoading,
    isError,
    error,
  } = api.canvas.getSlots.useQuery({ scheduleId: selectedScheduleId });

  if (isLoading) {
    return <span>Loading Slots...</span>;
  }

  if (isError) {
    return <span>Error: {error?.message}</span>;
  }

  return (
    <div>
      <h3>Slots for Schedule ID: {selectedScheduleId}</h3>
      <ul>
        {slots.entry?.map((slot, index) => (
          <li key={index}>
            <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
              <span>{slot.resource.start.toDateString()}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
