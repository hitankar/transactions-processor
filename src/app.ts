import { TransactionProcessor } from './lib/transaction';
import logger from './lib/logger';
import Store from './lib/persistence/store';
import InMemoryAdapter from './lib/persistence/adapter/in-memory.adapter';
import { Transaction } from 'transaction';

const urlRoot = 'https://resttest.bench.co/transactions';

(async (): Promise<void> => {
  try {

    // new store instance with in memory adapter.
    // We can use Redis by implementing a RedisAdapter and passing it in the constructor
    const store = new Store<Transaction>('transactions', new InMemoryAdapter());
    const transactionProcessor = new TransactionProcessor(urlRoot, store);
    
    await transactionProcessor.getTransactionPage();
    const dailyBalances = await transactionProcessor.process();

    for (const balance of dailyBalances.entries()) {
      logger.info(`| ${balance[0]} | ${balance[1].toFixed(2)}`);
    }
  } catch (e) {
    throw new Error(e);
  }
})();
