"use client";

import { useEffect, useState } from "react";
import Joyride, { CallBackProps, STATUS, Step } from "react-joyride";

export function OnboardingTour() {
  const [run, setRun] = useState(false);

  useEffect(() => {
    const hasCompletedTour = localStorage.getItem("sorosave_tour_completed");
    if (!hasCompletedTour) {
      setRun(true);
    }
  }, []);

  const steps: Step[] = [
    {
      target: "body",
      placement: "center",
      content: "Welcome to SoroSave! Let's take a quick tour to help you get started.",
      disableBeacon: true,
    },
    {
      target: ".tour-wallet-connect",
      content: "First, you'll need to connect your Freighter wallet to interact with the protocol.",
      disableBeacon: true,
    },
    {
      target: ".tour-browse-groups",
      content: "Here you can browse all available saving groups and their details.",
      disableBeacon: true,
    },
    {
      target: ".tour-join-group",
      content: "Found a group you like? Click here to join and start saving together.",
      disableBeacon: true,
    },
    {
      target: ".tour-contribute",
      content: "Once you're in a group, use this section to make your periodic contributions.",
      disableBeacon: true,
    },
  ];

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      setRun(false);
      localStorage.setItem("sorosave_tour_completed", "true");
    }
  };

  return (
    <Joyride
      callback={handleJoyrideCallback}
      continuous
      hideCloseButton
      run={run}
      scrollToFirstStep
      showProgress
      showSkipButton
      steps={steps}
      styles={{
        options: {
          primaryColor: "#3b82f6", // tailwind blue-500
          zIndex: 10000,
        },
      }}
    />
  );
}
