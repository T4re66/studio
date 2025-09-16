'use client';

import { Folder, File, Briefcase, FileText, Receipt, FolderOpen } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import type { OrganizeFilesOutput } from '@/ai/flows/organize-files-flow';

interface FileExplorerProps {
  data: OrganizeFilesOutput | null;
}

const iconMap: { [key: string]: React.ElementType } = {
  default: Folder,
  Projekte: Briefcase,
  Reports: FileText,
  Rechnungen: Receipt,
};

const fileIconMap: { [key: string]: React.ElementType } = {
    default: File,
    pdf: FileText,
    docx: FileText,
    txt: FileText,
};

// Dummy data for initial display
const dummyData: OrganizeFilesOutput = {
  folders: [
    {
      name: 'Projekte',
      files: [
        { name: 'projekt_phoenix_q2.docx', path: '/Projekte/projekt_phoenix_q2.docx' },
        { name: 'marketing_plan.pdf', path: '/Projekte/marketing_plan.pdf' },
      ],
    },
    {
      name: 'Rechnungen',
      files: [
        { name: 'rechnung_software_abo.pdf', path: '/Rechnungen/rechnung_software_abo.pdf' },
      ],
    },
     {
      name: 'Reports',
      files: [
        { name: 'quartalsbericht_q2.pdf', path: '/Reports/quartalsbericht_q2.pdf' },
      ],
    },
  ],
};


export function FileExplorer({ data }: FileExplorerProps) {
  const displayData = data || dummyData;

   if (!displayData || displayData.folders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-12 text-muted-foreground">
        <FolderOpen className="h-12 w-12" />
        <p className="text-center">Deine Ablage ist noch leer. <br/> Lade Dokumente hoch, um sie automatisch von der KI organisieren zu lassen.</p>
      </div>
    );
  }

  return (
    <Accordion type="multiple" defaultValue={displayData.folders.map(f => f.name)}>
      {displayData.folders.map((folder, folderIndex) => {
        const FolderIcon = iconMap[folder.name] || iconMap.default;
        return (
          <AccordionItem value={folder.name} key={folderIndex}>
            <AccordionTrigger className="hover:bg-muted/50 px-2 rounded-md">
              <div className="flex items-center gap-3">
                <FolderIcon className="h-5 w-5 text-primary" />
                <span className="font-semibold">{folder.name}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pl-8 pt-2">
              <ul className="space-y-1">
                {folder.files.map((file, fileIndex) => {
                    const fileExtension = file.name.split('.').pop() || 'default';
                    const FileIcon = fileIconMap[fileExtension] || fileIconMap.default;
                    return (
                        <li key={fileIndex} className="flex items-center gap-3 p-1 rounded-md hover:bg-muted/50 cursor-pointer">
                           <FileIcon className="h-4 w-4 text-muted-foreground" />
                           <span className="text-sm">{file.name}</span>
                        </li>
                    )
                })}
                 {folder.files.length === 0 && <li className="text-sm text-muted-foreground italic">Dieser Ordner ist leer.</li>}
              </ul>
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}
