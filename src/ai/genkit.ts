'use server';
/**
 * @fileoverview This file initializes the Genkit AI instance with necessary plugins.
 * It ensures that Genkit is configured once and can be used across the application.
 */
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

// Initialize Genkit with the Google AI plugin.
// This configuration allows the application to use Google's generative AI models.
export const ai = genkit({
  plugins: [
    googleAI({
      // Specify the API version to ensure compatibility and access to the latest features.
      apiVersion: 'v1beta',
    }),
  ],
});
