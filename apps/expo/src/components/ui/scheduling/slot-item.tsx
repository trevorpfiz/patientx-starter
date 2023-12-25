import React from "react";
import { Text, TouchableOpacity, useWindowDimensions } from "react-native";
import { atom, useAtom } from "jotai";

import type { SlotResource } from "@acme/shared/src/validators/slot";

import { formatTime } from "~/utils/dates";
import { cn } from "../rn-ui/utils/cn";

export const selectedSlotAtom = atom<SlotResource | null>(null);

const SlotItem = ({
  slot,
  isSelected,
}: {
  slot: SlotResource;
  isSelected: boolean;
}) => {
  const [, setSelectedSlot] = useAtom(selectedSlotAtom);
  const { height, width } = useWindowDimensions();

  const itemWidth = width / 3;
  const fixedWidth = 80;

  const buttonStyle = {
    // minWidth: itemWidth,
    maxWidth: itemWidth,
    margin: 8,
  };

  return (
    <TouchableOpacity
      onPress={() => setSelectedSlot(slot)}
      style={buttonStyle}
      className={cn(
        "flex-1 items-center rounded-xl border border-gray-300 px-4 py-8",
        isSelected ? "bg-blue-500" : "bg-white",
      )}
    >
      <Text
        className={cn(
          "text-center",
          isSelected ? "text-white" : "text-blue-500",
        )}
      >
        {formatTime(new Date(slot.start))}
      </Text>
    </TouchableOpacity>
  );
};

export { SlotItem };
