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

const WeatherAdvisoryPromptInputSchema = z.object({
  cropType: z.string(),
  location: z.string(),
  farmingStage: z.string(),
  language: z.string(),
  weatherData: z.string(),
});

const WeatherAdvisoryOutputSchema = z.object({
  advisory: z.string().describe('A weather advisory specific to the crop, location, and farming stage.'),
});
export type WeatherAdvisoryOutput = z.infer<typeof WeatherAdvisoryOutputSchema>;

export async function getWeatherAdvisory(input: WeatherAdvisoryInput): Promise<WeatherAdvisoryOutput> {
  return weatherAdvisoryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'weatherAdvisoryPrompt',
  input: {schema: WeatherAdvisoryPromptInputSchema},
  output: {schema: WeatherAdvisoryOutputSchema},
  prompt: `You are an expert agricultural advisor providing weather advisories to farmers.

  Provide a detailed weather advisory for the farmer based on the following real-time weather conditions:
  
  Weather Data:
  {{{weatherData}}}

  Respond entirely in the following language: {{{language}}}.

  Crop Type: {{{cropType}}}
  Location: {{{location}}}
  Farming Stage: {{{farmingStage}}}

  Consider these weather patterns and provide specific, actionable recommendations (e.g., watering, pest control, harvesting times) to protect the crop and optimize the farm work.`,
});

const weatherAdvisoryFlow = ai.defineFlow(
  {
    name: 'weatherAdvisoryFlow',
    inputSchema: WeatherAdvisoryInputSchema,
    outputSchema: WeatherAdvisoryOutputSchema,
  },
  async input => {
    let weatherData = "";
    try {
      const apiKey = process.env.OPENWEATHER_API_KEY || '0b43bc517b9250fe6cbf0e4425591e30';
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(input.location)}&appid=${apiKey}&units=metric`;
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        weatherData = `Current Weather for ${data.name}:
- Temperature: ${data.main.temp}°C (Feels like: ${data.main.feels_like}°C)
- Conditions: ${data.weather[0].main} (${data.weather[0].description})
- Humidity: ${data.main.humidity}%
- Wind Speed: ${data.wind.speed} m/s`;
      } else {
        console.warn(`OpenWeather API returned status ${response.status}. Using fallback weather data.`);
        weatherData = `Current Weather for ${input.location} (Estimated):
- Temperature: 28°C
- Conditions: Part cloudy, occasional breeze
- Humidity: 60%
- Wind Speed: 3.5 m/s`;
      }
    } catch (err) {
      console.error("Failed to fetch from OpenWeather API:", err);
      weatherData = `Current Weather for ${input.location} (Estimated):
- Temperature: 28°C
- Conditions: Part cloudy, occasional breeze
- Humidity: 60%
- Wind Speed: 3.5 m/s`;
    }

    const {output} = await prompt({
      ...input,
      weatherData,
    });
    return output!;
  }
);
