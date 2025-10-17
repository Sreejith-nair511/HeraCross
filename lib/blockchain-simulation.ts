/**
 * Simulated blockchain utility for reward system
 * This is a simplified simulation for demonstration purposes
 */

interface Transaction {
  id: string;
  from: string;
  to: string;
  amount: number;
  currency: string;
  timestamp: number;
  description: string;
  status: 'pending' | 'confirmed' | 'failed';
}

interface Wallet {
  address: string;
  balance: number;
  currency: string;
  transactions: Transaction[];
}

interface Reward {
  id: string;
  userId: string;
  points: number;
  amount: number;
  currency: string;
  description: string;
  timestamp: number;
  status: 'pending' | 'processed' | 'claimed';
}

class BlockchainSimulation {
  private wallets: Map<string, Wallet> = new Map();
  private transactions: Transaction[] = [];
  private rewards: Reward[] = [];
  private rewardRate = 0.1; // 0.1 currency unit per point

  constructor() {
    // Initialize with some sample wallets
    this.createWallet('user-001', 100);
    this.createWallet('user-002', 50);
    this.createWallet('opencity-rewards', 10000);
  }

  /**
   * Create a new wallet
   */
  createWallet(address: string, initialBalance: number = 0): Wallet {
    const wallet: Wallet = {
      address,
      balance: initialBalance,
      currency: 'OCOIN',
      transactions: []
    };
    this.wallets.set(address, wallet);
    return wallet;
  }

  /**
   * Get wallet balance
   */
  getBalance(address: string): number {
    const wallet = this.wallets.get(address);
    return wallet ? wallet.balance : 0;
  }

  /**
   * Transfer funds between wallets
   */
  transfer(from: string, to: string, amount: number, description: string = ''): Transaction | null {
    const fromWallet = this.wallets.get(from);
    const toWallet = this.wallets.get(to);

    if (!fromWallet || !toWallet) {
      console.error('Wallet not found');
      return null;
    }

    if (fromWallet.balance < amount) {
      console.error('Insufficient balance');
      return null;
    }

    // Create transaction
    const transaction: Transaction = {
      id: `tx-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      from,
      to,
      amount,
      currency: fromWallet.currency,
      timestamp: Date.now(),
      description,
      status: 'pending'
    };

    // Process transaction
    fromWallet.balance -= amount;
    toWallet.balance += amount;

    // Add to transaction history
    fromWallet.transactions.push(transaction);
    toWallet.transactions.push(transaction);
    this.transactions.push(transaction);

    // Confirm transaction
    transaction.status = 'confirmed';

    return transaction;
  }

  /**
   * Create a reward for a user
   */
  createReward(userId: string, points: number, description: string = ''): Reward | null {
    const amount = points * this.rewardRate;
    
    const reward: Reward = {
      id: `reward-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      userId,
      points,
      amount,
      currency: 'OCOIN',
      description,
      timestamp: Date.now(),
      status: 'pending'
    };

    this.rewards.push(reward);
    return reward;
  }

  /**
   * Claim a reward
   */
  claimReward(rewardId: string, userAddress: string): Transaction | null {
    const reward = this.rewards.find(r => r.id === rewardId);
    
    if (!reward) {
      console.error('Reward not found');
      return null;
    }

    if (reward.status !== 'pending') {
      console.error('Reward already claimed or processed');
      return null;
    }

    // Process reward
    reward.status = 'claimed';
    
    // Transfer reward amount to user
    const transaction = this.transfer('opencity-rewards', userAddress, reward.amount, reward.description);
    
    return transaction;
  }

  /**
   * Get user rewards
   */
  getUserRewards(userId: string): Reward[] {
    return this.rewards.filter(r => r.userId === userId);
  }

  /**
   * Get transaction history
   */
  getTransactionHistory(address: string): Transaction[] {
    const wallet = this.wallets.get(address);
    return wallet ? wallet.transactions : [];
  }

  /**
   * Get all rewards
   */
  getAllRewards(): Reward[] {
    return [...this.rewards];
  }

  /**
   * Get wallet information
   */
  getWallet(address: string): Wallet | undefined {
    return this.wallets.get(address);
  }

  /**
   * Simulate blockchain confirmation delay
   */
  async simulateConfirmation(): Promise<void> {
    // In a real blockchain, this would take time
    return new Promise(resolve => setTimeout(resolve, 1000));
  }
}

// Export a singleton instance
export const blockchain = new BlockchainSimulation();

// Export types
export type { Transaction, Wallet, Reward };