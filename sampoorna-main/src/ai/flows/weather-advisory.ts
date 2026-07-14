'use server';
/**
 * @fileOverview An AI agent that provides localized, crop-specific weather advisories.
 *
 * - getWeatherAdvisory - A function that handles the weather advisory process.
 * - WeatherAdvisoryInput - The input type for the getWeatherAdvisory function.
 * - WeatherAdvisoryOutput - The return type for the getWeatherAdvisory function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const WeatherAdvisoryInputSchema = z.object({
  cropType: z.string().describe('The type of crop.'),
  location: z.string().describe('The location of the farm.'),
  farmingStage: z.string().describe('The current farming stage (e.g., planting, growing, harvesting).'),
  language: z.string().describe('The language for the response (e.g., "en", "hi", "kn").'),
});
export type WeatherAdvisoryInput = z.infer<typeof WeatherAdvisoryInputSchema>;

const WeatherAdvisoryOutputSchema = z.object({
  advisory: z.string().describe('A weather advisory specific to the crop, location, and farming stage.'),
});
export type WeatherAdvisoryOutput = z.infer<typeof WeatherAdvisoryOutputSchema>;

export async function getWeatherAdvisory(input: WeatherAdvisoryInput): Promise<WeatherAdvisoryOutput> {
  return weatherAdvisoryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'weatherAdvisoryPrompt',
  input: {schema: WeatherAdvisoryInputSchema},
  output: {schema: WeatherAdvisoryOutputSchema},
  prompt: `You are an expert agricultural advisor providing weather advisories to farmers.

  Provide a weather advisory for the following:

  Respond entirely in the following language: {{{language}}}.

  Crop Type: {{{cropType}}}
  Location: {{{location}}}
  Farming Stage: {{{farmingStage}}}

  Consider recent weather patterns and provide specific recommendations to protect the harvest.`,
});

const weatherAdvisoryFlow = ai.defineFlow(
  {
    name: 'weatherAdvisoryFlow',
    inputSchema: WeatherAdvisoryInputSchema,
    outputSchema: WeatherAdvisoryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
