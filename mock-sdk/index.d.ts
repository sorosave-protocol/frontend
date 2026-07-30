export interface SoroSaveClientConfig {
  contractId: string;
  rpcUrl: string;
  networkPassphrase: string;
}

export class SoroSaveClient {
  constructor(config: SoroSaveClientConfig);
  joinGroup(groupId: string): Promise<any>;
  getGroup(groupId: string): Promise<any>;
  contribute(...args: any[]): Promise<any>;
  createGroup(...args: any[]): Promise<any>;
  [key: string]: any;
}

export function shortenAddress(address: string, chars?: number): string;

export interface SavingsGroup {
  id: string | number;
  name: string;
  admin?: string;
  token?: string;
  members: string[];
  contributionAmount: number | bigint;
  cycleLength: number;
  maxMembers: number;
  totalMembers?: number;
  currentMembers?: number;
  totalRounds: number;
  currentRound: number;
  status: GroupStatus;
  createdAt?: number;
  [key: string]: any;
}

export function formatAmount(amount: any): string;
export function parseAmount(amount: any): bigint;
export function getStatusLabel(status: any): string;
export enum GroupStatus {
  Active = "ACTIVE",
  Completed = "COMPLETED",
  Cancelled = "CANCELLED",
  Forming = "FORMING"
}
