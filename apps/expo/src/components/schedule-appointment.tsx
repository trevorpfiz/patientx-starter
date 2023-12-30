import React from "react";
import { SafeAreaView, Text, View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { useAtom } from "jotai";
import { Loader2 } from "lucide-react-native";

import type { SlotResource } from "@acme/shared/src/validators/slot";

import { patientIdAtom } from "~/app";
import { onboardingDateAtom } from "~/app/onboarding/confirmation";
import {
  ScheduleHeader,
  selectedDateAtom,
} from "~/components/ui/headers/schedule-header";
import { LoaderComponent } from "~/components/ui/loader";
import { Button } from "~/components/ui/rn-ui/components/ui/button";
import {
  selectedSlotAtom,
  SlotItem,
} from "~/components/ui/scheduling/slot-item";
import { api } from "~/utils/api";
import { formatDayDate } from "~/utils/dates";

// TimeSlots component to render the slots
const TimeSlots = ({ slots }: { slots: SlotResource[] }) => {
  const [selectedDate] = useAtom(selectedDateAtom);
  const [selectedSlot] = useAtom(selectedSlotAtom);

  const filteredSlots = slots.filter((slot) =>
    slot.start.startsWith(selectedDate),
  );

  // Format the selected date only if it's valid
  const formattedDate = selectedDate
    ? formatDayDate(selectedDate)
    : "No Date Selected";

  return (
    <View className="flex-1">
      <FlashList
        data={filteredSlots}
        numColumns={3}
        renderItem={({ item, index }) => (
          <SlotItem
            slot={item}
            isSelected={item.start === selectedSlot?.start}
          />
        )}
        estimatedItemSize={200}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingVertical: 16,
        }}
        ListHeaderComponent={
          <View className="flex-row items-center pb-4 pt-2">
            <Text className="text-xl">Select a time for </Text>
            <Text className="text-xl font-bold">{formattedDate}</Text>
          </View>
        }
      />
    </View>
  );
};

// ScheduleAppointment component
export default function ScheduleAppointment(props: {
  onSuccess?: () => void;
  onboarding?: boolean;
  reschedule?: boolean;
  appointmentId?: string;
}) {
  const [patientId] = useAtom(patientIdAtom);
  const [selectedSlot, setSelectedSlot] = useAtom(selectedSlotAtom);
  const [, setSelectedDate] = useAtom(selectedDateAtom);

  const [, setOnboardingDate] = useAtom(onboardingDateAtom);
  const utils = api.useUtils();

  const { isLoading, isError, data, error } = api.scheduling.getSlots.useQuery({
    query: {
      schedule: "Location.1-Staff.4ab37cded7e647e2827b548cd21f8bf2", // TODO: set up multiple providers
      duration: "30",
      end: "2024-03-14",
    },
  });

  const mutation = api.scheduling.createAppointment.useMutation({
    onSuccess: () => {
      // Invalidate the scheduling router so it will be refetched
      void utils.scheduling.invalidate();

      // Reset state
      setSelectedSlot(null);
      setSelectedDate("");

      // Set onboarding date for confirmation page if onboarding
      if (props.onboarding) {
        setOnboardingDate(selectedSlot?.start ?? "");
      }

      // run onSuccess callback if provided
      if (props.onSuccess) {
        props.onSuccess();
      }
    },
  });

  const updateMutation = api.scheduling.updateAppointment.useMutation({
    onSuccess: () => {
      // Invalidate the scheduling router so it will be refetched
      void utils.scheduling.invalidate();

      // Reset state
      setSelectedSlot(null);
      setSelectedDate("");

      // run onSuccess callback if provided
      if (props.onSuccess) {
        props.onSuccess();
      }
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

  function onBook(slot: SlotResource | null) {
    if (!slot) {
      return;
    }

    const locationReference = extractLocationId(slot.schedule.reference);

    // for creating a new appointment
    const requestBody = {
      contained: [
        {
          resourceType: "Endpoint",
          id: "appointment-meeting-endpoint",
          status: "active",
          connectionType: {
            code: "https",
          },
          payloadType: [
            {
              coding: [
                {
                  code: "video-call",
                },
              ],
            },
          ],
          address:
            "https://us05web.zoom.us/j/86069191358?pwd=Jbd0sfszdqxq2dr66iKUTIJMXxq5E1.1",
        },
      ],
      status: "proposed",
      appointmentType: {
        coding: [
          {
            system: "http://snomed.info/sct",
            code: "448337001",
            display: "Telemedicine consultation with patient",
          },
        ],
      },
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
        {
          reference: "#appointment-meeting-endpoint",
          type: "Endpoint",
        },
      ],
      start: slot.start,
      end: slot.end,
      participant: [
        {
          actor: {
            reference: "Practitioner/4ab37cded7e647e2827b548cd21f8bf2", // TODO: set up multiple providers
          },
          status: "accepted",
        },
        {
          actor: {
            reference: `Patient/${patientId}`,
          },
          status: "accepted",
        },
      ],
    };

    // for updating an existing appointment
    const updateRequestBody = {
      status: "booked",
      supportingInformation: [
        {
          reference: locationReference,
        },
        {
          reference: "#appointment-meeting-endpoint",
          type: "Endpoint",
        },
      ],
      start: slot.start,
      end: slot.end,
      participant: [
        {
          actor: {
            reference: "Practitioner/4ab37cded7e647e2827b548cd21f8bf2", // TODO: set up multiple providers
          },
          status: "accepted",
        },
        {
          actor: {
            reference: `Patient/${patientId}`,
          },
          status: "accepted",
        },
      ],
    };

    // Check if it's a new appointment or an update
    if (props.appointmentId) {
      // Updating the appointment
      updateMutation.mutate({
        path: { appointment_id: props.appointmentId },
        body: updateRequestBody,
      });
    } else {
      // Creating a new appointment
      mutation.mutate({
        body: requestBody,
      });
    }
  }

  const slots = data?.entry?.map((e) => e?.resource);

  if (isLoading) {
    return <LoaderComponent />;
  }

  if (isError) {
    return <Text>Error: {error?.message}</Text>;
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1">
        <ScheduleHeader />
        <View className="flex-1">
          {/* Display slots based on selectedDate */}
          <TimeSlots slots={slots ?? []} />
        </View>
        <View className="px-12 pb-4">
          <Button
            key={selectedSlot ? "enabled" : "disabled"}
            onPress={() => onBook(selectedSlot)}
            disabled={!selectedSlot}
            textClass="text-center"
          >
            {mutation.isLoading || updateMutation.isLoading ? (
              <View className="flex-row items-center justify-center gap-3">
                <Loader2
                  size={24}
                  color="white"
                  strokeWidth={3}
                  className="animate-spin"
                />
                <Text className="text-xl font-medium text-primary-foreground">
                  {props.reschedule ? "Rescheduling..." : "Booking..."}
                </Text>
              </View>
            ) : props.reschedule ? (
              "Reschedule"
            ) : (
              "Book"
            )}
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}
