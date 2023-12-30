import React from "react";
import { Text, View } from "react-native";
import { Calendar, Clock, Loader2 } from "lucide-react-native";

import type { AppointmentResource } from "@acme/shared/src/validators/appointment";

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
import { formatDayDate, formatTime } from "~/utils/dates";
import type { PractitionerInfo } from "~/utils/scheduling";

interface AppointmentCardProps {
  appointment: AppointmentResource;
  practitionerInfo: PractitionerInfo;
  showButtons?: boolean;
  markAppointmentAsFulfilled?: (appointment: AppointmentResource) => void;
  joinAppointment?: (appointment: AppointmentResource) => Promise<void>;
  rescheduleAppointment?: (appointment: AppointmentResource) => void;
  cancelAppointment?: (appointment: AppointmentResource) => Promise<void>;
  isCancelling?: boolean;
  footerContent?: React.ReactNode;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
  practitionerInfo,
  showButtons,
  markAppointmentAsFulfilled,
  joinAppointment,
  rescheduleAppointment,
  cancelAppointment,
  isCancelling,
  footerContent,
}) => {
  return (
    <Card>
      <CardHeader>
        <View className="flex-row items-center">
          <View className="mr-4">
            <View className="h-14 w-14 rounded-full bg-blue-500" />
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
            {formatDayDate(appointment.start)}
          </Text>
        </View>
        <View className="flex-row items-center gap-2">
          <Clock size={24} />
          <Text className="text-muted-foreground">
            {formatTime(appointment.start)}
          </Text>
        </View>
      </CardContent>
      <CardFooter className="flex-row gap-4">
        {showButtons ? (
          <>
            {/* Join */}
            <Button
              variant="default"
              size="sm"
              className="flex-[2]"
              onPress={async () => {
                await joinAppointment?.(appointment);

                markAppointmentAsFulfilled?.(appointment);
              }}
            >
              Join
            </Button>
            {/* Reschedule */}
            <Button
              variant="secondary"
              size="sm"
              onPress={() => rescheduleAppointment?.(appointment)}
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
                    onPress={async () => await cancelAppointment?.(appointment)}
                  >
                    {isCancelling ? (
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
          </>
        ) : footerContent ? (
          <Text className="text-muted-foreground">{footerContent}</Text>
        ) : null}
      </CardFooter>
    </Card>
  );
};

export { AppointmentCard };
