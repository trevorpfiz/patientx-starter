import { Text, TouchableOpacity } from "react-native";
import * as FileSystem from "expo-file-system";
import { useRouter } from "expo-router";
import * as Sharing from "expo-sharing";
import { Ionicons } from "@expo/vector-icons";

import { uploadTestPdf } from "~/components/forms/upload-test";

export function LeftHeaderDone() {
  const router = useRouter();

  return (
    <TouchableOpacity onPress={() => router.back()}>
      <Text className="font-medium text-blue-500">Done</Text>
    </TouchableOpacity>
  );
}

const base64ToUri = async (base64String: string) => {
  const filename = FileSystem.documentDirectory + "tempfile.pdf";
  await FileSystem.writeAsStringAsync(filename, base64String, {
    encoding: FileSystem.EncodingType.Base64,
  });
  return filename;
};

export function RightHeaderShare() {
  return (
    <TouchableOpacity
      onPress={() => {
        base64ToUri(uploadTestPdf) // Assuming uploadTestPdf is a base64 string
          .then((fileUri) => {
            return Sharing.shareAsync(fileUri);
          })
          .catch((error) => console.log(error));
      }}
    >
      <Ionicons name="ios-share-outline" size={24} color="#3b82f6" />
    </TouchableOpacity>
  );
}
