"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface TourStep {
  target: string;
  title: string;
  content: string;
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'center';
}

const ONBOARDING_KEY = 'sorosave_onboarding_complete';

const TOUR_STEPS: TourStep[] = [
  {
    target: '[data-tour="connect-wallet"]',
    title: 'Connect Your Wallet',
    content: 'First, connect your wallet to interact with the Stellar network. We support Freighter, xBull, and Albedo.',
  },
  {
    target: '[data-tour="groups-list"]',
    title: 'Browse Groups',
    content: 'Explore existing savings groups or create your own. Join a group to start saving together!',
  },
  {
    target: '[data-tour="create-group"]',
    title: 'Create a Group',
    content: 'Start your own savings circle. Set the contribution amount, cycle length, and maximum members.',
  },
  {
    target: '[data-tour="contribute"]',
    title: 'Make Contributions',
    content: 'Contribute to your group each cycle. Track your progress and see when it\'s your turn to receive the pot!',
  },
];

export function useOnboarding() {
  const [isComplete, setIsComplete] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    const completed = localStorage.getItem(ONBOARDING_KEY);
    setIsComplete(completed === 'true');
    setIsRunning(completed !== 'true');
  }, []);

  const startTour = useCallback(() => {
    setCurrentStep(0);
    setIsRunning(true);
    setIsComplete(false);
  }, []);

  const nextStep = useCallback(() => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeTour();
    }
  }, [currentStep]);

  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  const completeTour = useCallback(() => {
    localStorage.setItem(ONBOARDING_KEY, 'true');
    setIsComplete(true);
    setIsRunning(false);
    setCurrentStep(0);
  }, []);

  const skipTour = useCallback(() => {
    completeTour();
  }, [completeTour]);

  return {
    isComplete,
    isRunning,
    currentStep,
    steps: TOUR_STEPS,
    startTour,
    nextStep,
    prevStep,
    completeTour,
    skipTour,
  };
}

export function OnboardingTour() {
  const {
    isRunning,
    currentStep,
    steps,
    nextStep,
    prevStep,
    completeTour,
    skipTour,
  } = useOnboarding();

  if (!isRunning) return null;

  const step = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={skipTour} />
      
      {/* Tour Card */}
      <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 p-6">
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200 rounded-t-xl">
          <div 
            className="h-full bg-primary-600 rounded-t-xl transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Step Counter */}
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-gray-500">
            Step {currentStep + 1} of {steps.length}
          </span>
          <button 
            onClick={skipTour}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <h3 className="text-lg font-bold text-gray-900 mb-2">
          {step.title}
        </h3>
        <p className="text-gray-600 mb-6">
          {step.content}
        </p>

        {/* Actions */}
        <div className="flex justify-between">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Back
          </button>
          <div className="flex gap-2">
            <button
              onClick={skipTour}
              className="px-4 py-2 text-gray-500 hover:text-gray-700"
            >
              Skip
            </button>
            <button
              onClick={completeTour}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium"
            >
              {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Hook to replay tour from settings
export function useTourReplay() {
  const { startTour } = useOnboarding();
  
  const replayTour = useCallback(() => {
    localStorage.removeItem(ONBOARDING_KEY);
    startTour();
  }, [startTour]);

  return { replayTour };
}
