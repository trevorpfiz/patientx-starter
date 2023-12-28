import React from "react";
import { Pressable, View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { Check } from "lucide-react-native";

import { cn } from "~/components/ui/rn-ui/lib/utils";

interface CheckboxProps {
  value: boolean;
  onChange: (checked: boolean) => void;
  iconClass?: string;
  iconSize?: number;
}

const AnimatedCheck = Animated.createAnimatedComponent(Check);

const Checkbox = React.forwardRef<
  React.ElementRef<typeof Pressable>,
  Omit<React.ComponentPropsWithoutRef<typeof Pressable>, "onPress"> &
    CheckboxProps
>(({ className, value, onChange, iconClass, iconSize = 18, ...props }, ref) => {
  return (
    <Pressable
      ref={ref}
      role="checkbox"
      accessibilityState={{ checked: value }}
      className={cn(
        "peer flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-primary bg-card ring-offset-background disabled:opacity-50",
        className,
      )}
      onPress={() => {
        onChange(!value);
      }}
      {...props}
    >
      <View />
      {value && (
        <AnimatedCheck
          entering={FadeIn.duration(200)}
          exiting={FadeOut.duration(200)}
          size={iconSize}
          className={cn("text-foreground", iconClass)}
        />
      )}
    </Pressable>
  );
});

Checkbox.displayName = "Checkbox";

export { Checkbox };
