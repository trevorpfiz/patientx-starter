import { PatientConditions } from "../_components/patient-conditions";

export const runtime = "edge";

export default function PatientConditionsPage() {
  return (
    <>
      <PatientConditions />

      <div className="absolute inset-0 top-12 -z-10 bg-cover bg-center" />
    </>
  );
}
