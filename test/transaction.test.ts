import {getTransactions, process} from '../src/transaction';
import * as mockedPage1 from './fixtures/page-1.json';
import * as mockedPage2 from './fixtures/page-2.json';
import * as mockedNoTransactions from './fixtures/no-transactions.json';
import axios from './__mocks__/axios';

describe('prcesse transactions', () => {

  it('should return a hash map', async () => {

    const mockedTransactions = [
      {
        'Date': '2013-12-12',
        'Ledger': 'Office Expense',
        'Amount': '-25.05',
        'Company': 'AA OFFICE SUPPLIES'
      },
      {
        'Date': '2013-12-12',
        'Ledger': 'Insurance Expense',
        'Amount': '-20',
        'Company': 'AA OFFICE SUPPLIES'
      },
      {
        'Date': '2013-12-13',
        'Ledger': 'Business Meals & Entertainment Expense',
        'Amount': '-10.5',
        'Company': 'MCDONALDS RESTAURANT'
      },
      {
        'Date': '2013-12-14',
        'Ledger': 'Credit Card - 1234',
        'Amount': '25',
        'Company': 'PAYMENT - THANK YOU'
      }
    ];
  
    const value = await process(mockedTransactions);

    const map = new Map<string, number>([
      ['2013-12-12', -45.05],
      ['2013-12-13', -10.5],
      ['2013-12-14', 25]
    ]);


    expect(value).toEqual(map);
  });
});

describe('fetch each transaction page', () => {


  it('calculate total', async () => {

    axios.get.mockImplementationOnce( async () =>
      await Promise.resolve({data: mockedPage1})
    ).mockImplementationOnce( async () => await Promise.resolve({data: mockedPage2}));

    const result = await getTransactions('http://apiRoot');

    const response = new Map<string, number>([                                                                                                                                                                                         
      [ '2013-12-12', -45.05 ],
      [ '2013-12-13', -10.5 ],
      [ '2013-12-14', -21.6 ]
    ]);


    expect(result).toEqual(response);
    axios.get.mockRestore();
  });

  it('should not fail with transaction array is empty', async () => {

    axios.get.mockImplementationOnce( async () => await Promise.resolve({data: mockedNoTransactions}));

    const result = await getTransactions('http://apiRoot');

    const response = new Map<string, number>([]);


    expect(result).toEqual(response);
    axios.get.mockRestore();
  });

  it('axios throw error', async () => {
    axios.get.mockImplementationOnce( async () => {
      throw new Error();
    });

    const result = await getTransactions('http://apiRoot');

    const response = new Map<string, number>([]);


    expect(result).toEqual(response);
    axios.get.mockRestore();

  });

});