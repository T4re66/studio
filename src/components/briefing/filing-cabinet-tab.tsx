'use client'

import { useState } from 'react';
import { FileDropzone } from './file-dropzone';
import { FileExplorer } from './file-explorer';
import { organizeFiles, OrganizeFilesOutput } from '@/ai/flows/organize-files-flow';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export function FilingCabinetTab() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [organizedData, setOrganizedData] = useState<OrganizeFilesOutput | null>(null);
  const { toast } = useToast();

  const handleFilesDrop = async (files: File[]) => {
    setIsProcessing(true);
    toast({
      title: 'Verarbeite Dateien...',
      description: 'Die KI analysiert und sortiert deine Dokumente. Das kann einen Moment dauern.',
    });

    try {
      // In a real application, you would convert files to data URIs
      // For this demo, we'll send dummy data to the flow.
      const fileInputs = files.map(file => ({ name: file.name, content: 'dummy content' }));
      const result = await organizeFiles({ files: fileInputs });
      setOrganizedData(result);

      toast({
        title: 'Ablage aktualisiert!',
        description: 'Deine Dateien wurden erfolgreich von der KI organisiert.',
      });

    } catch (error) {
      console.error("Error organizing files:", error);
      toast({
        variant: 'destructive',
        title: 'Fehler bei der Organisation',
        description: 'Die KI konnte die Dateien nicht verarbeiten. Bitte versuche es erneut.',
      });
    } finally {
      setIsProcessing(false);
    }
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
          {isProcessing ? (
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
