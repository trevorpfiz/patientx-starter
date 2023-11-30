import * as z from "zod";

// Forms
export const newPatientSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  address: z.string().min(10, "Address must be at least 10 characters"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
});
export type NewPatient = z.infer<typeof newPatientSchema>;
