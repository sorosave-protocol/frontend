/**
 * Stellar Horizon API client for fetching transaction history.
 * Provides caching and pagination support.
 */

const HORIZON_URL =
  process.env.NEXT_PUBLIC_HORIZON_URL ||
  "https://horizon-testnet.stellar.org";

const CONTRACT_ID = process.env.NEXT_PUBLIC_CONTRACT_ID || "";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface HorizonTransaction {
  id: string;
  hash: string;
  ledger: number;
  created_at: string;
  source_account: string;
  operation_count: number;
  memo_type: string;
  memo?: string;
  successful: boolean;
  paging_token: string;
}

export interface TransactionOperation {
  id: string;
  type: string;
  type_i: number;
  source_account: string;
  transaction_hash: string;
  created_at: string;
  from?: string;
  to?: string;
  amount?: string;
  asset_type?: string;
  asset_code?: string;
  asset_issuer?: string;
  contract_id?: string;
  function?: string;
}

export interface ParsedTransaction {
  id: string;
  hash: string;
  ledger: number;
  createdAt: string;
  sourceAccount: string;
  successful: boolean;
  operationCount: number;
  operations: TransactionOperation[];
  memo?: string;
}

export interface TransactionPage {
  transactions: ParsedTransaction[];
  nextCursor: string | null;
  prevCursor: string | null;
}

// ---------------------------------------------------------------------------
// Simple in-memory cache
// ---------------------------------------------------------------------------

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const cache = new Map<string, CacheEntry<unknown>>();
const CACHE_TTL_MS = 30_000;

function getCached<T>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
    cache.delete(key);
    return null;
  }
  return entry.data as T;
}

function setCache<T>(key: string, data: T): void {
  cache.set(key, { data, timestamp: Date.now() });
}

export function clearHorizonCache(): void {
  cache.clear();
}

// ---------------------------------------------------------------------------
// Horizon API helpers
// ---------------------------------------------------------------------------

async function fetchHorizon<T>(path: string): Promise<T> {
  const url = `${HORIZON_URL}${path}`;
  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Horizon error ${res.status}: ${text}`);
  }
  return res.json() as Promise<T>;
}

interface HorizonTransactionResponse {
  _embedded: {
    records: HorizonTransaction[];
  };
  _links: {
    next: { href: string };
    prev: { href: string };
  };
}

interface HorizonOperationsResponse {
  _embedded: {
    records: TransactionOperation[];
  };
}

async function fetchTransactionOperations(
  txHash: string
): Promise<TransactionOperation[]> {
  const data = await fetchHorizon<HorizonOperationsResponse>(
    `/transactions/${txHash}/operations?limit=50`
  );
  return data._embedded.records;
}

async function enrichTransactions(
  records: HorizonTransaction[]
): Promise<ParsedTransaction[]> {
  const parsed = await Promise.all(
    records.map(async (tx) => {
      let operations: TransactionOperation[] = [];
      try {
        operations = await fetchTransactionOperations(tx.hash);
      } catch {
        // If operations fetch fails, continue without them
      }
      return {
        id: tx.id,
        hash: tx.hash,
        ledger: tx.ledger,
        createdAt: tx.created_at,
        sourceAccount: tx.source_account,
        successful: tx.successful,
        operationCount: tx.operation_count,
        operations,
        memo: tx.memo,
      };
    })
  );
  return parsed;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export async function fetchTransactions(
  cursor: string | null = null,
  limit = 10,
  order: "asc" | "desc" = "desc"
): Promise<TransactionPage> {
  if (!CONTRACT_ID) {
    throw new Error(
      "NEXT_PUBLIC_CONTRACT_ID is not configured. Set it in your .env file."
    );
  }

  const cacheKey = `tx:${CONTRACT_ID}:${cursor ?? "latest"}:${limit}:${order}`;
  const cached = getCached<TransactionPage>(cacheKey);
  if (cached) return cached;

  const params = new URLSearchParams({
    limit: String(Math.min(limit, 200)),
    order,
    include_failed: "true",
  });
  if (cursor) {
    params.set("cursor", cursor);
  }

  const data = await fetchHorizon<HorizonTransactionResponse>(
    `/accounts/${CONTRACT_ID}/transactions?${params}`
  );

  const transactions = await enrichTransactions(data._embedded.records);

  const nextHref = data._links.next?.href ?? null;
  const prevHref = data._links.prev?.href ?? null;
  const nextCursor = nextHref
    ? new URL(nextHref, HORIZON_URL).searchParams.get("cursor")
    : null;
  const prevCursor = prevHref
    ? new URL(prevHref, HORIZON_URL).searchParams.get("cursor")
    : null;

  const page: TransactionPage = {
    transactions,
    nextCursor,
    prevCursor,
  };

  setCache(cacheKey, page);
  return page;
}

export async function fetchRecentTransactions(
  limit = 10
): Promise<TransactionPage> {
  return fetchTransactions(null, limit, "desc");
}
