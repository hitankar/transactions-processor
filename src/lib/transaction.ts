import axios from 'axios';
import logger from './logger';
import Store from './persistence/store';
import { DailyBalances, Transaction, TransactionPage } from 'transaction';

export class TransactionProcessor {
  public constructor(
    private readonly urlRoot: string,
    private readonly store: Store<Transaction>
  ) {}

  /**
   * Recursive function to fetch from API until the last page is read.
   * Time Complexity: O(n * m) n = no. of pages, m = no. of transactions per page.
   *
   * @param page page to fetch. by default page = 1
   * @param processed number of transactions read
   * @returns void
   */
  public async getTransactionPage(
    page: number = 1,
    processed: number = 0
  ): Promise<void> {
    try {
      const { data } = await axios.get<TransactionPage>(
        `${this.urlRoot}/${page}.json`
      );

      if (data.totalCount === 0) return;

      processed = processed + data.transactions?.length;

      // add to existing data
      await this.store.append(data.transactions);

      if (processed < data.totalCount) {
        await this.getTransactionPage(++page, processed);
      }
    } catch (e) {
      logger.error(JSON.stringify(e));
    }
  }

  /**
   * Accepts transactions, processes to return a hashmap of daily balances
   * @param transactions transactions to calculate balances
   * @returns HashMap of daily balances
   */
  public async process(): Promise<DailyBalances> {
    const transactions = await this.store.getAll();

    const map = new Map<string, number>();

    transactions?.forEach((t) => {
      let amount = parseFloat(t.Amount);

      if (map.has(t.Date)) {
        amount += map.get(t.Date);
      }

      map.set(t.Date, amount);
    });

    return map;
  }
}
