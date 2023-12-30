import { useState } from "react";
import { Button, FlatList, Text, TouchableOpacity, View } from "react-native";
import { useAtom } from "jotai";
import { FileCheck, FileText, FileX } from "lucide-react-native";

import { patientIdAtom } from "~/app/(main)";
import { api } from "~/utils/api";
import { formatDateTime } from "~/utils/dates";

export default function Tasks() {
  const [patientId] = useAtom(patientIdAtom);

  const [taskStatus, setTaskStatus] = useState<
    "requested" | "cancelled" | "completed" | ""
  >("");
  const [taskDescription, setTaskDescription] = useState<string>("");

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
                setTaskDescription("");
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
                setTaskDescription("");
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
                setTaskDescription("");
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
        <Text className="text-3xl font-bold">{`Today's Tasks`}</Text>
        <Button
          title="See All"
          onPress={() => {
            setTaskStatus("");
            setTaskDescription("");
          }}
          color={"#1d4ed8"}
        />
      </View>
      <FlatList
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        data={listTask.data?.entry?.filter((item) => {
          if (taskDescription !== "") {
            return item.resource.description?.includes(taskDescription);
          }

          if (taskStatus === "") {
            return true;
          }
          return item.resource.status === taskStatus;
        })}
        renderItem={({ item }) => (
          <View
            className={`ml-4 flex w-52 flex-col gap-4 rounded-xl border p-2 ${
              item.resource.status === "requested"
                ? "border-red-400 bg-red-200"
                : item.resource.status === "cancelled"
                  ? "border-yellow-400 bg-yellow-200"
                  : "border-green-400 bg-green-200"
            }`}
          >
            <Text>{formatDateTime(item.resource.authoredOn!)}</Text>
            <Text>{item.resource.description}</Text>
            <Text>{item.resource.status}</Text>
          </View>
        )}
        keyExtractor={(item) => item.resource.id}
        contentContainerStyle={{ paddingHorizontal: 0 }}
      />
    </View>
  );
}
