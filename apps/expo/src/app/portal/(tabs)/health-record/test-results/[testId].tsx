import { Text, View } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import { FlashList } from "@shopify/flash-list";

import {
  ChatRightHeaderClose,
  MessagesLeftHeaderBack,
} from "~/components/ui/headers/messages-header";
import ResultItem from "~/components/ui/health-record/result-item";
import { api } from "~/utils/api";

export default function TestPage() {
  const { testId, type } = useLocalSearchParams<{
    testId: string;
    type: "Observation" | "DiagnosticReport";
  }>();

  const diagnosticReportQuery =
    api.diagnosticReport.getDiagnosticReport.useQuery(
      {
        id: testId,
      },
      {
        enabled: type === "DiagnosticReport",
      },
    );

  const observationQuery = api.observation.getObservation.useQuery(
    {
      id: testId,
    },
    {
      enabled: type === "Observation",
    },
  );

  const isLoading =
    diagnosticReportQuery.isLoading || observationQuery.isLoading;
  const isError = diagnosticReportQuery.isError || observationQuery.isError;
  const error = diagnosticReportQuery.error ?? observationQuery.error;
  const data =
    type === "DiagnosticReport"
      ? diagnosticReportQuery.data
      : observationQuery.data;

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (isError) {
    return <Text>Error: {error?.message}</Text>;
  }

  const diagnosticReportItems = diagnosticReportQuery.data?.presentedForm;
  const observationItems = observationQuery.data?.hasMember;

  return (
    <View className="flex-1 bg-gray-100">
      <Stack.Screen
        options={{
          title: testId,
          headerLeft: () => <MessagesLeftHeaderBack />,
          headerRight: () => <ChatRightHeaderClose />,
        }}
      />
      <Text className="text-lg font-semibold">
        {data?.code?.coding?.[0]?.display ?? "Unknown Test"}
      </Text>
      <Text>Collected on {data?.effectiveDateTime ?? "Unknown Date"}</Text>

      {type === "DiagnosticReport" && diagnosticReportItems && (
        <FlashList
          data={diagnosticReportItems}
          renderItem={({ item, index }) => <Text>DiagnosticReport Result</Text>}
          estimatedItemSize={100}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{
            paddingBottom: 16,
            // paddingTop: 16,
            // paddingHorizontal: 16,
          }}
        />
      )}

      {type === "Observation" && observationItems && (
        <FlashList
          data={observationItems.map((item) => ({ url: item.reference }))} // Transform to match expected shape
          renderItem={({ item, index }) => <Text>Observation Result</Text>}
          estimatedItemSize={100}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{
            paddingBottom: 16,
            // paddingTop: 16,
            // paddingHorizontal: 16,
          }}
        />
      )}
    </View>
  );
}
