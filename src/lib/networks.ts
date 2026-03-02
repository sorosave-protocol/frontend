/**
 * Network Configuration
 * Support for Stellar Testnet and Mainnet
 * Issue: #80
 */

export type Network = 'testnet' | 'mainnet';

export interface NetworkConfig {
  name: string;
  rpcUrl: string;
  networkPassphrase: string;
  contractId: string;
}

export const NETWORKS: Record<Network, NetworkConfig> = {
  testnet: {
    name: 'Testnet',
    rpcUrl: process.env.NEXT_PUBLIC_TESTNET_RPC_URL || 'https://soroban-testnet.stellar.org',
    networkPassphrase: 'Test SDF Network ; September 2015',
    contractId: process.env.NEXT_PUBLIC_TESTNET_CONTRACT_ID || '',
  },
  mainnet: {
    name: 'Mainnet',
    rpcUrl: process.env.NEXT_PUBLIC_MAINNET_RPC_URL || 'https://soroban-mainnet.stellar.org',
    networkPassphrase: 'Public Global Stellar Network ; September 2015',
    contractId: process.env.NEXT_PUBLIC_MAINNET_CONTRACT_ID || '',
  },
};

const NETWORK_STORAGE_KEY = 'sorosave_network';

// Get current network from localStorage or default to testnet
export function getStoredNetwork(): Network {
  if (typeof window === 'undefined') return 'testnet';
  
  const stored = localStorage.getItem(NETWORK_STORAGE_KEY);
  if (stored === 'testnet' || stored === 'mainnet') {
    return stored;
  }
  return 'testnet';
}

// Store network selection in localStorage
export function setStoredNetwork(network: Network): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(NETWORK_STORAGE_KEY, network);
}

// Get config for a network
export function getNetworkConfig(network: Network): NetworkConfig {
  return NETWORKS[network];
}

// Get current network config
export function getCurrentNetworkConfig(): NetworkConfig {
  return getNetworkConfig(getStoredNetwork());
}

// Clear cached data when switching networks
export function clearNetworkCache(): void {
  if (typeof window === 'undefined') return;
  
  // Clear any cached contract data
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith('sorosave_cache_')) {
      localStorage.removeItem(key);
    }
  });
}
