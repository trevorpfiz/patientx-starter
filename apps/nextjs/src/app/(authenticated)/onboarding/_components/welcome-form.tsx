"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { useForm } from "react-hook-form";

import type { PatientIntake } from "@acme/api/src/validators/forms";
import { patientIntakeSchema } from "@acme/api/src/validators/forms";
import { Button } from "@acme/ui/button";
import { Checkbox } from "@acme/ui/checkbox";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@acme/ui/select";
import { useToast } from "@acme/ui/use-toast";

import { api } from "~/trpc/react";
import { uploadTestPdf } from "./upload-test";

export const patientAtom = atomWithStorage("patientId", "");
const UUID = self.crypto.randomUUID();

export const WelcomeForm = (props: { onSuccess?: () => void }) => {
  const [patientId, setPatientId] = useAtom(patientAtom);
  const [consentsCompleted, setConsentsCompleted] = useState(0);
  const toaster = useToast();

  const form = useForm<PatientIntake>({
    resolver: zodResolver(patientIntakeSchema),
    defaultValues: {
      name: "",
      birthDate: "",
      gender: "",
      line: "",
      city: "",
      state: "",
      postalCode: "",
      phoneNumber: "",
      genericConsent: false,
      insuranceConsent: false,
    },
  });

  const patientMutation = api.patient.createPatient.useMutation({
    onSuccess: (data) => {
      console.log(data, "data");

      toaster.toast({
        title: "You submitted the following values:",
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">{JSON.stringify(data, null, 2)}</code>
          </pre>
        ),
      });
    },
    onError: (error) => {
      console.log(error, "error");

      // Show an error toast
      toaster.toast({
        title: "Error submitting consent",
        description: "An issue occurred while submitting. Please try again.",
        variant: "destructive",
      });
    },
  });

  const consentMutation = api.consent.submitConsent.useMutation({
    onSuccess: (data) => {
      console.log(data, "data");

      toaster.toast({
        title: "You submitted the following values:",
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">{JSON.stringify(data, null, 2)}</code>
          </pre>
        ),
      });

      // Increment consentsCompleted
      setConsentsCompleted((count) => count + 1);
    },
    onError: (error) => {
      console.log(error, "error");

      // Show an error toast
      toaster.toast({
        title: "Error submitting consent",
        description: "An issue occurred while submitting. Please try again.",
        variant: "destructive",
      });
    },
  });

  function mapGenderToBirthSex(gender: string) {
    switch (gender.toLowerCase()) {
      case "male":
        return "M";
      case "female":
        return "F";
      case "other":
        return "OTH";
      case "unknown":
        return "UNK";
      default:
        return "UNK"; // Default case if gender is not recognized
    }
  }

  async function onSubmit(data: PatientIntake) {
    const {
      name,
      birthDate,
      gender,
      line,
      city,
      state,
      postalCode,
      phoneNumber,
      genericConsent,
      insuranceConsent,
    } = data;
    console.log(JSON.stringify(data));

    // Calculate start and end dates
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setFullYear(startDate.getFullYear() + 1);

    // split name into given and family
    const fullNameParts = name.trim().split(/\s+/);
    const givenName = fullNameParts.slice(0, -1); // All names except the last word
    const familyName = fullNameParts.slice(-1)[0]; // The last word

    // map gender to birthsex
    const birthSexValue = mapGenderToBirthSex(gender);

    // patient request body
    const patientRequestBody = {
      name: [
        {
          use: "official",
          family: familyName,
          given: givenName,
        },
      ],
      birthDate: birthDate,
      gender: gender,
      address: [
        {
          use: "home",
          type: "both",
          text: `${line}, ${city}, ${state} ${postalCode}`, // Combine into one string
          line: [line],
          city: city,
          state: state,
          postalCode: postalCode,
        },
      ],
      telecom: [
        {
          system: "phone",
          value: phoneNumber,
        },
      ],
      extension: [
        {
          url: "http://hl7.org/fhir/us/core/StructureDefinition/us-core-birthsex",
          valueCode: birthSexValue,
        },
      ],
      identifier: [
        {
          use: "temp",
          system:
            "UUID used to query patient to set patient id in localStorage",
          value: UUID,
        },
      ],
    };

    // Submit intake form
    const response = await patientMutation.mutateAsync({
      body: patientRequestBody,
    });
    const patientDataId = response;

    if (patientDataId) {
      // Set patientId in localStorage
      setPatientId(patientDataId);

      // Prepare consent request bodies
      const genericConsentRequestBody = {
        status: "active",
        scope: {},
        category: [
          {
            coding: [
              {
                system: "LOINC",
                code: "64285-0",
                display: "Medical history screening form",
              },
            ],
          },
        ],
        patient: {
          reference: `Patient/${patientDataId}`,
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
          reference: `Patient/${patientDataId}`,
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

      // Trigger consent mutations
      if (genericConsent) {
        consentMutation.mutate({
          body: genericConsentRequestBody,
        });
      }

      if (insuranceConsent) {
        consentMutation.mutate({
          body: insuranceConsentRequestBody,
        });
      }
    } else {
      // Show an error toast
      toaster.toast({
        title: "Error submitting consent",
        description: "An issue occurred while submitting. Please try again.",
        variant: "destructive",
      });
    }
  }

  useEffect(() => {
    if (consentsCompleted === 2) {
      // Navigate to the next step
      if (props.onSuccess) {
        props.onSuccess();
      }
    }
  }, [consentsCompleted, props]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        {/* Personal information */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>{`Name`}</FormLabel>
              <FormControl>
                <Input placeholder="Full name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="birthDate"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>{`Date of Birth`}</FormLabel>
              <FormControl>
                <Input placeholder="YYYY-MM-DD" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gender</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="male">male</SelectItem>
                  <SelectItem value="female">female</SelectItem>
                  <SelectItem value="other">other</SelectItem>
                  <SelectItem value="unknown">unknown</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Address */}
        <FormField
          control={form.control}
          name="line"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>{`Street Address`}</FormLabel>
              <FormControl>
                <Input placeholder="123 Main St" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>{`City`}</FormLabel>
              <FormControl>
                <Input placeholder="New York" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="state"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>{`State`}</FormLabel>
              <FormControl>
                <Input placeholder="NY" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="postalCode"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>{`Zip Code`}</FormLabel>
              <FormControl>
                <Input placeholder="10001" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Phone number */}
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>{`Phone number`}</FormLabel>
              <FormControl>
                <Input placeholder="555-555-5555" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Consents */}
        <FormField
          control={form.control}
          name="genericConsent"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>{`Generic consent`}</FormLabel>
                <FormDescription>
                  {`This will allow us to use the health data you share with us.`}
                </FormDescription>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="insuranceConsent"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>{`Health insurance consent`}</FormLabel>
                <FormDescription>
                  {`I consent to share my health insurance information`}
                </FormDescription>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <Button type="submit" variant="outline">
          Submit
        </Button>
      </form>
    </Form>
  );
};
