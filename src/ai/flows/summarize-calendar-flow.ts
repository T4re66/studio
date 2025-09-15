'use server';
/**
 * @fileOverview A flow to summarize calendar events.
 *
 * - summarizeCalendar - A function that handles summarizing calendar events.
 * - SummarizeCalendarInput - The input type for the summarizeCalendar function.
 * - SummarizeCalendarOutput - The return type for the summarizeCalendar function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CalendarEventSchema = z.object({
  title: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  category: z.string(),
});

export type SummarizeCalendarInput = z.infer<typeof CalendarEventSchema>[];

const SummarizeCalendarOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the upcoming calendar events for the day, written in German. Mention the most important event.'),
});
export type SummarizeCalendarOutput = z.infer<typeof SummarizeCalendarOutputSchema>;

export async function summarizeCalendar(input: SummarizeCalendarInput): Promise<SummarizeCalendarOutput> {
  return summarizeCalendarFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeCalendarPrompt',
  input: {schema: z.array(CalendarEventSchema)},
  output: {schema: SummarizeCalendarOutputSchema},
  prompt: `You are an expert personal assistant. Your task is to summarize the following list of calendar events for the day.
  Focus on the most important meetings and appointments.
  Provide a concise summary in German.

  Here are the events:
  {{#each this}}
  - Title: {{title}}, Time: {{startTime}} - {{endTime}}, Category: {{category}}
  {{/each}}
  `,
});

const summarizeCalendarFlow = ai.defineFlow(
  {
    name: 'summarizeCalendarFlow',
    inputSchema: z.array(CalendarEventSchema),
    outputSchema: SummarizeCalendarOutputSchema,
  },
  async (events) => {
    if (events.length === 0) {
      return { summary: "Für heute stehen keine Termine im Kalender. Geniesse den freien Tag!" };
    }
    
    try {
      const {output} = await prompt(events);
      return output!;
    } catch (e) {
      console.error(e);
      return { summary: "Zusammenfassung konnte nicht geladen werden. Bitte versuchen Sie es später erneut." };
    }
  }
);
