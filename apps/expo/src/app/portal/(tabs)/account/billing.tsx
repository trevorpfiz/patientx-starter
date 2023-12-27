import { Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { ChevronRight } from "lucide-react-native";

import { api } from "~/utils/api";
import { formatDateTime } from "~/utils/dates";

export default function Billing() {
  const router = useRouter();
  const patientId = "e7836251cbed4bd5bb2d792bc02893fd";

  const billingQuery = api.document.searchBillDocument.useQuery({
    query: {
      subject: `Patient/${patientId}`,
    },
  });

  return (
    <View className="flex flex-col gap-4">
      {billingQuery.isLoading && (
        <View className="flex flex-col items-center justify-center">
          <Text className="text-lg font-medium">Loading...</Text>
        </View>
      )}
      {billingQuery.data &&
        billingQuery.data.total > 0 &&
        billingQuery.data.entry?.map((bill, index) => (
          <TouchableOpacity
            key={index}
            onPress={() =>
              router.push({
                pathname: "/portal/(modals)/pdf",
                params: {
                  url: bill.resource?.content?.[0]?.attachment.url ?? "",
                  patientId,
                },
              })
            }
          >
            <View className="flex flex-row items-center justify-between border-b border-gray-200 bg-white py-8 pl-8 pr-4">
              <View className="flex justify-between">
                <Text className="text-lg font-medium">Medical Bill</Text>
                <Text>
                  {bill.resource?.date
                    ? formatDateTime(new Date(bill.resource.date))
                    : "Unknown date"}
                </Text>
              </View>

              <ChevronRight size={20} strokeWidth={2} color="blue" />
            </View>
          </TouchableOpacity>
        ))}
    </View>
  );
}
