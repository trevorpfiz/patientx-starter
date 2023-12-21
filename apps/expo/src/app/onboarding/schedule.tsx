import React from "react";
import {
  Alert,
  Button,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { atom, useAtom, useSetAtom } from "jotai";

import type { SlotResource } from "@acme/shared/src/validators/slot";

import {
  ScheduleHeader,
  selectedDateAtom,
} from "~/components/ui/headers/schedule-header";
import { api } from "~/utils/api";
import { formatTime } from "~/utils/dates";

export const selectedSlotAtom = atom<SlotResource | null>(null);

// TimeSlots component to render the slots
const TimeSlots = ({ slots }: { slots: SlotResource[] }) => {
  const [selectedDate] = useAtom(selectedDateAtom);
  const setSelectedSlot = useSetAtom(selectedSlotAtom);

  const filteredSlots = slots.filter((slot) =>
    slot.start.startsWith(selectedDate),
  );

  return (
    <View className="flex flex-wrap">
      {filteredSlots.map((slot, index) => (
        <TouchableOpacity
          key={index}
          className="w-1/4 p-2"
          onPress={() => setSelectedSlot(slot)}
        >
          <View className="rounded-lg bg-white p-4 shadow-md">
            <Text className="text-center">
              {formatTime(new Date(slot.start))}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

// SchedulePage component
export default function SchedulePage() {
  const [selectedSlot] = useAtom(selectedSlotAtom);

  const router = useRouter();

  const { isLoading, isError, data, error } = api.scheduling.getSlots.useQuery({
    query: {
      schedule: "Location.1-Staff.4ab37cded7e647e2827b548cd21f8bf2",
      duration: "30",
      end: "2024-02-28",
    },
  });

  const mutation = api.scheduling.createAppointment.useMutation({
    onSuccess: (data) => {
      console.log(data, "data");

      // Navigate to confirmation page
      router.push("/onboarding/confirmation");
    },
    onError: (error) => {
      console.log(error, "error");
      console.log(JSON.stringify(error));
      Alert.alert("Warning", JSON.stringify(error));
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
      console.log("No slot selected");
      return;
    }

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

  const slots = data?.entry?.map((e) => e?.resource);

  if (isLoading) return <Text>Loading...</Text>;
  if (isError) {
    return <Text>Error: {error?.message}</Text>;
  }

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1">
        <Text className="text-3xl">Book your appointment</Text>
        <ScheduleHeader />
        <ScrollView>
          {/* Display slots based on selectedDate */}
          <TimeSlots slots={slots ?? []} />
        </ScrollView>
        <Button
          title="Book"
          disabled={!selectedSlot}
          onPress={() => onBook(selectedSlot)}
        />
      </View>
    </SafeAreaView>
  );
}
