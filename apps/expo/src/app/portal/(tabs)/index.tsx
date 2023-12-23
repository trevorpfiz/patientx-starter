import {
  Button,
  FlatList,
  SafeAreaView,
  Text,
  TextInput,
  View,
} from "react-native";
import { FileCheck, FileClock, FileText } from "lucide-react-native";

import { api } from "~/utils/api";
import { formatDateTime } from "~/utils/dates";

export default function Home() {
  const patientQuery = api.patient.getPatient.useQuery({
    path: {
      patient_id: "e7836251cbed4bd5bb2d792bc02893fd",
    },
  });

  const createTask = api.task.create.useMutation();

  const onCreateTask = async () => {
    const response = await createTask.mutateAsync({
      body: {
        status: "requested",
        description: "Ask patient for new insurance information.",
        requester: {
          reference: "Practitioner/4ab37cded7e647e2827b548cd21f8bf2",
        },
        intent: "unknown",
        for: {
          reference: "Patient/e7836251cbed4bd5bb2d792bc02893fd",
        },
      },
    });

    console.log("response", response);
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

  console.log("listTask", listTask.data);

  return (
    <View className="flex flex-col gap-8 p-4">
      <Text>Good Morning, User</Text>
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
      >
        Search
      </TextInput>
      <View className="flex flex-row items-center justify-around">
        <View className="flex flex-col gap-4">
          <View className="rounded-full border border-red-400 bg-red-100 p-3">
            <FileText color={"red"} size={40} />
          </View>
        </View>
        <View className="flex flex-col gap-4">
          <View className="rounded-full border border-yellow-400 bg-yellow-100 p-3">
            <FileClock className="text-yellow-800" size={40} />
          </View>
        </View>
        <View className="flex flex-col gap-4">
          <View className="rounded-full border border-green-400 bg-green-100 p-3">
            <FileCheck color={"green"} size={40} />
          </View>
        </View>
      </View>
      <View className="flex flex-row items-center justify-around">
        <Text>To-Do</Text>
        <Text>In-Progress</Text>
        <Text>Done</Text>
      </View>
      <View className="flex flex-row items-center justify-around">
        <Text className="text-3xl font-bold">Today's Tasks</Text>
        <Text>See All</Text>
      </View>
      {/* Use a flatlist horizontal to display list task */}
      <FlatList
        horizontal={true}
        data={listTask.data?.entry}
        renderItem={({ item }) => (
          <View className="mr-4 flex h-36 w-52 flex-col gap-4 rounded-xl border bg-red-100 p-2">
            <Text>{formatDateTime(new Date(item.resource.authoredOn!))}</Text>
            <Text>{item.resource.description}</Text>
            <Text>{item.resource.status}</Text>
          </View>
        )}
        keyExtractor={(item) => item.resource.id}
      />
    </View>
  );
}

const CreateTask = () => {
  return <View></View>;
};
