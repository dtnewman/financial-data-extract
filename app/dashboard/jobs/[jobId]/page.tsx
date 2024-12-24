import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { JobsApiV1Service } from '@/lib/generated/services/JobsApiV1Service';
import { withAuth } from '@/lib/auth-lib';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Dashboard: Job Details'
};

type PageProps = {
  params: {
    jobId: string;
  };
};

export default async function Page({ params }: PageProps) {
  // Fetch job data
  let job;
  try {
    job = await withAuth(() =>
      JobsApiV1Service.getJobApiV1JobsGetJobIdentifierGet(params.jobId)
    );
  } catch (error) {
    notFound();
  }

  return (
    <PageContainer>
      <div className="space-y-4">
        <Link
          href="/dashboard/jobs"
          className="inline-flex items-center rounded-md bg-secondary px-3 py-2 text-sm hover:bg-secondary/80"
          aria-label="Back to jobs page"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to jobs page
        </Link>

        <div className="flex items-center gap-4">
          <div className="flex flex-1 items-center justify-between">
            <Heading
              title={`Job ${job.id}`}
              description="Viewing detailed information about this job"
            />
          </div>
        </div>
        <Separator />

        <div className="grid gap-6 md:grid-cols-2">
          {/* Status Card */}
          <div className="rounded-lg border p-4">
            <h3 className="mb-2 font-semibold">Status</h3>
            <div className="text-lg">
              {job.status.charAt(0).toUpperCase() +
                job.status.slice(1).toLowerCase()}
            </div>
          </div>

          {/* Timing Card */}
          <div className="rounded-lg border p-4">
            <h3 className="mb-2 font-semibold">Timing</h3>
            <div className="space-y-1">
              <div className="text-sm">
                <span className="text-muted-foreground">Created: </span>
                {new Date(job.created_at).toLocaleString()}
              </div>
              <div className="text-sm">
                <span className="text-muted-foreground">Last Updated: </span>
                {new Date(job.updated_at).toLocaleString()}
              </div>
              {job.runtime && (
                <div className="text-sm">
                  <span className="text-muted-foreground">Runtime: </span>
                  {job.runtime} seconds
                </div>
              )}
            </div>
          </div>

          {/* Files Section */}
          {job.files && job.files.length > 0 && (
            <div className="col-span-2 rounded-lg border p-4">
              <h3 className="mb-4 font-semibold">Generated Files</h3>
              <div className="space-y-2">
                {job.files.map((file) => (
                  <div
                    key={file.file_name}
                    className="flex items-center justify-between rounded-md border bg-secondary p-2"
                  >
                    <span className="font-mono text-sm">{file.file_name}</span>
                    <span className="text-sm text-muted-foreground">
                      {(file.file_size / 1024).toFixed(2)} KB
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Output Logs */}
          {job.output_log_tail && job.output_log_tail.length > 0 && (
            <div className="col-span-2 rounded-lg border p-4">
              <h3 className="mb-4 font-semibold">Output Log Tail</h3>
              <pre className="max-h-[400px] overflow-auto rounded-lg bg-slate-200 p-4 font-mono text-sm">
                {job.output_log_tail.join('\n')}
              </pre>
            </div>
          )}

          {/* Error Logs */}
          {job.error_log_tail && job.error_log_tail.length > 0 && (
            <div className="col-span-2 rounded-lg border p-4">
              <h3 className="mb-4 font-semibold text-destructive">
                Error Log Tail
              </h3>
              <pre className="max-h-[400px] overflow-auto rounded-lg bg-destructive/10 p-4 font-mono text-sm text-destructive">
                {job.error_log_tail.join('\n')}
              </pre>
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
