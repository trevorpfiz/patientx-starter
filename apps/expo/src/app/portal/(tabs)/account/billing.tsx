import { Text, View } from "react-native";
import { Menu, MessageCircle } from "lucide-react-native";
import { api } from "~/utils/api";

export default function Billing() {
  const patientId = "e7836251cbed4bd5bb2d792bc02893fd"

  const billingQuery = api.document.searchBillDocument.useQuery({
    query: {
      subject: `Patient/${patientId}`
    }
  })

  console.log("billing", billingQuery.data)

  return (
    <View className="flex flex-col gap-4 my-2">
      <View
        className="flex flex-row justify-around gap-4"
      >
        <Menu />
        <Text className="text-lg font-medium">My Bills</Text>
        <MessageCircle />
      </View>

      <Text className="text-center">
        Tuesday, 2nd March 2021
      </Text>

      {billingQuery.isLoading && (
        <View className="flex flex-col items-center justify-center">
          <Text className="text-lg font-medium">Loading...</Text>
        </View>
      )}

      {billingQuery.data && billingQuery.data.total > 0 && billingQuery.data.entry.map((b, i) => (<View key={i}>
        <Text>{b.resource.date}</Text>
      </View>))}

    </View>
  );
}
