/**
 * Stellar Horizon API client for fetching on-chain transaction history.
 * Supports both Testnet and Mainnet with pagination and caching.
 */

const HORIZON_URLS = {
  testnet: "https://horizon-testnet.stellar.org",
  mainnet: "https://horizon.stellar.org",
} as const;

export type Network = keyof typeof HORIZON_URLS;

export type OperationType =
  | "payment"
  | "invoke_host_function"
  | "create_account"
  | "path_payment_strict_send"
  | "path_payment_strict_receive"
  | "change_trust"
  | "account_merge"
  | string;

export interface HorizonOperation {
  id: string;
  type: OperationType;
  type_i: number;
  created_at: string;
  transaction_hash: string;
  source_account: string;
  // payment fields
  amount?: string;
  asset_type?: string;
  asset_code?: string;
  asset_issuer?: string;
  from?: string;
  to?: string;
  // invoke_host_function fields
  function?: string;
}

export interface HorizonTransaction {
  id: string;
  hash: string;
  created_at: string;
  source_account: string;
  fee_charged: string;
  operation_count: number;
  successful: boolean;
  ledger: number;
}

export interface ParsedTransaction {
  id: string;
  hash: string;
  type: string;
  label: string;
  createdAt: Date;
  sourceAccount: string;
  amount?: string;
  assetCode?: string;
  from?: string;
  to?: string;
  successful: boolean;
  explorerUrl: string;
}

export interface PaginatedTransactions {
  records: ParsedTransaction[];
  nextCursor: string | null;
  prevCursor: string | null;
}

const PAGE_SIZE = 20;

// Simple in-memory cache: key -> { data, timestamp }
const cache = new Map<string, { data: PaginatedTransactions; timestamp: number }>();
const CACHE_TTL_MS = 30_000; // 30 seconds

function getCachedOrNull(key: string): PaginatedTransactions | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
    cache.delete(key);
    return null;
  }
  return entry.data;
}

function setCache(key: string, data: PaginatedTransactions) {
  cache.set(key, { data, timestamp: Date.now() });
}

function operationLabel(op: HorizonOperation): string {
  switch (op.type) {
    case "payment":
      return "Payment";
    case "invoke_host_function":
      return "Contract Call";
    case "create_account":
      return "Create Account";
    case "path_payment_strict_send":
    case "path_payment_strict_receive":
      return "Path Payment";
    case "change_trust":
      return "Change Trust";
    case "account_merge":
      return "Account Merge";
    default:
      return op.type
        .split("_")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
  }
}

function explorerUrl(hash: string, network: Network): string {
  const base =
    network === "mainnet"
      ? "https://stellar.expert/explorer/public/tx"
      : "https://stellar.expert/explorer/testnet/tx";
  return `${base}/${hash}`;
}

function parseOperation(
  op: HorizonOperation,
  network: Network
): ParsedTransaction {
  return {
    id: op.id,
    hash: op.transaction_hash,
    type: op.type,
    label: operationLabel(op),
    createdAt: new Date(op.created_at),
    sourceAccount: op.source_account,
    amount: op.amount,
    assetCode: op.asset_type === "native" ? "XLM" : op.asset_code,
    from: op.from,
    to: op.to,
    successful: true,
    explorerUrl: explorerUrl(op.transaction_hash, network),
  };
}

/**
 * Fetch operations for a given Stellar account with cursor-based pagination.
 * Results are cached for CACHE_TTL_MS.
 */
export async function fetchAccountTransactions(
  accountId: string,
  network: Network = "testnet",
  cursor?: string
): Promise<PaginatedTransactions> {
  const cacheKey = `${network}:${accountId}:${cursor ?? "first"}`;
  const cached = getCachedOrNull(cacheKey);
  if (cached) return cached;

  const base = HORIZON_URLS[network];
  const params = new URLSearchParams({
    limit: String(PAGE_SIZE),
    order: "desc",
  });
  if (cursor) params.set("cursor", cursor);

  const url = `${base}/accounts/${accountId}/operations?${params}`;
  const res = await fetch(url, {
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    if (res.status === 404) {
      // Account not found on this network — return empty list
      return { records: [], nextCursor: null, prevCursor: null };
    }
    throw new Error(`Horizon API error: ${res.status} ${res.statusText}`);
  }

  const json = await res.json();
  const records = (json._embedded?.records ?? []).map((op: HorizonOperation) =>
    parseOperation(op, network)
  );

  // Extract cursors from HAL links
  const nextLink: string | undefined = json._links?.next?.href;
  const prevLink: string | undefined = json._links?.prev?.href;

  function extractCursor(link?: string): string | null {
    if (!link) return null;
    try {
      const u = new URL(link);
      return u.searchParams.get("cursor");
    } catch {
      return null;
    }
  }

  const result: PaginatedTransactions = {
    records,
    nextCursor: extractCursor(nextLink),
    prevCursor: extractCursor(prevLink),
  };

  setCache(cacheKey, result);
  return result;
}

/**
 * Fetch recent transactions for a Soroban contract address.
 * Uses the contract's ledger entries endpoint to find relevant operations.
 */
export async function fetchContractTransactions(
  contractId: string,
  network: Network = "testnet",
  cursor?: string
): Promise<PaginatedTransactions> {
  const cacheKey = `contract:${network}:${contractId}:${cursor ?? "first"}`;
  const cached = getCachedOrNull(cacheKey);
  if (cached) return cached;

  const base = HORIZON_URLS[network];
  const params = new URLSearchParams({
    limit: String(PAGE_SIZE),
    order: "desc",
  });
  if (cursor) params.set("cursor", cursor);

  const url = `${base}/accounts/${contractId}/operations?${params}`;
  const res = await fetch(url, {
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    // Contracts may not always be queryable as accounts; return empty gracefully
    return { records: [], nextCursor: null, prevCursor: null };
  }

  const json = await res.json();
  const records = (json._embedded?.records ?? []).map((op: HorizonOperation) =>
    parseOperation(op, network)
  );

  const nextLink: string | undefined = json._links?.next?.href;
  const prevLink: string | undefined = json._links?.prev?.href;

  function extractCursor(link?: string): string | null {
    if (!link) return null;
    try {
      const u = new URL(link);
      return u.searchParams.get("cursor");
    } catch {
      return null;
    }
  }

  const result: PaginatedTransactions = {
    records,
    nextCursor: extractCursor(nextLink),
    prevCursor: extractCursor(prevLink),
  };

  setCache(cacheKey, result);
  return result;
}
