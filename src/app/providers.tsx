"use client";

import { ReactNode } from "react";
import { OnboardingTour } from "@/components/OnboardingTour";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <>
      {/* Onboarding Tour - shows automatically on first visit */}
      <OnboardingTour />
      
      {/* App content */}
      {children}
    </>
  );
}
