import { useRef, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import type { NativeScrollEvent, NativeSyntheticEvent } from "react-native";
import { format, parseISO } from "date-fns";
import { atom, useAtom } from "jotai";
import { ChevronLeft, ChevronRight } from "lucide-react-native";

import type { SlotResource } from "@acme/shared/src/validators/slot";

import { LoaderComponent } from "~/components/ui/loader";
import { selectedSlotAtom } from "~/components/ui/scheduling/slot-item";
import { api } from "~/utils/api";
import { getMonthYearFromDate } from "~/utils/dates";
import { cn } from "../rn-ui/lib/utils";

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
  const [, setSelectedSlot] = useAtom(selectedSlotAtom);
  const [monthYear, setMonthYear] = useState("");
  const scrollViewRef = useRef<ScrollView | null>(null);
  const itemsRef = useRef<(View | null)[]>([]);

  const { isLoading, isError, data, error } = api.scheduling.getSlots.useQuery({
    query: {
      schedule: "Location.1-Staff.4ab37cded7e647e2827b548cd21f8bf2", // TODO: set up multiple providers
      duration: "30",
      end: "2024-03-14",
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
    const dateElementWidth = 50; // width of each date element
    const changeMonthThreshold = 49; // will change the month earlier
    const firstVisibleIndex = Math.floor(
      (contentOffsetX + changeMonthThreshold) / dateElementWidth,
    );

    const visibleDate = uniqueDates[firstVisibleIndex];
    if (visibleDate) {
      const newMonthYear = getMonthYearFromDate(visibleDate);
      setMonthYear(newMonthYear);
    }
  };

  const selectDate = (dateString: string, index: number) => {
    const selected = itemsRef.current[index];
    setSelectedDate(dateString);
    setSelectedSlot(null);

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
  };

  if (isLoading) {
    return <LoaderComponent />;
  }

  if (isError) {
    return <Text>Error: {error?.message}</Text>;
  }

  return (
    <View className="flex items-center">
      <Text className="mt-4 text-xl font-semibold ">{monthYear}</Text>
      <View className="flex flex-row items-center justify-between border-b border-gray-400">
        <ChevronLeft size={24} color="gray" />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            alignItems: "center",
            gap: 0,
            paddingHorizontal: 0,
            paddingVertical: 16,
          }}
          ref={scrollViewRef}
          onScroll={handleScroll}
          scrollEventThrottle={32}
          collapsable={false}
        >
          {uniqueDates.map((dateString, index) => {
            // Use dateString to format the day of the week and the date
            const dayOfWeek = format(parseISO(dateString), "EEE"); // Abbreviated day of the week
            const dayOfMonth = format(parseISO(dateString), "d"); // Just the day number

            return (
              <View
                key={index}
                ref={(el) => (itemsRef.current[index] = el)}
                collapsable={false}
                removeClippedSubviews={false}
                className="flex-1 items-center justify-center"
              >
                <TouchableOpacity
                  onPress={() => selectDate(dateString, index)}
                  className={cn(
                    "flex flex-col items-center justify-between rounded-full",
                    dateString === selectedDate ? "bg-blue-500" : "bg-white",
                  )}
                  style={{
                    width: 50,
                    paddingHorizontal: 0,
                    paddingVertical: 8,
                  }}
                >
                  <Text
                    className={cn(
                      "font-normal",
                      dateString === selectedDate ? "text-white" : "text-black",
                    )}
                  >
                    {dayOfWeek}
                  </Text>
                  <Text
                    className={cn(
                      "font-semibold",
                      dateString === selectedDate ? "text-white" : "text-black",
                    )}
                  >
                    {dayOfMonth}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </ScrollView>
        <ChevronRight size={24} color="gray" />
      </View>
    </View>
  );
}
