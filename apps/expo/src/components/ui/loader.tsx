import React from "react";
import { View } from "react-native";
import { Loader2 } from "lucide-react-native";

import { cn } from "~/components/ui/rn-ui/lib/utils";

const LoaderComponent = React.forwardRef<
  React.ElementRef<typeof View>,
  React.ComponentPropsWithoutRef<typeof View>
>(({ className, ...props }, ref) => {
  return (
    <View
      ref={ref}
      className={cn(
        "mb-36 flex-1 items-center justify-center bg-white",
        className,
      )}
      {...props}
    >
      <Loader2
        size={48}
        color="black"
        strokeWidth={2}
        className="animate-spin"
      />
    </View>
  );
});
LoaderComponent.displayName = "LoaderComponent";

export { LoaderComponent };
