import { PatientForms } from "../_components/patient-forms";

export const runtime = "edge";

export default function PatientFormsPage() {
  return (
    <>
      <PatientForms patientId="e7836251cbed4bd5bb2d792bc02893fd" />

      <div className="absolute inset-0 top-12 -z-10 bg-cover bg-center" />
    </>
  );
}
