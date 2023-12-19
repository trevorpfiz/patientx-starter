import React from "react";
import { SafeAreaView, Text, useWindowDimensions } from "react-native";

// import Pdf from "react-native-pdf";

const source = {
  uri: "https://samples.leanpub.com/thereactnativebook-sample.pdf",
  cache: true,
};

export default function PDFPage() {
  const { width, height } = useWindowDimensions();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Text>PDF Page</Text>
      {/* <Pdf
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
      /> */}
    </SafeAreaView>
  );
}
