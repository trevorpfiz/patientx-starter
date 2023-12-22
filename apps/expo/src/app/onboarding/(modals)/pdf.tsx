import React from "react";
import { SafeAreaView, useWindowDimensions } from "react-native";
import Pdf from "react-native-pdf";
import { Stack } from "expo-router";

import { uploadTestPdf } from "~/components/forms/upload-test";
import {
  LeftHeaderDone,
  RightHeaderShare,
} from "~/components/ui/headers/pdf-header";

const source = { uri: `data:application/pdf;base64,${uploadTestPdf}` };

export default function PDFPage() {
  const { width, height } = useWindowDimensions();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          title: "PDF Viewer",
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
      />
    </SafeAreaView>
  );
}
