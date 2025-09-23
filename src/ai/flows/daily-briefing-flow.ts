'use server';
/**
 * @fileOverview Defines a Genkit flow to generate a comprehensive daily briefing
 * by summarizing emails and calendar events.
 *
 * - getDailyBriefing: A function that takes emails and events and returns a combined summary.
 * - DailyBriefingInput: The Zod schema for the input.
 * - DailyBriefingOutput: The Zod schema for the output.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import type { Email, CalendarEvent } from '@/lib/data';

// Zod schema for an individual email, ensuring data consistency.
const EmailSchema = z.object({
  id: z.string(),
  sender: z.string(),
  subject: z.string(),
  snippet: z.string(),
  isRead: z.boolean(),
  timestamp: z.string(),
});

// Zod schema for a calendar event, ensuring data consistency.
const CalendarEventSchema = z.object({
  id: z.string(),
  title: z.string(),
  date: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  category: z.string(),
  participants: z.array(z.string()),
});

// Define the Zod schema for the flow's input, combining emails and events.
const DailyBriefingInputSchema = z.object({
  emails: z.array(EmailSchema).describe("List of recent unread emails."),
  events: z.array(CalendarEventSchema).describe("List of today's calendar events."),
});
export type DailyBriefingInput = z.infer<typeof DailyBriefingInputSchema>;

// Define the Zod schema for the flow's output, which is a single summary string.
const DailyBriefingOutputSchema = z.string().describe("A concise summary of the user's day.");
export type DailyBriefingOutput = z.infer<typeof DailyBriefingOutputSchema>;

/**
 * Asynchronous wrapper function for the daily briefing Genkit flow.
 * @param {DailyBriefingInput} input - The emails and events to be summarized.
 * @returns {Promise<string>} A promise that resolves to the daily briefing summary.
 */
export async function getDailyBriefing(input: DailyBriefingInput): Promise<string> {
  if (input.emails.length === 0 && input.events.length === 0) {
    return "Dein Tag ist leer! Keine neuen E-Mails oder anstehenden Termine. Zeit, proaktiv zu werden!";
  }
  return await getDailyBriefingFlow(input);
}

// Define the Genkit prompt for generating the daily briefing.
// It instructs the AI on its persona and the desired structure of the summary.
const dailyBriefingPrompt = ai.definePrompt({
  name: 'dailyBriefingPrompt',
  input: { schema: DailyBriefingInputSchema },
  output: { schema: DailyBriefingOutputSchema },
  prompt: `
    You are a helpful AI assistant in an office app called "OfficeZen".
    Your task is to create a comprehensive, yet brief, daily summary for the user based on their unread emails and calendar events.
    
    Start with a friendly greeting.
    First, summarize the most important unread emails.
    Then, give an overview of the day's schedule based on the calendar events.
    Conclude with a positive and motivating sentence.
    
    Keep the entire output to a few short paragraphs. Use markdown for light formatting if needed (like bolding).

    Here is the data for today:

    Unread Emails:
    {{#if emails.length}}
      {{#each emails}}
      - From: {{sender}}, Subject: {{subject}}
      {{/each}}
    {{else}}
      No unread emails.
    {{/if}}

    Today's Calendar:
    {{#if events.length}}
      {{#each events}}
      - {{title}} ({{startTime}} - {{endTime}})
      {{/each}}
    {{else}}
      No events scheduled.
    {{/if}}
  `,
});

// Define the main Genkit flow for the daily briefing.
const getDailyBriefingFlow = ai.defineFlow(
  {
    name: 'getDailyBriefingFlow',
    inputSchema: DailyBriefingInputSchema,
    outputSchema: DailyBriefingOutputSchema,
  },
  async (input) => {
    const { output } = await dailyBriefingPrompt(input);
    return output || "Tages-Briefing konnte nicht erstellt werden.";
  }
);
