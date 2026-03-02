/**
 * Horizon API Client
 * Fetch and display transaction history from Stellar Horizon
 * Issue: #63
 */

import { SoroSaveClient } from "@sorosave/sdk";

const HORIZON_TESTNET = 'https://horizon-testnet.stellar.org';
const HORIZON_MAINNET = 'https://horizon-mainnet.stellar.org';

export interface Transaction {
  id: string;
  hash: string;
  ledger: number;
  timestamp: number;
  account: string;
  operations: Operation[];
  successful: boolean;
}

export interface Operation {
  type: string;
  from?: string;
  to?: string;
  amount?: string;
  asset?: string;
  contractId?: string;
}

export interface TransactionHistoryOptions {
  limit?: number;
  cursor?: string;
}

export class HorizonClient {
  private horizonUrl: string;
  private contractId: string;

  constructor(network: 'testnet' | 'mainnet' = 'testnet', contractId: string = '') {
    this.horizonUrl = network === 'testnet' ? HORIZON_TESTNET : HORIZON_MAINNET;
    this.contractId = contractId;
  }

  /**
   * Fetch transactions for a specific account
   */
  async getAccountTransactions(
    account: string,
    options: TransactionHistoryOptions = {}
  ): Promise<Transaction[]> {
    const { limit = 20, cursor } = options;
    
    let url = `${this.horizonUrl}/accounts/${account}/transactions?limit=${limit}&order=desc`;
    if (cursor) {
      url += `&cursor=${cursor}`;
    }

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch transactions: ${response.status}`);
    }

    const data = await response.json();
    
    return this.parseTransactions(data.records || []);
  }

  /**
   * Fetch transactions involving the contract
   */
  async getContractTransactions(
    options: TransactionHistoryOptions = {}
  ): Promise<Transaction[]> {
    const { limit = 20, cursor } = options;
    
    // Query transactions where this contract is involved
    let url = `${this.horizonUrl}/transactions?limit=${limit}&order=desc`;
    if (this.contractId) {
      url += `&transaction=${this.contractId}`;
    }
    if (cursor) {
      url += `&cursor=${cursor}`;
    }

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch contract transactions: ${response.status}`);
    }

    const data = await response.json();
    
    return this.parseTransactions(data.records || []);
  }

  /**
   * Parse Horizon transaction records into our format
   */
  private parseTransactions(records: Record<string, unknown>[]): Transaction[] {
    return records.map((record) => ({
      id: record.id as string,
      hash: record.hash as string,
      ledger: record.ledger as number,
      timestamp: new Date(record.created_at as string).getTime(),
      account: record.source_account as string,
      operations: this.parseOperations(record.operations as string),
      successful: (record.successful as boolean) ?? true,
    }));
  }

  /**
   * Parse operation URLs into operation details
   */
  private parseOperations(operationsUrl: string): Operation[] {
    // In a real implementation, you'd fetch the operations
    // For now, return a placeholder
    return [];
  }

  /**
   * Fetch a specific transaction by hash
   */
  async getTransaction(hash: string): Promise<Transaction | null> {
    const response = await fetch(`${this.horizonUrl}/transactions/${hash}`);
    
    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(`Failed to fetch transaction: ${response.status}`);
    }

    const record = await response.json();
    return this.parseTransactions([record])[0];
  }
}

// Cache for transaction results
const transactionCache = new Map<string, { data: Transaction[]; timestamp: number }>();
const CACHE_TTL = 60000; // 1 minute

export async function getCachedTransactions(
  client: HorizonClient,
  account: string,
  limit: number = 20
): Promise<Transaction[]> {
  const cacheKey = `${account}_${limit}`;
  const cached = transactionCache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  const transactions = await client.getAccountTransactions(account, { limit });
  
  transactionCache.set(cacheKey, {
    data: transactions,
    timestamp: Date.now(),
  });

  return transactions;
}

export function clearTransactionCache(): void {
  transactionCache.clear();
}
