import { Text, View } from "react-native";
import { useAtom } from "jotai";
import { Loader2 } from "lucide-react-native";

import { patientIdAtom, patientNameAtom } from "~/app";
import NextAppointment from "~/components/next-appointment";
import Tasks from "~/components/tasks";
import { api } from "~/utils/api";

export default function Home() {
  const [patientId] = useAtom(patientIdAtom);
  const [patientName, setPatientName] = useAtom(patientNameAtom);

  const patientQuery = api.patient.getPatient.useQuery(
    {
      path: {
        patient_id: patientId,
      },
    },
    {
      enabled: !!patientId,
    },
  );

  if (patientQuery.isLoading) {
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

  // Update patient name if not already set and if data is available
  if (
    patientQuery.data?.name?.[0] &&
    (!patientName.firstName || !patientName.lastName)
  ) {
    const firstName = patientQuery.data.name[0].given?.[0] ?? "";
    const lastName = patientQuery.data.name[0].family ?? "";
    setPatientName({ firstName, lastName });
  }

  return (
    <View className="flex-1 flex-col gap-8 bg-gray-100">
      {/* Welcome message */}
      <View className="bg-white px-6 py-8">
        <Text className="text-3xl font-semibold">
          Good to see you, {patientName.firstName || "User"}
        </Text>
      </View>

      {/* Next appointment */}
      <View className="px-6">
        <NextAppointment />
      </View>
      {/* Tasks */}
      <View className="pb-2">
        <Tasks />
      </View>
    </View>
  );
}
