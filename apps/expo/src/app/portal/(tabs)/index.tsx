import { Text, View } from "react-native";
import { useAtom } from "jotai";

import { patientIdAtom } from "~/components/forms/welcome-form";
import NextAppointment from "~/components/next-appointment";
import Tasks from "~/components/tasks";
import { api } from "~/utils/api";
import { formatDateTime } from "~/utils/dates";

export default function Home() {
  const [patientId] = useAtom(patientIdAtom);

  const patientQuery = api.patient.getPatient.useQuery({
    path: {
      patient_id: patientId,
    },
  });

  return (
    <View className="flex flex-col gap-8 p-4">
      {/* Welcome message */}
      <Text>
        Good Morning, {patientQuery.data?.name?.[0]?.given?.[0] ?? "User"}
      </Text>
      {/* Next appointment */}
      <NextAppointment />
      {/* Tasks */}
      <Tasks />
    </View>
  );
}
