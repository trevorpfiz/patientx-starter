import React from "react";
import { Text, View } from "react-native";
import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
import { FlashList } from "@shopify/flash-list";
import { useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { Calendar, Clock, Loader2 } from "lucide-react-native";

import type { AppointmentResource } from "@acme/shared/src/validators/appointment";

import { patientIdAtom } from "~/app";
import { Loader } from "~/components/ui/loader";
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
import { mapPractitionerIdsToNames } from "~/utils/scheduling";

export default function UpcomingAppointments() {
  const [patientId] = useAtom(patientIdAtom);
  const router = useRouter();
  const queryClient = useQueryClient();

  const appointmentQuery = api.scheduling.searchAppointments.useQuery({
    query: {
      patient: `Patient/${patientId}`,
      status: "proposed",
      _sort: "date",
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
    onSuccess: async (data) => {
      // Invalidate the query cache
      await queryClient.invalidateQueries();
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

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <Text>Error: {error?.message}</Text>;
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
                        {/* TODO: add avatar! */}
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
                        {formatDayDate(item.resource.start)}
                      </Text>
                    </View>
                    <View className="flex-row items-center gap-2">
                      <Clock size={24} />
                      <Text className="text-muted-foreground">
                        {formatTime(item.resource.start)}
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
                              <View className="flex-row items-center justify-center gap-3">
                                <Loader2
                                  size={24}
                                  color="white"
                                  strokeWidth={3}
                                  className="animate-spin"
                                />
                                <Text className="text-xl font-medium text-primary-foreground">
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
