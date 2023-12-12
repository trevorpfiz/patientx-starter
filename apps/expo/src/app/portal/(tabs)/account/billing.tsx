import { Dimensions, Linking, StyleSheet, Text, View } from "react-native";
import Pdf from "react-native-pdf";
import { Menu, MessageCircle } from "lucide-react-native";

import { api } from "~/utils/api";

export default function Billing() {
  const patientId = "e7836251cbed4bd5bb2d792bc02893fd";

  const billingQuery = api.document.searchBillDocument.useQuery({
    query: {
      subject: `Patient/${patientId}`,
    },
  });

  const source = {
    uri: "https://s29.q4cdn.com/175625835/files/doc_downloads/test.pdf",
    cache: true,
  };

  return (
    <View className="my-2 flex flex-col gap-4">
      <View className="flex flex-row justify-around gap-4">
        <Menu />
        <Text className="text-lg font-medium">My Bills</Text>
        <MessageCircle />
      </View>

      <Text className="text-center">Tuesday, 2nd March 2021</Text>

      {billingQuery.isLoading && (
        <View className="flex flex-col items-center justify-center">
          <Text className="text-lg font-medium">Loading...</Text>
        </View>
      )}
      {billingQuery.data &&
        billingQuery.data.total > 0 &&
        billingQuery?.data?.entry?.map((b, i) => (
          <View key={i}>
            <Text>HELLo</Text>
            <Text>{b.resource.date}</Text>
            {b.resource?.content[0]?.attachment.url && (
              <Pdf
                source={{
                  uri: b.resource?.content[0]?.attachment.url,
                  cache: true,
                }}
                onLoadComplete={(numberOfPages, filePath) => {
                  console.log(`Number of pages: ${numberOfPages}`);
                }}
                onPageChanged={(page, numberOfPages) => {
                  console.log(`Current page: ${page}`);
                }}
                onError={(error) => {
                  console.log(error);
                }}
                onPressLink={(uri) => {
                  console.log(`Link pressed: ${uri}`);
                }}
                style={styles.pdf}
              />
            )}
          </View>
        ))}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 25,
  },
  pdf: {
    flex: 1,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});
