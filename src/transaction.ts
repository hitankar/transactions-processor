import axios from 'axios';
import logger from './logger';

export const getTransactions = async (urlRoot: string): Promise<Map<string, number>> => {


  const transactions: Transaction[] = [];
  

  const getTransactionPage = async (page: number = 1, processed: number = 0): Promise<void> => {
  
    try {
      const { data } = await axios.get<TransactionPage>(`${urlRoot}/${page}.json`);
      processed = processed + data.transactions?.length; 
      transactions.push(...data.transactions);
    
      if (processed < data.totalCount) {
        await getTransactionPage(++page, processed) ;
      }
    } catch (e) {
      logger.warn(e);
    }
    
  };

  await getTransactionPage();
  return process(transactions);

};

export const process = (transactions: Transaction[]): Map<string, number> => {

  const map = new Map<string, number>();
  transactions.forEach(t => { 
    let amount = parseFloat(t.Amount);

    if (map.has(t.Date)) {
      amount += map.get(t.Date);
    }

    map.set(t.Date, amount);
  });

  return map;

};