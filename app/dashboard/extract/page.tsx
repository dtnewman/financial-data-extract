import PageContainer from '@/components/layout/page-container';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import UploadHandler from './upload-handler';

export const metadata = {
  title: 'Dashboard: Extract'
};

export default function Page() {
  return (
    <PageContainer>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <Heading title="Extract" description="Extract valuable insights from financial documents" />
        </div>
        <Separator />
        <Card>
          <CardHeader>
            <CardTitle>Upload Bank Statement</CardTitle>
            <CardDescription>
              Upload your bank statement in PDF format to extract insights
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UploadHandler />
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
