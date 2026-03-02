import { getStoredNetwork, NETWORKS } from './network';

export function getRpcUrl(): string {
  const network = getStoredNetwork();
  return NETWORKS[network].rpcUrl;
}

export function getContractId(): string {
  const network = getStoredNetwork();
  return NETWORKS[network].contractId;
}

export function getNetworkPassphrase(): string {
  const network = getStoredNetwork();
  return NETWORKS[network].passphrase;
}
