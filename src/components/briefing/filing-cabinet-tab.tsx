'use client'

import { useState } from 'react';
import { FileDropzone } from './file-dropzone';
import { FileExplorer } from './file-explorer';
import { organizeFiles, OrganizeFilesOutput } from '@/ai/flows/organize-files-flow';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const fileToDataURI = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            resolve(reader.result as string);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

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
      const fileInputs = await Promise.all(files.map(async (file) => {
          const content = await fileToDataURI(file);
          return { name: file.name, content: content };
      }));
      
      const result = await organizeFiles({ files: fileInputs });

      // Merge new results with existing ones
      setOrganizedData(prevData => {
          if (!prevData) return result;

          const newFolders = new Map(prevData.folders.map(f => [f.name, [...f.files]]));
          
          result.folders.forEach(newFolder => {
              if(newFolders.has(newFolder.name)) {
                  newFolders.get(newFolder.name)!.push(...newFolder.files);
              } else {
                  newFolders.set(newFolder.name, newFolder.files);
              }
          });

          return {
              folders: Array.from(newFolders.entries()).map(([name, files]) => ({ name, files }))
          };
      });

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
