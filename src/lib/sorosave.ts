import { SoroSaveClient } from "@sorosave/sdk";

const TESTNET_RPC_URL = "https://soroban-testnet.stellar.org";
const MAINNET_RPC_URL = "https://soroban-mainnet.stellar.org";
const TESTNET_NETWORK_PASSPHRASE = "Test SDF Network ; September 2015";
const MAINNET_NETWORK_PASSPHRASE = "Public Global Stellar Network ; September 2015";
const TESTNET_CONTRACT_ID = "";
const MAINNET_CONTRACT_ID = "";

export const NETWORKS = {
  TESTNET: {
    rpcUrl: TESTNET_RPC_URL,
    networkPassphrase: TESTNET_NETWORK_PASSPHRASE,
    contractId: TESTNET_CONTRACT_ID,
  },
  MAINNET: {
    rpcUrl: MAINNET_RPC_URL,
    networkPassphrase: MAINNET_NETWORK_PASSPHRASE,
    contractId: MAINNET_CONTRACT_ID,
  },
};

const DEFAULT_NETWORK = "TESTNET";

const getNetworkFromLocalStorage = (): keyof typeof NETWORKS => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("sorosave_network");
    if (saved === "MAINNET" || saved === "TESTNET") {
      return saved;
    }
  }
  return DEFAULT_NETWORK;
};

const getNetworkConfig = () => {
  const network = getNetworkFromLocalStorage();
  return NETWORKS[network];
};

let currentNetwork: keyof typeof NETWORKS = getNetworkFromLocalStorage();

const updateNetwork = (network: keyof typeof NETWORKS) => {
  currentNetwork = network;
  if (typeof window !== "undefined") {
    localStorage.setItem("sorosave_network", network);
  }
};

export const getCurrentNetwork = () => currentNetwork;

export const getSoroSaveClient = () => {
  const config = getNetworkConfig();
  return new SoroSaveClient({
    contractId: config.contractId,
    rpcUrl: config.rpcUrl,
    networkPassphrase: config.networkPassphrase,
  });
};

export const switchNetwork = (network: keyof typeof NETWORKS) => {
  updateNetwork(network);
};

export {
  TESTNET_RPC_URL,
  MAINNET_RPC_URL,
  TESTNET_NETWORK_PASSPHRASE,
  MAINNET_NETWORK_PASSPHRASE,
  TESTNET_CONTRACT_ID,
  MAINNET_CONTRACT_ID,
};