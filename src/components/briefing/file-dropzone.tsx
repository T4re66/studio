'use client';

import { useState, useCallback, useEffect } from 'react';
import { useDropzone, FileWithPath } from 'react-dropzone';
import { UploadCloud, File as FileIcon, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';

interface FileDropzoneProps {
  onFilesDrop: (files: File[]) => void;
  disabled?: boolean;
}

export function FileDropzone({ onFilesDrop, disabled }: FileDropzoneProps) {
  const [files, setFiles] = useState<File[]>([]);

  const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
    setFiles(prev => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    disabled,
    accept: {
        'application/pdf': ['.pdf'],
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
        'text/plain': ['.txt'],
        'image/jpeg': ['.jpeg', '.jpg'],
        'image/png': ['.png'],
    }
  });

  const removeFile = (fileToRemove: File) => {
    setFiles(files => files.filter(file => file !== fileToRemove));
  }

  const handleUpload = () => {
    if (files.length > 0) {
      onFilesDrop(files);
      setFiles([]);
    }
  }
  
  useEffect(() => {
    // Revoke object URLs on unmount to prevent memory leaks
    return () => files.forEach(file => {
        if ('path' in file) {
             URL.revokeObjectURL((file as FileWithPath).path!);
        }
    });
  }, [files]);


  return (
    <div className="flex flex-col gap-4">
        <div
            {...getRootProps()}
            className={cn(
            'group relative flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 text-center transition-colors',
            isDragActive && 'border-primary bg-primary/10',
            isDragReject && 'border-destructive bg-destructive/10',
            disabled && 'cursor-not-allowed opacity-50'
            )}
        >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <UploadCloud className={cn("h-12 w-12", isDragActive && "text-primary")} />
                <p className="font-semibold">
                Dateien hierher ziehen oder klicken, um sie auszuwählen
                </p>
                <p className="text-xs">Unterstützt: PDF, DOCX, TXT, JPG, PNG</p>
            </div>
        </div>

        {files.length > 0 && (
            <div className="space-y-2">
                 <h4 className="font-semibold text-sm">Hochzuladende Dateien:</h4>
                 <ul className="space-y-2">
                    {files.map((file, index) => (
                        <li key={index} className="flex items-center justify-between rounded-lg border bg-muted/20 p-2">
                            <div className="flex items-center gap-3">
                                <FileIcon className="h-5 w-5 text-muted-foreground" />
                                <span className="text-sm font-medium">{file.name}</span>
                            </div>
                            <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => removeFile(file)}>
                                <X className="h-4 w-4"/>
                            </Button>
                        </li>
                    ))}
                 </ul>
                 <Button onClick={handleUpload} disabled={disabled || files.length === 0} className="w-full">
                    {files.length} {files.length === 1 ? 'Datei' : 'Dateien'} hochladen & organisieren
                </Button>
            </div>
        )}
    </div>
  );
}
