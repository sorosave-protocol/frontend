export interface WalletAdapter {
  id: string;
  name: string;
  icon: string;
  url: string;
  isInstalled(): Promise<boolean>;
  connect(): Promise<string | null>;
  disconnect(): Promise<void>;
  getPublicKey(): Promise<string | null>;
}
