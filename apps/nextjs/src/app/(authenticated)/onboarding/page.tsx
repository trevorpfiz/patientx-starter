import { Onboarding } from "./multi-step-form";

export const runtime = "edge";

export default function OnboardingPage() {
  return (
    <>
      <Onboarding templateId="basic" />

      <div className="absolute inset-0 top-12 -z-10 bg-cover bg-center" />
    </>
  );
}
