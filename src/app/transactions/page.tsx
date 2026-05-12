"use client";

import { useCallback, useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { CONTRACT_ID } from "@/lib/sorosave";
import {
  HORIZON_URL,
  HorizonOperation,
  fetchOperationsForAccount,
  formatOperationType,
  shortenAddress,
  summarizeOperation,
} from "@/lib/horizon";

const PAGE_SIZE = 20;

type LoadDirection = "initial" | "next" | "prev";

export default function TransactionsPage() {
  const [operations, setOperations] = useState<HorizonOperation[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [prevCursor, setPrevCursor] = useState<string | null>(null);
  const [cursorStack, setCursorStack] = useState<Array<string | undefined>>([undefined]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [contractId, setContractId] = useState(CONTRACT_ID);
  const [inputValue, setInputValue] = useState(CONTRACT_ID);

  const load = useCallback(
    async (account: string, cursor: string | undefined, direction: LoadDirection) => {
      if (!account) {
        setOperations([]);
        setNextCursor(null);
        setPrevCursor(null);
        setError(
          "No contract address configured. Set NEXT_PUBLIC_CONTRACT_ID or enter one above."
        );
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const page = await fetchOperationsForAccount(account, {
          limit: PAGE_SIZE,
          cursor,
          order: "desc",
        });
        setOperations(page.records);
        setNextCursor(page.nextCursor);
        setPrevCursor(page.prevCursor);

        if (direction === "initial") {
          setCursorStack([undefined]);
        } else if (direction === "next") {
          setCursorStack((stack) => [...stack, cursor]);
        } else if (direction === "prev") {
          setCursorStack((stack) => (stack.length > 1 ? stack.slice(0, -1) : stack));
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        setError(message);
        setOperations([]);
        setNextCursor(null);
        setPrevCursor(null);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    load(contractId, undefined, "initial");
  }, [contractId, load]);

  const onSubmitAddress = (e: React.FormEvent) => {
    e.preventDefault();
    setContractId(inputValue.trim());
  };

  const canGoBack = cursorStack.length > 1 && !loading;
  const canGoNext = !!nextCursor && !loading && operations.length > 0;

  return (
    <>
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Transaction History</h1>
          <p className="text-gray-600 mt-1">
            On-chain operations involving the SoroSave contract, fetched from{" "}
            <a
              href={HORIZON_URL}
              className="text-primary-700 underline"
              target="_blank"
              rel="noreferrer"
            >
              Stellar Horizon
            </a>
            .
          </p>
        </div>

        <form
          onSubmit={onSubmitAddress}
          className="bg-white rounded-xl shadow-sm border p-4 mb-6 flex gap-3 items-center"
        >
          <label htmlFor="contract" className="text-sm font-medium text-gray-700 shrink-0">
            Address
          </label>
          <input
            id="contract"
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Contract or account address (C… or G…)"
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono"
          />
          <button
            type="submit"
            className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors disabled:opacity-60"
            disabled={loading}
          >
            Load
          </button>
        </form>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-6 text-sm">
            {error}
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
              <tr>
                <th className="text-left px-4 py-3">Type</th>
                <th className="text-left px-4 py-3">Summary</th>
                <th className="text-left px-4 py-3">When</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-left px-4 py-3">Tx</th>
              </tr>
            </thead>
            <tbody>
              {loading && operations.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                    Loading transactions…
                  </td>
                </tr>
              )}
              {!loading && operations.length === 0 && !error && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                    No operations found for this address.
                  </td>
                </tr>
              )}
              {operations.map((op) => (
                <tr key={op.id} className="border-t">
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {formatOperationType(op.type)}
                  </td>
                  <td className="px-4 py-3 text-gray-700">{summarizeOperation(op)}</td>
                  <td className="px-4 py-3 text-gray-500" title={op.created_at}>
                    {formatRelative(op.created_at)}
                  </td>
                  <td className="px-4 py-3">
                    {op.transaction_successful ? (
                      <span className="text-green-700">Success</span>
                    ) : (
                      <span className="text-red-700">Failed</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <a
                      href={`${HORIZON_URL}/transactions/${op.transaction_hash}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary-700 hover:underline font-mono"
                    >
                      {shortenAddress(op.transaction_hash)}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center mt-4">
          <button
            type="button"
            onClick={() => {
              const prevStack = cursorStack.slice(0, -1);
              const cursor = prevStack[prevStack.length - 1];
              load(contractId, cursor, "prev");
            }}
            disabled={!canGoBack}
            className="px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            ← Newer
          </button>
          <span className="text-xs text-gray-500">
            Page {cursorStack.length}
            {loading ? " · loading…" : ""}
          </span>
          <button
            type="button"
            onClick={() => {
              if (nextCursor) load(contractId, nextCursor, "next");
            }}
            disabled={!canGoNext}
            className="px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Older →
          </button>
        </div>
      </main>
    </>
  );
}

function formatRelative(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return iso;
  const diffSec = Math.max(0, Math.round((Date.now() - then) / 1000));
  if (diffSec < 60) return `${diffSec}s ago`;
  const diffMin = Math.round(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.round(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.round(diffHr / 24);
  if (diffDay < 30) return `${diffDay}d ago`;
  return new Date(iso).toLocaleDateString();
}
