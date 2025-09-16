'use server';
/**
 * @fileOverview A chatbot flow that can answer questions based on user's data.
 *
 * - chatbotFlow - A function that takes a question and context data and returns an answer.
 * - ChatbotInput - The input type for the chatbotFlow function.
 * - ChatbotOutput - The return type for the chatbotFlow function.
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

const ChatbotInputSchema = z.object({
  question: z.string().describe('The user\'s question to the chatbot.'),
  emails: z.array(EmailSchema),
  events: z.array(CalendarEventSchema),
  notes: z.array(NoteSchema),
});
export type ChatbotInput = z.infer<typeof ChatbotInputSchema>;

const ChatbotOutputSchema = z.object({
  answer: z.string().describe('The chatbot\'s answer to the question, written in German.'),
});
export type ChatbotOutput = z.infer<typeof ChatbotOutputSchema>;


export async function chatbotFlow(input: ChatbotInput): Promise<ChatbotOutput> {
  return internalChatbotFlow(input);
}


const prompt = ai.definePrompt({
  name: 'chatbotPrompt',
  input: {schema: ChatbotInputSchema},
  output: {schema: ChatbotOutputSchema},
  prompt: `Du bist ein intelligenter persönlicher Assistent namens "OfficeZen-Bot". Deine Aufgabe ist es, Fragen basierend auf den vom Benutzer bereitgestellten Daten (E-Mails, Kalenderereignisse und Notizen) zu beantworten.

Regeln:
- Antworte immer auf Deutsch.
- Sei prägnant und hilfsbereit.
- Beziehe dich direkt auf die bereitgestellten Daten, um die Fragen zu beantworten.
- Wenn die Daten nicht ausreichen, um die Frage zu beantworten, gib an, dass du die Antwort nicht in den verfügbaren Informationen finden kannst. Erfinde keine Informationen.
- Fasse Informationen zusammen, identifiziere Aktionspunkte und stelle Verbindungen zwischen verschiedenen Datenpunkten her.

Hier sind die Daten des Benutzers:

**E-Mails:**
{{#if emails.length}}
  {{#each emails}}
  - Von: {{sender}}, Betreff: {{subject}}, Inhalt: {{snippet}}
  {{/each}}
{{else}}
  Keine E-Mails vorhanden.
{{/if}}

**Kalenderereignisse:**
{{#if events.length}}
  {{#each events}}
  - Titel: {{title}}, Zeit: {{startTime}} - {{endTime}}, Kategorie: {{category}}
  {{/each}}
{{else}}
  Keine Kalenderereignisse vorhanden.
{{/if}}

**Notizen:**
{{#if notes.length}}
    {{#each notes}}
    - Titel: {{title}}, Datum: {{date}}, Tags: {{#each tags}}{{.}}, {{/each}}
      Inhalt: {{{content}}}
    {{/each}}
{{else}}
    Keine Notizen vorhanden.
{{/if}}

---

Benutzerfrage: "{{question}}"

Basierend auf den obigen Informationen, beantworte die Frage des Benutzers.`,
});

const internalChatbotFlow = ai.defineFlow(
  {
    name: 'chatbotFlow',
    inputSchema: ChatbotInputSchema,
    outputSchema: ChatbotOutputSchema,
  },
  async (input) => {
    
    const {output} = await prompt(input);
    return output!;
  }
);
