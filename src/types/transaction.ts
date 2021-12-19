
interface Transaction {
  Date: string;
  Ledger: string;
  Amount: string;
  Company: string;

}

interface TransactionPage {
  totalCount: number;
  page: number;
  transactions: Array<Transaction>;

}