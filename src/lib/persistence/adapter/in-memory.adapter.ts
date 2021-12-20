import Adapter from './adapter';

/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * In memory implementation of data store. Data is stored in memory as a map
 */
export default class InMemoryAdapter<T> implements Adapter<T> {
  private data = new Map<string, T>();

  public async get(key: string): Promise<T> {
    if (!this.data.has(key)) {
      return;
    }
    return this.data.get(key);
  }

  public async set(key: string, value: T): Promise<void> {
    this.data.set(key, value);
  }
}
