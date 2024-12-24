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
};

export default function UploadHandler() {
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
            <p className="text-sm text-muted-foreground">Processing your document...</p>
        </div>
    );

    const ResultStep = (
        <div className="space-y-4">
            <p className="font-medium">File uploaded successfully!</p>
            <div className="rounded-lg border p-4">
                <p className="text-sm font-medium text-muted-foreground mb-2">File Access URL:</p>
                <div className="flex items-center gap-2">
                    <code className="flex-1 bg-muted rounded p-2 text-sm break-all">
                        {state.signedUrl}
                    </code>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            navigator.clipboard.writeText(state.signedUrl || '');
                            toast.success('URL copied to clipboard');
                        }}
                    >
                        Copy
                    </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                    This URL will expire after a certain period. Make sure to download or access the file before expiration.
                </p>
            </div>
            <div className="flex justify-end space-x-2">
                <Button
                    variant="outline"
                    onClick={() => {
                        setState({
                            file: null,
                            uploadedFileKey: null,
                            signedUrl: null,
                            isProcessing: false
                        });
                        goTo(0);
                    }}
                >
                    Upload Another
                </Button>
                {state.signedUrl && (
                    <Button
                        onClick={() => {
                            if (state.signedUrl) {
                                window.open(state.signedUrl, '_blank');
                            }
                        }}
                    >
                        View File
                    </Button>
                )}
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

            const formData = new FormData();
            formData.append('file', state.file);

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Upload failed');
            }

            const data = await response.json();
            setState({
                ...state,
                uploadedFileKey: data.key,
                signedUrl: data.signedUrl,
                isProcessing: false
            });
            goTo(2); // Show result step
        } catch (error) {
            console.error('Upload error:', error);
            toast.error('Failed to upload file');
            setState({ ...state, isProcessing: false });
            goTo(0); // Return to upload step
        }
    }

    return <div className="w-full">{step}</div>;
} 