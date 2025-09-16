'use server';
/**
 * @fileOverview A flow to organize uploaded files using AI.
 *
 * - organizeFiles - A function that takes files and returns a structured folder organization.
 * - OrganizeFilesInput - The input type for the organizeFiles function.
 * - OrganizeFilesOutput - The return type for the organizeFiles function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Schema for a single file provided by the user
const FileInputSchema = z.object({
  name: z.string().describe('The name of the file.'),
  content: z.string().describe('The content of the file, likely as a data URI or extracted text. For this version, we will assume text.'),
});

// Schema for the overall input to the flow
const OrganizeFilesInputSchema = z.object({
  files: z.array(FileInputSchema).describe('An array of files to be organized.'),
});
export type OrganizeFilesInput = z.infer<typeof OrganizeFilesInputSchema>;


// Schema for a single file within an organized folder
const OrganizedFileSchema = z.object({
  name: z.string().describe('The original name of the file.'),
  path: z.string().describe('The new path of the file within the folder structure.'),
});

// Schema for a single folder
const FolderSchema = z.object({
  name: z.string().describe('The name of the folder, e.g., "Invoices", "Project Phoenix", "Reports".'),
  files: z.array(OrganizedFileSchema).describe('A list of files belonging to this folder.'),
});

// Schema for the final output of the flow
const OrganizeFilesOutputSchema = z.object({
  folders: z.array(FolderSchema).describe('A list of folders with the organized files.'),
});
export type OrganizeFilesOutput = z.infer<typeof OrganizeFilesOutputSchema>;


/**
 * This is the main function that will be called from the frontend.
 * It takes the user's files and uses an AI flow to organize them.
 */
export async function organizeFiles(input: OrganizeFilesInput): Promise<OrganizeFilesOutput> {
  return organizeFilesFlow(input);
}


// Define the AI prompt for organizing the files
const organizePrompt = ai.definePrompt({
  name: 'organizeFilesPrompt',
  input: {schema: OrganizeFilesInputSchema},
  output: {schema: OrganizeFilesOutputSchema},
  prompt: `You are an expert file organizer and personal assistant. Your task is to analyze a list of files, understand their content and context, and sort them into a logical folder structure.

Rules:
- Create a clear and concise folder structure. Common folders might be "Rechnungen", "Projekte", "Reports", "Allgemein", but you should create whatever structure makes the most sense for the given files.
- For each file, determine the most appropriate folder.
- The final output must be in the specified JSON format.

Analyze the following files:

{{#each files}}
---
File Name: {{name}}
Content:
{{{content}}}
---
{{/each}}

Based on the content of these files, create a folder structure and assign each file to its correct folder.`,
});


// Define the Genkit flow
const organizeFilesFlow = ai.defineFlow(
  {
    name: 'organizeFilesFlow',
    inputSchema: OrganizeFilesInputSchema,
    outputSchema: OrganizeFilesOutputSchema,
  },
  async (input) => {
    // In a real implementation, we would extract text from PDFs/DOCX files.
    // For now, we'll assume the 'content' field is already populated with text.
    
    try {
      const {output} = await organizePrompt(input);
      // Ensure that every file from input is in the output
      const inputFiles = new Set(input.files.map(f => f.name));
      const outputFiles = new Set(output!.folders.flatMap(f => f.files).map(f => f.name));
      
      for (const inputFile of inputFiles) {
          if (!outputFiles.has(inputFile)) {
              // If a file was missed by the AI, add it to an "Unsortiert" folder.
              let unsortedFolder = output!.folders.find(f => f.name === 'Unsortiert');
              if (!unsortedFolder) {
                  unsortedFolder = { name: 'Unsortiert', files: [] };
                  output!.folders.push(unsortedFolder);
              }
              unsortedFolder.files.push({ name: inputFile, path: `/Unsortiert/${inputFile}`});
          }
      }
      
      return output!;
    } catch (e) {
      console.error(e);
      // Fallback in case of an error, puts all files in "Unsortiert".
      return {
        folders: [
          {
            name: "Unsortiert",
            files: input.files.map(f => ({ name: f.name, path: `/Unsortiert/${f.name}` })),
          }
        ]
      };
    }
  }
);
