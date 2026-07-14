'use server';
/**
 * @fileOverview An AI agent that provides personalized farming tips.
 *
 * - getFarmingTips - A function that handles the farming tips generation process.
 * - FarmingTipsInput - The input type for the getFarmingTips function.
 * - FarmingTipsOutput - The return type for the getFarmingTips function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FarmingTipsInputSchema = z.object({
  cropName: z.string().describe('The name of the crop.'),
  farmingStage: z.string().describe('The current farming stage (e.g., planting, growing, harvesting).'),
  soilType: z.string().optional().describe('The type of soil in the farm.'),
  language: z.string().describe('The language for the response (e.g., "en", "hi", "kn").'),
});
export type FarmingTipsInput = z.infer<typeof FarmingTipsInputSchema>;

const FarmingTipsOutputSchema = z.object({
  category: z.string().describe('The general category of the provided tips (e.g., "General Care", "Pest Management", "Fertilization").'),
  tips: z.array(z.string()).describe('A list of personalized farming tips.'),
  relatedVideos: z.array(z.object({
    title: z.string().describe('The title of the related YouTube video.'),
    url: z.string().url().describe('The URL of the related YouTube video.'),
  })).describe('A list of related YouTube videos for further guidance.'),
});
export type FarmingTipsOutput = z.infer<typeof FarmingTipsOutputSchema>;

export async function getFarmingTips(
  input: FarmingTipsInput
): Promise<FarmingTipsOutput> {
  return getFarmingTipsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getFarmingTipsPrompt',
  input: {schema: FarmingTipsInputSchema},
  output: {schema: FarmingTipsOutputSchema},
  prompt: `You are an expert agricultural advisor. A farmer needs personalized tips for their crop.

  Generate a set of clear, actionable tips based on the following information. Also, provide a category for the tips and links to 2-3 relevant YouTube videos that could provide more detailed visual guidance.

  Respond entirely in the following language: {{{language}}}.

  Crop Name: {{{cropName}}}
  Farming Stage: {{{farmingStage}}}
  {{#if soilType}}
  Soil Type: {{{soilType}}}
  {{/if}}

  Provide practical tips for the farmer.
  The tips should be concise and easy to understand.
  The related videos should be from reputable sources if possible.
  `,
});

const getFarmingTipsFlow = ai.defineFlow(
  {
    name: 'getFarmingTipsFlow',
    inputSchema: FarmingTipsInputSchema,
    outputSchema: FarmingTipsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
