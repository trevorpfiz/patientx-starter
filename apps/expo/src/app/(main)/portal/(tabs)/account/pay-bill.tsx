import { useRef, useState } from "react";
import type { TextInput } from "react-native";
import { Text, View } from "react-native";
import Toast from "react-native-toast-message";
import { useAtom } from "jotai";
import { Loader2 } from "lucide-react-native";

import { patientIdAtom } from "~/app/(main)";
import { Button } from "~/components/ui/rn-ui/components/ui/button";
import { Input } from "~/components/ui/rn-ui/components/ui/input";
import { Label } from "~/components/ui/rn-ui/components/ui/label";
import { cn } from "~/components/ui/rn-ui/lib/utils";
import { api } from "~/utils/api";

export default function PayBill() {
  const [patientId] = useAtom(patientIdAtom);
  const inputRef = useRef<TextInput>(null);
  const [value, setValue] = useState("0");
  const [err, setErr] = useState<string | null>(null);

  function handleOnLabelPress() {
    if (!inputRef.current) {
      return;
    }
    if (inputRef.current.isFocused()) {
      inputRef.current?.blur();
    } else {
      inputRef.current?.focus();
    }
  }

  function onChangeText(text: string) {
    if (err) {
      setErr(null);
    }
    setValue(text);
  }

  const createPayment = api.payment.createPayment.useMutation({
    onSuccess: () => {
      Toast.show({
        type: "success",
        text1: "Payment created successfully",
      });
    },
  });

  const onCreatePayment = async (value: number) => {
    await createPayment.mutateAsync({
      body: {
        request: {
          reference: `Patient/${patientId}`,
        },
        amount: {
          value,
        },
        payment: {},
        recipient: {},
        status: "active",
      },
    });
  };

  return (
    <View className="flex-1 flex-col gap-4 bg-gray-100 p-6">
      <View className="flex-1">
        <Label
          className={cn(err && "text-destructive", "pb-2.5")}
          onPress={handleOnLabelPress}
          nativeID="inputLabel"
        >
          How much would you like to pay today?
        </Label>
        <Input
          ref={inputRef}
          placeholder="Enter an amount"
          value={value}
          onChangeText={onChangeText}
          aria-label="input"
          aria-labelledby="inputLabel"
        />
      </View>
      <View>
        <Button
          onPress={async () => {
            await onCreatePayment(parseInt(value));
          }}
          disabled={createPayment.isLoading} // Disable the button when loading
        >
          {createPayment.isLoading ? (
            <View className="flex-row items-center justify-center gap-3">
              <Loader2
                size={24}
                color="white"
                strokeWidth={3}
                className="animate-spin"
              />
              <Text className="text-xl font-medium text-primary-foreground">
                Processing...
              </Text>
            </View>
          ) : (
            "Pay"
          )}
        </Button>
      </View>
    </View>
  );
}
