'use server';

/**
 * @fileOverview A crop health diagnosis AI agent.
 *
 * - diagnoseCropHealth - A function that handles the crop health diagnosis process.
 * - DiagnoseCropHealthInput - The input type for the diagnoseCropHealth function.
 * - DiagnoseCropHealthOutput - The return type for the diagnoseCropHealth function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DiagnoseCropHealthInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a plant, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  cropName: z.string().describe('The name of the crop.'),
  symptoms: z.string().describe('The symptoms observed on the crop.'),
  language: z.string().describe('The language for the response (e.g., "en", "hi", "kn").'),
});
export type DiagnoseCropHealthInput = z.infer<typeof DiagnoseCropHealthInputSchema>;

const DiagnoseCropHealthOutputSchema = z.object({
  diagnosis: z.string().describe('The diagnosis of the crop health issue.'),
  treatmentRecommendations: z
    .string()
    .describe('The treatment recommendations for the diagnosed crop health issue.'),
});
export type DiagnoseCropHealthOutput = z.infer<typeof DiagnoseCropHealthOutputSchema>;

export async function diagnoseCropHealth(
  input: DiagnoseCropHealthInput
): Promise<DiagnoseCropHealthOutput> {
  return diagnoseCropHealthFlow(input);
}

const prompt = ai.definePrompt({
  name: 'diagnoseCropHealthPrompt',
  input: {schema: DiagnoseCropHealthInputSchema},
  output: {schema: DiagnoseCropHealthOutputSchema},
  prompt: `You are an expert in diagnosing crop health issues and providing treatment recommendations to farmers.

  A farmer has provided the following information about their ailing plant. Analyze the photo, crop name, and symptoms to provide a diagnosis and treatment recommendations.

  Respond entirely in the following language: {{{language}}}.

  Crop Name: {{{cropName}}}
  Symptoms: {{{symptoms}}}
  Photo: {{media url=photoDataUri}}

  Respond with a diagnosis and treatment recommendations.
  Diagnosis:
  Treatment Recommendations:`,
});

const diagnoseCropHealthFlow = ai.defineFlow(
  {
    name: 'diagnoseCropHealthFlow',
    inputSchema: DiagnoseCropHealthInputSchema,
    outputSchema: DiagnoseCropHealthOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
