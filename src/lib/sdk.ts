// Local stub replacing @/lib/sdk until the package is available

export enum GroupStatus {
  Forming = "Forming",
  Active = "Active",
  Completed = "Completed",
  Disputed = "Disputed",
  Paused = "Paused",
}

export interface SavingsGroup {
  id: number;
  name: string;
  admin: string;
  token: string;
  contributionAmount: bigint;
  cycleLength: number;
  maxMembers: number;
  members: string[];
  payoutOrder: string[];
  currentRound: number;
  totalRounds: number;
  status: GroupStatus;
  createdAt: number;
}

export function formatAmount(amount: bigint): string {
  return (Number(amount) / 1e7).toFixed(2);
}

export function parseAmount(value: string): bigint {
  return BigInt(Math.round(parseFloat(value) * 1e7));
}

export function shortenAddress(address: string, chars = 4): string {
  if (!address) return "";
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

export function getStatusLabel(status: GroupStatus | string): string {
  return status.toString();
}

export class SoroSaveClient {
  contractId: string;
  rpcUrl: string;
  networkPassphrase: string;

  constructor(config: { contractId: string; rpcUrl: string; networkPassphrase: string }) {
    this.contractId = config.contractId;
    this.rpcUrl = config.rpcUrl;
    this.networkPassphrase = config.networkPassphrase;
  }

  async contribute(_member: string, _groupId: number, _caller: string): Promise<{ toXDR: () => string }> {
    throw new Error("SoroSaveClient not yet connected to a live contract.");
  }

  async createGroup(_params: Partial<SavingsGroup>, _caller: string): Promise<{ toXDR: () => string }> {
    throw new Error("SoroSaveClient not yet connected to a live contract.");
  }
}
