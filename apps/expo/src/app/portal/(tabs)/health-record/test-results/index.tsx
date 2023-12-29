import { Text, View } from "react-native";
import { useRouter } from "expo-router";
import { FlashList } from "@shopify/flash-list";
import { useAtom } from "jotai";

import { patientIdAtom } from "~/app";
import TestItem from "~/components/ui/health-record/test-item";
import { api } from "~/utils/api";

export default function TestResultsPage() {
  const [patientId] = useAtom(patientIdAtom);
  const router = useRouter();

  const { isLoading, isError, data, error } =
    api.patientMedicalHistory.getPatientDiagnosticReports.useQuery({
      patientId,
    });

  const {
    isLoading: isObsLoading,
    isError: isObsError,
    data: obsData,
    error: obsError,
  } = api.patientMedicalHistory.getPatientObservations.useQuery({
    patientId,
  });

  if (isLoading || isObsLoading) {
    return <Text>Loading...</Text>;
  }

  if (isError || isObsError) {
    return <Text>Error: {error?.message ?? obsError?.message}</Text>;
  }

  // Filter Observations with hasMember property
  const observationWithMembers =
    obsData?.entry?.filter(
      (item) =>
        item.resource?.hasMember &&
        item.resource.resourceType === "Observation",
    ) ?? [];

  // Merge diagnostic reports with filtered observations
  const mergedData = [
    ...(data?.entry?.map((item) => ({ ...item, type: "diagnosticReport" })) ??
      []),
    ...observationWithMembers.map((item) => ({ ...item, type: "observation" })),
  ];

  return (
    <View className="flex-1 bg-gray-100">
      {data?.total > 0 ? (
        <FlashList
          data={mergedData}
          renderItem={({ item, index }) => (
            <TestItem
              name={item.resource?.code?.coding?.[0]?.display ?? "Unknown test"}
              authored={item.resource?.effectiveDateTime ?? "Unknown date"}
              issued={item.resource?.issued ?? "Unknown date"}
              type={item.resource.resourceType === "Observation" ? true : false}
              onPress={() =>
                router.push({
                  pathname: `/portal/(tabs)/health-record/test-results/${item.resource?.id}`,
                  params: {
                    type: item.resource.resourceType,
                    testName:
                      item.resource?.code?.coding?.[0]?.display ?? "Test",
                  },
                })
              }
              first={index === 0}
              last={index === mergedData.length - 1}
            />
          )}
          estimatedItemSize={100}
          keyExtractor={(item, index) => item.resource?.id ?? index.toString()}
          contentContainerStyle={{
            paddingBottom: 16,
          }}
        />
      ) : (
        <Text className="p-8">{`No test results found.`}</Text>
      )}
    </View>
  );
}
