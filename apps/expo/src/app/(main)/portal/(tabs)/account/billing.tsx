import { Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { useAtom } from "jotai";
import { ChevronRight } from "lucide-react-native";

import { patientIdAtom } from "~/app/(main)";
import { LoaderComponent } from "~/components/ui/loader";
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
    return <LoaderComponent />;
  }

  if (billingQuery.isError) {
    return <Text>Error: {billingQuery.error?.message}</Text>;
  }

  if (!billingQuery.data || billingQuery.data.total === 0) {
    return (
      <View className="flex-1 bg-gray-100">
        <Text className="p-8">No billing statements found.</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-100">
      {billingQuery.data.entry?.map((bill) => (
        <TouchableOpacity
          key={bill.resource.id} // Use a unique identifier if available
          onPress={() =>
            router.push({
              pathname: "/portal/pdf",
              params: {
                url: bill.resource?.content?.[0]?.attachment.url ?? "",
              },
            })
          }
          accessibilityRole="button"
          accessibilityLabel="View bill"
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
