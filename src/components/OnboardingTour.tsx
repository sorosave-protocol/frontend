"use client";

import React, { useState, useEffect } from "react";
import Joyride, { CallBackProps, STATUS, Step } from "react-joyride";

const TOUR_STEPS: Step[] = [
  {
    target: "#tour-wallet-connect",
    content:
      "First, connect your Stellar wallet using Freighter. This allows you to participate in savings groups.",
    disableBeacon: true,
    title: "Connect Your Wallet",
  },
  {
    target: "#tour-groups-link",
    content:
      "Browse existing savings groups here. You can find groups to join or see how others are saving.",
    title: "Browse Groups",
  },
  {
    target: "#tour-create-group",
    content:
      "Want to start your own savings circle? Create a new group and invite friends to join!",
    title: "Create a Group",
  },
  {
    target: "#tour-join-group",
    content:
      "When a group is still forming, click Join Group to become a member. Each group has a fixed contribution amount.",
    title: "Join a Group",
  },
  {
    target: "#tour-contribute",
    content:
      "Once the group is active, contribute each round. Your contribution goes into the pot, and one member receives it!",
    title: "Contribute to the Pot",
  },
];

const TOUR_STORAGE_KEY = "sorosave-tour-completed";

interface OnboardingTourProps {
  onComplete?: () => void;
}

export function OnboardingTour({ onComplete }: OnboardingTourProps) {
  const [run, setRun] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    // Check if this is first visit
    const tourCompleted = localStorage.getItem(TOUR_STORAGE_KEY);
    if (!tourCompleted) {
      // Delay start slightly to ensure DOM is ready
      setTimeout(() => setRun(true), 500);
    }
  }, []);

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status, index, type } = data;

    // Finished or skipped
    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      localStorage.setItem(TOUR_STORAGE_KEY, "true");
      setRun(false);
      onComplete?.();
    }

    // Update step index for continuous tracking
    if (type === "step:end") {
      setStepIndex(index + 1);
    }
  };

  const restartTour = () => {
    localStorage.removeItem(TOUR_STORAGE_KEY);
    setStepIndex(0);
    setRun(true);
  };

  // Export restart function for external use
  if (typeof window !== "undefined") {
    (window as unknown as { restartSoroSaveTour: () => void }).restartSoroSaveTour = restartTour;
  }

  return (
    <Joyride
      run={run}
      steps={TOUR_STEPS}
      stepIndex={stepIndex}
      continuous
      showSkipButton
      showProgress
      callback={handleJoyrideCallback}
      styles={{
        options: {
          primaryColor: "#4f46e5", // Indigo - matches primary theme
          zIndex: 10000,
        },
        tooltipContainer: {
          textAlign: "left",
        },
        buttonNext: {
          backgroundColor: "#4f46e5",
        },
        buttonBack: {
          marginRight: 10,
        },
        buttonSkip: {
          color: "#6b7280",
        },
      }}
      locale={{
        next: "Next",
        back: "Back",
        skip: "Skip tour",
        last: "Finish",
      }}
    />
  );
}

// Helper function to restart tour from outside
export function restartTour() {
  if (typeof window !== "undefined") {
    const restart = (window as unknown as { restartSoroSaveTour?: () => void }).restartSoroSaveTour;
    if (restart) restart();
  }
}