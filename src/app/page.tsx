"use client";
import { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { OnboardingTour } from "@/components/OnboardingTour";

export default function Home() {
  const [showTour, setShowTour] = useState(false);
  return (
    <>
      <Navbar />
      <OnboardingTour forceShow={showTour} onComplete={() => setShowTour(false)} />
      <main>
        {/* Hero */}
        <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="max-w-3xl">
              <h1 className="text-4xl sm:text-5xl font-bold mb-6">
                Decentralized Group Savings for Everyone
              </h1>
              <p className="text-xl text-primary-100 mb-8">
                SoroSave brings the traditional rotating savings model (ajo,
                susu, chit fund) to the Stellar blockchain. Trustless,
                transparent, and accessible.
              </p>
              <div className="flex space-x-4">
                <Link
                  href="/groups"
                  className="bg-white text-primary-700 px-6 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
                >
                  Browse Groups
                </Link>
                <Link
                  href="/groups/new"
                  className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors"
                >
                  Create a Group
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              How It Works
            </h2>
            <div className="grid md:grid-cols-4 gap-8">
              {[
                {
                  step: "1",
                  title: "Create a Group",
                  description:
                    "Set contribution amount, cycle length, and max members. You become the admin.",
                },
                {
                  step: "2",
                  title: "Members Join",
                  description:
                    "Share the group link. Members join until the group is full or the admin starts it.",
                },
                {
                  step: "3",
                  title: "Contribute Each Cycle",
                  description:
                    "Every member contributes the fixed amount each round. Smart contract enforces rules.",
                },
                {
                  step: "4",
                  title: "Receive the Pot",
                  description:
                    "Each round, one member receives the full pot. Continues until everyone has received.",
                },
              ].map((item) => (
                <div key={item.step} className="text-center">
                  <div className="w-12 h-12 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="bg-gray-100 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Why SoroSave?
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "Trustless",
                  description:
                    "Smart contracts enforce contributions and payouts. No middleman needed.",
                },
                {
                  title: "Transparent",
                  description:
                    "All transactions are on-chain. Every member can verify the group state.",
                },
                {
                  title: "Low Cost",
                  description:
                    "Built on Soroban (Stellar). Transaction fees are a fraction of a cent.",
                },
              ].map((feature) => (
                <div
                  key={feature.title}
                  className="bg-white p-6 rounded-xl shadow-sm"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-gray-400 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-lg font-semibold text-white mb-2">SoroSave</p>
            <p className="text-sm">
              Open-source decentralized group savings protocol on Soroban.
            </p>
            <div className="mt-4 space-x-4 text-sm">
              <a href="https://github.com/big14way/sorosave" className="hover:text-white">GitHub</a>
              <a href="#" className="hover:text-white">Docs</a>
              <a href="#" className="hover:text-white">Discord</a>
              <button onClick={() => setShowTour(true)} className="hover:text-white underline">Take the tour</button>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
