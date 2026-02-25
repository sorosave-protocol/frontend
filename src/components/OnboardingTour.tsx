"use client";

import React, { useState, useEffect, useCallback } from "react";
import Joyride, {
  CallBackProps,
  STATUS,
  Step,
  TooltipRenderProps,
} from "react-joyride";
import { X, RefreshCw, ChevronRight, ChevronLeft } from "lucide-react";

interface OnboardingTourProps {
  run?: boolean;
  onComplete?: () => void;
}

const TOUR_COMPLETED_KEY = "sorosave_onboarding_completed";
const TOUR_DISMISSED_KEY = "sorosave_onboarding_dismissed";

// Custom tooltip component for better styling
const TourTooltip = ({
  continuous,
  index,
  step,
  backProps,
  closeProps,
  primaryProps,
  tooltipProps,
  size,
  isLastStep,
}: TooltipRenderProps) => (
  <div
    {...tooltipProps}
    className="bg-white rounded-xl shadow-2xl p-6 max-w-sm border border-gray-100"
  >
    {/* Header */}
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
          <span className="text-white text-sm font-bold">{index + 1}</span>
        </div>
        <span className="text-xs text-gray-400">of {size}</span>
      </div>
      <button
        {...closeProps}
        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
      >
        <X className="w-5 h-5 text-gray-400" />
      </button>
    </div>

    {/* Content */}
    <div className="mb-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {step.title}
      </h3>
      <div className="text-gray-600 text-sm leading-relaxed">{step.content}</div>
    </div>

    {/* Footer */}
    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
      <div className="flex gap-1">
        {Array.from({ length: size }).map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-colors ${
              i === index
                ? "bg-blue-500"
                : i < index
                ? "bg-blue-300"
                : "bg-gray-200"
            }`}
          />
        ))}
      </div>
      <div className="flex gap-2">
        {continuous && index > 0 && (
          <button
            {...backProps}
            className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>
        )}
        <button
          {...primaryProps}
          className="flex items-center gap-1 px-4 py-1.5 text-sm bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity"
        >
          {isLastStep ? "Finish" : "Next"}
          {!isLastStep && <ChevronRight className="w-4 h-4" />}
        </button>
      </div>
    </div>
  </div>
);

export const OnboardingTour: React.FC<OnboardingTourProps> = ({
  run: runProp = false,
  onComplete,
}) => {
  const [run, setRun] = useState(runProp);
  const [stepIndex, setStepIndex] = useState(0);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Check if tour should run automatically on first visit
    if (typeof window !== "undefined") {
      const hasCompleted = localStorage.getItem(TOUR_COMPLETED_KEY);
      const hasDismissed = localStorage.getItem(TOUR_DISMISSED_KEY);
      if (!hasCompleted && !hasDismissed && !runProp) {
        setRun(true);
      }
    }
  }, [runProp]);

  const steps: Step[] = [
    {
      target: "[data-tour='welcome']",
      title: "👋 Welcome to Sorosave!",
      content: (
        <div>
          <p className="mb-2">
            Let's take a quick tour to help you get started with decentralized
            savings groups.
          </p>
          <p className="text-xs text-gray-500">
            You can skip this anytime or replay it from Settings later.
          </p>
        </div>
      ),
      placement: "center",
    },
    {
      target: "[data-tour='wallet']",
      title: "🔐 Connect Your Wallet",
      content: (
        <div>
          <p className="mb-2">
            First, connect your Stellar wallet to interact with the Sorosave
            protocol.
          </p>
          <p className="text-xs text-gray-500">
            We support Freighter, Albedo, and other Stellar wallets.
          </p>
        </div>
      ),
      placement: "bottom",
    },
    {
      target: "[data-tour='groups']",
      title: "👥 Browse Savings Groups",
      content: (
        <div>
          <p className="mb-2">
            Discover public savings groups created by the community or create
            your own.
          </p>
          <p className="text-xs text-gray-500">
            Each group has a goal, contribution amount, and schedule.
          </p>
        </div>
      ),
      placement: "right",
    },
    {
      target: "[data-tour='join']",
      title: "🤝 Join a Group",
      content: (
        <div>
          <p className="mb-2">
            Join a group to start saving together with friends or community
            members.
          </p>
          <p className="text-xs text-gray-500">
            You'll commit to regular contributions to help reach the group goal.
          </p>
        </div>
      ),
      placement: "left",
    },
    {
      target: "[data-tour='contribute']",
      title: "💰 Make Contributions",
      content: (
        <div>
          <p className="mb-2">
            Contribute to your groups on a regular schedule. Track your progress
            and see your savings grow!
          </p>
          <p className="text-xs text-gray-500">
            All contributions are secured on the Stellar blockchain.
          </p>
        </div>
      ),
      placement: "top",
    },
    {
      target: "[data-tour='dashboard']",
      title: "📊 Track Your Progress",
      content: (
        <div>
          <p className="mb-2">
            Monitor your savings, view contribution history, and manage all your
            groups from your dashboard.
          </p>
          <p className="text-sm text-blue-600 font-medium mt-3">
            Ready to start saving? Let's go! 🚀
          </p>
        </div>
      ),
      placement: "right",
    },
  ];

  const handleJoyrideCallback = useCallback(
    (data: CallBackProps) => {
      const { action, index, status, type } = data;

      if (action === "close" || status === STATUS.SKIPPED) {
        setRun(false);
        if (typeof window !== "undefined") {
          localStorage.setItem(TOUR_DISMISSED_KEY, "true");
        }
      }

      if (status === STATUS.FINISHED) {
        setRun(false);
        if (typeof window !== "undefined") {
          localStorage.setItem(TOUR_COMPLETED_KEY, "true");
        }
        onComplete?.();
      }

      if (type === "step:after") {
        setStepIndex(index + (action === "next" ? 1 : 0));
      }
    },
    [onComplete]
  );

  if (!isClient) {
    return null;
  }

  return (
    <Joyride
      steps={steps}
      run={run}
      stepIndex={stepIndex}
      continuous
      showSkipButton
      showProgress
      disableOverlayClose
      disableCloseOnEsc={false}
      spotlightClicks={false}
      hideBackButton={stepIndex === 0}
      tooltipComponent={TourTooltip}
      styles={{
        options: {
          zIndex: 10000,
          arrowColor: "#fff",
          backgroundColor: "#fff",
          overlayColor: "rgba(0, 0, 0, 0.5)",
          primaryColor: "#3b82f6",
          textColor: "#1f2937",
          width: "auto",
          spotlight: {
            backgroundColor: "transparent",
          },
        },
        spotlight: {
          backgroundColor: "transparent",
          borderRadius: "8px",
        },
      }}
      callback={handleJoyrideCallback}
      locale={{
        back: "Back",
        close: "Close",
        last: "Finish",
        next: "Next",
        skip: "Skip Tour",
      }}
    />
  );
};

// Hook to control the tour
export const useOnboardingTour = () => {
  const [isRunning, setIsRunning] = useState(false);

  const startTour = useCallback(() => {
    setIsRunning(true);
  }, []);

  const stopTour = useCallback(() => {
    setIsRunning(false);
  }, []);

  const resetTour = useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(TOUR_COMPLETED_KEY);
      localStorage.removeItem(TOUR_DISMISSED_KEY);
    }
    setIsRunning(true);
  }, []);

  const hasCompletedTour = useCallback(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(TOUR_COMPLETED_KEY) === "true";
    }
    return false;
  }, []);

  return {
    isRunning,
    startTour,
    stopTour,
    resetTour,
    hasCompletedTour,
    TourComponent: () => (
      <OnboardingTour run={isRunning} onComplete={() => setIsRunning(false)} />
    ),
  };
};

// Button component to replay tour from settings
export const ReplayTourButton: React.FC = () => {
  const { resetTour } = useOnboardingTour();

  return (
    <button
      onClick={resetTour}
      className="flex items-center gap-2 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
    >
      <RefreshCw className="w-4 h-4" />
      Replay Onboarding Tour
    </button>
  );
};

export default OnboardingTour;
