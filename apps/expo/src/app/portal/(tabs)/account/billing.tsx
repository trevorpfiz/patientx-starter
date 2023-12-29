import { Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { useAtom } from "jotai";
import { ChevronRight, Loader2 } from "lucide-react-native";

import { patientIdAtom } from "~/app";
import { api } from "~/utils/api";
import { formatDateTime } from "~/utils/dates";

export default function Billing() {
  const [patientId] = useAtom(patientIdAtom);
  const router = useRouter();

  const billingQuery = api.document.searchBillDocument.useQuery({
    query: {
      subject: `Patient/${patientId}`,
    },
  });

  if (billingQuery.isLoading) {
    return (
      <View className="mb-36 flex-1 items-center justify-center bg-white">
        <Loader2
          size={48}
          color="black"
          strokeWidth={2}
          className="animate-spin"
        />
      </View>
    );
  }

  return (
    <View className="flex flex-col gap-4">
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
                },
              })
            }
          >
            <View className="flex flex-row items-center justify-between border-b border-gray-200 bg-white py-8 pl-8 pr-4">
              <View className="flex justify-between">
                <Text className="text-lg font-medium">Medical Bill</Text>
                <Text>
                  {bill.resource?.date
                    ? formatDateTime(bill.resource.date)
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
