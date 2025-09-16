'use server';
/**
 * @fileOverview A chatbot flow that can answer questions based on user's data and perform actions.
 *
 * - chatbotFlow - A function that takes a question and context data and returns an answer.
 * - ChatbotInput - The input type for the chatbotFlow function.
 * - ChatbotOutput - The return type for the chatbotFlow function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { calendarEvents } from '@/lib/data';

const EmailSchema = z.object({
  sender: z.string(),
  subject: z.string(),
  snippet: z.string(),
});

const CalendarEventSchema = z.object({
  id: z.string(),
  title: z.string(),
  date: z.string(), // YYYY-MM-DD
  startTime: z.string(), // HH:mm
  endTime: z.string(), // HH:mm
  category: z.enum(['Meeting', 'Personal', 'Team Event']),
  participants: z.array(z.string()), // user IDs
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

// === DEFINE TOOLS ===

const createCalendarEventTool = ai.defineTool(
    {
        name: 'createCalendarEvent',
        description: 'Erstellt einen neuen Termin im Kalender des Benutzers. Frage nach allen notwendigen Informationen, bevor du das Tool aufrufst.',
        inputSchema: z.object({
            title: z.string().describe("Der Titel des Termins."),
            date: z.string().describe("Das Datum des Termins im Format YYYY-MM-DD."),
            startTime: z.string().describe("Die Startzeit im Format HH:mm."),
            endTime: z.string().describe("Die Endzeit im Format HH:mm."),
        }),
        outputSchema: z.object({
            success: z.boolean(),
            message: z.string(),
        })
    },
    async (input) => {
        console.log('Creating calendar event:', input);
        
        // In a real application, you would save this to a database.
        // For this demo, we'll just add it to the in-memory array.
        const newEvent = {
            id: `evt${calendarEvents.length + 1}`,
            participants: ['1'], // Assume current user
            category: 'Meeting' as const,
            ...input,
        };
        calendarEvents.push(newEvent);

        return { success: true, message: `Termin "${input.title}" wurde erfolgreich erstellt.` };
    }
);

const prompt = ai.definePrompt({
  name: 'chatbotPrompt',
  input: {schema: ChatbotInputSchema},
  output: {schema: ChatbotOutputSchema},
  tools: [createCalendarEventTool],
  prompt: `Du bist ein intelligenter persönlicher Assistent namens "OfficeZen-Bot". Deine Aufgabe ist es, Fragen basierend auf den vom Benutzer bereitgestellten Daten (E-Mails, Kalenderereignisse und Notizen) zu beantworten und Aktionen für ihn auszuführen.

Regeln:
- Antworte immer auf Deutsch.
- Sei prägnant und hilfsbereit.
- Beziehe dich direkt auf die bereitgestellten Daten, um die Fragen zu beantworten.
- Wenn die Daten nicht ausreichen, um die Frage zu beantworten, gib an, dass du die Antwort nicht in den verfügbaren Informationen finden kannst. Erfinde keine Informationen.
- Fasse Informationen zusammen, identifiziere Aktionspunkte und stelle Verbindungen zwischen verschiedenen Datenpunkten her.
- Du kannst Aktionen ausführen! Nutze die verfügbaren Tools, um Aufgaben wie das Erstellen von Terminen zu erledigen.
- Wenn der Benutzer eine Aktion ausführen möchte, stelle sicher, dass du alle notwendigen Informationen hast (z.B. für einen Termin: Titel, Datum, Uhrzeit), bevor du das entsprechende Tool aufrufst. Frage aktiv nach, wenn etwas fehlt.

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

Basierend auf den obigen Informationen, beantworte die Frage des Benutzers oder führe die gewünschte Aktion aus.`,
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
