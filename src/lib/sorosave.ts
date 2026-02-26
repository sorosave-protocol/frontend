import { SoroSaveClient } from "@sorosave/sdk";

export type NetworkType = "testnet" | "mainnet";

export interface NetworkConfig {
  rpcUrl: string;
  networkPassphrase: string;
  contractId: string;
}

const NETWORK_CONFIGS: Record<NetworkType, NetworkConfig> = {
  testnet: {
    rpcUrl: process.env.NEXT_PUBLIC_TESTNET_RPC_URL || "https://soroban-testnet.stellar.org",
    networkPassphrase: "Test SDF Network ; September 2015",
    contractId: process.env.NEXT_PUBLIC_TESTNET_CONTRACT_ID || "",
  },
  mainnet: {
    rpcUrl: process.env.NEXT_PUBLIC_MAINNET_RPC_URL || "https://soroban-mainnet.stellar.org",
    networkPassphrase: "Public Global Stellar Network ; September 2015",
    contractId: process.env.NEXT_PUBLIC_MAINNET_CONTRACT_ID || "",
  },
};

let currentClient: SoroSaveClient;
let currentNetwork: NetworkType = "testnet";

// Initialize with testnet by default
if (typeof window !== "undefined") {
  const savedNetwork = localStorage.getItem("sorosave_network") as NetworkType | null;
  currentNetwork = savedNetwork || "testnet";
}

const config = NETWORK_CONFIGS[currentNetwork];
currentClient = new SoroSaveClient({
  contractId: config.contractId,
  rpcUrl: config.rpcUrl,
  networkPassphrase: config.networkPassphrase,
});

export function getCurrentNetwork(): NetworkType {
  return currentNetwork;
}

export function switchNetwork(network: NetworkType): void {
  currentNetwork = network;
  if (typeof window !== "undefined") {
    localStorage.setItem("sorosave_network", network);
  }
  
  const config = NETWORK_CONFIGS[network];
  currentClient = new SoroSaveClient({
    contractId: config.contractId,
    rpcUrl: config.rpcUrl,
    networkPassphrase: config.networkPassphrase,
  });
}

export function getSoroSaveClient(): SoroSaveClient {
  return currentClient;
}

export function getNetworkConfig(network: NetworkType): NetworkConfig {
  return NETWORK_CONFIGS[network];
}

// Legacy exports for backward compatibility
export const sorosaveClient = currentClient;
export const TESTNET_RPC_URL = NETWORK_CONFIGS.testnet.rpcUrl;
export const NETWORK_PASSPHRASE = NETWORK_CONFIGS.testnet.networkPassphrase;
export const CONTRACT_ID = NETWORK_CONFIGS.testnet.contractId;
