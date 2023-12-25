import { Text, TouchableOpacity, View } from "react-native";
import * as FileSystem from "expo-file-system";
import { useRouter } from "expo-router";
import * as Sharing from "expo-sharing";
import { Ionicons } from "@expo/vector-icons";

export function LeftHeaderDone() {
  const router = useRouter();

  return (
    <TouchableOpacity onPress={() => router.back()}>
      <Text className="font-medium text-blue-500">Done</Text>
    </TouchableOpacity>
  );
}

export function RightHeaderShare({ document }: { document: string }) {
  const share = async (document: string) => {
    try {
      let fileUri = document;

      // Check if the document is a base64 string
      if (document.startsWith("data:application/pdf;base64,")) {
        // Extract the base64 part
        const base64String = document.split("base64,")[1] ?? "";
        fileUri = FileSystem.documentDirectory + "tempfile.pdf";
        await FileSystem.writeAsStringAsync(fileUri, base64String, {
          encoding: FileSystem.EncodingType.Base64,
        });
      }
      // Else if the document is a remote URL, download it first
      else if (document.startsWith("http")) {
        const fileName = document.split("/").pop() ?? "";
        const localUri = FileSystem.cacheDirectory + fileName;
        const { uri } = await FileSystem.downloadAsync(document, localUri);
        fileUri = uri;
      }

      // Use the fileUri for sharing
      await Sharing.shareAsync(fileUri);
    } catch (error) {
      console.error("Sharing error:", error);
    }
  };

  return (
    <TouchableOpacity onPress={() => share(document)}>
      <View className="w-6">
        <Ionicons name="ios-share-outline" size={24} color="#3b82f6" />
      </View>
    </TouchableOpacity>
  );
}
