import { Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { FlashList } from "@shopify/flash-list";
import { compareDesc, parseISO } from "date-fns";
import { useAtom } from "jotai";
import { ChevronRight } from "lucide-react-native";

import { patientIdAtom } from "~/app/(main)";
import { LoaderComponent } from "~/components/ui/loader";
import { api } from "~/utils/api";
import { formatDateTime } from "~/utils/dates";

export default function ClinicalNotes() {
  const [patientId] = useAtom(patientIdAtom);
  const router = useRouter();

  const { isLoading, isError, data, error } =
    api.patientMedicalHistory.getPatientDocuments.useQuery({
      patientId,
    });

  if (isLoading) {
    return <LoaderComponent />;
  }

  if (isError) {
    return <Text>Error: {error?.message}</Text>;
  }

  // Filter out the documents that are not clinical notes
  const processedNotes = data?.entry
    ?.filter((note) => {
      const typeCode = note.resource?.type?.coding?.[0]?.code;
      return typeCode !== "11502-2" && typeCode !== "94093-2";
    })
    .map((note) => {
      let displayText = note.resource?.type?.coding?.[0]?.display;
      if (!displayText) {
        // Use category coding code as a fallback
        displayText =
          note.resource?.category?.[0]?.coding?.[0]?.code ?? "Unknown Category";
      }
      return {
        ...note,
        displayText,
      };
    });

  // Sort the notes by date in descending order
  const sortedNotes =
    processedNotes?.sort((a, b) => {
      const dateA = a.resource?.date ? parseISO(a.resource.date) : new Date(0);
      const dateB = b.resource?.date ? parseISO(b.resource.date) : new Date(0);
      return compareDesc(dateA, dateB);
    }) ?? [];

  return (
    <View className="flex-1 bg-gray-100">
      {data && data.total > 0 ? (
        <FlashList
          data={sortedNotes}
          renderItem={({ item }) => {
            // TODO: not getting document names from Canvas API?
            // console.log(item.resource.type?.coding?.[0]);
            return (
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: "/portal/pdf",
                    params: {
                      url: item.resource?.content?.[0]?.attachment.url ?? "",
                    },
                  })
                }
              >
                <View className="flex flex-row items-center justify-between border-b border-gray-200 bg-white py-8 pl-8 pr-4">
                  <View className="flex justify-between">
                    <Text className="text-lg font-medium">
                      {item.displayText} {/* Use the processed display text */}
                    </Text>
                    <Text>
                      {item.resource?.date
                        ? formatDateTime(item.resource.date)
                        : "Unknown date"}
                    </Text>
                  </View>
                  <ChevronRight size={20} strokeWidth={2} color="blue" />
                </View>
              </TouchableOpacity>
            );
          }}
          estimatedItemSize={200}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{
            paddingBottom: 16,
          }}
        />
      ) : (
        <Text className="p-8">No clinical notes found.</Text>
      )}
    </View>
  );
}
