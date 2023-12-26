import { useState } from "react";
import {
  Button,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { FileCheck, FileText, FileX } from "lucide-react-native";

import { api } from "~/utils/api";
import { formatDateTime } from "~/utils/dates";

export default function Home() {
  const [taskStatus, setTaskStatus] = useState<
    "requested" | "cancelled" | "completed" | ""
  >("");
  const [taskDescription, setTaskDescription] = useState<string>("");

  const patientQuery = api.patient.getPatient.useQuery({
    path: {
      patient_id: "e7836251cbed4bd5bb2d792bc02893fd",
    },
  });

  const createTask = api.task.create.useMutation();

  const onCreateTask = async () => {
    await createTask.mutateAsync({
      body: {
        status: taskStatus !== "" ? taskStatus : "requested",
        authoredOn: new Date().toISOString(),
        description: "Get the patient's blood pressure",
        requester: {
          reference: "Practitioner/4ab37cded7e647e2827b548cd21f8bf2",
        },
        intent: "unknown",
        for: {
          reference: `Patient/${
            patientQuery.data!.id ?? "e7836251cbed4bd5bb2d792bc02893fd"
          }`,
        },
      },
    });
  };

  const updateTask = api.task.update.useMutation();

  const onUpdateTask = async (taskId: string, status: string) => {
    await updateTask.mutateAsync({
      path: {
        task_id: taskId,
      },
      body: {
        status: status,
        authoredOn: new Date().toISOString(),
        description: "Get the patient's blood pressure",
        requester: {
          reference: "Practitioner/4ab37cded7e647e2827b548cd21f8bf2",
        },
        intent: "unknown",
        for: {
          reference: `Patient/${
            patientQuery.data!.id ?? "e7836251cbed4bd5bb2d792bc02893fd"
          }`,
        },
      },
    });
  };

  const listTask = api.task.search.useQuery(
    {
      query: {
        patient: `Patient/${patientQuery.data?.id}`,
      },
    },
    {
      enabled: !!patientQuery.data?.id,
    },
  );

  return (
    <View className="flex flex-col gap-8 p-4">
      <Text>
        Good Morning,{" "}
        {patientQuery.data?.name ? patientQuery.data.name[0]?.family : "User"}
      </Text>
      <Text className="text-3xl">
        You have{" "}
        <Text className="font-bold text-purple-400">
          {listTask.data?.total ?? 0} tasks
        </Text>{" "}
        this month
      </Text>

      <Button
        title="Create Task"
        onPress={async () => onCreateTask()}
        color="#1d4ed8"
      />
      <TextInput
        placeholder="Search"
        className="w-full rounded bg-gray-300 p-2"
        onChangeText={(text) => setTaskDescription(text)}
      >
        Search
      </TextInput>
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
        <Text className="text-3xl font-bold">Today's Tasks</Text>
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
            className={`mr-4 flex w-52 flex-col gap-4 rounded-xl border p-2 ${
              item.resource.status === "requested"
                ? "border-red-400 bg-red-200"
                : item.resource.status === "cancelled"
                  ? "border-yellow-400 bg-yellow-200"
                  : "border-green-400 bg-green-200"
            }`}
          >
            <Text>{formatDateTime(new Date(item.resource.authoredOn!))}</Text>
            <Text>{item.resource.description}</Text>
            <Text>{item.resource.status}</Text>
            {taskStatus !== "" && (
              <TouchableOpacity className="flex flex-row items-center justify-center rounded border bg-gray-300">
                <Text
                  className={`${
                    item.resource.status === "requested"
                      ? "text-red-800"
                      : item.resource.status === "cancelled"
                        ? "text-yellow-800"
                        : "text-green-800"
                  }`}
                  onPress={async () => {
                    if (item.resource.status === "requested") {
                      await onUpdateTask(item.resource.id, "cancelled");
                    } else if (item.resource.status === "cancelled") {
                      await onUpdateTask(item.resource.id, "completed");
                    } else {
                      await onUpdateTask(item.resource.id, "requested");
                    }
                  }}
                >
                  Update to{" "}
                  {item.resource.status === "requested"
                    ? "Cancelled"
                    : item.resource.status === "cancelled"
                      ? "Done"
                      : "Requested"}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
        keyExtractor={(item) => item.resource.id}
      />
    </View>
  );
}
