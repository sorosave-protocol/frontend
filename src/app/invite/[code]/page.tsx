"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { ConnectWallet } from "@/components/ConnectWallet";
import { useWallet } from "@/app/providers";
import { sorosaveClient } from "@/lib/sorosave";

export default function InvitePage() {
  const params = useParams();
  const code = params.code as string;
  const { isConnected, address } = useWallet();

  const [isJoining, setIsJoining] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleJoin = async () => {
    if (!isConnected || !address) return;

    setIsJoining(true);
    setStatus("idle");
    try {
      // If SoroSaveClient has joinGroup implemented, we call it
      if (typeof sorosaveClient.joinGroup === "function") {
        await sorosaveClient.joinGroup(code);
      } else {
        // Fallback mock delay for UI demonstration
        await new Promise((resolve) => setTimeout(resolve, 1500));
      }
      setStatus("success");
    } catch (error: any) {
      console.error(error);
      setStatus("error");
      setErrorMessage(error.message || "Failed to join group");
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full rounded-2xl shadow-xl p-8 space-y-6 text-center">
        <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-8 h-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
            />
          </svg>
        </div>

        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            You&apos;ve been invited!
          </h1>
          <p className="text-gray-500">
            Join the saving group <span className="font-semibold text-indigo-600">#{code}</span> to start contributing and earning yields together.
          </p>
        </div>

        {status === "success" && (
          <div className="bg-green-50 text-green-700 p-4 rounded-lg font-medium">
            🎉 Successfully joined the group!
          </div>
        )}

        {status === "error" && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg font-medium">
            ❌ {errorMessage}
          </div>
        )}

        <div className="pt-4 flex flex-col space-y-4 items-center">
          {!isConnected ? (
            <div className="flex flex-col items-center space-y-3 w-full">
              <p className="text-sm text-gray-500">Please connect your wallet to join</p>
              <ConnectWallet />
            </div>
          ) : (
            <button
              onClick={handleJoin}
              disabled={isJoining || status === "success"}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isJoining ? "Joining Group..." : status === "success" ? "Joined" : "Join Group Now"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
