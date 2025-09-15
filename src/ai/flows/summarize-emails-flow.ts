'use server';
/**
 * @fileOverview A flow to summarize emails.
 *
 * - summarizeEmails - A function that handles summarizing emails.
 * - SummarizeEmailsInput - The input type for the summarizeEmails function.
 * - SummarizeEmailsOutput - The return type for the summarizeEmails function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EmailSchema = z.object({
  sender: z.string(),
  subject: z.string(),
  snippet: z.string(),
});

export type SummarizeEmailsInput = z.infer<typeof EmailSchema>[];

const SummarizeEmailsOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the most important emails, written in German.'),
});
export type SummarizeEmailsOutput = z.infer<typeof SummarizeEmailsOutputSchema>;

export async function summarizeEmails(input: SummarizeEmailsInput): Promise<SummarizeEmailsOutput> {
  return summarizeEmailsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeEmailsPrompt',
  input: {schema: z.array(EmailSchema)},
  output: {schema: SummarizeEmailsOutputSchema},
  prompt: `You are an expert office assistant. Your task is to summarize the following list of emails.
  Focus on the most important and urgent items. Identify any action items, deadlines, or key decisions.
  Provide a concise summary in German.

  Here are the emails:
  {{#each this}}
  - From: {{sender}}, Subject: {{subject}}, Snippet: {{snippet}}
  {{/each}}
  `,
});

const summarizeEmailsFlow = ai.defineFlow(
  {
    name: 'summarizeEmailsFlow',
    inputSchema: z.array(EmailSchema),
    outputSchema: SummarizeEmailsOutputSchema,
  },
  async (emails) => {
    if (emails.length === 0) {
      return { summary: "Dein Posteingang ist leer. Gut gemacht!" };
    }
    
    try {
      const {output} = await prompt(emails);
      return output!;
    } catch (e) {
      console.error(e);
      return { summary: "Zusammenfassung konnte nicht geladen werden. Bitte versuchen Sie es später erneut." };
    }
  }
);
