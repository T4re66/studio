
'use client'

import { useState } from 'react';
import { FileDropzone } from './file-dropzone';
import { FileExplorer } from './file-explorer';
<<<<<<< HEAD
<<<<<<< HEAD
=======
import type { OrganizeFilesOutput } from '@/ai/flows/organize-files-flow';
>>>>>>> ef6eeef (geht immernoch nicht auf das github passe alles so an das es zu 100pro f)
=======
>>>>>>> 29a0906 (Du vergisst und löscht alle hintergrund prozesse und funktionen ich will)
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Loader2 } from 'lucide-react';
import { organizeFiles, type OrganizeFilesOutput } from '@/ai/flows/organize-files-flow';
import { useToast } from '@/hooks/use-toast';

<<<<<<< HEAD
// Helper function to read file as Base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = error => reject(error);
  });
=======
// This type is now defined locally for the UI shell.
type OrganizeFilesOutput = {
  folders: {
    name: string;
    files: {
      name: string;
      path: string;
    }[];
  }[];
>>>>>>> 29a0906 (Du vergisst und löscht alle hintergrund prozesse und funktionen ich will)
};


export function FilingCabinetTab() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [organizedData, setOrganizedData] = useState<OrganizeFilesOutput | null>(null);

  const handleFilesDrop = async (files: File[]) => {
    setIsProcessing(true);
<<<<<<< HEAD
<<<<<<< HEAD
    setOrganizedData(null);
    try {
      const filesToProcess = await Promise.all(
        files.map(async file => ({
          fileName: file.name,
          fileContent: await fileToBase64(file),
        }))
      );

      const result = await organizeFiles({ files: filesToProcess });
      setOrganizedData(result);

      toast({
        title: "Organisation abgeschlossen",
        description: "Die KI hat deine Dateien erfolgreich sortiert."
      });

    } catch (error) {
      console.error("Error organizing files:", error);
      toast({
        variant: "destructive",
        title: "Fehler bei der Organisation",
        description: "Die Dateien konnten nicht von der KI sortiert werden."
      })
    } finally {
      setIsProcessing(false);
    }
=======
    toast({
      title: 'Verarbeite Dateien...',
      description: 'Die KI-Funktion ist zurzeit deaktiviert.',
    });

    // Placeholder for AI organization
=======
    // Placeholder for UI shell, no real processing
>>>>>>> 29a0906 (Du vergisst und löscht alle hintergrund prozesse und funktionen ich will)
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsProcessing(false);
>>>>>>> ef6eeef (geht immernoch nicht auf das github passe alles so an das es zu 100pro f)
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
