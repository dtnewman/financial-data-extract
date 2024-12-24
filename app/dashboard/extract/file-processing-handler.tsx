'use client';

import { FileUploader } from '@/components/file-uploader';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useState } from 'react';
import useMultistepForm from '@/hooks/use-multistep-form';
import { Loader2 } from 'lucide-react';

type UploadState = {
  file: File | null;
  uploadedFileKey: string | null;
  signedUrl: string | null;
  isProcessing: boolean;
  processingStatus?: string;
  analysisResults?: string;
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
        {state.processingStatus || 'Processing your document...'}
      </p>
    </div>
  );

  const ResultStep = (
    <div className="space-y-4">
      <p className="font-medium">Document processed successfully!</p>

      {state.analysisResults && (
        <div className="rounded-lg border p-4">
          <p className="mb-2 text-sm font-medium text-muted-foreground">
            Extracted Information:
          </p>
          <pre className="max-h-[400px] overflow-auto rounded-lg bg-muted p-4 text-sm">
            {JSON.stringify(JSON.parse(state.analysisResults), null, 2)}
          </pre>
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
      setState({
        ...state,
        isProcessing: true,
        processingStatus: 'Uploading file...'
      });
      goTo(1);

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

      // Start analysis with SSE
      const eventSource = new EventSource(
        `/api/analyze?pdfUrl=${encodeURIComponent(pdfUrl)}`
      );

      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);

        if (data.status) {
          setState((prev) => ({ ...prev, processingStatus: data.status }));
        }

        if (data.analysis) {
          setState((prev) => ({
            ...prev,
            signedUrl: pdfUrl,
            analysisResults: data.analysis,
            isProcessing: false
          }));
          eventSource.close();
          goTo(2);
        }
      };

      eventSource.onerror = () => {
        eventSource.close();
        throw new Error('Analysis failed');
      };
    } catch (error) {
      console.error('Processing error:', error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to process document'
      );
      setState({ ...state, isProcessing: false });
      goTo(0);
    }
  }

  return <div className="w-full">{step}</div>;
}
