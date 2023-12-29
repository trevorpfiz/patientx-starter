import { useAtom } from 'jotai';
import { useState } from 'react';
import { View } from 'react-native'
import Toast from 'react-native-toast-message';
import { patientIdAtom } from '~/app';
import { TextInput } from '~/components/ui/forms/text-input';
import { Button } from '~/components/ui/rn-ui/components/ui/button';
import { api } from '~/utils/api';

export default function PayBill() {
  const [value, setValue] = useState("0");
  const [patientId] = useAtom(patientIdAtom);

  const createPayment = api.payment.createPayment.useMutation({
    onSuccess: () => {
      Toast.show({
        type: "success",
        text1: "Payment created successfully",
      });
    },
    onError: (error) => {
      Toast.show({
        type: "error",
        text1: "Payment failed",
        text2: error.message,
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

    <View className="p-4 flex flex-col gap-4">
      <TextInput
        onChangeText={setValue}
        value={value}
        placeholder="Enter amount"
      />
      <Button
        onPress={async () => {
          await onCreatePayment(parseInt(value));
        }}
      >Pay</Button>
    </View>
  )
}
