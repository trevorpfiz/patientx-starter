import React from "react";
import { Text, View } from "react-native";
import { useAtom } from "jotai";
import { Calendar, Clock, Loader2 } from "lucide-react-native";

import type { CareTeamBundle } from "@acme/shared/src/validators/care-team";

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

export default function NextAppointment() {
  const [patientId] = useAtom(patientIdAtom);

  const { isLoading, isError, data, error } =
    api.patientMedicalHistory.getPatientAppointments.useQuery({ patientId });

  const careTeamQuery = api.careTeam.searchCareTeam.useQuery({
    query: {
      patient: patientId,
    },
  });

  function mapPractitionerIdsToNames(careTeamData: CareTeamBundle) {
    const practitionerMap = new Map();
    careTeamData?.entry?.forEach((entry) => {
      entry.resource.participant.forEach((participant) => {
        const id = participant.member.reference.split("/")[1]; // Extracts ID from "Practitioner/ID"
        let name = participant.member.display;

        // Ensure there is a comma between the name and title if not already present
        if (!name.includes(",")) {
          name = name.replace(/(\sMD|\sPhD|\sDO|\sRN|\sDVM|\sDDS|\DPM)/, ",$1");
        }

        const displayRole = participant.role
          .map((role) => role.coding.map((coding) => coding.display).join(", "))
          .join("; ");
        practitionerMap.set(id, { name, role: displayRole });
      });
    });
    return practitionerMap;
  }

  if (isLoading || careTeamQuery.isLoading) {
    return (
      <View className="mb-36 flex-1 items-center justify-center bg-white">
        <Loader2
          size={48}
          color="black"
          strokeWidth={2}
          className="animate-spin"
        />
      </View>
    );
  }

  if (isError || careTeamQuery.isError) {
    return <Text>Error: {error?.message ?? careTeamQuery.error?.message}</Text>;
  }

  // derived data from queries
  const careTeamData = careTeamQuery.data;
  const practitionerMap =
    careTeamData && mapPractitionerIdsToNames(careTeamData);

  let appointments = data?.entry;
  let soonestAppointment = null;
  // Only show completed appointments
  if (appointments) {
    appointments = appointments
      .filter(
        (appointment) =>
          appointment.resource.status !== "cancelled" &&
          appointment.resource.status !== "fulfilled",
      )
      .sort((a, b) => a.resource.start.localeCompare(b.resource.start));

    soonestAppointment = appointments[0];
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
