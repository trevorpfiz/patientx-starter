import React from "react";
import { Text, View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { useAtom } from "jotai";

import { patientIdAtom } from "~/app/(main)";
import { AppointmentCard } from "~/components/ui/cards/appointment-card";
import { LoaderComponent } from "~/components/ui/loader";
import { api } from "~/utils/api";
import { mapPractitionerIdsToNames } from "~/utils/scheduling";

export default function CompletedAppointments() {
  const [patientId] = useAtom(patientIdAtom);

  const appointmentQuery = api.scheduling.searchAppointments.useQuery({
    query: {
      patient: `Patient/${patientId}`,
      status: "fulfilled",
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

  if (isLoading) {
    return <LoaderComponent />;
  }

  if (isError) {
    return <Text>Error: {error?.message}</Text>;
  }

  // derived data from queries
  const careTeamData = careTeamQuery.data;
  const practitionerMap =
    careTeamData && mapPractitionerIdsToNames(careTeamData);

  const appointments = appointmentQuery.data?.entry ?? [];
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
                  footerContent="Completed"
                />
              </View>
            );
          }}
          estimatedItemSize={200}
          keyExtractor={(item, index) => index.toString()}
        />
      ) : (
        <Text className="p-8">{`No completed appointments found.`}</Text>
      )}
    </View>
  );
}
