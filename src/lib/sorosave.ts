import { SoroSaveClient } from "@sorosave/sdk";

// Definição das configurações de cada rede
const NETWORKS = {
  testnet: {
    rpc: process.env.NEXT_PUBLIC_RPC_URL || "https://soroban-testnet.stellar.org",
    pass: process.env.NEXT_PUBLIC_NETWORK_PASSPHRASE || "Test SDF Network ; September 2015",
    contractId: process.env.NEXT_PUBLIC_CONTRACT_ID || ""
  },
  mainnet: {
    rpc: process.env.NEXT_PUBLIC_MAINNET_RPC_URL || "https://mainnet.stellar.org",
    pass: process.env.NEXT_PUBLIC_MAINNET_NETWORK_PASSPHRASE || "Public Global Stellar Network ; November 2015",
    contractId: process.env.NEXT_PUBLIC_MAINNET_CONTRACT_ID || ""
  }
};

// Lógica de leitura segura do localStorage
const getSelectedNetwork = (): "testnet" | "mainnet" => {
  if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
    return (localStorage.getItem("selected_network") as "testnet" | "mainnet") || "testnet";
  }
  return "testnet";
};

const network = getSelectedNetwork();
const config = NETWORKS[network];

export const sorosaveClient = new SoroSaveClient({
  contractId: config.contractId,
  rpcUrl: config.rpc,
  networkPassphrase: config.pass,
});

// Exporta as variáveis para o restante da aplicação usar
export const TESTNET_RPC_URL = config.rpc;
export const NETWORK_PASSPHRASE = config.pass;
export const CONTRACT_ID = config.contractId;
