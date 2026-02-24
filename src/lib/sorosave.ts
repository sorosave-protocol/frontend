import { SoroSaveClient } from "@/lib/sdk";
import { NETWORK_CONFIG, Network } from "@/components/NetworkSwitcher";

function getNetwork(): Network {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("sorosave_network") as Network | null;
    if (stored === "mainnet" || stored === "testnet") return stored;
  }
  return "testnet";
}

function getConfig() {
  return NETWORK_CONFIG[getNetwork()];
}

export function getSorosaveClient() {
  const config = getConfig();
  return new SoroSaveClient({
    contractId: config.contractId,
    rpcUrl: config.rpcUrl,
    networkPassphrase: config.passphrase,
  });
}

// Legacy named exports for backward compat
export const sorosaveClient = new SoroSaveClient({
  contractId: NETWORK_CONFIG.testnet.contractId,
  rpcUrl: NETWORK_CONFIG.testnet.rpcUrl,
  networkPassphrase: NETWORK_CONFIG.testnet.passphrase,
});

export const NETWORK_PASSPHRASE = NETWORK_CONFIG.testnet.passphrase;
export const TESTNET_RPC_URL = NETWORK_CONFIG.testnet.rpcUrl;
export const CONTRACT_ID = NETWORK_CONFIG.testnet.contractId;
