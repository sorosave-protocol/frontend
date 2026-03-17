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

interface SoroSaveConfig {
  contractId: string;
  rpcUrl: string;
  networkPassphrase: string;
}

interface CreateGroupInput {
  admin: string;
  name: string;
  token: string;
  contributionAmount: bigint;
  cycleLength: number;
  maxMembers: number;
}

interface TransactionLike {
  toXDR(): string;
}

class MockTransaction implements TransactionLike {
  constructor(private readonly payload: Record<string, unknown>) {}

  toXDR(): string {
    return JSON.stringify(this.payload);
  }
}

export class SoroSaveClient {
  constructor(private readonly config: SoroSaveConfig) {}

  async createGroup(input: CreateGroupInput, sourcePublicKey: string): Promise<TransactionLike> {
    return new MockTransaction({
      action: "createGroup",
      sourcePublicKey,
      contractId: this.config.contractId,
      rpcUrl: this.config.rpcUrl,
      networkPassphrase: this.config.networkPassphrase,
      input: {
        ...input,
        contributionAmount: input.contributionAmount.toString(),
      },
    });
  }

  async contribute(member: string, groupId: number, sourcePublicKey: string): Promise<TransactionLike> {
    return new MockTransaction({
      action: "contribute",
      member,
      groupId,
      sourcePublicKey,
      contractId: this.config.contractId,
      rpcUrl: this.config.rpcUrl,
      networkPassphrase: this.config.networkPassphrase,
    });
  }
}

export function shortenAddress(address: string, visible = 4): string {
  if (address.length <= visible * 2 + 3) return address;
  return `${address.slice(0, visible)}...${address.slice(-visible)}`;
}

export function parseAmount(value: string, decimals = 7): bigint {
  const normalized = value.trim();
  if (!normalized) return 0n;

  const [wholePart, fractionalPart = ""] = normalized.split(".");
  const whole = wholePart === "" ? "0" : wholePart;
  const fraction = fractionalPart.padEnd(decimals, "0").slice(0, decimals);

  return BigInt(`${whole}${fraction}`);
}

export function formatAmount(value: bigint, decimals = 7): string {
  const negative = value < 0n;
  const absolute = negative ? -value : value;
  const raw = absolute.toString().padStart(decimals + 1, "0");
  const whole = raw.slice(0, -decimals) || "0";
  const fraction = raw.slice(-decimals).replace(/0+$/, "");
  const formatted = fraction ? `${whole}.${fraction}` : whole;
  return negative ? `-${formatted}` : formatted;
}

export function getStatusLabel(status: GroupStatus): string {
  switch (status) {
    case GroupStatus.Forming:
      return "Forming";
    case GroupStatus.Active:
      return "Active";
    case GroupStatus.Completed:
      return "Completed";
    case GroupStatus.Disputed:
      return "Disputed";
    case GroupStatus.Paused:
      return "Paused";
    default:
      return String(status);
  }
}
