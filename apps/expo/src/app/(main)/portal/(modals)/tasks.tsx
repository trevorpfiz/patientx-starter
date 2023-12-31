import { useMemo, useState } from "react";
import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import { Agenda } from "react-native-calendars";
import Toast from "react-native-toast-message";
import { Stack } from "expo-router";
import { format } from "date-fns";
import { useAtom } from "jotai";

import { LeftHeaderDone } from "~/components/ui/headers/tasks-header";
import { LoaderComponent } from "~/components/ui/loader";
import { Button } from "~/components/ui/rn-ui/components/ui/button";
import { api } from "~/utils/api";
import { patientIdAtom } from "../..";

export default function TasksPage() {
  const utils = api.useUtils();
  const [patientId] = useAtom(patientIdAtom);
  const [selectedDate, setSelectedDate] = useState(
    format(new Date(), "yyyy-MM-dd"),
  );

  const listTask = api.task.search.useQuery({
    query: {
      patient: `Patient/${patientId}`,
    },
  });

  const createTask = api.task.create.useMutation({
    onSuccess: async () => {
      await utils.task.search.invalidate({
        query: {
          patient: `Patient/${patientId}`,
        },
      });
      Toast.show({
        type: "success",
        text1: "Task Created",
        text2: "Your task has been created",
      });
    },
  });

  const onCreateTask = async () => {
    try {
      await createTask.mutateAsync({
        body: {
          status: "completed",
          description: "Get the patient's temperature",
          requester: {
            reference: "Practitioner/4ab37cded7e647e2827b548cd21f8bf2",
          },
          intent: "unknown",
          for: {
            reference: `Patient/${patientId}`,
          },
          authoredOn: new Date().toISOString(),
        },
      });
      Toast.show({
        type: "success",
        text1: "Task Created",
        text2: "Your task has been created",
      });
    } catch (e) {
      Toast.show({
        type: "error",
        text1: "Error Creating Task",
        text2: "Please try again",
      });
    }
  };

  const tasks = useMemo(() => {
    if (listTask.data) {
      // Convert to items for agenda
      const items = listTask.data.entry!.map((task) => ({
        name: JSON.stringify({
          description: task.resource.description,
          status: task.resource.status,
        }),
        height: 80,
        day: format(new Date(task.resource.authoredOn!), "yyyy-MM-dd"),
      }));

      // Group by day
      const grouped = items.reduce(
        (acc, item) => {
          if (!acc[item.day]) {
            acc[item.day] = [];
          }
          acc[item.day].push(item);
          return acc;
        },
        {} as Record<string, any>,
      );

      return grouped;
    }
    return [];
  }, [listTask.data]);

  if (listTask.isLoading) {
    return <LoaderComponent />;
  }

  return (
    <SafeAreaView className="my-2 flex flex-1 flex-col gap-4">
      <Stack.Screen
        options={{
          title: "Tasks",
          headerLeft: () => <LeftHeaderDone />,
        }}
      />

      <View className="flex items-center justify-center">
        <Button className="w-64 bg-purple-600" onPress={onCreateTask}>
          Add Task
        </Button>
      </View>

      <Agenda
        selected={selectedDate}
        onDayPress={(day) => {
          setSelectedDate(day.dateString);
        }}
        renderEmptyData={() => (
          <View className="flex flex-1 items-center justify-center">
            <Text className="font-bold">No tasks for this day</Text>
          </View>
        )}
        items={
          tasks as Record<
            string,
            {
              name: string;
              height: number;
              day: string;
            }[]
          >
        }
        className="m-8 rounded border p-8"
        theme={{
          calendarBackground: "#222",
          dayTextColor: "#fff",
          textDisabledColor: "#444",
          monthTextColor: "#888",
        }}
        renderItem={(item, isFirst) => (
          <TouchableOpacity
            className={`my-4 flex flex-col gap-4 rounded px-4 py-2 ${JSON.parse(item.name).status === "requested"
              ? "bg-red-500"
              : JSON.parse(item.name).status === "cancelled"
                ? "bg-yellow-500"
                : "bg-green-500"
              }`}
          >
            <Text className="font-medium text-white">
              {format(new Date(item.day), "h:mm a")}
            </Text>
            <Text className="text-white">
              {JSON.parse(item.name).description}
            </Text>
            <Text className="font-bold capitalize text-white">
              {JSON.parse(item.name).status}
            </Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}
