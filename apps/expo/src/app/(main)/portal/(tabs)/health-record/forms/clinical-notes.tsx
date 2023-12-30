import { Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
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

  return (
    <View className="flex flex-col gap-4">
      {data &&
        data.total > 0 &&
        data.entry?.map((note, index) => (
          <TouchableOpacity
            key={index}
            onPress={() =>
              router.push({
                pathname: "/portal/pdf",
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
                    ? formatDateTime(note.resource.date)
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
