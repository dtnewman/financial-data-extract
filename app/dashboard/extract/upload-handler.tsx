'use client';

import { FileUploader } from '@/components/file-uploader';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useState } from 'react';

export default function UploadHandler() {
    const [selectedFile, setSelectedFile] = useState<File[]>([]);
    const [isUploading, setIsUploading] = useState(false);

    const handleUpload = async () => {
        if (!selectedFile.length) {
            toast.error('Please select a file first');
            return;
        }

        try {
            setIsUploading(true);
            const formData = new FormData();
            formData.append('file', selectedFile[0]);

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Upload failed');
            }

            const data = await response.json();
            toast.success('File uploaded successfully');
            setSelectedFile([]);
            return data;
        } catch (error) {
            console.error('Upload error:', error);
            toast.error('Failed to upload file');
            throw error;
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="space-y-4">
            <FileUploader
                accept={{ 'application/pdf': ['.pdf'] }}
                maxSize={1024 * 1024 * 10} // 10MB
                maxFiles={1}
                multiple={false}
                value={selectedFile}
                onValueChange={setSelectedFile}
            />
            {selectedFile.length > 0 && (
                <div className="flex justify-end space-x-2">
                    <Button
                        variant="outline"
                        onClick={() => setSelectedFile([])}
                        disabled={isUploading}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleUpload}
                        disabled={isUploading}
                    >
                        {isUploading ? 'Uploading...' : 'Continue'}
                    </Button>
                </div>
            )}
        </div>
    );
} 