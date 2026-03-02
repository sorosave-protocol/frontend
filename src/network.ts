export type NetworkType = 'mainnet' | 'testnet';

export interface NetworkConfig {
  name: string;
  rpcUrl: string;
  contractId: string;
  passphrase: string;
}

export const NETWORKS: Record<NetworkType, NetworkConfig> = {
  mainnet: {
    name: 'Mainnet',
    rpcUrl: 'https://horizon.stellar.org',
    contractId: process.env.NEXT_PUBLIC_MAINNET_CONTRACT_ID || '',
    passphrase: 'Public Global Stellar Network ; September 2015',
  },
  testnet: {
    name: 'Testnet',
    rpcUrl: 'https://horizon-testnet.stellar.org',
    contractId: process.env.NEXT_PUBLIC_TESTNET_CONTRACT_ID || '',
    passphrase: 'Test SDF Network ; September 2015',
  },
};

const STORAGE_KEY = 'sorosave-network';

export function getStoredNetwork(): NetworkType {
  if (typeof window === 'undefined') return 'testnet';
  const stored = localStorage.getItem(STORAGE_KEY);
  return (stored as NetworkType) || 'testnet';
}

export function setStoredNetwork(network: NetworkType): void {
  localStorage.setItem(STORAGE_KEY, network);
}

export function clearNetworkCache(): void {
  const keysToRemove = Object.keys(localStorage).filter(key => 
    key.startsWith('sorosave-') && key !== STORAGE_KEY
  );
  keysToRemove.forEach(key => localStorage.removeItem(key));
}
