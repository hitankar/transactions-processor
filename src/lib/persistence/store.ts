import Adapter from './adapter/adapter';

export default class Store<T> {
  constructor(
    private readonly key: string, 
    private readonly adapter: Adapter<T[]>
  ) {}

  /**
   * Append data to existing store key
   * @param data data to store
   */
  async append(data: T[]): Promise<void> {
    let stored = await this.adapter.get(this.key);

    // checked if return is false (meaning key doesn't exist)
    if (stored) {
      stored.push(...data);
    } else {
      stored = data;
    }

    this.adapter.set(this.key, stored);
  }

  /**
   * Get value of key and return as an array
   * @returns returns array of T
   */
  async getAll():Promise<T[]> {
    return await this.adapter.get(this.key);
  }

}