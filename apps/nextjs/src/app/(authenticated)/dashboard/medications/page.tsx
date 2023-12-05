import { PatientMedications } from "../_components/patient-medications";

export const runtime = "edge";

export default function PatientMedicationsPage() {
  return (
    <>
      <PatientMedications />

      <div className="absolute inset-0 top-12 -z-10 bg-cover bg-center" />
    </>
  );
}
