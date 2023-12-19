import Link from "next/link";

import { AllPatients } from "./_components/all-patients";
import { Patient } from "./_components/patient";

export const runtime = "edge";

export default function HomePage() {
  return (
    <main className="flex h-screen flex-col items-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container mt-12 flex flex-col items-center justify-center gap-4 py-8">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          Create <span className="text-pink-400">T3</span> Turbo
        </h1>
        <Link href="/onboarding">
          <h2 className="text-blue-500">Onboarding</h2>
        </Link>
        <Link href="/dashboard">
          <h2 className="text-blue-500">Dashboard</h2>
        </Link>
        <Patient />
        <AllPatients />
      </div>
    </main>
  );
}
