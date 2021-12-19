import {getTransactions, process} from '../src/transaction';
import axios from './__mocks__/axios';
import * as mockedResponsePage1 from './data/page1.json';
import * as mockedResponsePage2 from './data/page2.json';
import * as nodata from './data/nodata.json';


describe('prcesse transactions', () => {

  it('should return a hash map', async () => {
    const data = [
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
    const map = new Map<string, number>([
      ['2013-12-12', -45.05],
      ['2013-12-13', -10.5],
      ['2013-12-14', 25]
    ]);
    const value = process(data);
    expect(value).toEqual(map);
  });
});

describe('fetch each transaction page', () => {


  it('calculate total', async () => {

    axios.get.mockImplementationOnce( async () =>
      Promise.resolve({data: mockedResponsePage1})
    ).mockImplementationOnce( async () => Promise.resolve({data: mockedResponsePage2}));

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

    axios.get.mockImplementationOnce( async () => Promise.resolve({data: nodata}));

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