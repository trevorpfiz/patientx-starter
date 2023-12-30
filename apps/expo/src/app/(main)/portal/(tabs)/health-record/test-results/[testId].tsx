import { Text, TouchableOpacity, View } from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { FlashList } from "@shopify/flash-list";
import { useAtom } from "jotai";
import { ChevronRight } from "lucide-react-native";

import { patientIdAtom } from "~/app/(main)";
import ObservationItem from "~/components/ui/health-record/observation-item";
import { LoaderComponent } from "~/components/ui/loader";
import { api } from "~/utils/api";
import { formatDateTime } from "~/utils/dates";

export default function TestPage() {
  const { testId, type, testName } = useLocalSearchParams<{
    testId: string;
    type: "Observation" | "DiagnosticReport";
    testName: string;
  }>();
  const [patientId] = useAtom(patientIdAtom);
  const router = useRouter();

  const diagnosticReportQuery =
    api.diagnosticReport.getDiagnosticReport.useQuery(
      {
        id: testId,
      },
      {
        enabled: type === "DiagnosticReport",
      },
    );

  const observationsQuery =
    api.patientMedicalHistory.getPatientObservations.useQuery(
      {
        patientId,
      },
      {
        enabled: type === "Observation",
      },
    );

  const isLoading =
    diagnosticReportQuery.isInitialLoading ||
    diagnosticReportQuery.isRefetching ||
    observationsQuery.isInitialLoading ||
    observationsQuery.isRefetching; // @link https://github.com/TanStack/query/issues/3584#issuecomment-1369491188
  const isError = diagnosticReportQuery.isError || observationsQuery.isError;
  const error = diagnosticReportQuery.error ?? observationsQuery.error;
  const data =
    type === "DiagnosticReport"
      ? diagnosticReportQuery.data
      : observationsQuery.data;

  if (isLoading) {
    return <LoaderComponent />;
  }

  if (isError) {
    return <Text>Error: {error?.message}</Text>;
  }

  const diagnosticReportItem = diagnosticReportQuery.data;
  // we are pulling all observations, but we only want the ones that are derived from the testId
  const observationItems = observationsQuery.data?.entry?.filter((obsItem) => {
    return obsItem.resource?.derivedFrom?.some(
      (derived) => derived.reference?.split("/")[1] === testId,
    );
  });

  return (
    <View className="flex-1 bg-gray-100">
      <Stack.Screen
        options={{
          title: testName,
        }}
      />
      {type === "DiagnosticReport" && diagnosticReportItem && (
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "/portal/(modals)/pdf",
              params: {
                url: diagnosticReportItem.presentedForm?.[0]?.url ?? "",
              },
            })
          }
          className="border-b border-gray-200 bg-white py-8 pl-8 pr-4"
          activeOpacity={0.5}
        >
          <View className="flex-row items-center justify-between">
            <View className="flex-1 flex-col">
              <Text className="text-lg font-semibold">
                {`${diagnosticReportItem.code?.coding?.[0]?.display} report` ??
                  "Unknown report"}
              </Text>
              <Text>
                Collected on{" "}
                {formatDateTime(diagnosticReportItem.effectiveDateTime)}
              </Text>
            </View>

            <ChevronRight size={20} strokeWidth={2} color="blue" />
          </View>
        </TouchableOpacity>
      )}

      {type === "Observation" && observationItems && (
        <FlashList
          data={observationItems}
          renderItem={({ item, index }) => {
            const components = item.resource?.component?.map((comp) => ({
              display: comp.code?.coding?.[0]?.display ?? "Unknown",
              value: comp.valueQuantity?.value ?? "?",
              unit: comp.valueQuantity?.unit ?? "",
            }));

            return (
              <ObservationItem
                name={
                  item.resource?.code?.coding?.[0]?.display ??
                  "Unknown Observation"
                }
                collectedDate={
                  item.resource?.effectiveDateTime ?? "Unknown date"
                }
                valueQuantity={
                  item.resource?.valueQuantity && !components
                    ? {
                        value: item.resource.valueQuantity.value,
                        unit: item.resource.valueQuantity.unit,
                      }
                    : undefined
                }
                components={components}
                first={index === 0}
                last={index === observationItems.length - 1}
              />
            );
          }}
          estimatedItemSize={100}
          keyExtractor={(item, index) => item.resource?.id ?? index.toString()}
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
