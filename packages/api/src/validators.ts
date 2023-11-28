import * as z from "zod";

export const patientSchema = z.object({
  resourceType: z.literal("Patient"),
  id: z.string(),
});
export type BasicPatient = z.infer<typeof patientSchema>;
