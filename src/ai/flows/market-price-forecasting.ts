'use server';
/**
 * @fileOverview Market price forecasting AI agent.
 *
 * - getMarketPriceForecast - A function that handles the market price forecast process.
 * - MarketPriceForecastInput - The input type for the getMarketPriceForecast function.
 * - MarketPriceForecastOutput - The return type for the getMarketPriceForecast function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MarketPriceForecastInputSchema = z.object({
  crop: z.string().describe('The crop for which to forecast the market price.'),
  location: z.string().describe('The location where the crop is being grown.'),
  currentDate: z.string().describe('The current date.'),
  language: z.string().describe('The language for the response (e.g., "en", "hi", "kn").'),
});
export type MarketPriceForecastInput = z.infer<typeof MarketPriceForecastInputSchema>;

const MarketPriceForecastOutputSchema = z.object({
  forecast: z.string().describe('The AI-driven future price prediction for the crop.'),
  confidence: z.string().describe('The confidence level of the prediction.'),
  factors: z.string().describe('Factors influencing the price prediction.'),
});
export type MarketPriceForecastOutput = z.infer<typeof MarketPriceForecastOutputSchema>;

export async function getMarketPriceForecast(input: MarketPriceForecastInput): Promise<MarketPriceForecastOutput> {
  return marketPriceForecastFlow(input);
}

const prompt = ai.definePrompt({
  name: 'marketPriceForecastPrompt',
  input: {schema: MarketPriceForecastInputSchema},
  output: {schema: MarketPriceForecastOutputSchema},
  prompt: `You are an AI assistant that provides future market price predictions for crops to help farmers make informed decisions.

  Based on the crop, location, and current date, provide a future market price forecast, a confidence level for the prediction, and factors influencing the prediction.

  Respond entirely in the following language: {{{language}}}.

  Crop: {{{crop}}}
  Location: {{{location}}}
  Current Date: {{{currentDate}}}`,
});

const marketPriceForecastFlow = ai.defineFlow(
  {
    name: 'marketPriceForecastFlow',
    inputSchema: MarketPriceForecastInputSchema,
    outputSchema: MarketPriceForecastOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
