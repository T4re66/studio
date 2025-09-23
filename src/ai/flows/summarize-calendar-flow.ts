'use server';
/**
 * @fileOverview This file defines a Genkit flow for summarizing a user's daily calendar events.
 *
 * - summarizeCalendar: A function that takes an array of calendar events and returns a summary of the day.
 * - SummarizeCalendarInput: The Zod schema for the input of the summarizeCalendar function.
 * - SummarizeCalendarOutput: The Zod schema for the output of the summarizeCalendar function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import type { CalendarEvent } from '@/lib/data';

// Define the Zod schema for the input, which is an array of calendar event objects.
// This ensures type safety and validation for the data passed to the flow.
const SummarizeCalendarInputSchema = z.array(
  z.object({
    id: z.string(),
    title: z.string(),
    date: z.string(),
    startTime: z.string(),
    endTime: z.string(),
    category: z.string(),
    participants: z.array(z.string()),
  })
);
export type SummarizeCalendarInput = z.infer<typeof SummarizeCalendarInputSchema>;

// Define the Zod schema for the output, which is a single string containing the calendar summary.
const SummarizeCalendarOutputSchema = z.string();
export type SummarizeCalendarOutput = z.infer<typeof SummarizeCalendarOutputSchema>;


/**
 * An asynchronous function that serves as a wrapper for the Genkit calendar summarization flow.
 * @param {CalendarEvent[]} events - An array of calendar events for the day.
 * @returns {Promise<string>} A promise that resolves to a string summary of the calendar events.
 */
export async function summarizeCalendar(events: CalendarEvent[]): Promise<string> {
  if (events.length === 0) {
    return "Für heute stehen keine Termine im Kalender.";
  }
  return await summarizeCalendarFlow(events);
}

// Define the Genkit prompt for summarizing calendar events.
// The prompt guides the AI on its role, the task, and the expected output format.
const summarizeCalendarPrompt = ai.definePrompt({
  name: 'summarizeCalendarPrompt',
  input: { schema: SummarizeCalendarInputSchema },
  output: { schema: SummarizeCalendarOutputSchema },
  prompt: `
    You are a helpful assistant in an office app called "OfficeZen".
    Your task is to summarize the user's calendar for the day.
    Focus on the schedule, highlight key meetings, and mention any free blocks of time.
    Keep the summary concise and easy to digest. Address the user in a friendly but professional tone.
    The output should be a single string.

    Here are today's calendar events:
    {{#each input}}
    - Event: {{title}} ({{startTime}} - {{endTime}})
    {{/each}}
  `,
});

// Define the Genkit flow for summarizing the calendar.
// This flow orchestrates the call to the AI model via the defined prompt.
const summarizeCalendarFlow = ai.defineFlow(
  {
    name: 'summarizeCalendarFlow',
    inputSchema: SummarizeCalendarInputSchema,
    outputSchema: SummarizeCalendarOutputSchema,
  },
  async (events) => {
    const { output } = await summarizeCalendarPrompt(events);
    return output || "Kalender-Zusammenfassung konnte nicht erstellt werden.";
  }
);
