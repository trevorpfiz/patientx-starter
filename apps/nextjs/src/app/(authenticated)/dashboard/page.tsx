import Dashboard from "./_components/dashboard";

export const runtime = "edge";

export default function DashboardPage() {
  return (
    <>
      <Dashboard />

      <div className="absolute inset-0 top-12 -z-10 bg-cover bg-center" />
    </>
  );
}
