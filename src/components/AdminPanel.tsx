"use client";

import { useState } from "react";
import { useWallet } from "@/app/providers";
import { sorosaveClient, NETWORK_PASSPHRASE } from "@/lib/sorosave";
import { GroupStatus, shortenAddress } from "@sorosave/sdk";
import { signTransaction } from "@/lib/wallet";

interface AdminPanelProps {
  groupId: number;
  admin: string;
  status: GroupStatus;
  members: string[];
}

type ActionKey =
  | "start"
  | "pause"
  | "resume"
  | "remove"
  | "transfer"
  | "emergency";

export function AdminPanel({
  groupId,
  admin,
  status,
  members,
}: AdminPanelProps) {
  const { address, isConnected } = useWallet();
  const [pending, setPending] = useState<ActionKey | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [memberToRemove, setMemberToRemove] = useState("");
  const [newAdmin, setNewAdmin] = useState("");
  const [confirmEmergency, setConfirmEmergency] = useState(false);

  const isAdmin = isConnected && address === admin;
  if (!isAdmin) return null;

  const submit = async (
    key: ActionKey,
    build: () => Promise<{ toXDR: () => string }>
  ) => {
    setPending(key);
    setError(null);
    try {
      const tx = await build();
      const signedXdr = await signTransaction(tx.toXDR(), NETWORK_PASSPHRASE);
      // TODO: Submit signed transaction to network
      console.log(`Signed ${key}:`, signedXdr);
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to ${key}`);
    } finally {
      setPending(null);
    }
  };

  const handleStart = () =>
    submit("start", () => sorosaveClient.startGroup(address!, groupId));

  const handlePause = () =>
    submit("pause", () => sorosaveClient.pauseGroup(address!, groupId));

  const handleResume = () =>
    submit("resume", () => sorosaveClient.resumeGroup(address!, groupId));

  const handleRemoveMember = () => {
    if (!memberToRemove) {
      setError("Select a member to remove");
      return;
    }
    submit("remove", () =>
      sorosaveClient.removeMember(address!, groupId, memberToRemove)
    ).then(() => setMemberToRemove(""));
  };

  const handleTransferAdmin = () => {
    if (!newAdmin) {
      setError("Enter the new admin address");
      return;
    }
    submit("transfer", () =>
      sorosaveClient.transferAdmin(address!, groupId, newAdmin)
    ).then(() => setNewAdmin(""));
  };

  const handleEmergencyWithdraw = () => {
    submit("emergency", () =>
      sorosaveClient.emergencyWithdraw(address!, groupId)
    ).then(() => setConfirmEmergency(false));
  };

  const isBusy = pending !== null;
  const removableMembers = members.filter((m) => m !== admin);

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Admin Panel</h3>
        <span className="text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full">
          Admin only
        </span>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {status === GroupStatus.Forming && (
        <button
          onClick={handleStart}
          disabled={isBusy}
          className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {pending === "start" ? "Starting..." : "Start Group"}
        </button>
      )}

      {status === GroupStatus.Active && (
        <button
          onClick={handlePause}
          disabled={isBusy}
          className="w-full bg-amber-600 text-white py-2.5 rounded-lg font-medium hover:bg-amber-700 disabled:opacity-50 transition-colors"
        >
          {pending === "pause" ? "Pausing..." : "Pause Group"}
        </button>
      )}

      {status === GroupStatus.Paused && (
        <button
          onClick={handleResume}
          disabled={isBusy}
          className="w-full bg-green-600 text-white py-2.5 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 transition-colors"
        >
          {pending === "resume" ? "Resuming..." : "Resume Group"}
        </button>
      )}

      <div className="border-t pt-5">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Remove member
        </label>
        <div className="flex gap-2">
          <select
            value={memberToRemove}
            onChange={(e) => setMemberToRemove(e.target.value)}
            disabled={isBusy || removableMembers.length === 0}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-50"
          >
            <option value="">
              {removableMembers.length === 0
                ? "No removable members"
                : "Select member..."}
            </option>
            {removableMembers.map((m) => (
              <option key={m} value={m}>
                {shortenAddress(m, 6)}
              </option>
            ))}
          </select>
          <button
            onClick={handleRemoveMember}
            disabled={isBusy || !memberToRemove}
            className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50 transition-colors"
          >
            {pending === "remove" ? "Removing..." : "Remove"}
          </button>
        </div>
      </div>

      <div className="border-t pt-5">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Transfer admin role
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={newAdmin}
            onChange={(e) => setNewAdmin(e.target.value)}
            disabled={isBusy}
            placeholder="G... new admin address"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-50"
          />
          <button
            onClick={handleTransferAdmin}
            disabled={isBusy || !newAdmin}
            className="px-4 py-2 bg-gray-800 text-white rounded-lg text-sm font-medium hover:bg-gray-900 disabled:opacity-50 transition-colors"
          >
            {pending === "transfer" ? "Transferring..." : "Transfer"}
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          The new admin will gain full control of this group.
        </p>
      </div>

      <div className="border-t pt-5">
        {!confirmEmergency ? (
          <button
            onClick={() => {
              setError(null);
              setConfirmEmergency(true);
            }}
            disabled={isBusy}
            className="w-full bg-red-50 text-red-700 border border-red-200 py-2.5 rounded-lg font-medium hover:bg-red-100 disabled:opacity-50 transition-colors"
          >
            Emergency Withdraw
          </button>
        ) : (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-3">
            <div>
              <p className="text-sm font-semibold text-red-800">
                Confirm emergency withdraw
              </p>
              <p className="text-xs text-red-700 mt-1">
                This dissolves the group and returns remaining funds to
                members. This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setConfirmEmergency(false)}
                disabled={isBusy}
                className="flex-1 px-4 py-2 border border-gray-300 bg-white rounded-lg text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleEmergencyWithdraw}
                disabled={isBusy}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50"
              >
                {pending === "emergency" ? "Withdrawing..." : "Confirm"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
