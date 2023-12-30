import { Text, View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { useAtom } from "jotai";

import { patientIdAtom } from "~/app/(main)";
import ConsentItem from "~/components/ui/health-record/consent-item";
import { LoaderComponent } from "~/components/ui/loader";
import { api } from "~/utils/api";

export default function ConsentsPage() {
  const [patientId] = useAtom(patientIdAtom);

  const { isLoading, isError, data, error } =
    api.patientMedicalHistory.getPatientConsents.useQuery({
      patientId,
    });

  if (isLoading) {
    return <LoaderComponent />;
  }

  if (isError) {
    return <Text>Error: {error.message}</Text>;
  }

  const consents = data?.entry;

  return (
    <View className="flex-1 bg-gray-100">
      {data?.total > 0 ? (
        <FlashList
          data={consents}
          renderItem={({ item, index }) => (
            <ConsentItem
              consent={
                item.resource?.category?.[0]?.coding?.[0]?.display ??
                "unknown consent"
              }
              status={item.resource?.status ?? "unknown"}
              start={item.resource?.provision?.period?.start ?? "unknown"}
              end={item.resource?.provision?.period?.end ?? "unknown"}
              source={item.resource?.sourceAttachment?.url ?? ""}
              first={index === 0}
              last={index === data?.total - 1}
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
        <Text className="p-8">{`No consents found.`}</Text>
      )}
    </View>
  );
}
