import React, { useState } from "react";
import { SafeAreaView, Text, useWindowDimensions, View, TextInput, Button } from "react-native";
import Pdf from "react-native-pdf";
import Toast from "react-native-toast-message";
import { Stack, useLocalSearchParams } from "expo-router";

import {
  LeftHeaderDone,
  RightHeaderShare,
} from "~/components/ui/headers/pdf-header";
import { api } from "~/utils/api";

export default function PDFPage() {
  const { url, patientId } = useLocalSearchParams<{
    url: string;
    patientId: string;
  }>();
  const { width, height } = useWindowDimensions();

  const source = { uri: url, cache: true };
  const [value, setValue] = useState("0");

  const createPayment = api.payment.createPayment.useMutation({
    onSuccess: () => {
      Toast.show({
        type: "success",
        text1: "Payment created successfully",
      });
    },
    onError: (error) => {
      Toast.show({
        type: "error",
        text1: "Payment failed",
        text2: error.message,
      });
    },
  });

  const onCreatePayment = async (value: number) => {
    console.log("VALUE", value)
    await createPayment.mutateAsync({
      body: {
        request: {
          reference: `Patient/${patientId}`,
        },
        amount: {
          value,
        },
        payment: {},
        recipient: {},
        status: "active",
      },
    });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View className="p-4 flex flex-col gap-4">
        <TextInput
          className="border border-gray-300 rounded p-2 mt-4"
          onChangeText={setValue}
          value={value}
          placeholder="Enter amount"
        />
        <Button
          onPress={async () => {
            await onCreatePayment(parseInt(value));
          }}
          disabled={value === "0"}
          color="#007AFF"
          title="Pay Bill"
        />
      </View>

      <Stack.Screen
        options={{
          title: "",
          headerLeft: () => <LeftHeaderDone />,
          headerRight: () => <RightHeaderShare document={source.uri} />,
        }}
      />
      <Pdf
        source={source}
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
        style={{ flex: 1, width, height }}
        trustAllCerts={false}
      />
    </SafeAreaView>
  );
}
