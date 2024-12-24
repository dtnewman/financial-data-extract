import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { formatCurrency } from '@/lib/utils';

type Transaction = {
  date: string;
  description: string;
  credit_amount: number | null;
  debit_amount: number | null;
  balance: number;
};

interface TransactionTableProps {
  transactions: Transaction[];
}

export function TransactionTable({ transactions }: TransactionTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="text-right">Credit</TableHead>
            <TableHead className="text-right">Debit</TableHead>
            <TableHead className="text-right">Balance</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction, index) => (
            <TableRow key={index}>
              <TableCell>{transaction.date}</TableCell>
              <TableCell>{transaction.description}</TableCell>
              <TableCell className="text-right">
                {transaction.credit_amount !== null
                  ? formatCurrency(transaction.credit_amount)
                  : '-'}
              </TableCell>
              <TableCell className="text-right">
                {transaction.debit_amount !== null
                  ? formatCurrency(transaction.debit_amount)
                  : '-'}
              </TableCell>
              <TableCell className="text-right">
                {formatCurrency(transaction.balance)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}