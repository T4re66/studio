'use server';
/**
 * @fileOverview A flow to summarize a daily briefing from emails, calendar events, and notes.
 *
 * - summarizeBriefing - A function that handles summarizing the daily briefing.
 * - SummarizeBriefingInput - The input type for the summarizeBriefing function.
 * - SummarizeBriefingOutput - The return type for the summarizeBriefing function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EmailSchema = z.object({
  sender: z.string(),
  subject: z.string(),
  snippet: z.string(),
});

const CalendarEventSchema = z.object({
  title: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  category: z.string(),
});

const NoteSchema = z.object({
    title: z.string(),
    content: z.string(),
    date: z.string(),
    tags: z.array(z.string()),
});

export const SummarizeBriefingInputSchema = z.object({
  emails: z.array(EmailSchema),
  events: z.array(CalendarEventSchema),
  notes: z.array(NoteSchema),
});
export type SummarizeBriefingInput = z.infer<typeof SummarizeBriefingInputSchema>;

const SummarizeBriefingOutputSchema = z.object({
  emailSummary: z.string().describe('A concise summary of the most important emails, written in German. Focus on action items.'),
  calendarSummary: z.string().describe('A concise summary of the upcoming calendar events, written in German. Mention the most important event.'),
  notesSummary: z.string().describe('A summary of the notes, connecting them to emails and calendar events to draw conclusions and identify action items. Written in German.'),
});
export type SummarizeBriefingOutput = z.infer<typeof SummarizeBriefingOutputSchema>;

export async function summarizeBriefing(input: SummarizeBriefingInput): Promise<SummarizeBriefingOutput> {
  return summarizeBriefingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeBriefingPrompt',
  input: {schema: SummarizeBriefingInputSchema},
  output: {schema: SummarizeBriefingOutputSchema},
  prompt: `You are an expert personal assistant. Your task is to create a daily briefing in German based on the provided emails, calendar events, and notes.

Analyze all the information and create three distinct summaries:
1.  **Email Summary**: Summarize the most important and urgent emails. Identify any action items, deadlines, or key decisions.
2.  **Calendar Summary**: Summarize the calendar events for the day. Focus on the most important meetings and appointments.
3.  **Notes Summary**: This is the most critical part. Analyze the notes and find connections to the provided emails and calendar events. Draw conclusions, identify cross-references, and highlight any resulting action items or conflicts. For example, if a note mentions a task that is also discussed in an email or related to a meeting, point that out.

Here is the information for today:

**Emails:**
{{#if emails.length}}
  {{#each emails}}
  - From: {{sender}}, Subject: {{subject}}, Snippet: {{snippet}}
  {{/each}}
{{else}}
  No emails for today.
{{/if}}

**Calendar Events:**
{{#if events.length}}
  {{#each events}}
  - Title: {{title}}, Time: {{startTime}} - {{endTime}}, Category: {{category}}
  {{/each}}
{{else}}
  No calendar events for today.
{{/if}}

**Notes:**
{{#if notes.length}}
    {{#each notes}}
    - Title: {{title}}, Date: {{date}}, Tags: {{#each tags}}{{.}}, {{/each}}
      Content: {{{content}}}
    {{/each}}
{{else}}
    No notes available.
{{/if}}

Provide a concise summary for each category in German.
`,
});

const summarizeBriefingFlow = ai.defineFlow(
  {
    name: 'summarizeBriefingFlow',
    inputSchema: SummarizeBriefingInputSchema,
    outputSchema: SummarizeBriefingOutputSchema,
  },
  async ({ emails, events, notes }) => {
    const hasContent = emails.length > 0 || events.length > 0 || notes.length > 0;

    if (!hasContent) {
      return {
        emailSummary: "Dein Posteingang ist leer.",
        calendarSummary: "Keine Termine für heute.",
        notesSummary: "Keine Notizen zum Analysieren vorhanden.",
      };
    }
    
    try {
      const {output} = await prompt({ emails, events, notes });
      return output!;
    } catch (e) {
      console.error(e);
      return {
        emailSummary: "Zusammenfassung konnte nicht geladen werden.",
        calendarSummary: "Zusammenfassung konnte nicht geladen werden.",
        notesSummary: "Zusammenfassung konnte nicht geladen werden.",
      };
    }
  }
);
