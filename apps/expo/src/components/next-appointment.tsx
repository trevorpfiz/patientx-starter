import React, { useMemo } from "react";
import { Text, View } from "react-native";
import { useAtom } from "jotai";

import { patientIdAtom } from "~/app";
import { AppointmentCard } from "~/components/ui/cards/appointment-card";
import { LoaderComponent } from "~/components/ui/loader";
import { api } from "~/utils/api";
import { mapPractitionerIdsToNames } from "~/utils/scheduling";

export default function NextAppointment() {
  const [patientId] = useAtom(patientIdAtom);

  const appointmentQuery = api.scheduling.searchAppointments.useQuery({
    query: { patient: `Patient/${patientId}`, _sort: "date", _count: "100" },
  });

  const careTeamQuery = api.careTeam.searchCareTeam.useQuery({
    query: {
      patient: patientId,
    },
  });

  const isLoading = appointmentQuery.isLoading || careTeamQuery.isLoading;
  const isError = appointmentQuery.isError || careTeamQuery.isError;
  const error = appointmentQuery.error ?? careTeamQuery.error;

  // derived data from queries
  const careTeamData = careTeamQuery.data;
  const practitionerMap =
    careTeamData && mapPractitionerIdsToNames(careTeamData);

  const soonestAppointment = useMemo(() => {
    const appointments = appointmentQuery.data?.entry
      ?.filter(
        (appointment) =>
          appointment.resource.status !== "cancelled" &&
          appointment.resource.status !== "fulfilled",
      )
      .sort((a, b) => a.resource.start.localeCompare(b.resource.start));

    return appointments?.[0];
  }, [appointmentQuery.data?.entry]);

  if (isLoading) {
    return <LoaderComponent className="mt-8" />;
  }

  if (isError) {
    return <Text>Error: {error?.message}</Text>;
  }

  const practitionerId =
    soonestAppointment?.resource.participant
      .find((p) => p.actor.type === "Practitioner")
      ?.actor.reference.split("/")[1] ?? "";
  const practitionerInfo = practitionerMap?.get(practitionerId) ?? {
    name: "Unknown Practitioner",
    role: "Unknown Role",
  };

  return (
    <View>
      {soonestAppointment ? (
        <AppointmentCard
          appointment={soonestAppointment.resource}
          practitionerInfo={practitionerInfo}
          footerContent="Completed"
        />
      ) : (
        <Text className="p-8">{`No appointments found.`}</Text>
      )}
    </View>
  );
}
