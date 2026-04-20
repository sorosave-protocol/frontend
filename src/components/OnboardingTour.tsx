"use client";

import React, { useEffect, useState } from "react";
import Joyride, { CallBackProps, STATUS, Step } from "react-joyride";

export const OnboardingTour = () => {
  const [run, setRun] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Check local storage to see if tour was already completed
    const hasSeenTour = localStorage.getItem("sorosave_tour_completed");
    if (!hasSeenTour) {
      setRun(true);
    }

    // Listen for custom event to trigger replay
    const handleReplay = () => {
      localStorage.removeItem("sorosave_tour_completed");
      setRun(true);
    };
    
    window.addEventListener("replay_onboarding_tour", handleReplay);
    return () => {
      window.removeEventListener("replay_onboarding_tour", handleReplay);
    };
  }, []);

  const steps: Step[] = [
    {
      target: "body",
      content: "Welcome to Sorosave! Let's take a quick tour of our platform.",
      placement: "center",
      disableBeacon: true,
    },
    {
      target: ".tour-wallet-connect",
      content: "First, connect your wallet to get started.",
      placement: "bottom",
    },
    {
      target: ".tour-browse-groups",
      content: "Browse available saving groups to find one that fits your goals.",
      placement: "bottom",
    },
    {
      target: ".tour-join-group",
      content: "Join a group to participate in decentralized savings.",
      placement: "bottom",
    },
    {
      target: ".tour-contribute",
      content: "Finally, make regular contributions and watch your savings grow!",
      placement: "top",
    }
  ];

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

    // If the tour is finished or the user skips it
    if (finishedStatuses.includes(status)) {
      setRun(false);
      localStorage.setItem("sorosave_tour_completed", "true");
    }
  };

  if (!isMounted) return null;

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      scrollToFirstStep
      showProgress
      showSkipButton
      callback={handleJoyrideCallback}
      styles={{
        options: {
          primaryColor: "#0f766e",
          zIndex: 10000,
        },
      }}
    />
  );
};

// Expose a helper to trigger the tour manually from Settings/Help menus
export const triggerTourReplay = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("replay_onboarding_tour"));
  }
};
