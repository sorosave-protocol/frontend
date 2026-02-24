import { getActiveWalletAdapter } from "@/app/providers";

export async function signTransaction(
  xdr: string,
  networkPassphrase: string
): Promise<string> {
  // Route to active wallet adapter if available
  const adapter = getActiveWalletAdapter?.();
  if (!adapter) throw new Error("No wallet connected");

  // Freighter: window.freighter.signTransaction
  if (adapter.id === "freighter") {
    const { signTransaction: freighterSign } = await import("@stellar/freighter-api");
    const result = await freighterSign(xdr, { networkPassphrase });
    return result;
  }

  // xBull
  if (adapter.id === "xbull" && typeof window !== "undefined" && (window as any).xBullSDK) {
    return await (window as any).xBullSDK.sign({ xdr, network: networkPassphrase });
  }

  // Albedo
  if (adapter.id === "albedo") {
    const albedo = (await import("@albedo-link/intent")).default;
    const res = await albedo.tx({ xdr, network: networkPassphrase === "Public Global Stellar Network ; September 2015" ? "public" : "testnet" });
    return res.signed_envelope_xdr;
  }

  throw new Error(`signTransaction not implemented for wallet: ${adapter.id}`);
}
