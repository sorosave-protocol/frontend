/**
 * Stellar Horizon API client for fetching on-chain transaction history.
 *
 * Horizon exposes operations and transactions for any account address, including
 * Soroban contract addresses (C…). We hit the public endpoints with fetch() so
 * we don't pull in the full @stellar/stellar-sdk just for read-only queries.
 *
 * Docs: https://developers.stellar.org/api/horizon
 */

const DEFAULT_HORIZON_URL =
  process.env.NEXT_PUBLIC_HORIZON_URL || "https://horizon-testnet.stellar.org";

export const HORIZON_URL = DEFAULT_HORIZON_URL;

export type HorizonOrder = "asc" | "desc";

export interface HorizonPageOptions {
  limit?: number;
  cursor?: string;
  order?: HorizonOrder;
}

export interface HorizonTransaction {
  id: string;
  paging_token: string;
  successful: boolean;
  hash: string;
  ledger: number;
  created_at: string;
  source_account: string;
  fee_charged: string;
  operation_count: number;
  memo?: string;
  memo_type?: string;
}

/**
 * Subset of operation fields we surface in the UI. Horizon returns many more
 * fields; we keep this loose so unknown operation types still render.
 */
export interface HorizonOperation {
  id: string;
  paging_token: string;
  transaction_hash: string;
  transaction_successful: boolean;
  source_account: string;
  type: string;
  type_i: number;
  created_at: string;

  // payment / path_payment_*
  asset_type?: string;
  asset_code?: string;
  asset_issuer?: string;
  amount?: string;
  from?: string;
  to?: string;

  // invoke_host_function (Soroban)
  function?: string;
  parameters?: Array<{ type: string; value: string }>;
  address?: string;
  salt?: string;
}

interface HorizonCollection<T> {
  _links: {
    self: { href: string };
    next: { href: string };
    prev: { href: string };
  };
  _embedded: {
    records: T[];
  };
}

export interface HorizonPage<T> {
  records: T[];
  nextCursor: string | null;
  prevCursor: string | null;
}

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

const CACHE_TTL_MS = 30_000;
const cache = new Map<string, CacheEntry<unknown>>();

function getCached<T>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (entry.expiresAt < Date.now()) {
    cache.delete(key);
    return null;
  }
  return entry.value as T;
}

function setCached<T>(key: string, value: T): void {
  cache.set(key, { value, expiresAt: Date.now() + CACHE_TTL_MS });
}

/** Clears the in-memory Horizon response cache. Mostly useful for tests. */
export function clearHorizonCache(): void {
  cache.clear();
}

function buildUrl(path: string, params: Record<string, string | number | undefined>): string {
  const url = new URL(path, HORIZON_URL);
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === "") continue;
    url.searchParams.set(key, String(value));
  }
  return url.toString();
}

function extractCursor(href: string | undefined): string | null {
  if (!href) return null;
  try {
    const url = new URL(href);
    return url.searchParams.get("cursor");
  } catch {
    return null;
  }
}

async function horizonGet<T>(url: string): Promise<HorizonCollection<T>> {
  const cached = getCached<HorizonCollection<T>>(url);
  if (cached) return cached;

  const res = await fetch(url, {
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(
      `Horizon request failed (${res.status} ${res.statusText}): ${body.slice(0, 200)}`
    );
  }

  const data = (await res.json()) as HorizonCollection<T>;
  setCached(url, data);
  return data;
}

function toPage<T>(collection: HorizonCollection<T>): HorizonPage<T> {
  return {
    records: collection._embedded.records,
    nextCursor: extractCursor(collection._links.next?.href),
    prevCursor: extractCursor(collection._links.prev?.href),
  };
}

/**
 * Fetches transactions involving the given account or contract address.
 * Works for both classic G… accounts and C… contract addresses on Horizon.
 */
export async function fetchTransactionsForAccount(
  account: string,
  options: HorizonPageOptions = {}
): Promise<HorizonPage<HorizonTransaction>> {
  if (!account) {
    return { records: [], nextCursor: null, prevCursor: null };
  }
  const url = buildUrl(`/accounts/${account}/transactions`, {
    limit: options.limit ?? 20,
    cursor: options.cursor,
    order: options.order ?? "desc",
  });
  return toPage(await horizonGet<HorizonTransaction>(url));
}

/**
 * Fetches operations involving the given account or contract address. Returns
 * the lower-level operation records (payments, invocations, etc.) which is
 * usually what we want to show in a transaction-history feed.
 */
export async function fetchOperationsForAccount(
  account: string,
  options: HorizonPageOptions = {}
): Promise<HorizonPage<HorizonOperation>> {
  if (!account) {
    return { records: [], nextCursor: null, prevCursor: null };
  }
  const url = buildUrl(`/accounts/${account}/operations`, {
    limit: options.limit ?? 20,
    cursor: options.cursor,
    order: options.order ?? "desc",
    include_failed: "true",
  });
  return toPage(await horizonGet<HorizonOperation>(url));
}

/** Human-friendly label for a Horizon operation type. */
export function formatOperationType(type: string): string {
  switch (type) {
    case "payment":
      return "Payment";
    case "create_account":
      return "Account Created";
    case "path_payment_strict_send":
    case "path_payment_strict_receive":
      return "Path Payment";
    case "change_trust":
      return "Trustline Change";
    case "manage_sell_offer":
    case "manage_buy_offer":
    case "create_passive_sell_offer":
      return "Offer";
    case "invoke_host_function":
      return "Contract Invocation";
    case "extend_footprint_ttl":
      return "TTL Extension";
    case "restore_footprint":
      return "Restore Footprint";
    default:
      return type
        .split("_")
        .map((part) => (part ? part[0].toUpperCase() + part.slice(1) : part))
        .join(" ");
  }
}

/** Short summary describing what an operation did, for list rows. */
export function summarizeOperation(op: HorizonOperation): string {
  switch (op.type) {
    case "payment": {
      const asset = op.asset_type === "native" ? "XLM" : op.asset_code || "asset";
      return `${op.amount ?? "?"} ${asset} from ${shortenAddress(op.from)} to ${shortenAddress(op.to)}`;
    }
    case "create_account":
      return `Funded ${shortenAddress(op.to ?? op.address)} with ${op.amount ?? "?"} XLM`;
    case "invoke_host_function":
      return op.function
        ? `${op.function}${op.address ? ` on ${shortenAddress(op.address)}` : ""}`
        : "Contract invocation";
    default:
      return formatOperationType(op.type);
  }
}

function shortenAddress(address: string | undefined | null): string {
  if (!address) return "—";
  if (address.length <= 12) return address;
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

export { shortenAddress };
