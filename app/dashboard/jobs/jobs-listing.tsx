import { DataTable } from '@/components/ui/table/data-table';
import { JobsApiV1Service } from '@/lib/generated/services/JobsApiV1Service';
import { searchParamsCache } from '@/lib/searchparams';
import { columns } from './_components/columns';
import { withAuth } from '@/lib/auth-lib';

type JobsListingProps = {};

export default async function JobsListing({}: JobsListingProps) {
  // Get search params from cache
  const page = searchParamsCache.get('page');
  const pageLimit = searchParamsCache.get('limit');

  // Calculate offset based on page and limit
  const offset = page ? (page - 1) * (pageLimit || 10) : 0;

  // Fetch jobs data from API
  const data = await withAuth(() =>
    JobsApiV1Service.listJobsApiV1JobsListGet(pageLimit || 10, offset)
  );

  return (
    <DataTable
      columns={columns}
      data={data.jobs}
      totalItems={data.total_count}
      rowHref="/dashboard/jobs/$id"
    />
  );
}
