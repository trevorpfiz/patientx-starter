import { Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { useAtom } from "jotai";
import { ChevronRight, Loader2 } from "lucide-react-native";

import { patientIdAtom } from "~/components/forms/welcome-form";
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
    return (
      <View className="mb-36 flex-1 items-center justify-center bg-white">
        <Loader2
          size={48}
          color="black"
          strokeWidth={2}
          className="animate-spin"
        />
      </View>
    );
  }

  if (isError) {
    return <Text>Error: {error?.message}</Text>;
  }

  return (
    <View className="flex flex-col gap-4">
      {data &&
        data.total > 0 &&
        data.entry?.map((note, index) => (
          <TouchableOpacity
            key={index}
            onPress={() =>
              router.push({
                pathname: "/portal/(modals)/pdf",
                params: {
                  url: note.resource?.content?.[0]?.attachment.url ?? "",
                },
              })
            }
          >
            <View className="flex flex-row items-center justify-between border-b border-gray-200 bg-white py-8 pl-8 pr-4">
              <View className="flex justify-between">
                <Text className="text-lg font-medium">
                  {note.resource.type?.coding?.[0]?.display ?? "Clinical Note"}
                </Text>
                <Text>
                  {note.resource?.date
                    ? formatDateTime(new Date(note.resource.date))
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
