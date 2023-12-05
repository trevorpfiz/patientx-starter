import { PatientTestResults } from "../_components/patient-test-results";

export const runtime = "edge";

export default function PatientsTestResultsPage() {
  return (
    <>
      <PatientTestResults />

      <div className="absolute inset-0 top-12 -z-10 bg-cover bg-center" />
    </>
  );
}
