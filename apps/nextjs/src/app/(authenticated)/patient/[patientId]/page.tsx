import GetPatient from "../_components/get-patient";

const PatientIdPage = ({ params }: { params: { patientId: string } }) => {
  return (
    <div className="flex flex-col gap-4">
      <GetPatient patientId={params.patientId} />
    </div>
  );
};

export default PatientIdPage;
