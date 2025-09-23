'use server';
/**
 * @fileOverview Defines the primary Genkit flow for the OfficeZen chatbot assistant.
 *
 * - chat: The main function to interact with the chatbot.
 * - ChatInput: The Zod schema for the chat function's input.
 * - ChatOutput: The Zod schema for the chat function's output.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import type { Email, CalendarEvent, Note } from '@/lib/data';

// Schemas for data structures the AI will use.
const EmailSchema = z.object({
  id: z.string(),
  sender: z.string(),
  subject: z.string(),
  snippet: z.string(),
  isRead: z.boolean(),
  timestamp: z.string(),
});

const CalendarEventSchema = z.object({
  id: z.string(),
  title: z.string(),
  date: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  category: z.string(),
  participants: z.array(z.string()),
});

const NoteSchema = z.object({
    id: z.string(),
    title: z.string(),
    content: z.string(),
    date: z.string(),
    tags: z.array(z.string()),
    userId: z.string(),
});


// Input schema for the main chat flow.
export const ChatInputSchema = z.object({
  message: z.string().describe('The user\'s message to the chatbot.'),
  history: z.array(z.object({
    role: z.enum(['user', 'bot']),
    content: z.string(),
  })).describe('The history of the conversation.'),
  context: z.object({
    emails: z.array(EmailSchema),
    events: z.array(CalendarEventSchema),
    notes: z.array(NoteSchema),
  }).describe('The user\'s current data context.'),
});
export type ChatInput = z.infer<typeof ChatInputSchema>;

export const ChatOutputSchema = z.string().describe('The chatbot\'s response.');
export type ChatOutput = z.infer<typeof ChatOutputSchema>;


/**
 * Asynchronous wrapper function for the chatbot Genkit flow.
 * @param {ChatInput} input - The user's message, history, and data context.
 * @returns {Promise<string>} A promise that resolves to the chatbot's response.
 */
export async function chat(input: ChatInput): Promise<string> {
  return await chatbotFlow(input);
}


// Tool for the AI to get relevant data.
const getData = ai.defineTool(
  {
    name: 'getData',
    description: 'Get relevant data such as emails, calendar events, or notes to answer a user\'s question.',
    inputSchema: z.object({
        dataType: z.enum(['emails', 'events', 'notes']).describe('The type of data to retrieve.'),
        query: z.string().optional().describe('A search query to filter the data.'),
    }),
    outputSchema: z.union([
        z.array(EmailSchema),
        z.array(CalendarEventSchema),
        z.array(NoteSchema),
    ]),
  },
  async (input) => {
    // In this simplified version, the data is already in the context.
    // A more advanced version would query Firestore or Google APIs here based on the input.
    // For now, we return the data from the context passed into the flow.
    // The LLM will still use this tool to "decide" what data it needs.
    const flowState = chatbotFlow.state()
    if (!flowState) {
        return [];
    }
    
    switch (input.dataType) {
        case 'emails':
            return flowState.input.context.emails;
        case 'events':
            return flowState.input.context.events;
        case 'notes':
            return flowState.input.context.notes;
        default:
            return [];
    }
  }
);


// Define the main chatbot prompt.
const chatbotPrompt = ai.definePrompt({
    name: 'chatbotPrompt',
    tools: [getData],
    input: { schema: ChatInputSchema },
    output: { schema: ChatOutputSchema },
    prompt: `You are a helpful and friendly AI assistant for an office application called "OfficeZen".
Your name is Zen. You are concise and get straight to the point.
You have access to the user's emails, calendar events, and personal notes.
Use the tools available to you to answer the user's questions and perform actions.
When summarizing or referencing data, be brief. If you use information from a specific source (like an email or a note), mention it briefly (e.g., "According to an email from...").

Here is the conversation history:
{{#each history}}
- {{role}}: {{content}}
{{/each}}

User's new message: {{{message}}}
`,
});

// Define the main Genkit flow for the chatbot.
const chatbotFlow = ai.defineFlow(
  {
    name: 'chatbotFlow',
    inputSchema: ChatInputSchema,
    outputSchema: ChatOutputSchema,
  },
  async (input) => {
    const { output } = await chatbotPrompt(input);
    return output || "Ich konnte leider keine Antwort finden.";
  }
);
