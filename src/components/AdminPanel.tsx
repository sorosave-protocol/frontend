"use client";

import { useState } from "react";
import { GroupStatus } from "@sorosave/sdk";

interface AdminPanelProps {
  groupId: number;
  status: GroupStatus;
  admin: string;
  currentAccount: string;
  members: string[];
  onStartGroup: () => Promise<void>;
  onPauseGroup: () => Promise<void>;
  onResumeGroup: () => Promise<void>;
  onRemoveMember: (member: string) => Promise<void>;
  onTransferAdmin: (newAdmin: string) => Promise<void>;
  onEmergencyWithdraw: () => Promise<void>;
}

export function AdminPanel({
  groupId,
  status,
  admin,
  currentAccount,
  members,
  onStartGroup,
  onPauseGroup,
  onResumeGroup,
  onRemoveMember,
  onTransferAdmin,
  onEmergencyWithdraw,
}: AdminPanelProps) {
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState("");
  const [loading, setLoading] = useState<string | null>(null);

  // Only show admin panel if current user is the admin
  if (currentAccount.toLowerCase() !== admin.toLowerCase()) {
    return null;
  }

  const handleAction = async (action: string, fn: () => Promise<void>) => {
    setLoading(action);
    try {
      await fn();
    } catch (error) {
      console.error(`${action} failed:`, error);
    } finally {
      setLoading(null);
    }
  };

  const otherMembers = members.filter(
    (m) => m.toLowerCase() !== admin.toLowerCase()
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Admin Controls
      </h3>

      <div className="space-y-3">
        {/* Start Group */}
        {status === GroupStatus.Forming && (
          <button
            onClick={() => handleAction("start", onStartGroup)}
            disabled={loading === "start"}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            {loading === "start" ? "Starting..." : "Start Group"}
          </button>
        )}

        {/* Pause / Resume */}
        {status === GroupStatus.Active && (
          <button
            onClick={() => handleAction("pause", onPauseGroup)}
            disabled={loading === "pause"}
            className="w-full bg-yellow-600 text-white py-3 rounded-lg font-medium hover:bg-yellow-700 transition-colors disabled:opacity-50"
          >
            {loading === "pause" ? "Pausing..." : "Pause Group"}
          </button>
        )}

        {status === GroupStatus.Paused && (
          <button
            onClick={() => handleAction("resume", onResumeGroup)}
            disabled={loading === "resume"}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading === "resume" ? "Resuming..." : "Resume Group"}
          </button>
        )}

        {/* Remove Member */}
        {otherMembers.length > 0 && (
          <button
            onClick={() => setShowRemoveModal(true)}
            className="w-full bg-red-100 text-red-700 py-3 rounded-lg font-medium hover:bg-red-200 transition-colors"
          >
            Remove Member
          </button>
        )}

        {/* Transfer Admin */}
        {otherMembers.length > 0 && (
          <button
            onClick={() => setShowTransferModal(true)}
            className="w-full bg-purple-100 text-purple-700 py-3 rounded-lg font-medium hover:bg-purple-200 transition-colors"
          >
            Transfer Admin Role
          </button>
        )}

        {/* Emergency Withdraw */}
        <button
          onClick={() => setShowEmergencyModal(true)}
          className="w-full bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
        >
          Emergency Withdraw
        </button>
      </div>

      {/* Remove Member Modal */}
      {showRemoveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h4 className="text-lg font-semibold mb-4">Remove Member</h4>
            <select
              value={selectedMember}
              onChange={(e) => setSelectedMember(e.target.value)}
              className="w-full border rounded-lg p-2 mb-4"
            >
              <option value="">Select a member</option>
              {otherMembers.map((m) => (
                <option key={m} value={m}>
                  {m.slice(0, 8)}...{m.slice(-4)}
                </option>
              ))}
            </select>
            <div className="flex gap-3">
              <button
                onClick={() => setShowRemoveModal(false)}
                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (selectedMember) {
                    handleAction("remove", () => onRemoveMember(selectedMember));
                    setShowRemoveModal(false);
                  }
                }}
                disabled={!selectedMember}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg disabled:opacity-50"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Transfer Admin Modal */}
      {showTransferModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h4 className="text-lg font-semibold mb-4">Transfer Admin Role</h4>
            <select
              value={selectedMember}
              onChange={(e) => setSelectedMember(e.target.value)}
              className="w-full border rounded-lg p-2 mb-4"
            >
              <option value="">Select new admin</option>
              {otherMembers.map((m) => (
                <option key={m} value={m}>
                  {m.slice(0, 8)}...{m.slice(-4)}
                </option>
              ))}
            </select>
            <div className="flex gap-3">
              <button
                onClick={() => setShowTransferModal(false)}
                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (selectedMember) {
                    handleAction("transfer", () => onTransferAdmin(selectedMember));
                    setShowTransferModal(false);
                  }
                }}
                disabled={!selectedMember}
                className="flex-1 bg-purple-600 text-white py-2 rounded-lg disabled:opacity-50"
              >
                Transfer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Emergency Withdraw Confirmation Modal */}
      {showEmergencyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h4 className="text-lg font-semibold mb-2 text-red-600">
              Emergency Withdraw
            </h4>
            <p className="text-gray-600 mb-4">
              This will withdraw all funds from the group contract. This action
              cannot be undone. All members will receive their contributed
              amounts.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowEmergencyModal(false)}
                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleAction("withdraw", onEmergencyWithdraw);
                  setShowEmergencyModal(false);
                }}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg"
              >
                Confirm Withdraw
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
