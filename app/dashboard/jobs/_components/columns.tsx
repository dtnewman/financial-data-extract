'use client';

import { JobResponseItem } from '@/lib/generated/models/JobResponseItem';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { CellAction } from './cell-action';

export const columns: ColumnDef<JobResponseItem>[] = [
  {
    accessorKey: 'id',
    header: 'JOB ID'
  },
  {
    accessorKey: 'status',
    header: 'STATUS',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
    }
  },
  {
    accessorKey: 'created_at',
    header: 'CREATED AT',
    cell: ({ row }) => {
      const date = row.getValue('created_at') as string;
      return format(new Date(date), 'MMM dd, yyyy HH:mm:ss');
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <div onClick={(e) => e.stopPropagation()}>
        <CellAction data={row.original} />
      </div>
    )
  }
];
