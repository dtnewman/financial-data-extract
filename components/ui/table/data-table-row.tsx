'use client';

import { TableRow } from '@/components/ui/table';
import { Row } from '@tanstack/react-table';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface DataTableRowProps<TData> {
  row: Row<TData>;
  children: React.ReactNode;
  href?: string;
}

export function DataTableRow<TData>({
  row,
  children,
  href
}: DataTableRowProps<TData>) {
  const router = useRouter();

  const handleClick = () => {
    if (href) {
      router.push(href);
    }
  };

  return (
    <TableRow
      onClick={handleClick}
      className={cn(href && 'cursor-pointer hover:bg-muted/50')}
      data-state={row.getIsSelected() && 'selected'}
    >
      {children}
    </TableRow>
  );
}
