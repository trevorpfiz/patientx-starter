import { PatientAppointments } from "../_components/patient-appointments";

export const runtime = "edge";

export default function PatientAppointmentsPage() {
  return (
    <>
      <PatientAppointments />

      <div className="absolute inset-0 top-12 -z-10 bg-cover bg-center" />
    </>
  );
}
