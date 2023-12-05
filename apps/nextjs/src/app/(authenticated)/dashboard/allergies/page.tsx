import { PatientAllergies } from "../_components/patient-allergies";

export const runtime = "edge";

export default function PatientAllergiesPage() {
  return (
    <>
      <PatientAllergies patientId="e7836251cbed4bd5bb2d792bc02893fd" />

      <div className="absolute inset-0 top-12 -z-10 bg-cover bg-center" />
    </>
  );
}
