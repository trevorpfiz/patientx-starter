import React, { useMemo } from "react";
import { Text, View } from "react-native";
import { useAtom } from "jotai";
import { Calendar, Clock, Loader2 } from "lucide-react-native";

import { patientIdAtom } from "~/app";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/rn-ui/components/ui/card";
import { api } from "~/utils/api";
import { formatDayDate, formatTime } from "~/utils/dates";
import { mapPractitionerIdsToNames } from "~/utils/scheduling";

export default function NextAppointment() {
  const [patientId] = useAtom(patientIdAtom);

  const appointmentQuery = api.scheduling.searchAppointments.useQuery({
    query: { patient: `Patient/${patientId}`, _sort: "date" },
  });

  const careTeamQuery = api.careTeam.searchCareTeam.useQuery({
    query: {
      patient: patientId,
    },
  });

  const isLoading = appointmentQuery.isLoading || careTeamQuery.isLoading;
  const isError = appointmentQuery.isError || careTeamQuery.isError;
  const error = appointmentQuery.error ?? careTeamQuery.error;

  const careTeamData = careTeamQuery.data;
  const practitionerMap = useMemo(
    () => mapPractitionerIdsToNames(careTeamData),
    [careTeamData],
  );

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
    return <Loader />;
  }

  if (isError) {
    return <Text>Error: {error?.message}</Text>;
  }

  const practitionerId = soonestAppointment?.resource.participant
    .find((p) => p.actor.type === "Practitioner")
    ?.actor.reference.split("/")[1];
  const practitionerInfo = practitionerMap?.get(practitionerId) || {
    name: "Unknown Practitioner",
    role: "Unknown Role",
  };

  return (
    <View>
      {soonestAppointment ? (
        <Card>
          <CardHeader>
            <View className="flex-row items-center">
              {/* Avatar */}
              <View className="mr-4">
                <View className="h-14 w-14 rounded-full bg-blue-500" />

                {/* Uncomment the line below to use a stock image */}
                {/* <Image source={{ uri: 'https://via.placeholder.com/50' }} className="w-12 h-12 rounded-full" /> */}
              </View>
              <View>
                <CardTitle>{practitionerInfo.name}</CardTitle>
                <CardDescription>{practitionerInfo.role}</CardDescription>
              </View>
            </View>
          </CardHeader>
          <CardContent className="flex-row gap-4">
            <View className="flex-row items-center gap-2">
              <Calendar size={24} />
              <Text className="text-muted-foreground">
                {formatDayDate(soonestAppointment.resource.start)}
              </Text>
            </View>
            <View className="flex-row items-center gap-2">
              <Clock size={24} />
              <Text className="text-muted-foreground">
                {formatTime(soonestAppointment.resource.start)}
              </Text>
            </View>
          </CardContent>
        </Card>
      ) : (
        <Text className="p-8">{`No appointments found.`}</Text>
      )}
    </View>
  );
}
