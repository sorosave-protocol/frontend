"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const STEPS = [
  {
    title: "Welcome to SoroSave 👋",
    description: "SoroSave brings the traditional rotating savings model (ajo, susu, chit fund) to the Stellar blockchain — trustless, transparent, and accessible to everyone.",
    image: "🌍",
    cta: null,
  },
  {
    title: "Create or Join a Savings Group",
    description: "Browse existing groups and join one that matches your savings goals, or start your own group and invite friends. Each group has a fixed contribution amount and cycle length.",
    image: "👥",
    cta: { label: "Browse Groups", href: "/groups" },
  },
  {
    title: "Contribute Each Cycle",
    description: "Every member contributes the same fixed amount each round. The smart contract on Soroban automatically enforces the rules — no middleman, no trust required.",
    image: "💸",
    cta: null,
  },
  {
    title: "Receive the Pot",
    description: "Each round, one member receives the full accumulated pot. The rotation continues until every member has received their payout.",
    image: "🏆",
    cta: null,
  },
  {
    title: "Connect Your Wallet",
    description: "SoroSave supports Freighter, xBull, and Albedo wallets. Connect your Stellar wallet to join groups, contribute, and receive payouts — all on-chain.",
    image: "🔐",
    cta: null,
  },
];

interface OnboardingTourProps {
  forceShow?: boolean;
  onComplete?: () => void;
}

export function OnboardingTour({ forceShow = false, onComplete }: OnboardingTourProps) {
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (forceShow) { setVisible(true); return; }
    const seen = localStorage.getItem("sorosave_onboarding_done");
    if (!seen) setVisible(true);
  }, [forceShow]);

  const close = (permanently = true) => {
    if (permanently) localStorage.setItem("sorosave_onboarding_done", "1");
    setVisible(false);
    onComplete?.();
  };

  if (!visible) return null;

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;
  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Progress bar */}
        <div className="h-1 bg-gray-200 dark:bg-gray-700">
          <div
            className="h-1 bg-primary-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Content */}
        <div className="p-8 text-center">
          <div className="text-6xl mb-5">{current.image}</div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">{current.title}</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{current.description}</p>

          {current.cta && (
            <Link
              href={current.cta.href}
              onClick={() => close(true)}
              className="inline-block mt-4 text-sm text-primary-600 dark:text-primary-400 font-medium hover:underline"
            >
              {current.cta.label} →
            </Link>
          )}
        </div>

        {/* Step dots */}
        <div className="flex justify-center space-x-1.5 pb-4">
          {STEPS.map((_, i) => (
            <button
              key={i}
              onClick={() => setStep(i)}
              className={`w-2 h-2 rounded-full transition-all ${i === step ? "bg-primary-500 w-4" : "bg-gray-300 dark:bg-gray-600"}`}
            />
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 pb-6">
          <button
            onClick={() => close(true)}
            className="text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            Skip tour
          </button>
          <div className="flex space-x-2">
            {step > 0 && (
              <button
                onClick={() => setStep(s => s - 1)}
                className="px-4 py-2 text-sm border dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                ← Back
              </button>
            )}
            <button
              onClick={() => isLast ? close(true) : setStep(s => s + 1)}
              className="px-5 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium"
            >
              {isLast ? "Get Started 🚀" : "Next →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
