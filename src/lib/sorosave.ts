import { SoroSaveClient } from "@/lib/sdk";

const TESTNET_RPC_URL =
  process.env.NEXT_PUBLIC_RPC_URL || "https://soroban-testnet.stellar.org";
const NETWORK_PASSPHRASE =
  process.env.NEXT_PUBLIC_NETWORK_PASSPHRASE || "Test SDF Network ; September 2015";
const CONTRACT_ID = process.env.NEXT_PUBLIC_CONTRACT_ID || "";

export const sorosaveClient = new SoroSaveClient({
  contractId: CONTRACT_ID,
  rpcUrl: TESTNET_RPC_URL,
  networkPassphrase: NETWORK_PASSPHRASE,
});

export { TESTNET_RPC_URL, NETWORK_PASSPHRASE, CONTRACT_ID };
