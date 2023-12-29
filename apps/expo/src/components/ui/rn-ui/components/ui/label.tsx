import React from "react";
import { Pressable, Text } from "react-native";

import { cn } from "~/components/ui/rn-ui/lib/utils";

const Label = React.forwardRef<
  React.ElementRef<typeof Text>,
  React.ComponentPropsWithoutRef<typeof Text> & {
    rootProps?: Omit<
      React.ComponentPropsWithoutRef<typeof Pressable>,
      "onPress"
    >;
  }
>(({ className, onPress, rootProps, ...props }, ref) => (
  <Pressable onPress={onPress} {...rootProps} className="flex-shrink">
    <Text
      ref={ref}
      className={cn(
        "px-0.5 py-1.5 text-lg font-medium leading-none text-foreground",
        className,
      )}
      {...props}
    />
  </Pressable>
));

Label.displayName = "Label";

export { Label };
