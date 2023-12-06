"use client";

import { useRouter } from "next/navigation";
import { atom, useAtom } from "jotai";

import type { SlotResource } from "@acme/api/src/validators";
import { Button } from "@acme/ui/button";
import { useToast } from "@acme/ui/use-toast";

import { formatDateTime, formatTime } from "~/lib/utils";
import { api } from "~/trpc/react";

export const selectedScheduleIdAtom = atom("");
export const selectedPractitionerIdAtom = atom("");

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
  const [selectedPractitionerId, setSelectedPractitionerId] = useAtom(
    selectedPractitionerIdAtom,
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
        <Button
          key={index}
          onClick={() => {
            setSelectedScheduleId(schedule.resource.id);
            setSelectedPractitionerId(
              schedule.resource.actor?.[0]?.reference ?? "",
            );
          }}
        >
          {schedule.resource.comment} {/* Assuming you have a provider name */}
        </Button>
      ))}
    </div>
  );
}

function AvailableSlots() {
  const [selectedScheduleId] = useAtom(selectedScheduleIdAtom);
  const [selectedPractitionerId] = useAtom(selectedPractitionerIdAtom);

  const router = useRouter();
  const toaster = useToast();

  const {
    data: slots,
    isLoading,
    isError,
    error,
  } = api.canvas.getSlots.useQuery({
    scheduleId: selectedScheduleId,
    duration: "30",
  });

  const mutation = api.canvas.createAppointment.useMutation({
    onSuccess: (data) => {
      toaster.toast({
        title: "You submitted the following values:",
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">{JSON.stringify(data, null, 2)}</code>
          </pre>
        ),
      });

      // Navigate to next steps
      router.push("/onboarding?step=next-steps");
    },
    onError: (error) => {
      // Show an error toast
      toaster.toast({
        title: "Error submitting consent",
        description: "An issue occurred while submitting. Please try again.",
        variant: "destructive",
      });
    },
  });

  function extractLocationId(reference: string) {
    const parts = reference.split(".");
    if (parts.length < 2 || !parts[1]) {
      return "Location/unknown";
    }

    const subParts = parts[1].split("-");
    if (subParts.length === 0) {
      return "Location/unknown";
    }

    const locationNumber = subParts[0];
    return `Location/${locationNumber}`;
  }

  function onBook(slot: SlotResource) {
    const locationReference = extractLocationId(slot.schedule.reference);

    const requestBody = {
      status: "proposed",
      reasonCode: [
        {
          coding: [
            {
              system: "INTERNAL",
              code: "INIV",
              display: "Initial Visit",
              userSelected: false,
            },
          ],
          text: "Initial 30 Minute Visit",
        },
      ],
      supportingInformation: [
        {
          reference: locationReference,
        },
      ],
      start: slot.start,
      end: slot.end,
      participant: [
        {
          actor: {
            reference: selectedPractitionerId,
          },
          status: "accepted",
        },
        {
          actor: {
            reference: "Patient/e7836251cbed4bd5bb2d792bc02893fd",
          },
          status: "accepted",
        },
      ],
    };

    // Create appointment
    mutation.mutate({
      body: requestBody,
    });
  }

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
              {/* <span>{formatTime(new Date(slot.resource.start))}</span> */}
              <span>{formatDateTime(new Date(slot.resource.start))}</span>
              <Button onClick={() => onBook(slot.resource)}>Book</Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
