'use server';
/**
 * @fileOverview This file implements a Genkit flow for suggesting mental wellness activities during study breaks.
 *
 * - suggestBreakActivity - A function that suggests a relevant mental wellness activity.
 * - SuggestBreakActivityInput - The input type for the suggestBreakActivity function.
 * - SuggestBreakActivityOutput - The return type for the suggestBreakActivity function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ActivityTypeSchema = z.enum(['game', 'music', 'chatbot', 'meditation']);

const SuggestBreakActivityInputSchema = z.object({
  preferredActivityTypes: z
    .array(ActivityTypeSchema)
    .describe('An array of preferred activity types for the break.'),
  currentMood: z
    .string()
    .optional()
    .describe('The current mood or emotional state of the student.'),
  focusDurationMinutes: z
    .number()
    .optional()
    .describe('The duration in minutes the student has been focusing.'),
});
export type SuggestBreakActivityInput = z.infer<
  typeof SuggestBreakActivityInputSchema
>;

const SuggestBreakActivityOutputSchema = z.object({
  activityType: ActivityTypeSchema.describe(
    'The type of mental wellness activity suggested.'
  ),
  title: z.string().describe('A title for the suggested activity.'),
  description: z
    .string()
    .describe('A brief description of the suggested activity.'),
  content: z
    .string()
    .describe(
      'Specific content for the activity (e.g., meditation script, song title, chatbot prompt).'}
    ),
  durationMinutes: z
    .number()
    .optional()
    .describe('The suggested duration for the activity in minutes.'),
});
export type SuggestBreakActivityOutput = z.infer<
  typeof SuggestBreakActivityOutputSchema
>;

export async function suggestBreakActivity(
  input: SuggestBreakActivityInput
): Promise<SuggestBreakActivityOutput> {
  return suggestBreakActivityFlow(input);
}

const suggestBreakActivityPrompt = ai.definePrompt({
  name: 'suggestBreakActivityPrompt',
  input: {schema: SuggestBreakActivityInputSchema},
  output: {schema: SuggestBreakActivityOutputSchema},
  prompt: `You are a mental wellness assistant designed to help students relax and recharge during study breaks.

Based on the student's preferences and current mood, suggest a brief mental wellness activity.

Preferred activity types: {{{preferredActivityTypes}}}
Currently, the student has been focusing for {{{focusDurationMinutes}}} minutes.
Current mood: {{{currentMood}}}

Choose ONE activity type from the preferred list. If no mood is provided, suggest something generally relaxing.
Provide a concise title, a brief description, and relevant content for the chosen activity.

- If 'music' is chosen, provide a relaxing song title and a brief description of its mood.
- If 'chatbot' is chosen, provide an initial welcoming prompt for the student to start a conversation.
- If 'meditation' is chosen, provide a short, simple guided meditation script.
- If 'game' is chosen, suggest a simple, quick mental game idea.

Ensure the output strictly follows the JSON schema for activityType, title, description, content, and an optional durationMinutes.`,
});

const suggestBreakActivityFlow = ai.defineFlow(
  {
    name: 'suggestBreakActivityFlow',
    inputSchema: SuggestBreakActivityInputSchema,
    outputSchema: SuggestBreakActivityOutputSchema,
  },
  async (input) => {
    const {output} = await suggestBreakActivityPrompt(input);
    return output!;
  }
);
