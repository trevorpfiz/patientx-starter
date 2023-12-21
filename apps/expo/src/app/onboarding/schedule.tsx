import React from "react";
import { Alert, Button, SafeAreaView, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { FlashList } from "@shopify/flash-list";
import { useAtom } from "jotai";

import type { SlotResource } from "@acme/shared/src/validators/slot";

import { patientTestAtom } from "~/components/forms/welcome-form";
import {
  ScheduleHeader,
  selectedDateAtom,
} from "~/components/ui/headers/schedule-header";
import {
  selectedSlotAtom,
  SlotItem,
} from "~/components/ui/scheduling/slot-item";
import { api } from "~/utils/api";

// TimeSlots component to render the slots
const TimeSlots = ({ slots }: { slots: SlotResource[] }) => {
  const [patientId] = useAtom(patientTestAtom);
  const [selectedDate] = useAtom(selectedDateAtom);
  const [selectedSlot, setSelectedSlot] = useAtom(selectedSlotAtom);

  const filteredSlots = slots.filter((slot) =>
    slot.start.startsWith(selectedDate),
  );

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
          <Text className="p-2 text-xl font-semibold">Select a time</Text>
        }
      />
    </View>
  );
};

// SchedulePage component
export default function SchedulePage() {
  const [selectedSlot] = useAtom(selectedSlotAtom);

  const router = useRouter();

  const { isLoading, isError, data, error } = api.scheduling.getSlots.useQuery({
    query: {
      schedule: "Location.1-Staff.4ab37cded7e647e2827b548cd21f8bf2", // TODO: set up multiple providers
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
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1">
        <ScheduleHeader />
        <View className="flex-1">
          {/* Display slots based on selectedDate */}
          <TimeSlots slots={slots ?? []} />
        </View>
        <Button
          title="Book"
          disabled={!selectedSlot}
          onPress={() => onBook(selectedSlot)}
        />
      </View>
    </SafeAreaView>
  );
}
