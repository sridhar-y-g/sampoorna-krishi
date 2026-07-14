'use server';

/**
 * @fileOverview An AI agent that allows farmers to find applicable agricultural subsidies using natural language.
 *
 * - findSubsidies - A function that handles the subsidy finding process.
 * - FindSubsidiesInput - The input type for the findSubsidies function.
 * - FindSubsidiesOutput - The return type for the findSubsidies function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FindSubsidiesInputSchema = z.object({
  query: z
    .string()
    .describe("The farmer's natural language query for finding applicable agricultural subsidies."),
  language: z.string().describe('The language for the response (e.g., "en", "hi", "kn").'),
});
export type FindSubsidiesInput = z.infer<typeof FindSubsidiesInputSchema>;

const FindSubsidiesOutputSchema = z.object({
  subsidies: z
    .string()
    .describe('A list of applicable agricultural subsidies based on the farmer query.'),
});
export type FindSubsidiesOutput = z.infer<typeof FindSubsidiesOutputSchema>;

export async function findSubsidies(input: FindSubsidiesInput): Promise<FindSubsidiesOutput> {
  return findSubsidiesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'findSubsidiesPrompt',
  input: {schema: FindSubsidiesInputSchema},
  output: {schema: FindSubsidiesOutputSchema},
  prompt: `You are an agricultural expert specializing in Indian government subsidies for farmers.

You will use this information to locate all possible applicable subsidies for the farmer.

Respond entirely in the following language: {{{language}}}.

Query: {{{query}}}`,
});

const findSubsidiesFlow = ai.defineFlow(
  {
    name: 'findSubsidiesFlow',
    inputSchema: FindSubsidiesInputSchema,
    outputSchema: FindSubsidiesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
