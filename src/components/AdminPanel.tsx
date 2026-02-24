"use client";

import { useState } from "react";
import { SavingsGroup, GroupStatus } from "@/lib/sdk";

interface AdminPanelProps {
  group: SavingsGroup;
  connectedAddress: string;
}

type ActionState = "idle" | "loading" | "success" | "error";

function AdminAction({
  label, description, buttonText, buttonStyle, onAction, disabled,
}: {
  label: string;
  description: string;
  buttonText: string;
  buttonStyle: string;
  onAction: () => Promise<void>;
  disabled?: boolean;
}) {
  const [state, setState] = useState<ActionState>("idle");
  const [error, setError] = useState("");

  const handle = async () => {
    setState("loading");
    setError("");
    try {
      await onAction();
      setState("success");
      setTimeout(() => setState("idle"), 2500);
    } catch (e) {
      setState("error");
      setError(e instanceof Error ? e.message : "Transaction failed");
    }
  };

  return (
    <div className="flex items-center justify-between py-3 border-b dark:border-gray-700 last:border-0">
      <div>
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{label}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
        {state === "error" && <p className="text-xs text-red-500 mt-1">{error}</p>}
      </div>
      <button
        onClick={handle}
        disabled={state === "loading" || disabled}
        className={`ml-4 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 ${
          state === "success" ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" : buttonStyle
        }`}
      >
        {state === "loading" ? "…" : state === "success" ? "✓ Done" : buttonText}
      </button>
    </div>
  );
}

export function AdminPanel({ group, connectedAddress }: AdminPanelProps) {
  const [transferAddr, setTransferAddr] = useState("");
  const [showConfirmWithdraw, setShowConfirmWithdraw] = useState(false);

  const isAdmin = connectedAddress === group.admin;
  if (!isAdmin) return null;

  const canStart = group.status === GroupStatus.Forming && group.members.length >= 2;
  const canPause = group.status === GroupStatus.Active;
  const canResume = group.status === GroupStatus.Paused;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border-2 border-primary-200 dark:border-primary-800 shadow-sm p-5">
      <div className="flex items-center space-x-2 mb-4">
        <span className="text-lg">🛡️</span>
        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">Admin Controls</h3>
        <span className="text-xs bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 px-2 py-0.5 rounded-full">You are admin</span>
      </div>

      <div>
        {/* Start Group */}
        {group.status === GroupStatus.Forming && (
          <AdminAction
            label="Start Group"
            description={canStart ? "Begin the first contribution round." : `Need at least 2 members (${group.members.length} joined).`}
            buttonText="Start"
            buttonStyle="bg-green-600 text-white hover:bg-green-700"
            disabled={!canStart}
            onAction={async () => {
              // TODO: sorosaveClient.startGroup(group.id, connectedAddress)
              await new Promise(r => setTimeout(r, 1000));
            }}
          />
        )}

        {/* Pause */}
        {canPause && (
          <AdminAction
            label="Pause Group"
            description="Temporarily halts contributions and payouts."
            buttonText="Pause"
            buttonStyle="bg-yellow-500 text-white hover:bg-yellow-600"
            onAction={async () => {
              await new Promise(r => setTimeout(r, 1000));
            }}
          />
        )}

        {/* Resume */}
        {canResume && (
          <AdminAction
            label="Resume Group"
            description="Resumes contributions and payouts."
            buttonText="Resume"
            buttonStyle="bg-blue-600 text-white hover:bg-blue-700"
            onAction={async () => {
              await new Promise(r => setTimeout(r, 1000));
            }}
          />
        )}

        {/* Transfer Admin */}
        <div className="py-3 border-b dark:border-gray-700">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">Transfer Admin</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Hand over admin rights to another member.</p>
          <div className="flex space-x-2">
            <input
              type="text"
              value={transferAddr}
              onChange={e => setTransferAddr(e.target.value)}
              placeholder="G... Stellar address"
              className="flex-1 text-xs px-3 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <button
              onClick={async () => {
                if (!transferAddr.startsWith("G") || transferAddr.length < 56) return;
                // TODO: sorosaveClient.transferAdmin(group.id, transferAddr, connectedAddress)
                await new Promise(r => setTimeout(r, 1000));
                setTransferAddr("");
              }}
              disabled={!transferAddr.startsWith("G") || transferAddr.length < 56}
              className="px-3 py-2 bg-gray-700 text-white rounded-lg text-xs hover:bg-gray-800 disabled:opacity-40"
            >
              Transfer
            </button>
          </div>
        </div>

        {/* Emergency Withdraw */}
        <div className="pt-3">
          <p className="text-sm font-medium text-red-600 dark:text-red-400 mb-1">Emergency Withdraw</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Dissolves the group and returns funds. Irreversible.</p>
          {!showConfirmWithdraw ? (
            <button
              onClick={() => setShowConfirmWithdraw(true)}
              className="px-3 py-1.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-lg text-sm hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
            >
              Emergency Withdraw
            </button>
          ) : (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
              <p className="text-xs font-semibold text-red-700 dark:text-red-300 mb-2">⚠️ This will dissolve the group. Are you sure?</p>
              <div className="flex space-x-2">
                <button
                  onClick={async () => {
                    // TODO: sorosaveClient.emergencyWithdraw(group.id, connectedAddress)
                    await new Promise(r => setTimeout(r, 1000));
                    setShowConfirmWithdraw(false);
                  }}
                  className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs hover:bg-red-700"
                >
                  Confirm Withdraw
                </button>
                <button
                  onClick={() => setShowConfirmWithdraw(false)}
                  className="px-3 py-1.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-xs hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
