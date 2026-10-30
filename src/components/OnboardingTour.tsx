"use client";
import { useState, useEffect } from 'react';
import Joyride, { Step, CallBackProps, STATUS } from 'react-joyride';

export function OnboardingTour() {
  const [run, setRun] = useState(false);

  useEffect(() => {
    const hasSeenTour = localStorage.getItem('sorosave_tour_completed');
    if (!hasSeenTour) {
      setRun(true);
    }
  }, []);

  const steps: Step[] = [
    {
      target: '.tour-welcome',
      content: 'Welcome to SoroSave! Let us give you a quick tour of how decentralized group savings work.',
      disableBeacon: true,
      placement: 'bottom',
    },
    {
      target: '.tour-browse',
      content: 'Looking to join an existing cycle? Browse active groups waiting for members here.',
      placement: 'bottom',
    },
    {
      target: '.tour-create',
      content: 'Or take charge and create your own savings group. You set the rules and become the admin.',
      placement: 'bottom',
    },
    {
      target: '.tour-how-it-works',
      content: 'Not sure how trustless savings cycles operate? Read our quick 4-step breakdown here!',
      placement: 'top',
    }
  ];

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status as any)) {
      localStorage.setItem('sorosave_tour_completed', 'true');
      setRun(false);
    }
  };

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous={true}
      showSkipButton={true}
      showProgress={true}
      styles={{ options: { primaryColor: '#0f766e', zIndex: 1000 } }}
      callback={handleJoyrideCallback}
    />
  );
}