"use client";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@acme/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@acme/ui/form";
import { Input } from "@acme/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@acme/ui/popover";
import { toast } from "@acme/ui/use-toast";

import { api } from "~/trpc/react";

const CreatePayment = ({ reference }: { reference: string }) => {
  const router = useRouter();

  const CreatePaymentFormSchema = z.object({
    amount: z.coerce.number().gt(0, {
      message: "Amount must be greater than 0",
    }),
  });

  const createPayment = api.payment.createPayment.useMutation({
    onSuccess: () => {
      toast({
        title: "Payment created",
        description: "Payment created successfully",
      });
      router.refresh();
    },
    onError: (error) => {
      toast({
        title: "Payment creation failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const createPaymentForm = useForm<z.infer<typeof CreatePaymentFormSchema>>({
    resolver: zodResolver(CreatePaymentFormSchema),
    defaultValues: {
      amount: 0,
    },
  });

  const onSubmitCreatePayment = async (
    data: z.infer<typeof CreatePaymentFormSchema>,
  ) => {
    try {
      await createPayment.mutateAsync({
        body: {
          resourceType: "PaymentNotice",
          status: "active",
          recipient: {},
          request: {
            reference: reference,
          },
          payment: {},
          created: new Date().toISOString(),
          amount: {
            value: data.amount,
            currency: "USD",
          },
        },
      });

      createPaymentForm.reset();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button>Create Payment</Button>
      </PopoverTrigger>
      <PopoverContent>
        <Form {...createPaymentForm}>
          <form
            onSubmit={createPaymentForm.handleSubmit(onSubmitCreatePayment)}
            className="w-full space-y-6"
          >
            <FormField
              control={createPaymentForm.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="10.00" {...field} />
                  </FormControl>
                  <FormDescription>
                    The amount of the payment to be made.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Submit Payment
            </Button>
          </form>
        </Form>
      </PopoverContent>
    </Popover>
  );
};

export default CreatePayment;
