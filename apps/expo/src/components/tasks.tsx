import { useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { useAtom } from "jotai";
import { FileCheck, FileText, FileX } from "lucide-react-native";

import { patientIdAtom } from "~/app";
import { Button } from "~/components/ui/rn-ui/components/ui/button";
import { api } from "~/utils/api";
import { formatDateTime } from "~/utils/dates";
import { useRouter } from "expo-router";

export default function Tasks() {
  const [patientId] = useAtom(patientIdAtom);

  const router = useRouter()

  const [taskStatus, setTaskStatus] = useState<
    "requested" | "cancelled" | "completed" | ""
  >("");

  const listTask = api.task.search.useQuery({
    query: {
      patient: `Patient/${patientId}`,
    },
  });

  return (
    <View className="flex flex-col gap-8">
      <View className="flex flex-row items-center justify-around">
        <View className="flex flex-col gap-4">
          <View className="rounded-full border border-red-400 bg-red-100 p-3">
            <TouchableOpacity
              onPress={async () => {
                setTaskStatus("requested");
                await listTask.refetch();
              }}
            >
              <FileText color={"red"} size={40} />
            </TouchableOpacity>
          </View>
        </View>
        <View className="flex flex-col gap-4">
          <View className="rounded-full border border-yellow-400 bg-yellow-100 p-3">
            <TouchableOpacity
              onPress={async () => {
                setTaskStatus("cancelled");
                await listTask.refetch();
              }}
            >
              <FileX className="text-yellow-800" size={40} />
            </TouchableOpacity>
          </View>
        </View>
        <View className="flex flex-col gap-4">
          <View className="rounded-full border border-green-400 bg-green-100 p-3">
            <TouchableOpacity
              onPress={async () => {
                setTaskStatus("completed");
                await listTask.refetch();
              }}
            >
              <FileCheck color={"green"} size={40} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View className="flex flex-row items-center justify-around">
        <Text>To-Do</Text>
        <Text>Cancelled</Text>
        <Text>Done</Text>
      </View>
      <View className="flex flex-row items-center justify-around">
        <Text className="text-3xl font-bold">{"Today's Tasks"}</Text>
        <Button
          onPress={() => {
            setTaskStatus("");
            router.push("/portal/(modals)/tasks")
          }}
          textClass="text-center"
        >
          See All
        </Button>
      </View>
      <FlatList
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        data={listTask.data?.entry?.filter((item) => {
          if (taskStatus === "") {
            return true;
          }
          return item.resource.status === taskStatus;
        })}
        renderItem={({ item }) => (
          <View
            className={`ml-4 flex w-52 flex-col gap-4 rounded-xl p-2 ${item.resource.status === "requested"
              ? "bg-red-500"
              : item.resource.status === "cancelled"
                ? "bg-yellow-800"
                : "bg-green-800"
              }`}
          >
            <Text className="font-medium text-white">
              {formatDateTime(item.resource.authoredOn!)}
            </Text>
            <Text className="text-gray-300">{item.resource.description}</Text>
            <Text className="font-bold capitalize text-white">
              {item.resource.status}
            </Text>
          </View>
        )}
        keyExtractor={(item) => item.resource.id}
        contentContainerStyle={{ paddingHorizontal: 0 }}
      />
    </View>
  );
}
