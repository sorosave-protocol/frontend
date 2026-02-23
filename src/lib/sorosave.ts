// Mock sorosave client - would be imported from SDK in production
const TESTNET_RPC_URL =
  process.env.NEXT_PUBLIC_RPC_URL || "https://soroban-testnet.stellar.org";
const NETWORK_PASSPHRASE =
  process.env.NEXT_PUBLIC_NETWORK_PASSPHRASE || "Test SDF Network ; September 2015";
const CONTRACT_ID = process.env.NEXT_PUBLIC_CONTRACT_ID || "";

// Mock client - just for type compatibility
export const sorosaveClient = {
  createGroup: async () => ({ toXDR: () => "" }),
  contribute: async () => ({ toXDR: () => "" }),
};

export { TESTNET_RPC_URL, NETWORK_PASSPHRASE, CONTRACT_ID };
