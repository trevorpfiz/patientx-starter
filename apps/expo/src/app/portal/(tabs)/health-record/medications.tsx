import { Text, View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { useAtom } from "jotai";
import { Loader2 } from "lucide-react-native";

import { patientIdAtom } from "~/app";
import MedicationItem from "~/components/ui/health-record/medication-item";
import { api } from "~/utils/api";

export default function Medications() {
  const [patientId] = useAtom(patientIdAtom);

  const { isLoading, isError, data, error } =
    api.patientMedicalHistory.getPatientMedications.useQuery({ patientId });

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <Text>Error: {error.message}</Text>;
  }

  const medications = data?.entry;

  return (
    <View className="flex-1 bg-gray-100">
      {data.total > 0 ? (
        <FlashList
          data={medications}
          renderItem={({ item, index }) => (
            <MedicationItem
              medication={
                item.resource?.medicationReference?.display ??
                item.resource?.medicationCodeableConcept?.coding?.[0]
                  ?.display ??
                "unknown medication"
              }
              status={item.resource.status}
              dosage={item.resource?.dosage?.[0]?.text ?? "unknown dosage"}
              start={item.resource?.effectivePeriod?.start ?? "unknown"}
              end={item.resource?.effectivePeriod?.end ?? "unknown"}
              first={index === 0}
              last={index === data.total - 1}
            />
          )}
          estimatedItemSize={100}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{
            paddingBottom: 16,
            // paddingTop: 16,
            // paddingHorizontal: 16,
          }}
        />
      ) : (
        <Text className="p-8">{`No medications found.`}</Text>
      )}
    </View>
  );
}
