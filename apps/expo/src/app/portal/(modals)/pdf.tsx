import React from "react";
import { SafeAreaView, useWindowDimensions } from "react-native";
import Pdf from "react-native-pdf";
import { Stack, useLocalSearchParams } from "expo-router";

import {
  LeftHeaderDone,
  RightHeaderShare,
} from "~/components/ui/headers/pdf-header";

export default function PDFPage() {
  const { url } = useLocalSearchParams<{ url: string }>();
  const { width, height } = useWindowDimensions();

  const source = { uri: url, cache: true };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          title: "",
          headerLeft: () => <LeftHeaderDone />,
        }}
      />
      <Pdf
        source={source}
        onLoadComplete={(numberOfPages, filePath) => {
          // console.log(`Number of pages: ${numberOfPages}`);
        }}
        onPageChanged={(page, numberOfPages) => {
          // console.log(`Current page: ${page}`);
        }}
        onError={(error) => {
          console.log(error);
        }}
        onPressLink={(uri) => {
          // console.log(`Link pressed: ${uri}`);
        }}
        style={{ flex: 1, width, height }}
        trustAllCerts={false}
      />
    </SafeAreaView>
  );
}
