import Store from '../src/lib/persistence/store';
import { Transaction } from '../src/types/transaction';
import transactions from './fixtures/transactions';
import InMemoryAdapter from './__mocks__/in-memory.adapter';

describe('Store', () => {
  jest.mock('../src/lib/persistence/adapter/in-memory.adapter');

  beforeEach(() => {
    InMemoryAdapter.mockClear();
    InMemoryAdapter.mockImplementationOnce(() => {
      return {
        get: jest.fn().mockImplementationOnce(() => transactions),
        set: jest.fn(),
      };
    });
  });

  afterEach(() => {
    InMemoryAdapter.mockRestore();
  });

  test('Instantiate store', async () => {
    const adapter = new InMemoryAdapter();
    const s = new Store('keyName', adapter);
    expect(s).toBeInstanceOf(Store);
    InMemoryAdapter.mockRestore();
  });

  test('append method', async () => {
    const adapter = new InMemoryAdapter();
    const s = new Store<Transaction>('keyName', adapter);

    jest.spyOn(s, 'append');
    await s.append(transactions);
    expect(s.append).toBeCalled();
    expect(s.append).toHaveBeenCalledWith(transactions);
  });

  test('getAll returns data based on key', async () => {
    const adapter = new InMemoryAdapter();
    const s = new Store<Transaction>('keyName', adapter);

    jest.spyOn(s, 'getAll');
    const result = await s.getAll();
    expect(s.getAll).toBeCalled();
    expect(result).toEqual(transactions);
  });
});
