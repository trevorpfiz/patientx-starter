import { Text, View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { useAtom } from "jotai";

import { patientIdAtom } from "~/app/(main)";
import ImmunizationItem from "~/components/ui/health-record/immunization-item";
import { LoaderComponent } from "~/components/ui/loader";
import { api } from "~/utils/api";

export default function Immunizations() {
  const [patientId] = useAtom(patientIdAtom);

  const { isLoading, isError, data, error } =
    api.patientMedicalHistory.getPatientImmunizations.useQuery({ patientId });

  if (isLoading) {
    return <LoaderComponent />;
  }

  if (isError) {
    return <Text>Error: {error.message}</Text>;
  }

  const immunizations = data?.entry;

  return (
    <View className="flex-1 bg-gray-100">
      {data.total > 0 ? (
        <FlashList
          data={immunizations}
          renderItem={({ item, index }) => (
            <ImmunizationItem
              immunization={item.resource.vaccineCode.coding[0]?.display ?? ""}
              status={item.resource.status}
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
