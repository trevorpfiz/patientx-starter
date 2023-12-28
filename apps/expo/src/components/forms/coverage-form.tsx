import { SafeAreaView, Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Animated, { FadeInDown, FadeOutUp } from "react-native-reanimated";
import { Link } from "expo-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAtom } from "jotai";
import { Loader2 } from "lucide-react-native";
import { Controller, FormProvider, useForm } from "react-hook-form";

import { coverageFormSchema } from "@acme/shared/src/validators/forms";
import type { CoverageFormType } from "@acme/shared/src/validators/forms";

import { Button } from "~/components/ui/rn-ui/components/ui/button";
import { Checkbox } from "~/components/ui/rn-ui/components/ui/checkbox";
import { Input } from "~/components/ui/rn-ui/components/ui/input";
import { Label } from "~/components/ui/rn-ui/components/ui/label";
import { cn } from "~/components/ui/rn-ui/lib/utils";
import { useStepStatusUpdater } from "~/hooks/use-step-status-updater";
import { api } from "~/utils/api";
import { uploadTestPdf } from "./upload-test";
import { patientIdAtom } from "./welcome-form";

export const CoverageForm = (props: { onSuccess?: () => void }) => {
  const [patientId] = useAtom(patientIdAtom);
  const updater = useStepStatusUpdater();

  const form = useForm<CoverageFormType>({
    resolver: zodResolver(coverageFormSchema),
    defaultValues: {
      subscriberId: "",
      payorId: "",
      insuranceConsent: false,
    },
  });

  const coverageMutation = api.coverage.submitCoverage.useMutation({
    onSuccess: (data) => {
      console.log(data, "data");
    },
  });

  const consentMutation = api.consent.submitConsent.useMutation({
    onSuccess: (data) => {
      console.log(data, "data");

      // Update the coverage step as complete
      updater.updateStepStatus("coverage", "complete");

      // Call the passed onSuccess prop if it exists
      if (props.onSuccess) {
        props.onSuccess();
      }
    },
  });

  async function onSubmit(data: CoverageFormType) {
    const { subscriberId, payorId, insuranceConsent } = data;
    console.log(JSON.stringify(data));

    // Calculate start and end dates
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setFullYear(startDate.getFullYear() + 1);

    // coverage request body
    const coverageRequestBody = {
      status: "active",
      subscriber: {
        reference: `Patient/${patientId}`,
      },
      subscriberId: `${subscriberId}`,
      beneficiary: {
        reference: `Patient/${patientId}`,
      },
      relationship: {
        coding: [
          {
            system: "http://hl7.org/fhir/ValueSet/subscriber-relationship",
            code: "self",
          },
        ],
      },
      payor: [
        {
          identifier: {
            system: "https://www.claim.md/services/era/",
            value: `${payorId}`,
          },
          display: "Insurer company name",
        },
      ],
      order: 1,
    };

    // TODO - can change logic to run both mutations in parallel
    // Submit intake form
    await coverageMutation.mutateAsync({
      query: {},
      body: coverageRequestBody,
    });

    // Prepare insurance consent request body
    const insuranceConsentRequestBody = {
      status: "active",
      scope: {},
      category: [
        {
          coding: [
            {
              system: "LOINC",
              code: "64290-0",
              display: "Health insurance card",
            },
          ],
        },
      ],
      patient: {
        reference: `Patient/${patientId}`,
      },
      dateTime: startDate.toISOString(),
      sourceAttachment: {
        contentType: "application/pdf",
        title: "UploadTest.pdf",
        data: uploadTestPdf,
      },
      provision: {
        period: {
          start: startDate.toISOString().split("T")[0],
          end: endDate.toISOString().split("T")[0],
        },
      },
    };

    // Trigger consent mutation
    if (insuranceConsent) {
      consentMutation.mutate({
        body: insuranceConsentRequestBody,
      });
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Text className="px-6 py-4 text-2xl font-semibold">
        Share your insurance details
      </Text>

      <KeyboardAwareScrollView>
        <View className="flex-1 px-6">
          <FormProvider {...form}>
            <View className="flex flex-col gap-4">
              <Controller
                control={form.control}
                name="subscriberId"
                render={({
                  field: { onChange, onBlur, value },
                  fieldState: { error },
                }) => {
                  return (
                    <View>
                      <Label
                        className={cn(error && "text-destructive", "pb-2.5")}
                        nativeID="subscriberLabel"
                      >
                        Subscriber ID
                      </Label>
                      <Input
                        placeholder=""
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        accessibilityLabel="Subscriber ID"
                        accessibilityLabelledBy="subscriberLabel"
                      />
                      {error && (
                        <Animated.Text
                          entering={FadeInDown}
                          exiting={FadeOutUp.duration(275)}
                          className={"px-0.5 py-2 text-sm text-destructive"}
                          role="alert"
                        >
                          {error?.message}
                        </Animated.Text>
                      )}
                    </View>
                  );
                }}
              />

              <Controller
                control={form.control}
                name="payorId"
                render={({
                  field: { onChange, onBlur, value },
                  fieldState: { error },
                }) => {
                  return (
                    <View>
                      <Label
                        className={cn(error && "text-destructive", "pb-2.5")}
                        nativeID="payorLabel"
                      >
                        Payor ID
                      </Label>
                      <Input
                        placeholder=""
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        accessibilityLabel="Payor ID"
                        accessibilityLabelledBy="payorLabel"
                      />
                      {error && (
                        <Animated.Text
                          entering={FadeInDown}
                          exiting={FadeOutUp.duration(275)}
                          className={"px-0.5 py-2 text-sm text-destructive"}
                          role="alert"
                        >
                          {error?.message}
                        </Animated.Text>
                      )}
                    </View>
                  );
                }}
              />

              <Controller
                control={form.control}
                name="insuranceConsent"
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <View>
                    <View className="flex-row items-center gap-2">
                      <Checkbox
                        accessibilityLabelledBy="checkLabel"
                        value={value}
                        onChange={onChange}
                      />
                      <Label
                        onPress={() => onChange(!value)}
                        nativeID="checkLabel"
                        className="flex-shrink text-base"
                      >
                        {`I consent to receiving medical treatment, the filing of insurance benefits for my care, and the sharing of my medical record information with my insurance company as outlined in the`}{" "}
                        <Link href={"/onboarding/(modals)/pdf"}>
                          <Text className="text-blue-500 underline">
                            Consent to Treat Form
                          </Text>
                        </Link>
                      </Label>
                    </View>
                    {error && (
                      <Animated.Text
                        entering={FadeInDown}
                        exiting={FadeOutUp.duration(275)}
                        className={"px-0.5 py-2 text-sm text-destructive"}
                        role="alert"
                      >
                        {error?.message}
                      </Animated.Text>
                    )}
                  </View>
                )}
              />
            </View>
          </FormProvider>
        </View>
      </KeyboardAwareScrollView>
      <View className="px-12 pb-4">
        <Button onPress={form.handleSubmit(onSubmit)} textClass="text-center">
          {coverageMutation.isLoading || consentMutation.isLoading ? (
            <View className="flex-row items-center justify-center gap-3">
              <Loader2
                size={24}
                color="white"
                strokeWidth={3}
                className="animate-spin"
              />
              <Text className="text-xl font-medium text-primary-foreground">
                Submitting...
              </Text>
            </View>
          ) : (
            "Submit"
          )}
        </Button>
      </View>
    </SafeAreaView>
  );
};
