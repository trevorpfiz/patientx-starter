import { api } from "~/trpc/server";

const PatientIdPage = async ({ params }: { params: { patientId: string } }) => {
  const patient = await api.canvas.getPatient.query({ id: params.patientId });
  console.log("patient", patient);
  return (
    <div className="flex flex-col gap-4">
      <p>{JSON.stringify(patient)}</p>
    </div>
  );
};

export default PatientIdPage;
