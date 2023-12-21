import { useRef, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import type { NativeScrollEvent, NativeSyntheticEvent } from "react-native";
// import * as Haptics from "expo-haptics";
import clsx from "clsx";
import { format, parseISO } from "date-fns";
import { atom, useAtom } from "jotai";

import type { SlotResource } from "@acme/shared/src/validators/slot";

import { api } from "~/utils/api";
import { getFormattedDate, getMonthYearFromDate } from "~/utils/dates";

export const selectedDateAtom = atom("");

// Function to find unique dates and sort them
const findUniqueDates = (slots: SlotResource[]) => {
  const uniqueDates = new Set(
    slots.map((slot) => format(parseISO(slot.start), "yyyy-MM-dd")),
  );
  return Array.from(uniqueDates).sort();
};

export function ScheduleHeader() {
  const [selectedDate, setSelectedDate] = useAtom(selectedDateAtom);
  const [monthYear, setMonthYear] = useState("");
  const scrollViewRef = useRef<ScrollView | null>(null);
  const itemsRef = useRef<(View | null)[]>([]);

  const { isLoading, isError, data, error } = api.scheduling.getSlots.useQuery({
    query: {
      schedule: "Location.1-Staff.4ab37cded7e647e2827b548cd21f8bf2",
      duration: "30",
      end: "2024-02-28",
    },
  });

  // derived state from data
  const slots = data?.entry?.map((e) => e?.resource);
  const uniqueDates = findUniqueDates(slots ?? []);
  // Set initial month year when data is ready
  if (uniqueDates.length > 0 && monthYear === "") {
    const firstDate = uniqueDates[0];
    if (firstDate) {
      const initialMonthYear = getMonthYearFromDate(firstDate);
      setMonthYear(initialMonthYear);
      setSelectedDate(firstDate);
    }
  }

  // set month year title on scroll
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const dateElementWidth = 100; // width of each date element
    const firstVisibleIndex = Math.floor(contentOffsetX / dateElementWidth);

    const visibleDate = uniqueDates[firstVisibleIndex];
    if (visibleDate) {
      const newMonthYear = getMonthYearFromDate(visibleDate);
      setMonthYear(newMonthYear);
    }
  };

  const selectDate = (dateString: string, index: number) => {
    const selected = itemsRef.current[index];
    setSelectedDate(dateString);

    selected?.measure((x) => {
      const scrollView = scrollViewRef.current;
      if (scrollView) {
        scrollView.scrollTo({
          x: x - 16,
          y: 0,
          animated: true,
        });
      }
    });

    // await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  if (isLoading) return <Text>Loading...</Text>;
  if (isError) {
    return <Text>Error: {error?.message}</Text>;
  }

  return (
    <View>
      <Text className="text-3xl font-bold">{monthYear}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          alignItems: "center",
          gap: 8,
          paddingHorizontal: 8,
          paddingVertical: 16,
        }}
        ref={scrollViewRef}
        onScroll={handleScroll}
        scrollEventThrottle={16} // Adjust as needed for performance
        collapsable={false}
      >
        {uniqueDates.map((dateString, index) => (
          <View
            key={index}
            ref={(el) => (itemsRef.current[index] = el)}
            collapsable={false}
            removeClippedSubviews={false}
            className={clsx(
              "flex-1 items-center justify-center pb-8",
              dateString === selectedDate && "border-b-4 border-blue-500",
            )}
          >
            <TouchableOpacity onPress={() => selectDate(dateString, index)}>
              <View className="rounded-lg bg-white px-4 py-2 shadow-md">
                <Text className="text-center">
                  <Text>{getFormattedDate(dateString)}</Text>
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
