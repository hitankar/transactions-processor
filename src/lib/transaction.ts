import axios from 'axios';
import logger from './logger';
import Store from './persistence/store';
import InMemoryAdapter from './persistence/adapter/in-memory.adapter';
import { Transaction, TransactionPage } from 'transaction';


export class TransactionProcessor {
  public constructor(
    private readonly urlRoot: string,
    private readonly store: Store<Transaction>,
  ) {}

  /**
   * Recursive function to fetch from API until the last page is read.
   * Time Complexity: O(n * m) n = no. of pages, m = no. of transactions per page.
   * 
   * @param page page to fetch. by default page = 1
   * @param processed number of transactions read
   * @returns void
   */
  public async getTransactionPage(page: number = 1, processed: number = 0): Promise<void> {
  
    try {
      const { data } = await axios.get<TransactionPage>(`${this.urlRoot}/${page}.json`);
      if(data.totalCount === 0) return;

      processed = processed + data.transactions?.length; 
      await this.store.append(data.transactions);

      if (processed < data.totalCount) {
        await this.getTransactionPage(++page, processed) ;
      }
    } catch (e) {
      logger.error(e);
    }
    
  }

  /**
 * Accepts transactions, processes to return a hashmap of daily balances
 * @param transactions transactions to calculate balances
 * @returns HashMap of daily balances
 */
  public async process(): Promise<Map<string, number>> {

    const transactions = await this.store.getAll();


    const map = new Map<string, number>();

    transactions.forEach(t => { 
      let amount = parseFloat(t.Amount);

      if (map.has(t.Date)) {
        amount += map.get(t.Date);
      }

      map.set(t.Date, amount);
    });

    return map;

  }
}

const store = new Store<Transaction>(
  'transactions',
  new InMemoryAdapter()
);

/**
 * wrapper function to get and pass urlRoot
 * @param urlRoot base url of API endpoint
 * @returns hash-map of transaction date and balance
 */
export const getTransactions = async (urlRoot: string): Promise<Map<string, number>> => {

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
      await store.append(data.transactions);
    
      if (processed < data.totalCount) {
        await getTransactionPage(++page, processed) ;
      }
    } catch (e) {
      logger.warn(e);
    }
    
  };

  await getTransactionPage();
  return await process(await store.getAll());

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