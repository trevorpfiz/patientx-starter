import React from "react";
import { Text, View } from "react-native";
import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
import { FlashList } from "@shopify/flash-list";
import { useAtom } from "jotai";

import type { AppointmentResource } from "@acme/shared/src/validators/appointment";

import { patientIdAtom } from "~/app";
import { AppointmentCard } from "~/components/ui/cards/appointment-card";
import { LoaderComponent } from "~/components/ui/loader";
import { api } from "~/utils/api";
import { mapPractitionerIdsToNames } from "~/utils/scheduling";

export default function UpcomingAppointments() {
  const [patientId] = useAtom(patientIdAtom);
  const router = useRouter();
  const utils = api.useUtils();

  const appointmentQuery = api.scheduling.searchAppointments.useQuery({
    query: {
      patient: `Patient/${patientId}`,
      _sort: "date",
      _count: "100",
    },
  });

  const careTeamQuery = api.careTeam.searchCareTeam.useQuery({
    query: {
      patient: patientId,
    },
  });

  const isLoading = appointmentQuery.isLoading || careTeamQuery.isLoading;
  const isError = appointmentQuery.isError || careTeamQuery.isError;
  const error = appointmentQuery.error ?? careTeamQuery.error;

  const mutation = api.scheduling.updateAppointment.useMutation({
    onSuccess: () => {
      // Invalidate the scheduling router so it will be refetched
      void utils.scheduling.invalidate();
    },
  });

  // for marking an appointment as completed
  function markAppointmentAsFulfilled(appointment: AppointmentResource) {
    const fulfilledRequestBody = {
      status: "fulfilled",
      supportingInformation: appointment.supportingInformation,
      start: appointment.start,
      end: appointment.end,
      participant: appointment.participant,
    };

    mutation.mutate({
      path: { appointment_id: appointment.id },
      body: fulfilledRequestBody,
    });
  }

  // for joining an appointment
  async function joinAppointment(appointment: AppointmentResource) {
    await Linking.openURL(appointment?.contained?.[0]?.address ?? "");
  }

  // for rescheduling an appointment
  function rescheduleAppointment(appointment: AppointmentResource) {
    router.push({
      pathname: "/portal/(tabs)/appointments/reschedule",
      params: {
        appointmentId: appointment.id,
      },
    });
  }

  // for cancelling an appointment
  async function cancelAppointment(appointment: AppointmentResource) {
    const cancelRequestBody = {
      status: "cancelled",
      supportingInformation: appointment.supportingInformation,
      start: appointment.start,
      end: appointment.end,
      participant: appointment.participant,
    };

    await mutation.mutateAsync({
      path: { appointment_id: appointment.id },
      body: cancelRequestBody,
    });
  }

  // derived data from queries
  const careTeamData = careTeamQuery.data;
  const practitionerMap =
    careTeamData && mapPractitionerIdsToNames(careTeamData);

  let appointments = appointmentQuery.data?.entry;
  // Sort appointments by the start date and filter out cancelled/fulfilled
  if (appointments) {
    appointments = appointments.filter(
      (appointment) =>
        appointment.resource.status !== "cancelled" &&
        appointment.resource.status !== "fulfilled",
    );
  }

  if (isLoading) {
    return <LoaderComponent />;
  }

  if (isError) {
    return <Text>Error: {error?.message ?? careTeamQuery.error?.message}</Text>;
  }

  return (
    <View className="flex-1 bg-gray-100">
      {appointments && appointments.length > 0 ? (
        <FlashList
          data={appointments}
          renderItem={({ item }) => {
            const practitionerId =
              item.resource.participant
                .find((p) => p.actor.type === "Practitioner")
                ?.actor.reference.split("/")[1] ?? "";
            const practitionerInfo = practitionerMap?.get(practitionerId) ?? {
              name: "Unknown Practitioner",
              role: "Unknown Role",
            };

            return (
              <View className="flex-1 justify-center p-6">
                <AppointmentCard
                  appointment={item.resource}
                  practitionerInfo={practitionerInfo}
                  showButtons={true}
                  markAppointmentAsFulfilled={markAppointmentAsFulfilled}
                  joinAppointment={joinAppointment}
                  rescheduleAppointment={rescheduleAppointment}
                  cancelAppointment={cancelAppointment}
                  isCancelling={mutation.isLoading}
                />
              </View>
            );
          }}
          estimatedItemSize={200}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{
            paddingBottom: 16,
            // paddingTop: 16,
            // paddingHorizontal: 16,
          }}
        />
      ) : (
        <Text className="p-8">{`No appointments found.`}</Text>
      )}
    </View>
  );
}
