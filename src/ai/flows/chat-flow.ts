
'use server';
/**
 * @fileOverview A basic AI chat flow.
 *
 * - chat - A function that handles basic chat interactions.
 * - ChatInput - The input type for the chat function.
 * - ChatOutput - The return type for the chat function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { APP_NAME } from '@/lib/constants';

const ChatInputSchema = z.object({
  message: z.string().describe('The user message to the AI assistant.'),
});
export type ChatInput = z.infer<typeof ChatInputSchema>;

const ChatOutputSchema = z.object({
  response: z.string().describe('The AI assistant\'s response to the user.'),
});
export type ChatOutput = z.infer<typeof ChatOutputSchema>;

export async function chat(input: ChatInput): Promise<ChatOutput> {
  return chatFlow(input);
}

const chatPrompt = ai.definePrompt({
  name: 'chatPrompt',
  input: {schema: ChatInputSchema},
  output: {schema: ChatOutputSchema},
  prompt: `You are a helpful AI assistant for '${APP_NAME}', a platform for intelligent content automation.
  Respond to the user's query concisely and helpfully.

  User's message: {{{message}}}`,
});

const chatFlow = ai.defineFlow(
  {
    name: 'chatFlow',
    inputSchema: ChatInputSchema,
    outputSchema: ChatOutputSchema,
  },
  async (input) => {
    const {output} = await chatPrompt(input);
    if (!output) {
      // Handle the case where output might be null or undefined
      // This could be due to safety filter blocks or other issues
      return { response: "I'm sorry, I couldn't generate a response at this time." };
    }
    return output;
  }
);

