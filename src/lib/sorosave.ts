import { SoroSaveClient } from "@sorosave/sdk";
import { getNetworkConfig, loadSelectedNetwork, type NetworkConfig } from "./network";

/**
 * Create a SoroSaveClient configured for the given network.
 * Falls back to env vars for backwards compatibility when no network is provided.
 */
export function createSoroSaveClient(network?: NetworkConfig): SoroSaveClient {
  const config = network ?? getNetworkConfig(loadSelectedNetwork());

  return new SoroSaveClient({
    contractId: config.contractId,
    rpcUrl: config.rpcUrl,
    networkPassphrase: config.networkPassphrase,
  });
}

// Default client — uses the persisted network selection.
// Components that are network-aware should prefer calling createSoroSaveClient()
// with the network from useNetwork() instead.
export const sorosaveClient = createSoroSaveClient();

// Re-export for backwards compatibility
const fallbackConfig = getNetworkConfig(loadSelectedNetwork());
export const TESTNET_RPC_URL = fallbackConfig.rpcUrl;
export const NETWORK_PASSPHRASE = fallbackConfig.networkPassphrase;
export const CONTRACT_ID = fallbackConfig.contractId;
