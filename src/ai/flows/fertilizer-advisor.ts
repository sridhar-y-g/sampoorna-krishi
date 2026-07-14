'use server';
/**
 * @fileOverview An AI agent that provides personalized fertilizer recommendations.
 *
 * - getFertilizerAdvice - A function that handles the fertilizer recommendation process.
 * - FertilizerAdviceInput - The input type for the getFertilizerAdvice function.
 * - FertilizerAdviceOutput - The return type for the getFertilizerAdvice function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FertilizerAdviceInputSchema = z.object({
  cropName: z.string().describe('The name of the crop.'),
  farmingStage: z.string().describe('The current farming stage (e.g., planting, growing, harvesting).'),
  soilType: z.string().optional().describe('The type of soil in the farm.'),
  language: z.string().describe('The language for the response (e.g., "en", "hi", "kn").'),
});
export type FertilizerAdviceInput = z.infer<typeof FertilizerAdviceInputSchema>;

const FertilizerRecommendationSchema = z.object({
    fertilizerName: z.string().describe("The name of the recommended fertilizer (e.g., 'DAP (Diammonium Phosphate)')."),
    recommendationReason: z.string().describe('A detailed explanation of why this fertilizer is recommended for the given crop and stage.'),
    applicationGuidance: z.string().describe('Specific instructions on how to apply the fertilizer.'),
    typicalAmount: z.string().describe('The typical application amount (e.g., "100-150 kg/ha").'),
});

const FertilizerAdviceOutputSchema = z.object({
  recommendations: z.array(FertilizerRecommendationSchema).describe('A list of detailed fertilizer recommendations.'),
  generalNotes: z.string().describe('General notes or disclaimers about the recommendations provided.'),
});
export type FertilizerAdviceOutput = z.infer<typeof FertilizerAdviceOutputSchema>;

export async function getFertilizerAdvice(
  input: FertilizerAdviceInput
): Promise<FertilizerAdviceOutput> {
  return getFertilizerAdviceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getFertilizerAdvicePrompt',
  input: {schema: FertilizerAdviceInputSchema},
  output: {schema: FertilizerAdviceOutputSchema},
  prompt: `You are an expert agricultural advisor specializing in soil science and crop nutrition. A farmer needs fertilizer recommendations.

  Generate a set of 2-3 detailed fertilizer recommendations based on the following information. For each recommendation, provide the fertilizer name, why it's recommended, application guidance, and a typical amount. Also, include some general notes at the end.

  Respond entirely in the following language: {{{language}}}.

  Crop Name: {{{cropName}}}
  Farming Stage: {{{farmingStage}}}
  {{#if soilType}}
  Soil Type: {{{soilType}}}
  {{/if}}

  Provide practical, actionable advice. The recommendations should be clear and easy for a farmer to understand and implement.
  `,
});

const getFertilizerAdviceFlow = ai.defineFlow(
  {
    name: 'getFertilizerAdviceFlow',
    inputSchema: FertilizerAdviceInputSchema,
    outputSchema: FertilizerAdviceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
