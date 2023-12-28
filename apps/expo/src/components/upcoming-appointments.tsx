import React from "react";
import { Alert, Text, View } from "react-native";
import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
import { FlashList } from "@shopify/flash-list";
import { useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { Calendar, Clock, Loader2 } from "lucide-react-native";

import type { AppointmentResource } from "@acme/shared/src/validators/appointment";
import type { CareTeamBundle } from "@acme/shared/src/validators/care-team";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/rn-ui/components/ui/alert-dialog";
import { Button } from "~/components/ui/rn-ui/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/rn-ui/components/ui/card";
import { api } from "~/utils/api";
import { formatDayDate, formatTime } from "~/utils/dates";
import { patientIdAtom } from "./forms/welcome-form";

export default function UpcomingAppointments() {
  const [patientId] = useAtom(patientIdAtom);
  const router = useRouter();
  const queryClient = useQueryClient();

  const { isLoading, isError, data, error } =
    api.patientMedicalHistory.getPatientAppointments.useQuery({ patientId });

  const careTeamQuery = api.careTeam.searchCareTeam.useQuery({
    query: {
      patient: patientId,
    },
  });

  const mutation = api.scheduling.updateAppointment.useMutation({
    onSuccess: async (data) => {
      console.log(data, "data");

      // Invalidate the query cache
      await queryClient.invalidateQueries();
    },
    onError: (error) => {
      console.log(error, "error");
      console.log(JSON.stringify(error));
      Alert.alert("Warning", JSON.stringify(error));
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
  // Sort appointments by the start date and filter out cancelled/fulfilled
  if (appointments) {
    appointments = appointments
      .filter(
        (appointment) =>
          appointment.resource.status !== "cancelled" &&
          appointment.resource.status !== "fulfilled",
      )
      .sort((a, b) => a.resource.start.localeCompare(b.resource.start));
  }

  return (
    <View className="flex-1 bg-gray-100">
      {appointments && appointments.length > 0 ? (
        <FlashList
          data={appointments}
          renderItem={({ item, index }) => {
            const practitionerId = item.resource.participant
              .find((p) => p.actor.type === "Practitioner")
              ?.actor.reference.split("/")[1];
            const practitionerInfo = practitionerMap?.get(practitionerId) || {
              name: "Unknown Practitioner",
              role: "Unknown Role",
            };

            return (
              <View className="flex-1 justify-center p-6">
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
                        <CardDescription>
                          {practitionerInfo.role}
                        </CardDescription>
                      </View>
                    </View>
                  </CardHeader>
                  <CardContent className="flex-row gap-4">
                    <View className="flex-row items-center gap-2">
                      <Calendar size={24} />
                      <Text className="text-muted-foreground">
                        {formatDayDate(new Date(item.resource.start))}
                      </Text>
                    </View>
                    <View className="flex-row items-center gap-2">
                      <Clock size={24} />
                      <Text className="text-muted-foreground">
                        {formatTime(new Date(item.resource.start))}
                      </Text>
                    </View>
                  </CardContent>
                  <CardFooter className="flex-row gap-4">
                    <Button
                      variant="default"
                      size="sm"
                      className="flex-[2]"
                      onPress={async () => {
                        await Linking.openURL(
                          item.resource?.contained?.[0]?.address ?? "",
                        );
                        markAppointmentAsFulfilled(item.resource);
                      }}
                    >
                      Join
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onPress={() =>
                        router.push({
                          pathname: "/portal/(tabs)/appointments/reschedule",
                          params: {
                            appointmentId: item.resource.id,
                          },
                        })
                      }
                    >
                      Reschedule
                    </Button>

                    {/* Cancel */}
                    <AlertDialog>
                      <AlertDialogTrigger variant="outline" size="sm">
                        Cancel
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            {`Your appointment will be cancelled. To reschedule instead, you can find your appointment in the 'Upcoming' tab and press the 'Reschedule' button.`}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Nevermind</AlertDialogCancel>
                          <AlertDialogAction
                            onPress={async () =>
                              await cancelAppointment(item.resource)
                            }
                          >
                            {mutation.isLoading ? (
                              <View className="flex-row gap-3">
                                <Loader2
                                  size={24}
                                  color="white"
                                  className="animate-spin"
                                />
                                <Text className="text-lg text-white">
                                  Cancelling...
                                </Text>
                              </View>
                            ) : (
                              "Proceed"
                            )}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </CardFooter>
                </Card>
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
