"use client";

import { useEffect, useMemo, useState, startTransition } from "react";
import { usePathname, useRouter } from "next/navigation";

interface OnboardingTourProps {
  runId: number;
}

interface TourStep {
  id: string;
  route: string;
  selector: string;
  title: string;
  description: string;
}

interface HighlightRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

const TOUR_STORAGE_KEY = "sorosave:onboarding-seen";

const TOUR_STEPS: TourStep[] = [
  {
    id: "wallet",
    route: "/",
    selector: '[data-tour="wallet-connect"]',
    title: "Connect your wallet first",
    description:
      "Freighter is the entry point for every savings action. The tour starts here so new members know where trust begins.",
  },
  {
    id: "browse",
    route: "/",
    selector: '[data-tour="browse-groups"]',
    title: "Browse active savings circles",
    description:
      "Open the groups list to compare contribution size, member count, and status before you commit.",
  },
  {
    id: "join",
    route: "/groups/1",
    selector: '[data-tour="join-group"]',
    title: "Join a forming group",
    description:
      "Forming groups still have open seats. This is where a new member joins before the rotation starts.",
  },
  {
    id: "contribute",
    route: "/groups/2",
    selector: '[data-tour="contribute-group"]',
    title: "Contribute when your cycle opens",
    description:
      "Once a group is active, this action keeps the pot moving. Members use it every round to stay in good standing.",
  },
];

export function OnboardingTour({ runId }: OnboardingTourProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [highlightRect, setHighlightRect] = useState<HighlightRect | null>(null);

  const currentStep = TOUR_STEPS[stepIndex] ?? null;

  const overlayStyle = useMemo(() => {
    if (!highlightRect) return null;

    return {
      top: Math.max(highlightRect.top - 10, 8),
      left: Math.max(highlightRect.left - 10, 8),
      width: highlightRect.width + 20,
      height: highlightRect.height + 20,
    };
  }, [highlightRect]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    const hasSeenTour = window.localStorage.getItem(TOUR_STORAGE_KEY) === "true";
    if (hasSeenTour) return;

    const timer = window.setTimeout(() => {
      setStepIndex(0);
      setIsRunning(true);
    }, 600);

    return () => {
      window.clearTimeout(timer);
    };
  }, [isMounted]);

  useEffect(() => {
    if (!isMounted || runId === 0) return;
    setStepIndex(0);
    setIsRunning(true);
  }, [isMounted, runId]);

  useEffect(() => {
    if (!isRunning || !currentStep) return;
    if (pathname === currentStep.route) return;

    startTransition(() => {
      router.push(currentStep.route);
    });
  }, [currentStep, isRunning, pathname, router]);

  useEffect(() => {
    if (!isRunning || !currentStep || pathname !== currentStep.route) {
      setHighlightRect(null);
      return;
    }

    let animationFrame = 0;
    let intervalId = 0;

    const syncHighlight = () => {
      const element = document.querySelector(currentStep.selector);
      if (!element) {
        setHighlightRect(null);
        return;
      }

      const rect = (element as HTMLElement).getBoundingClientRect();
      setHighlightRect({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      });
    };

    const requestSync = () => {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = window.requestAnimationFrame(syncHighlight);
    };

    requestSync();
    intervalId = window.setInterval(requestSync, 250);
    window.addEventListener("resize", requestSync);
    window.addEventListener("scroll", requestSync, { passive: true });

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.clearInterval(intervalId);
      window.removeEventListener("resize", requestSync);
      window.removeEventListener("scroll", requestSync);
    };
  }, [currentStep, isRunning, pathname]);

  if (!isMounted || !isRunning || !currentStep) {
    return null;
  }

  const stopTour = () => {
    window.localStorage.setItem(TOUR_STORAGE_KEY, "true");
    setIsRunning(false);
    setHighlightRect(null);
  };

  const goToStep = (nextIndex: number) => {
    if (nextIndex < 0) return;
    if (nextIndex >= TOUR_STEPS.length) {
      stopTour();
      return;
    }

    setStepIndex(nextIndex);
  };

  return (
    <>
      <div className="fixed inset-0 z-[70] bg-slate-950/55 backdrop-blur-[1px]" />
      {overlayStyle && (
        <div
          className="pointer-events-none fixed z-[71] rounded-2xl border-2 border-amber-300 shadow-[0_0_0_9999px_rgba(15,23,42,0.2)] transition-all duration-200"
          style={overlayStyle}
        />
      )}
      <div className="fixed bottom-6 right-6 z-[72] w-[min(92vw,24rem)] rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary-700">
              Guided Tour
            </p>
            <h2 className="mt-2 text-lg font-semibold text-slate-950">
              {currentStep.title}
            </h2>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
            {stepIndex + 1}/{TOUR_STEPS.length}
          </span>
        </div>

        <p className="text-sm leading-6 text-slate-600">
          {currentStep.description}
        </p>

        <div className="mt-5 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={stopTour}
            className="text-sm font-medium text-slate-500 transition-colors hover:text-slate-900"
          >
            Skip tour
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => goToStep(stepIndex - 1)}
              disabled={stepIndex === 0}
              className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Back
            </button>
            <button
              type="button"
              onClick={() => goToStep(stepIndex + 1)}
              className="rounded-full bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-700"
            >
              {stepIndex === TOUR_STEPS.length - 1 ? "Finish" : "Next"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
