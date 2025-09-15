'use server';
/**
 * @fileOverview Automatically scan new items added to the digital fridge using the device's camera,
 * suggest an appropriate portion size, and set an expiration reminder based on historical consumption patterns and OCR analysis of the item's printed expiration date
 *
 * - getExpirationReminder - A function that handles the fridge expiration process.
 * - GetExpirationReminderInput - The input type for the getExpirationReminder function.
 * - GetExpirationReminderOutput - The return type for the getExpirationReminder function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { analyzeConsumptionPatterns } from './services/fridge-service';
import { extractExpirationDate } from './services/ocr-service';

const GetExpirationReminderInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of the food item, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  itemDescription: z.string().describe('The description of the food item.'),
  historicalConsumptionData: z.string().optional().describe('Historical consumption data for similar items, if available.'),
});
export type GetExpirationReminderInput = z.infer<typeof GetExpirationReminderInputSchema>;

const GetExpirationReminderOutputSchema = z.object({
  portionSizeSuggestion: z.string().describe('Suggested portion size for the item.'),
  expirationReminder: z.string().describe('The date the item is likely to expire and should be consumed by.'),
});
export type GetExpirationReminderOutput = z.infer<typeof GetExpirationReminderOutputSchema>;

export async function getExpirationReminder(input: GetExpirationReminderInput): Promise<GetExpirationReminderOutput> {
  return getExpirationReminderFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getExpirationReminderPrompt',
  input: {schema: GetExpirationReminderInputSchema},
  output: {schema: GetExpirationReminderOutputSchema},
  prompt: `You are a helpful assistant that analyzes food items and provides portion size suggestions and expiration reminders to minimize food waste.

  Analyze the following food item:
  Description: {{{itemDescription}}}
  Photo: {{media url=photoDataUri}}
  Historical Consumption Data: {{{historicalConsumptionData}}}

  Consider the item description, analyze the photo, and take into account any historical consumption data to suggest a portion size and set an expiration reminder.
  In addition, use OCR to extract the expiration date from the photo. If no date can be extracted, make your best determination.
  Output the portion size suggestion and the expiration reminder in a clear and concise manner.
`,
});

const getExpirationReminderFlow = ai.defineFlow(
  {
    name: 'getExpirationReminderFlow',
    inputSchema: GetExpirationReminderInputSchema,
    outputSchema: GetExpirationReminderOutputSchema,
  },
  async input => {
    // Call OCR service to extract expiration date from the image
    const extractedDate = await extractExpirationDate(input.photoDataUri);

    // Call service to analyze consumption patterns
    const consumptionPatterns = await analyzeConsumptionPatterns(input.itemDescription, input.historicalConsumptionData);

    const promptInput = {
      ...input,
      extractedDate,
      consumptionPatterns,
    };

    const {output} = await prompt(promptInput);
    return output!;
  }
);
