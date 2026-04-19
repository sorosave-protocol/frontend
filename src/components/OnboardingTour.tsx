import { useEffect, useState } from "react";
import Joyride, { CallBackProps, STATUS, Step } from "react-joyride";
import { useWallet } from "@/app/providers";
import { useRouter } from "next/navigation";

const steps: Step[] = [
  {
    target: "body",
    content: "Welcome to SoroSave! Let's take a quick tour of the app's key features.",
    placement: "center",
    disableBeacon: true,
  },
  {
    target: "[data-testid='wallet-connect-button']",
    content: "First, connect your Stellar wallet to interact with the protocol.",
    placement: "right",
  },
  {
    target: "[data-testid='groups-list']",
    content: "Browse existing savings groups and see what's available.",
    placement: "right",
  },
  {
    target: "[data-testid='group-card']",
    content: "Click on a group to view details and join.",
    placement: "right",
  },
  {
    target: "[data-testid='join-group-button']",
    content: "Join a group by clicking this button and confirming the transaction.",
    placement: "right",
  },
  {
    target: "[data-testid='contribute-button']",
    content: "Once in a group, contribute your savings each cycle.",
    placement: "right",
  },
];

export function OnboardingTour() {
  const [run, setRun] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const { isConnected } = useWallet();
  const router = useRouter();

  useEffect(() => {
    const hasVisited = localStorage.getItem("onboardingTourCompleted");
    if (!hasVisited) {
      setRun(true);
    }
  }, []);

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status, type, index } = data;

    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      localStorage.setItem("onboardingTourCompleted", "true");
      setRun(false);
    }

    if (type === "step:after" && index === 1 && !isConnected) {
      router.push("/wallet");
    }

    setStepIndex(index);
  };

  return (
    <Joyride
      steps={steps}
      run={run}
      stepIndex={stepIndex}
      continuous
      showProgress
      showSkipButton
      callback={handleJoyrideCallback}
      styles={{
        options: {
          zIndex: 10000,
        },
      }}
    />
  );
}