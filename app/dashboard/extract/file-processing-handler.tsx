'use client';

import { FileUploader } from '@/components/file-uploader';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useState } from 'react';
import useMultistepForm from '@/hooks/use-multistep-form';
import { Loader2 } from 'lucide-react';
import { TransactionTable } from './_components/transaction-table';

type UploadState = {
  file: File | null;
  uploadedFileKey: string | null;
  signedUrl: string | null;
  isProcessing: boolean;
  analysisResults?: {
    transactions: Array<{
      date: string;
      description: string;
      credit_amount: number | null;
      debit_amount: number | null;
      category: string;
      summary: string;
    }>;
    start_balance: number | null;
    end_balance: number | null;
  };
};

export default function FileProcessingHandler() {
  const [state, setState] = useState<UploadState>({
    file: null,
    uploadedFileKey: null,
    signedUrl: null,
    isProcessing: false
  });

  const FileUploadStep = (
    <div className="space-y-4">
      <FileUploader
        value={state.file ? [state.file] : []}
        onValueChange={(files) => {
          if (Array.isArray(files)) {
            setState({ ...state, file: files[0] || null });
          }
        }}
        accept={{ 'application/pdf': ['.pdf'] }}
        maxSize={1024 * 1024 * 10} // 10MB
      />
      <div className="flex justify-end">
        <Button
          onClick={handleUpload}
          disabled={!state.file || state.isProcessing}
        >
          Continue
        </Button>
      </div>
    </div>
  );

  const ProcessingStep = (
    <div className="flex flex-col items-center justify-center space-y-4 py-8">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground">
        Processing your document...
      </p>
    </div>
  );

  const ResultStep = (
    <div className="space-y-4">
      <p className="font-medium">Document processed successfully!</p>

      {state.analysisResults && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="rounded-lg border p-4">
              <p className="text-sm text-muted-foreground">Starting Balance</p>
              <p className="text-lg font-medium">
                {state.analysisResults.start_balance?.toFixed(2) ?? 'N/A'}
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <p className="text-sm text-muted-foreground">Ending Balance</p>
              <p className="text-lg font-medium">
                {state.analysisResults.end_balance?.toFixed(2) ?? 'N/A'}
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <p className="text-sm text-muted-foreground">Total Credits</p>
              <p className="text-lg font-medium text-green-600">
                {state.analysisResults.transactions
                  .reduce((sum, t) => sum + (t.credit_amount ?? 0), 0)
                  .toFixed(2)}
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <p className="text-sm text-muted-foreground">Total Debits</p>
              <p className="text-lg font-medium text-red-600">
                {state.analysisResults.transactions
                  .reduce((sum, t) => sum + (t.debit_amount ?? 0), 0)
                  .toFixed(2)}
              </p>
            </div>
          </div>

          <div className="rounded-lg border p-4">
            <p className="mb-4 text-sm font-medium text-muted-foreground">
              Extracted Transactions:
            </p>
            <TransactionTable
              transactions={state.analysisResults.transactions.map((t, i) => ({
                ...t,
                balance:
                  (state.analysisResults!.start_balance ?? 0) +
                  state
                    .analysisResults!.transactions.slice(0, i + 1)
                    .reduce(
                      (sum, curr) =>
                        sum +
                        (curr.credit_amount ?? 0) -
                        (curr.debit_amount ?? 0),
                      0
                    )
              }))}
            />
          </div>
        </div>
      )}

      <div className="flex justify-end space-x-2">
        <Button
          variant="outline"
          onClick={() => {
            setState({
              file: null,
              uploadedFileKey: null,
              signedUrl: null,
              isProcessing: false,
              analysisResults: undefined
            });
            goTo(0);
          }}
        >
          Process Another
        </Button>
      </div>
    </div>
  );

  const { step, goTo } = useMultistepForm([
    FileUploadStep,
    ProcessingStep,
    ResultStep
  ]);

  async function handleUpload() {
    if (!state.file) {
      toast.error('Please select a file first');
      return;
    }

    try {
      setState({ ...state, isProcessing: true });
      goTo(1); // Show processing step

      // Upload file
      const formData = new FormData();
      formData.append('file', state.file);

      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      if (!uploadResponse.ok) {
        throw new Error('Upload failed');
      }

      const { signedUrl: pdfUrl } = await uploadResponse.json();

      // Analyze the document
      const analysisResponse = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ pdfUrl })
      });

      if (!analysisResponse.ok) {
        const errorData = await analysisResponse.json();
        throw new Error(errorData.error || 'Analysis failed');
      }

      const { transactions, start_balance, end_balance } =
        await analysisResponse.json();

      // Update state with results
      setState({
        ...state,
        signedUrl: pdfUrl,
        analysisResults: {
          transactions,
          start_balance,
          end_balance
        },
        isProcessing: false
      });

      goTo(2); // Show result step
    } catch (error) {
      console.error('Processing error:', error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to process document'
      );
      setState({ ...state, isProcessing: false });
      goTo(0); // Return to upload step
    }
  }

  return <div className="w-full">{step}</div>;
}
