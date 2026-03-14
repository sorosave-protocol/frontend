"use client";

import { useState } from "react";
import { useWallet } from "@/app/providers";
import { sorosaveClient, NETWORK_PASSPHRASE } from "@/lib/sorosave";
import { signTransaction } from "@/lib/wallet";
import { shortenAddress, GroupStatus } from "@sorosave/sdk";

interface AdminPanelProps {
  groupId: number;
  admin: string;
  members: string[];
  status: string;
  onAction: () => void;
}

type ModalType = "remove" | "transfer" | "withdraw" | null;

export function AdminPanel({ groupId, admin, members, status, onAction }: AdminPanelProps) {
  const { address } = useWallet();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [modal, setModal] = useState<ModalType>(null);
  const [selectedMember, setSelectedMember] = useState<string>("");
  const [confirmText, setConfirmText] = useState("");

  const isAdmin = address === admin;
  if (!isAdmin) return null;

  const clearMessages = () => { setError(null); setSuccess(null); };

  const execAction = async (actionName: string, fn: () => Promise<string>) => {
    clearMessages();
    setLoading(actionName);
    try {
      const xdr = await fn();
      await signTransaction(xdr, NETWORK_PASSPHRASE);
      setSuccess(`${actionName} successful!`);
      setModal(null);
      setConfirmText("");
      setSelectedMember("");
      onAction();
    } catch (err) {
      setError(err instanceof Error ? err.message : `${actionName} failed`);
    } finally {
      setLoading(null);
    }
  };

  const handleStartGroup = () => execAction("Start Group", async () => {
    const tx = await sorosaveClient.startGroup(address!, groupId);
    return tx.toXDR();
  });

  const handleTogglePause = () => execAction(
    status === GroupStatus.Paused ? "Resume" : "Pause",
    async () => {
      const tx = status === GroupStatus.Paused
        ? await sorosaveClient.resumeGroup(address!, groupId)
        : await sorosaveClient.pauseGroup(address!, groupId);
      return tx.toXDR();
    }
  );

  const handleRemoveMember = () => execAction("Remove Member", async () => {
    const tx = await sorosaveClient.removeMember(address!, groupId, selectedMember);
    return tx.toXDR();
  });

  const handleTransferAdmin = () => execAction("Transfer Admin", async () => {
    const tx = await sorosaveClient.transferAdmin(address!, groupId, selectedMember);
    return tx.toXDR();
  });

  const handleEmergencyWithdraw = () => execAction("Emergency Withdraw", async () => {
    const tx = await sorosaveClient.emergencyWithdraw(address!, groupId);
    return tx.toXDR();
  });

  const otherMembers = members.filter(m => m !== admin);

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <div className="flex items-center space-x-2 mb-4">
        <svg className="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <h3 className="text-lg font-semibold text-gray-900">Admin Panel</h3>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm mb-4 flex justify-between items-center">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700 ml-2">&times;</button>
        </div>
      )}
      {success && (
        <div className="bg-green-50 text-green-700 p-3 rounded-lg text-sm mb-4 flex justify-between items-center">
          <span>{success}</span>
          <button onClick={() => setSuccess(null)} className="text-green-500 hover:text-green-700 ml-2">&times;</button>
        </div>
      )}

      <div className="space-y-3">
        {status === GroupStatus.Forming && (
          <button
            onClick={handleStartGroup}
            disabled={!!loading}
            className="w-full bg-green-600 text-white py-2.5 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 text-sm"
          >
            {loading === "Start Group" ? "Starting..." : "Start Group"}
          </button>
        )}

        {(status === GroupStatus.Active || status === GroupStatus.Paused) && (
          <button
            onClick={handleTogglePause}
            disabled={!!loading}
            className={`w-full py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50 text-sm ${
              status === GroupStatus.Paused
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-yellow-500 text-white hover:bg-yellow-600"
            }`}
          >
            {loading === "Pause" || loading === "Resume"
              ? "Processing..."
              : status === GroupStatus.Paused ? "Resume Group" : "Pause Group"}
          </button>
        )}

        {otherMembers.length > 0 && (
          <>
            <button
              onClick={() => { clearMessages(); setModal("remove"); }}
              disabled={!!loading}
              className="w-full border border-red-300 text-red-700 py-2.5 rounded-lg font-medium hover:bg-red-50 transition-colors disabled:opacity-50 text-sm"
            >
              Remove Member
            </button>
            <button
              onClick={() => { clearMessages(); setModal("transfer"); }}
              disabled={!!loading}
              className="w-full border border-blue-300 text-blue-700 py-2.5 rounded-lg font-medium hover:bg-blue-50 transition-colors disabled:opacity-50 text-sm"
            >
              Transfer Admin Role
            </button>
          </>
        )}

        <button
          onClick={() => { clearMessages(); setModal("withdraw"); }}
          disabled={!!loading}
          className="w-full bg-red-600 text-white py-2.5 rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 text-sm"
        >
          Emergency Withdraw
        </button>
      </div>

      {/* Member Selection Modal (Remove / Transfer) */}
      {(modal === "remove" || modal === "transfer") && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {modal === "remove" ? "Remove Member" : "Transfer Admin Role"}
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              {modal === "remove"
                ? "Select a member to remove from the group."
                : "Select a member to transfer admin privileges to."}
            </p>

            <div className="space-y-2 max-h-60 overflow-y-auto mb-4">
              {otherMembers.map(member => (
                <label
                  key={member}
                  className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedMember === member
                      ? "border-primary-500 bg-primary-50"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="member"
                    value={member}
                    checked={selectedMember === member}
                    onChange={() => setSelectedMember(member)}
                    className="mr-3 text-primary-600"
                  />
                  <span className="text-sm font-medium text-gray-900">
                    {shortenAddress(member, 6)}
                  </span>
                </label>
              ))}
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => { setModal(null); setSelectedMember(""); }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={modal === "remove" ? handleRemoveMember : handleTransferAdmin}
                disabled={!selectedMember || !!loading}
                className={`flex-1 px-4 py-2 rounded-lg font-medium text-sm disabled:opacity-50 ${
                  modal === "remove"
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {loading ? "Processing..." : modal === "remove" ? "Remove" : "Transfer"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Emergency Withdraw Confirmation Modal */}
      {modal === "withdraw" && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center space-x-2 mb-4">
              <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-lg font-semibold text-red-900">Emergency Withdraw</h3>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-red-800 font-medium mb-2">Warning: This action is irreversible!</p>
              <p className="text-sm text-red-700">
                Emergency withdrawal will return all remaining funds to members and terminate the group permanently.
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type <span className="font-mono font-bold">WITHDRAW</span> to confirm
              </label>
              <input
                type="text"
                value={confirmText}
                onChange={e => setConfirmText(e.target.value)}
                placeholder="WITHDRAW"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => { setModal(null); setConfirmText(""); }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleEmergencyWithdraw}
                disabled={confirmText !== "WITHDRAW" || !!loading}
                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-red-700 disabled:opacity-50"
              >
                {loading === "Emergency Withdraw" ? "Withdrawing..." : "Confirm Withdraw"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
