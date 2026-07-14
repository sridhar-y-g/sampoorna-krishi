'use server';
/**
 * @fileOverview An AI agent that provides a preliminary assessment of crop damage for insurance purposes.
 *
 * - getCropDamageAssessment - A function that handles the crop damage assessment process.
 * - CropDamageAssessmentInput - The input type for the getCropDamageAssessment function.
 * - CropDamageAssessmentOutput - The return type for the getCropDamageAssessment function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CropDamageAssessmentInputSchema = z.object({
  cropType: z.string().describe('The type of crop that was damaged.'),
  location: z.string().describe('The location of the farm (e.g., village, district, state).'),
  incidentDate: z.string().describe('The date the damage-causing incident occurred (e.g., YYYY-MM-DD).'),
  incidentDescription: z.string().describe('A brief description of the incident (e.g., "Heavy rainfall and flooding", "Hailstorm", "Drought conditions").'),
  language: z.string().describe('The language for the response (e.g., "en", "hi", "kn").'),
});
export type CropDamageAssessmentInput = z.infer<typeof CropDamageAssessmentInputSchema>;

const CropDamageAssessmentOutputSchema = z.object({
  estimatedDamagePercentage: z.number().min(0).max(100).describe('A numerical estimate of the percentage of crop damage, from 0 to 100.'),
  confidence: z.enum(['High', 'Medium', 'Low']).describe('The confidence level of the assessment.'),
  assessmentSummary: z.string().describe('A detailed summary of the damage assessment, referencing simulated satellite and weather data.'),
  nextSteps: z.array(z.string()).describe('A list of recommended next steps for the farmer to take.'),
  disclaimer: z.string().describe('A disclaimer that this is a preliminary estimate for guidance only.'),
});
export type CropDamageAssessmentOutput = z.infer<typeof CropDamageAssessmentOutputSchema>;


export async function getCropDamageAssessment(
  input: CropDamageAssessmentInput
): Promise<CropDamageAssessmentOutput> {
  return getCropDamageAssessmentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'cropDamageAssessmentPrompt',
  input: {schema: CropDamageAssessmentInputSchema},
  output: {schema: CropDamageAssessmentOutputSchema},
  prompt: `You are an AI agricultural insurance assessor. Your task is to provide a preliminary crop damage assessment based on user-provided details and simulated environmental data.

  Analyze the information provided below. Based on a simulated analysis of satellite imagery (NDVI and moisture levels) and weather data for the given location and date, generate a damage assessment.

  Respond entirely in the following language: {{{language}}}.

  - Crop Type: {{{cropType}}}
  - Location: {{{location}}}
  - Incident Date: {{{incidentDate}}}
  - Incident Description: {{{incidentDescription}}}

  Your assessment must include:
  1.  An 'estimatedDamagePercentage' (0-100).
  2.  A 'confidence' level ('High', 'Medium', or 'Low') for your assessment.
  3.  A detailed 'assessmentSummary' explaining the damage. Fabricate plausible details from simulated satellite (NDVI, soil moisture) and weather data. For example: "Based on analysis of simulated satellite imagery (NDVI and moisture levels) and weather data for [Location] on [Date], which confirms reports of [Incident], we estimate the damage to the [Crop] to be significant. Satellite data shows a considerable decrease in vegetation health and an increase in soil saturation in the affected region."
  4.  A list of 3-4 'nextSteps' for the farmer (e.g., document damage, contact agent, prepare land documents).
  5.  A standard 'disclaimer' stating that this is a preliminary estimate for guidance and the final claim will be determined by a field survey.
  `,
});

const getCropDamageAssessmentFlow = ai.defineFlow(
  {
    name: 'getCropDamageAssessmentFlow',
    inputSchema: CropDamageAssessmentInputSchema,
    outputSchema: CropDamageAssessmentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
