"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { useWallet } from "@/app/providers";
import { SavingsGroup, GroupStatus, formatAmount } from "@/lib/sdk";
import Link from "next/link";

// Decode invite code → groupId
function decodeInviteCode(code: string): { groupId: number; groupName: string } | null {
  try {
    const padded = code + "==".slice((code.length % 4) || 4);
    const decoded = atob(padded);
    const [id, ...nameParts] = decoded.split(":");
    return { groupId: parseInt(id), groupName: nameParts.join(":") };
  } catch {
    return null;
  }
}

// Mock fetch — replace with real contract query
async function fetchGroup(groupId: number): Promise<SavingsGroup | null> {
  const MOCK_GROUPS: Record<number, SavingsGroup> = {
    1: {
      id: 1,
      name: "Lagos Savings Circle",
      admin: "GABCDEFGHIJKLMNOPQRSTUVWXYZ234567ABCDEFG",
      token: "CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC",
      contributionAmount: 1000000000n,
      cycleLength: 604800,
      maxMembers: 5,
      members: ["GABCDEFGHIJKLMNOPQRSTUVWXYZ234567ABCDEFG", "GEFGHIJKLMNOPQRSTUVWXYZ234567ABCDEFGHIJ"],
      payoutOrder: [],
      currentRound: 0,
      totalRounds: 0,
      status: GroupStatus.Forming,
      createdAt: 1700000000,
    },
  };
  return MOCK_GROUPS[groupId] ?? null;
}

type JoinState = "idle" | "loading" | "success" | "error";

export default function InvitePage() {
  const params = useParams();
  const router = useRouter();
  const { address, isConnected } = useWallet();
  const [group, setGroup] = useState<SavingsGroup | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [joinState, setJoinState] = useState<JoinState>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const code = params?.code as string;

  useEffect(() => {
    const decoded = decodeInviteCode(code);
    if (!decoded) { setNotFound(true); return; }
    fetchGroup(decoded.groupId).then((g) => {
      if (!g) setNotFound(true);
      else setGroup(g);
    });
  }, [code]);

  const handleJoin = async () => {
    if (!address || !group) return;
    setJoinState("loading");
    setErrorMsg("");
    try {
      // TODO: call sorosaveClient.joinGroup(group.id, address)
      await new Promise((r) => setTimeout(r, 1200)); // simulate tx
      setJoinState("success");
      setTimeout(() => router.push(`/groups/${group.id}`), 2000);
    } catch (e) {
      setJoinState("error");
      setErrorMsg(e instanceof Error ? e.message : "Failed to join group. Please try again.");
    }
  };

  if (notFound) {
    return (
      <>
        <Navbar />
        <main className="max-w-lg mx-auto px-4 py-24 text-center">
          <div className="text-6xl mb-4">🔗</div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Invalid invite link</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-6">This invite link is invalid or has expired.</p>
          <Link href="/groups" className="bg-primary-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-primary-700">
            Browse Groups
          </Link>
        </main>
      </>
    );
  }

  if (!group) {
    return (
      <>
        <Navbar />
        <main className="max-w-lg mx-auto px-4 py-24 text-center">
          <div className="animate-pulse text-4xl">⏳</div>
          <p className="text-gray-500 dark:text-gray-400 mt-4">Loading group details...</p>
        </main>
      </>
    );
  }

  const spotsLeft = group.maxMembers - group.members.length;
  const isFull = spotsLeft <= 0;
  const alreadyMember = address ? group.members.includes(address) : false;
  const canJoin = isConnected && !isFull && !alreadyMember && group.status === GroupStatus.Forming;

  return (
    <>
      <Navbar />
      <main className="max-w-lg mx-auto px-4 sm:px-6 py-16">
        {/* Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border dark:border-gray-700 shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-br from-primary-600 to-primary-800 p-8 text-white text-center">
            <div className="text-4xl mb-3">🤝</div>
            <h1 className="text-2xl font-bold mb-1">You&apos;re Invited!</h1>
            <p className="text-primary-100 text-sm">Join a savings group on SoroSave</p>
          </div>

          {/* Group details */}
          <div className="p-6 space-y-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{group.name}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {group.status === GroupStatus.Forming ? "🔵 Forming — looking for members" : `🟢 ${group.status}`}
              </p>
            </div>

            <dl className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
                <dt className="text-gray-500 dark:text-gray-400 text-xs mb-1">Contribution</dt>
                <dd className="font-semibold text-gray-900 dark:text-gray-100">{formatAmount(group.contributionAmount)} tokens</dd>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
                <dt className="text-gray-500 dark:text-gray-400 text-xs mb-1">Cycle</dt>
                <dd className="font-semibold text-gray-900 dark:text-gray-100">
                  {group.cycleLength >= 2592000 ? "Monthly" : group.cycleLength >= 604800 ? "Weekly" : "Daily"}
                </dd>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
                <dt className="text-gray-500 dark:text-gray-400 text-xs mb-1">Members</dt>
                <dd className="font-semibold text-gray-900 dark:text-gray-100">{group.members.length} / {group.maxMembers}</dd>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
                <dt className="text-gray-500 dark:text-gray-400 text-xs mb-1">Spots Left</dt>
                <dd className={`font-semibold ${isFull ? "text-red-600" : "text-green-600"}`}>
                  {isFull ? "Full" : `${spotsLeft} open`}
                </dd>
              </div>
            </dl>

            {/* Actions */}
            <div className="pt-2">
              {joinState === "success" ? (
                <div className="text-center py-4">
                  <div className="text-4xl mb-2">🎉</div>
                  <p className="font-semibold text-green-600 dark:text-green-400">You joined the group!</p>
                  <p className="text-sm text-gray-400 mt-1">Redirecting...</p>
                </div>
              ) : !isConnected ? (
                <div className="text-center py-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Connect your wallet to join this group.</p>
                  <p className="text-xs text-gray-400">Use the Connect Wallet button in the top right.</p>
                </div>
              ) : alreadyMember ? (
                <div className="text-center py-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">You&apos;re already a member of this group.</p>
                  <Link href={`/groups/${group.id}`} className="bg-primary-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-primary-700 text-sm inline-block">
                    View Group →
                  </Link>
                </div>
              ) : isFull ? (
                <div className="text-center py-2">
                  <p className="text-sm text-red-500 mb-3">This group is full.</p>
                  <Link href="/groups" className="text-primary-600 hover:underline text-sm">Browse other groups</Link>
                </div>
              ) : (
                <>
                  <button
                    onClick={handleJoin}
                    disabled={joinState === "loading" || !canJoin}
                    className="w-full bg-primary-600 text-white py-3 rounded-xl font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50 text-sm"
                  >
                    {joinState === "loading" ? "Joining..." : `Join ${group.name}`}
                  </button>
                  {joinState === "error" && (
                    <p className="text-sm text-red-500 mt-2 text-center">{errorMsg}</p>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-6">
          Powered by <a href="https://stellar.org" className="hover:underline">Stellar / Soroban</a>
        </p>
      </main>
    </>
  );
}
