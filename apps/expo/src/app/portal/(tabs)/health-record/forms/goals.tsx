import { Text, View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { useAtom } from "jotai";
import { Loader2 } from "lucide-react-native";

import { patientIdAtom } from "~/app";
import GoalItem from "~/components/ui/health-record/goal-item";
import { api } from "~/utils/api";

export default function GoalsPage() {
  const [patientId] = useAtom(patientIdAtom);

  const { isLoading, isError, data, error } =
    api.patientMedicalHistory.getPatientGoals.useQuery({
      patientId,
    });

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <Text>Error: {error.message}</Text>;
  }

  const goals = data?.entry;

  return (
    <View className="flex-1 bg-gray-100">
      {data?.total > 0 ? (
        <FlashList
          data={goals}
          renderItem={({ item, index }) => (
            <GoalItem
              goal={item.resource?.description?.text ?? "unknown goal"}
              status={item.resource?.lifecycleStatus ?? "unknown"}
              start={item.resource?.startDate ?? "unknown"}
              priority={
                item.resource?.priority?.coding?.[0]?.display ?? "unknown"
              }
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
        <Text className="p-8">{`No goals found.`}</Text>
      )}
    </View>
  );
}
