'use client'

import { useState } from 'react';
import { FileDropzone } from './file-dropzone';
import { FileExplorer } from './file-explorer';
import type { OrganizeFilesOutput } from '@/ai/flows/organize-files-flow';
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
      description: 'Die KI-Funktion ist zurzeit deaktiviert.',
    });

    // Placeholder for AI organization
    await new Promise(resolve => setTimeout(resolve, 1500));

    const result = {
        folders: [
            {
                name: "Unsortiert",
                files: files.map(f => ({ name: f.name, path: `/Unsortiert/${f.name}`}))
            }
        ]
    };
    
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
