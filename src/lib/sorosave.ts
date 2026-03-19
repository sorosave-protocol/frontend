import {
  SorobanRpc,
  Networks,
  TransactionBuilder,
  Operation,
  Asset,
  Keypair,
  Account,
  BASE_FEE,
  TimeoutInfinite,
  xdr,
  scValToNative,
  nativeToScVal,
  Address,
} from '@stellar/stellar-sdk';

export interface NetworkConfig {
  name: string;
  networkPassphrase: string;
  rpcUrl: string;
  contractId: string;
  explorerUrl: string;
}

export const NETWORKS: Record<string, NetworkConfig> = {
  testnet: {
    name: 'Testnet',
    networkPassphrase: Networks.TESTNET,
    rpcUrl: 'https://soroban-testnet.stellar.org',
    contractId: 'CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQAHHAGK23R2',
    explorerUrl: 'https://stellar.expert/explorer/testnet',
  },
  mainnet: {
    name: 'Mainnet',
    networkPassphrase: Networks.PUBLIC,
    rpcUrl: 'https://mainnet.stellar.validationcloud.io/v1/rpc',
    contractId: 'CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD2KM',
    explorerUrl: 'https://stellar.expert/explorer/public',
  },
};

export class SoroSaveClient {
  private rpc: SorobanRpc.Server;
  private network: NetworkConfig;
  private contractId: string;

  constructor(networkName: string = 'testnet') {
    this.network = NETWORKS[networkName] || NETWORKS.testnet;
    this.rpc = new SorobanRpc.Server(this.network.rpcUrl);
    this.contractId = this.network.contractId;
  }

  async getAccount(publicKey: string): Promise<Account> {
    const account = await this.rpc.getAccount(publicKey);
    return new Account(account.accountId(), account.sequenceNumber());
  }

  async createSavingsGoal(
    userKeypair: Keypair,
    goalName: string,
    targetAmount: string,
    deadline: Date
  ) {
    try {
      const account = await this.getAccount(userKeypair.publicKey());
      
      const transaction = new TransactionBuilder(account, {
        fee: BASE_FEE,
        networkPassphrase: this.network.networkPassphrase,
      })
        .addOperation(
          Operation.invokeContract({
            contract: this.contractId,
            method: 'create_goal',
            args: [
              nativeToScVal(Address.fromString(userKeypair.publicKey())),
              nativeToScVal(goalName, { type: 'string' }),
              nativeToScVal(BigInt(target Amount), { type: 'i128' }),
              nativeToScVal(Math.floor(deadline.getTime() / 1000), { type: 'u64' }),
            ],
          })
        )
        .setTimeout(TimeoutInfinite)
        .build();

      transaction.sign(userKeypair);

      const result = await this.rpc.sendTransaction(transaction);
      return result;
    } catch (error) {
      console.error('Error creating savings goal:', error);
      throw error;
    }
  }

  async deposit(userKeypair: Keypair, goalId: string, amount: string) {
    try {
      const account = await this.getAccount(userKeypair.publicKey());
      
      const transaction = new TransactionBuilder(account, {
        fee: BASE_FEE,
        networkPassphrase: this.network.networkPassphrase,
      })
        .addOperation(
          Operation.invokeContract({
            contract: this.contractId,
            method: 'deposit',
            args: [
              nativeToScVal(Address.fromString(userKeypair.publicKey())),
              nativeToScVal(goalId, { type: 'string' }),
              nativeToScVal(BigInt(amount), { type: 'i128' }),
            ],
          })
        )
        .setTimeout(TimeoutInfinite)
        .build();

      transaction.sign(userKeypair);

      const result = await this.rpc.sendTransaction(transaction);
      return result;
    } catch (error) {
      console.error('Error depositing:', error);
      throw error;
    }
  }

  async withdraw(userKeypair: Keypair, goalId: string, amount: string) {
    try {
      const account = await this.getAccount(userKeypair.publicKey());
      
      const transaction = new TransactionBuilder(account, {
        fee: BASE_FEE,
        networkPassphrase: this.network.networkPassphrase,
      })
        .addOperation(
          Operation.invokeContract({
            contract: this.contractId,
            method: 'withdraw',
            args: [
              nativeToScVal(Address.fromString(userKeypair.publicKey())),
              nativeToScVal(goalId, { type: 'string' }),
              nativeToScVal(BigInt(amount), { type: 'i128' }),
            ],
          })
        )
        .setTimeout(TimeoutInfinite)
        .build();

      transaction.sign(userKeypair);

      const result = await this.rpc.sendTransaction(transaction);
      return result;
    } catch (error) {
      console.error('Error withdrawing:', error);
      throw error;
    }
  }

  async getUserGoals(userPublicKey: string) {
    try {
      const result = await this.rpc.simulateTransaction(
        new TransactionBuilder(await this.getAccount(userPublicKey), {
          fee: BASE_FEE,
          networkPassphrase: this.network.networkPassphrase,
        })
          .addOperation(
            Operation.invokeContract({
              contract: this.contractId,
              method: 'get_user_goals',
              args: [nativeToScVal(Address.fromString(userPublicKey))],
            })
          )
          .setTimeout(TimeoutInfinite)
          .build()
      );

      if (result.result?.retval) {
        return scValToNative(result.result.retval);
      }
      return [];
    } catch (error) {
      console.error('Error getting user goals:', error);
      throw error;
    }
  }

  async getGoalDetails(goalId: string) {
    try {
      const keypair = Keypair.random();
      const account = await this.getAccount(keypair.publicKey());
      
      const result = await this.rpc.simulateTransaction(
        new TransactionBuilder(account, {
          fee: BASE_FEE,
          networkPassphrase: this.network.networkPassphrase,
        })
          .addOperation(
            Operation.invokeContract({
              contract: this.contractId,
              method: 'get_goal',
              args: [nativeToScVal(goalId, { type: 'string' })],
            })
          )
          .setTimeout(TimeoutInfinite)
          .build()
      );

      if (result.result?.retval) {
        return scValToNative(result.result.retval);
      }
      return null;
    } catch (error) {
      console.error('Error getting goal details:', error);
      throw error;
    }
  }

  switchNetwork(networkName: string) {
    this.network = NETWORKS[networkName] || NETWORKS.testnet;
    this.rpc = new SorobanRpc.Server(this.network.rpcUrl);
    this.contractId = this.network.contractId;
  }

  getCurrentNetwork(): NetworkConfig {
    return this.network;
  }

  getAvailableNetworks(): NetworkConfig[] {
    return Object.values(NETWORKS);
  }
}

export const soroSaveClient = new SoroSaveClient();