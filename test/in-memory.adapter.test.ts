import InMemoryAdapter from '../src/lib/persistence/adapter/in-memory.adapter';
import { Transaction } from '../src/types/transaction';

describe('InMemoryAdapter class', () => {
  test('Instantiate adapter', async () => {
    const adapter = new InMemoryAdapter();
    expect(adapter).toBeInstanceOf(InMemoryAdapter);
  });

  test('Setting a value with set() can be retrieved with get()', async () => {
    const adapter = new InMemoryAdapter<Transaction[]>();
    const data = [
      {
        Date: '2013-12-12',
        Ledger: 'Office Expense',
        Amount: '-25.05',
        Company: 'AA OFFICE SUPPLIES',
      },
    ];
    await adapter.set('key', data);
    const value = await adapter.get('key');
    expect(value).toEqual(data);
  });
});
