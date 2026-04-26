"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useWallet } from "@/app/providers";
import { sorosaveClient, NETWORK_PASSPHRASE } from "@/lib/sorosave";
import { parseAmount } from "@sorosave/sdk";
import { signTransaction } from "@/lib/wallet";

export function CreateGroupForm() {
  const { address, isConnected } = useWallet();
  const t = useTranslations("newGroup");
  const [name, setName] = useState("");
  const [tokenAddress, setTokenAddress] = useState("");
  const [contributionAmount, setContributionAmount] = useState("");
  const [cycleLength, setCycleLength] = useState("86400");
  const [maxMembers, setMaxMembers] = useState("5");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) return;

    setLoading(true);
    setError(null);

    try {
      const tx = await sorosaveClient.createGroup(
        {
          admin: address,
          name,
          token: tokenAddress,
          contributionAmount: parseAmount(contributionAmount),
          cycleLength: parseInt(cycleLength),
          maxMembers: parseInt(maxMembers),
        },
        address
      );

      const signedXdr = await signTransaction(
        tx.toXDR(),
        NETWORK_PASSPHRASE
      );

      // TODO: Submit signed transaction to network
      console.log("Signed transaction:", signedXdr);
      alert(t("successMessage"));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create group");
    } finally {
      setLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="text-center py-12 text-gray-500">
        {t("connectWalletPrompt")}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-lg">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t("groupName")}
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder={t("groupNamePlaceholder")}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t("tokenAddress")}
        </label>
        <input
          type="text"
          value={tokenAddress}
          onChange={(e) => setTokenAddress(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder={t("tokenAddressPlaceholder")}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t("contributionAmount")}
        </label>
        <input
          type="text"
          value={contributionAmount}
          onChange={(e) => setContributionAmount(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder={t("contributionAmountPlaceholder")}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t("cycleLength")}
          </label>
          <select
            value={cycleLength}
            onChange={(e) => setCycleLength(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="3600">1 Hour</option>
            <option value="86400">1 Day</option>
            <option value="604800">1 Week</option>
            <option value="2592000">1 Month</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t("maxMembers")}
          </label>
          <input
            type="number"
            min="2"
            max="20"
            value={maxMembers}
            onChange={(e) => setMaxMembers(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-primary-600 text-white py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50"
      >
        {loading ? t("creating") : t("createButton")}
      </button>
    </form>
  );
}
