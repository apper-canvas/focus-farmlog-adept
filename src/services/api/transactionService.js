import transactionsData from "../mockData/transactions.json";

class TransactionService {
  constructor() {
    this.transactions = [...transactionsData];
  }

  async getAll() {
    await this.delay();
    return [...this.transactions];
  }

  async getById(id) {
    await this.delay();
    const transaction = this.transactions.find(t => t.Id === id);
    if (!transaction) throw new Error("Transaction not found");
    return { ...transaction };
  }

  async getByFarm(farmId) {
    await this.delay();
    return this.transactions.filter(t => t.farmId === farmId).map(t => ({ ...t }));
  }

  async getByType(type) {
    await this.delay();
    return this.transactions.filter(t => t.type === type).map(t => ({ ...t }));
  }

  async create(transactionData) {
    await this.delay();
    const newId = Math.max(...this.transactions.map(t => t.Id)) + 1;
    const newTransaction = {
      ...transactionData,
      Id: newId,
      farmId: parseInt(transactionData.farmId),
      amount: parseFloat(transactionData.amount)
    };
    this.transactions.push(newTransaction);
    return { ...newTransaction };
  }

  async update(id, transactionData) {
    await this.delay();
    const index = this.transactions.findIndex(t => t.Id === id);
    if (index === -1) throw new Error("Transaction not found");
    
    this.transactions[index] = {
      ...transactionData,
      Id: id,
      farmId: parseInt(transactionData.farmId),
      amount: parseFloat(transactionData.amount)
    };
    return { ...this.transactions[index] };
  }

  async delete(id) {
    await this.delay();
    const index = this.transactions.findIndex(t => t.Id === id);
    if (index === -1) throw new Error("Transaction not found");
    
    this.transactions.splice(index, 1);
    return true;
  }

  delay() {
    return new Promise(resolve => setTimeout(resolve, 300));
  }
}

export const transactionService = new TransactionService();