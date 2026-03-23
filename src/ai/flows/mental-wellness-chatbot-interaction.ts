'use server';
/**
 * @fileOverview An empathetic AI companion chatbot for mental wellness support.
 *
 * - mentalWellnessChat - A function that handles the chatbot interaction.
 * - MentalWellnessChatInput - The input type for the mentalWellnessChat function.
 * - MentalWellnessChatOutput - The return type for the mentalWellnessChat function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MentalWellnessChatInputSchema = z
  .object({
    message: z.string().describe('The student\'s message to the chatbot.'),
  })
  .describe('Input for the mental wellness chatbot.');
export type MentalWellnessChatInput = z.infer<typeof MentalWellnessChatInputSchema>;

const MentalWellnessChatOutputSchema = z
  .object({
    response: z.string().describe('The empathetic response from the AI chatbot.'),
  })
  .describe('Output from the mental wellness chatbot.');
export type MentalWellnessChatOutput = z.infer<typeof MentalWellnessChatOutputSchema>;

export async function mentalWellnessChat(input: MentalWellnessChatInput): Promise<MentalWellnessChatOutput> {
  return mentalWellnessChatFlow(input);
}

const mentalWellnessChatPrompt = ai.definePrompt({
  name: 'mentalWellnessChatPrompt',
  input: {schema: MentalWellnessChatInputSchema},
  output: {schema: MentalWellnessChatOutputSchema},
  prompt: `You are an empathetic, supportive, and non-judgmental AI companion designed to help students during their breaks or stressful moments. Your goal is to listen, validate their feelings, and offer constructive and comforting responses.

Student: {{{message}}}

AI Companion:`,
});

const mentalWellnessChatFlow = ai.defineFlow(
  {
    name: 'mentalWellnessChatFlow',
    inputSchema: MentalWellnessChatInputSchema,
    outputSchema: MentalWellnessChatOutputSchema,
  },
  async input => {
    const {output} = await mentalWellnessChatPrompt(input);
    return output!;
  }
);
