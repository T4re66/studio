'use server';
/**
 * @fileOverview Defines a Genkit flow to organize uploaded files into a structured folder system.
 *
 * - organizeFiles: A function that takes a list of files and returns a proposed folder structure.
 * - OrganizeFilesInput: The Zod schema for the input.
 * - OrganizeFilesOutput: The Zod schema for the output.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

// Define the Zod schema for a single file input.
const FileInputSchema = z.object({
  fileName: z.string().describe('The name of the file, including its extension.'),
  fileContent: z.string().describe('A Base64 encoded string representing the file content.'),
});

// Define the Zod schema for the flow's input.
export const OrganizeFilesInputSchema = z.object({
  files: z.array(FileInputSchema).describe('An array of files to be organized.'),
});
export type OrganizeFilesInput = z.infer<typeof OrganizeFilesInputSchema>;


// Define the Zod schema for the flow's output.
const FileOutputSchema = z.object({
  name: z.string().describe('The original name of the file.'),
  path: z.string().describe('The new proposed path for the file, including the folder.'),
});

const FolderSchema = z.object({
  name: z.string().describe('The suggested name for the folder (e.g., "Rechnungen", "Projekte", "Reports").'),
  files: z.array(FileOutputSchema).describe('A list of files that belong in this folder.'),
});

export const OrganizeFilesOutputSchema = z.object({
  folders: z.array(FolderSchema).describe('A list of suggested folders with their respective files.'),
});
export type OrganizeFilesOutput = z.infer<typeof OrganizeFilesOutputSchema>;


/**
 * Asynchronous wrapper function for the file organization Genkit flow.
 * @param {OrganizeFilesInput} input - The files to be organized.
 * @returns {Promise<OrganizeFilesOutput>} A promise that resolves to the suggested folder structure.
 */
export async function organizeFiles(input: OrganizeFilesInput): Promise<OrganizeFilesOutput> {
  if (!input.files || input.files.length === 0) {
    return { folders: [] };
  }
  return await organizeFilesFlow(input);
}


// Define the Genkit prompt for organizing files.
const organizeFilesPrompt = ai.definePrompt({
  name: 'organizeFilesPrompt',
  input: { schema: OrganizeFilesInputSchema },
  output: { schema: OrganizeFilesOutputSchema },
  prompt: `You are an expert file system organizer. Your task is to analyze a list of files (by their name and content) and sort them into a logical folder structure.
Common folder names in a business context are "Rechnungen", "Projekte", "Reports", "Verträge", "Präsentationen", or "Sonstiges".
For each file, determine the best folder and define its new path. Group all files under their respective folders.

Here are the files to organize:
{{#each files}}
- File Name: {{fileName}}
  Content (first 100 chars): {{substring fileContent 0 100}}
{{/each}}
`,
});

// Define the main Genkit flow for organizing files.
const organizeFilesFlow = ai.defineFlow(
  {
    name: 'organizeFilesFlow',
    inputSchema: OrganizeFilesInputSchema,
    outputSchema: OrganizeFilesOutputSchema,
  },
  async (input) => {
    const { output } = await organizeFilesPrompt(input);
    return output || { folders: [] };
  }
);
