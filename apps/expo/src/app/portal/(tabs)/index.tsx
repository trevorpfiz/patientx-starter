import { Text, View } from "react-native";
import { useAtom } from "jotai";

import { patientIdAtom } from "~/components/forms/welcome-form";
import NextAppointment from "~/components/next-appointment";
import Tasks from "~/components/tasks";
import { api } from "~/utils/api";

export default function Home() {
  const [patientId] = useAtom(patientIdAtom);

  const patientQuery = api.patient.getPatient.useQuery({
    path: {
      patient_id: patientId,
    },
  });

  return (
    <View className="flex-1 flex-col gap-8 px-6 py-4">
      {/* Welcome message */}
      <Text className="text-3xl font-semibold">
        Good Morning, {patientQuery.data?.name?.[0]?.given?.[0] ?? "User"}
      </Text>
      {/* Next appointment */}
      <View>
        <NextAppointment />
      </View>
      {/* Tasks */}
      <View className="flex-1">
        <Tasks />
      </View>
    </View>
  );
}
