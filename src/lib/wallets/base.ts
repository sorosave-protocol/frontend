export interface WalletAdapter {
  id: string;
  name: string;
  icon: string | React.ReactNode;
  isInstalled(): Promise<boolean>;
  connect(): Promise<string>;
  getPublicKey(): Promise<string | null>;
  signTransaction(xdr: string, networkPassphrase?: string): Promise<string>;
}
