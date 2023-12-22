import { Text, View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { useAtom } from "jotai";

import { patientIdAtom } from "~/components/forms/welcome-form";
import ConditionItem from "~/components/ui/health-record/condition-item";
import { api } from "~/utils/api";

export default function Conditions() {
  const [patientId] = useAtom(patientIdAtom);

  const { isLoading, isError, data, error } =
    api.patientMedicalHistory.getPatientConditions.useQuery({ patientId });

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (isError) {
    return <Text>Error: {error.message}</Text>;
  }

  const conditions = data?.entry;

  return (
    <View className="flex-1 bg-gray-100">
      {data?.total > 0 ? (
        <FlashList
          data={conditions}
          renderItem={({ item, index }) => (
            <ConditionItem
              condition={
                item.resource.category?.[0]?.coding[0]?.display ?? "unknown"
              }
              status={
                item.resource.clinicalStatus?.coding[0]?.display ?? "unknown"
              }
              onset={item.resource.onsetDateTime ?? "unknown"}
              abatement={item.resource.abatementDateTime ?? "unknown"}
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
        <Text className="p-8">{`No immunizations found.`}</Text>
      )}
    </View>
  );
}
