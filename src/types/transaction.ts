
type Transaction = {
  Date: string;
  Ledger: string;
  Amount: string;
  Company: string;
}

type TransactionPage = {
  totalCount: number;
  page: number;
  transactions: Array<Transaction>;
}