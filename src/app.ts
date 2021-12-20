import { TransactionProcessor } from './lib/transaction';
import logger from './lib/logger';
import Store from './lib/persistence/store';
import InMemoryAdapter from './lib/persistence/adapter/in-memory.adapter';


const urlRoot = 'https://resttest.bench.co/transactions';

(async (): Promise<void> => {
  try {
    // const map =  await getTransactions(urlRoot);
    const store = new Store<Transaction>(
      'transactions',
      new InMemoryAdapter()
    );
    const transactionProcessor = new TransactionProcessor(urlRoot, store);
    await transactionProcessor.getTransactionPage();
    const map = await transactionProcessor.process();
    for (const t of map.entries()) {
      logger.log('info', `${t[0]} - ${t[1].toFixed(2)}`);
    }
  } catch (e) {
    throw new Error(e);
  }
  
})();