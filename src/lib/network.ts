/**
 * Network configuration for Stellar Testnet and Mainnet.
 * Provides network definitions, persistence, and helpers for switching
 * between networks in the SoroSave frontend.
 */

export type NetworkId = "testnet" | "mainnet";

export interface NetworkConfig {
  id: NetworkId;
  name: string;
  rpcUrl: string;
  networkPassphrase: string;
  horizonUrl: string;
  contractId: string;
}

const NETWORKS: Record<NetworkId, NetworkConfig> = {
  testnet: {
    id: "testnet",
    name: "Testnet",
    rpcUrl:
      process.env.NEXT_PUBLIC_TESTNET_RPC_URL ||
      "https://soroban-testnet.stellar.org",
    networkPassphrase: "Test SDF Network ; September 2015",
    horizonUrl: "https://horizon-testnet.stellar.org",
    contractId: process.env.NEXT_PUBLIC_TESTNET_CONTRACT_ID || "",
  },
  mainnet: {
    id: "mainnet",
    name: "Mainnet",
    rpcUrl:
      process.env.NEXT_PUBLIC_MAINNET_RPC_URL ||
      "https://soroban.stellar.org",
    networkPassphrase: "Public Global Stellar Network ; September 2015",
    horizonUrl: "https://horizon.stellar.org",
    contractId: process.env.NEXT_PUBLIC_MAINNET_CONTRACT_ID || "",
  },
};

const STORAGE_KEY = "sorosave_selected_network";

/**
 * Retrieve the full config for a given network ID.
 */
export function getNetworkConfig(id: NetworkId): NetworkConfig {
  return NETWORKS[id];
}

/**
 * Return all available networks.
 */
export function getAllNetworks(): NetworkConfig[] {
  return Object.values(NETWORKS);
}

/**
 * Persist the selected network in localStorage.
 */
export function saveSelectedNetwork(id: NetworkId): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, id);
  }
}

/**
 * Load the previously selected network from localStorage, defaulting to testnet.
 */
export function loadSelectedNetwork(): NetworkId {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "testnet" || stored === "mainnet") {
      return stored;
    }
  }
  return "testnet";
}
