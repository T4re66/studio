'use server';
/**
 * @fileOverview This file defines a Genkit flow for summarizing a list of emails.
 *
 * - summarizeEmails: A function that takes an array of unread emails and returns a concise summary.
 * - SummarizeEmailsInput: The Zod schema for the input of the summarizeEmails function.
 * - SummarizeEmailsOutput: The Zod schema for the output of the summarizeEmails function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import type { Email } from '@/lib/data';

// Define the Zod schema for the input, which is an array of email objects.
// This ensures that the input to the flow is always in the expected format.
const SummarizeEmailsInputSchema = z.array(
  z.object({
    id: z.string(),
    sender: z.string(),
    subject: z.string(),
    snippet: z.string(),
    isRead: z.boolean(),
    timestamp: z.string(),
  })
);
export type SummarizeEmailsInput = z.infer<typeof SummarizeEmailsInputSchema>;

// Define the Zod schema for the output, which is a single string containing the summary.
const SummarizeEmailsOutputSchema = z.string();
export type SummarizeEmailsOutput = z.infer<typeof SummarizeEmailsOutputSchema>;

/**
 * An asynchronous function that takes an array of emails and returns a summary.
 * It serves as a wrapper around the Genkit flow.
 * @param {Email[]} emails - An array of email objects to be summarized.
 * @returns {Promise<string>} A promise that resolves to the email summary string.
 */
export async function summarizeEmails(emails: Email[]): Promise<string> {
  if (emails.length === 0) {
    return "Keine ungelesenen E-Mails vorhanden.";
  }
  return await summarizeEmailsFlow(emails);
}

// Define the Genkit prompt for summarizing emails.
// The prompt instructs the AI model on how to behave and what format to use for the output.
const summarizeEmailsPrompt = ai.definePrompt({
  name: 'summarizeEmailsPrompt',
  input: { schema: SummarizeEmailsInputSchema },
  output: { schema: SummarizeEmailsOutputSchema },
  prompt: `
    You are a helpful assistant integrated into an office management app called "OfficeZen".
    Your task is to summarize a list of unread emails for the user.
    Provide a brief, actionable summary. Mention the most important senders and topics.
    Keep it concise and easy to read. Address the user directly in a friendly but professional tone.
    The output should be a single string.

    Here are the unread emails:
    {{#each input}}
    - From: {{sender}}, Subject: {{subject}}, Snippet: {{snippet}}
    {{/each}}
  `,
});

// Define the Genkit flow for summarizing emails.
// This flow takes the email array, invokes the prompt, and returns the generated summary.
const summarizeEmailsFlow = ai.defineFlow(
  {
    name: 'summarizeEmailsFlow',
    inputSchema: SummarizeEmailsInputSchema,
    outputSchema: SummarizeEmailsOutputSchema,
  },
  async (emails) => {
    const { output } = await summarizeEmailsPrompt(emails);
    return output || "Zusammenfassung konnte nicht erstellt werden.";
  }
);
