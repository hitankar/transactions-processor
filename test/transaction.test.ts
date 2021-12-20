import { TransactionProcessor } from '../src/lib/transaction';
import * as mockedPage1 from './fixtures/page-1.json';
import * as mockedPage2 from './fixtures/page-2.json';
import * as mockedNoTransactions from './fixtures/no-transactions.json';
import axios from './__mocks__/axios';
import Store from './__mocks__/store';

describe('Transaction processor', () => {
  jest.mock('../src/lib/persistence/store');

  beforeEach(() => {
    Store.mockClear();
  });

  afterEach(() => {
    axios.get.mockRestore();
    Store.mockRestore();
  });

  test('instatiate class', async () => {
    const store = new Store();
    const t = new TransactionProcessor('http://root', store);
    expect(t).toBeInstanceOf(TransactionProcessor);
    Store.mockRestore();
  });

  test('process method returns map of daily balances', async () => {
    Store.mockImplementationOnce(() => {
      const mockedTransactions = [
        {
          Date: '2013-12-12',
          Ledger: 'Office Expense',
          Amount: '-25.05',
          Company: 'AA OFFICE SUPPLIES',
        },
        {
          Date: '2013-12-12',
          Ledger: 'Insurance Expense',
          Amount: '-20',
          Company: 'AA OFFICE SUPPLIES',
        },
        {
          Date: '2013-12-13',
          Ledger: 'Business Meals & Entertainment Expense',
          Amount: '-10.5',
          Company: 'MCDONALDS RESTAURANT',
        },
        {
          Date: '2013-12-14',
          Ledger: 'Credit Card - 1234',
          Amount: '25',
          Company: 'PAYMENT - THANK YOU',
        },
      ];

      return {
        getAll: jest.fn().mockResolvedValue(mockedTransactions),
      };
    });
    const store = new Store();
    const t = new TransactionProcessor('http://root', store);
    const value = await t.process();

    const map = new Map<string, number>([
      ['2013-12-12', -45.05],
      ['2013-12-13', -10.5],
      ['2013-12-14', 25],
    ]);

    expect(value).toEqual(map);
    Store.mockRestore();
  });

  test('getTransactionPage should fetch each page', async () => {
    axios.get
      .mockImplementationOnce(
        async () => await Promise.resolve({ data: mockedPage1 })
      )
      .mockImplementationOnce(
        async () => await Promise.resolve({ data: mockedPage2 })
      );

    Store.mockImplementationOnce(() => {
      return {
        append: jest.fn(),
      };
    });

    const store = new Store();
    const t = new TransactionProcessor('http://root', store);

    jest.spyOn(t, 'getTransactionPage');
    await t.getTransactionPage();
    expect(t.getTransactionPage).toBeCalledTimes(2);
    expect(t.getTransactionPage).toHaveBeenLastCalledWith(2, 4);
    axios.get.mockRestore();
    Store.mockRestore();
  });

  it('process method should return empty map if no transactions are received', async () => {
    axios.get.mockImplementationOnce(
      async () => await Promise.resolve({ data: mockedNoTransactions })
    );

    Store.mockImplementationOnce(() => {
      return {
        append: jest.fn(),
        getAll: jest.fn().mockResolvedValueOnce([]),
      };
    });

    const store = new Store();
    const t = new TransactionProcessor('http://root', store);

    await t.getTransactionPage();
    const result = await t.process();

    const response = new Map<string, number>([]);

    expect(result).toEqual(response);
    axios.get.mockRestore();
  });

  test('axios error should invoke process method', async () => {
    axios.get.mockImplementationOnce(async () => {
      throw new Error();
    });

    Store.mockImplementationOnce(() => {
      return {
        append: jest.fn(),
        getAll: jest.fn().mockResolvedValueOnce([]),
      };
    });

    const store = new Store();
    const t = new TransactionProcessor('http://root', store);

    jest.spyOn(t, 'process');
    await t.getTransactionPage();

    const result = await t.process();

    const response = new Map<string, number>([]);

    expect(t.process).toBeCalled();
    expect(result).toEqual(response);
    axios.get.mockRestore();
    Store.mockRestore();
  });
});
