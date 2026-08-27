import { SoroSaveClient } from "@sorosave/sdk";

export type SorobanNetwork = "testnet" | "mainnet";

const NETWORK_CONFIGS: Record<
  SorobanNetwork,
  { rpcUrl: string; networkPassphrase: string; label: string }
> = {
  testnet: {
    rpcUrl:
      process.env.NEXT_PUBLIC_RPC_URL ||
      "https://soroban-testnet.stellar.org",
    networkPassphrase:
      process.env.NEXT_PUBLIC_NETWORK_PASSPHRASE ||
      "Test SDF Network ; September 2015",
    label: "Testnet",
  },
  mainnet: {
    rpcUrl:
      process.env.NEXT_PUBLIC_RPC_URL_MAINNET ||
      "https://soroban-mainnet.stellar.org",
    networkPassphrase:
      process.env.NEXT_PUBLIC_NETWORK_PASSPHRASE_MAINNET ||
      "Public Global Stellar Network ; September 2015",
    label: "Mainnet",
  },
};

const DEFAULT_NETWORK: SorobanNetwork = "testnet";

function resolveContractId(network: SorobanNetwork): string {
  if (network === "mainnet") {
    return process.env.NEXT_PUBLIC_CONTRACT_ID_MAINNET || "";
  }
  return process.env.NEXT_PUBLIC_CONTRACT_ID || "";
}

export function detectNetwork(): SorobanNetwork {
  if (typeof window === "undefined") return DEFAULT_NETWORK;
  try {
    const stored = window.localStorage.getItem(
      "sorosave.network",
    ) as SorobanNetwork | null;
    if (stored === "testnet" || stored === "mainnet") return stored;
  } catch {
    // localStorage unavailable; fall through
  }
  return DEFAULT_NETWORK;
}

export function persistNetwork(network: SorobanNetwork): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem("sorosave.network", network);
  } catch {
    // localStorage unavailable; best effort
  }
}

function buildClient(network: SorobanNetwork): SoroSaveClient {
  const config = NETWORK_CONFIGS[network];
  return new SoroSaveClient({
    contractId: resolveContractId(network),
    rpcUrl: config.rpcUrl,
    networkPassphrase: config.networkPassphrase,
  });
}

export const sorosaveClient: SoroSaveClient = buildClient(detectNetwork());

export function rebuildClient(network: SorobanNetwork): SoroSaveClient {
  persistNetwork(network);
  return buildClient(network);
}

export { NETWORK_CONFIGS };
