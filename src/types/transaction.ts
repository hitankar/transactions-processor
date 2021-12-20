
export type Transaction = {
  Date: string;
  Ledger: string;
  Amount: string;
  Company: string;
}

export type TransactionPage = {
  totalCount: number;
  page: number;
  transactions: Array<Transaction>;
}