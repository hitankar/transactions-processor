import axios from 'axios';
import logger from './logger';

/**
 * wrapper function to get and pass urlRoot
 * @param urlRoot base url of API endpoint
 * @returns hash-map of transaction date and balance
 */
export const getTransactions = async (urlRoot: string): Promise<Map<string, number>> => {


  const transactions: Transaction[] = [];
  

  /**
   * Recursive function to fetch from API until the last page is read.
   * Time Complexity: O(n * m) n = no. of pages, m = no. of transactions per page.
   * 
   * @param page page to fetch. by default page = 1
   * @param processed number of transactions read
   * @returns void
   */
  const getTransactionPage = async (page: number = 1, processed: number = 0): Promise<void> => {
  
    try {
      const { data } = await axios.get<TransactionPage>(`${urlRoot}/${page}.json`);
      if(data.totalCount === 0) return;

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
  return await process(transactions);

};

/**
 * Accepts transactions, processes to return a hashmap of daily balances
 * @param transactions transactions to calculate balances
 * @returns HashMap of daily balances
 */
export const process = async (transactions: Transaction[]): Promise<Map<string, number>> => {

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