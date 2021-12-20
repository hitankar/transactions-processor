/* eslint-disable semi */
/* eslint-disable @typescript-eslint/no-explicit-any */
export default interface Adapter<T> {
  get(key: string): Promise<T>;
  set(key: string, value: T): void;
}