import { getTransactions } from './transaction';
import logger from './logger';


const urlRoot = 'https://resttest.bench.co/transactions';

(async (): Promise<void> => {
  try {
    const map =  await getTransactions(urlRoot);
    for (const t of map.entries()) {
      logger.log('info', `${t[0]} - ${t[1].toFixed(2)}`);
    }
  } catch (e) {
    logger.error(e);
  }
  
})();