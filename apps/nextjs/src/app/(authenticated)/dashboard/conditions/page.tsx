import { PatientConditions } from "../_components/patient-conditions";

export const runtime = "edge";

export default function PatientConditionsPage() {
  return (
    <>
      <PatientConditions patientId="e7836251cbed4bd5bb2d792bc02893fd" />

      <div className="absolute inset-0 top-12 -z-10 bg-cover bg-center" />
    </>
  );
}
