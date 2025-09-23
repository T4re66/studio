
'use client'

import { useState } from 'react';
import { FileDropzone } from './file-dropzone';
import { FileExplorer } from './file-explorer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Loader2 } from 'lucide-react';

// This type is now defined locally for the UI shell.
type OrganizeFilesOutput = {
  folders: {
    name: string;
    files: {
      name: string;
      path: string;
    }[];
  }[];
};

export function FilingCabinetTab() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [organizedData, setOrganizedData] = useState<OrganizeFilesOutput | null>(null);

  const handleFilesDrop = async (files: File[]) => {
    setIsProcessing(true);
    // Placeholder for UI shell, no real processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsProcessing(false);
  };

  return (
    <div className="flex flex-col gap-8">
      <h2 className="text-xl font-semibold font-headline">Intelligente Ablage</h2>
      <FileDropzone onFilesDrop={handleFilesDrop} disabled={isProcessing} />
      
      <Card>
        <CardHeader>
          <CardTitle>Deine Ablage</CardTitle>
          <CardDescription>
            Hier siehst du die von der KI erstellte Ordnerstruktur und deine einsortierten Dateien.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isProcessing && !organizedData ? (
            <div className="flex flex-col items-center justify-center gap-4 p-12 text-muted-foreground">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="text-center">Die KI sortiert deine Dateien...</p>
            </div>
          ) : (
            <FileExplorer data={organizedData} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
