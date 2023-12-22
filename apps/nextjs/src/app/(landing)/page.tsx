import { Suspense } from "react";
import Link from "next/link";

import { AllPatients } from "./_components/all-patients";
import { AuthShowcase } from "./_components/auth-showcase";
import { Patient } from "./_components/patient";
import {
  CreatePostForm,
  PostCardSkeleton,
  PostList,
} from "./_components/posts";

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
        <AuthShowcase />

        <CreatePostForm />
        <div className="h-[40vh] w-full max-w-2xl overflow-y-scroll">
          <Suspense
            fallback={
              <div className="flex w-full flex-col gap-4">
                <PostCardSkeleton />
                <PostCardSkeleton />
                <PostCardSkeleton />
              </div>
            }
          >
            <PostList />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
