import { Text, View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { useAtom } from "jotai";

import { patientIdAtom } from "~/app/(main)";
import ConditionItem from "~/components/ui/health-record/condition-item";
import { LoaderComponent } from "~/components/ui/loader";
import { api } from "~/utils/api";

export default function Conditions() {
  const [patientId] = useAtom(patientIdAtom);

  const { isLoading, isError, data, error } =
    api.patientMedicalHistory.getPatientConditions.useQuery({ patientId });

  if (isLoading) {
    return <LoaderComponent />;
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
              condition={item.resource.code?.coding[0]?.display ?? "unknown"}
              status={
                item.resource.clinicalStatus?.coding[0]?.display ?? "unknown"
              }
              onset={item.resource.onsetDateTime ?? "unknown"}
              abatement={item.resource.abatementDateTime ?? "unknown"}
              first={index === 0}
              last={index === data.total - 1}
            />
          )}
          estimatedItemSize={200}
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
