'use server';

import {
  getWeatherAdvisory as getWeatherAdvisoryFlow,
  type WeatherAdvisoryInput,
  type WeatherAdvisoryOutput,
} from '@/ai/flows/weather-advisory';
import {
  diagnoseCropHealth as diagnoseCropHealthFlow,
  type DiagnoseCropHealthInput,
  type DiagnoseCropHealthOutput,
} from '@/ai/flows/crop-health-diagnosis';
import {
  findSubsidies as findSubsidiesFlow,
  type FindSubsidiesInput,
  type FindSubsidiesOutput,
} from '@/ai/flows/subsidy-finder';
import {
  getMarketPriceForecast as getMarketPriceForecastFlow,
  type MarketPriceForecastInput,
  type MarketPriceForecastOutput,
} from '@/ai/flows/market-price-forecasting';
import {
  textToSpeech as textToSpeechFlow,
  type TextToSpeechInput,
  type TextToSpeechOutput,
} from '@/ai/flows/text-to-speech';
import {
    getFarmingTips as getFarmingTipsFlow,
    type FarmingTipsInput,
    type FarmingTipsOutput,
} from '@/ai/flows/farming-tips';
import {
    getFertilizerAdvice as getFertilizerAdviceFlow,
    type FertilizerAdviceInput,
    type FertilizerAdviceOutput,
} from '@/ai/flows/fertilizer-advisor';
import {
    getCropDamageAssessment as getCropDamageAssessmentFlow,
    type CropDamageAssessmentInput,
    type CropDamageAssessmentOutput,
} from '@/ai/flows/crop-damage-assessment';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

export async function getWeatherAdvisory(
  input: WeatherAdvisoryInput,
): Promise<WeatherAdvisoryOutput> {
  const result = await getWeatherAdvisoryFlow(input);
  revalidatePath('/weather-advisory');
  return result;
}

export async function diagnoseCropHealth(
  input: DiagnoseCropHealthInput,
): Promise<DiagnoseCropHealthOutput> {
  const result = await diagnoseCropHealthFlow(input);
  revalidatePath('/crop-diagnosis');
  return result;
}

export async function findSubsidies(
  input: FindSubsidiesInput,
): Promise<FindSubsidiesOutput> {
  const result = await findSubsidiesFlow(input);
  revalidatePath('/subsidy-finder');
  return result;
}

export async function getMarketPriceForecast(
  input: MarketPriceForecastInput,
): Promise<MarketPriceForecastOutput> {
  const result = await getMarketPriceForecastFlow(input);
  revalidatePath('/market-price');
  return result;
}

export async function textToSpeech(
    input: TextToSpeechInput,
): Promise<TextToSpeechOutput> {
    const result = await textToSpeechFlow(input);
    return result;
}

export async function getFarmingTips(
    input: FarmingTipsInput,
): Promise<FarmingTipsOutput> {
    const result = await getFarmingTipsFlow(input);
    revalidatePath('/farming-tips');
    return result;
}

export async function getFertilizerAdvice(
    input: FertilizerAdviceInput,
): Promise<FertilizerAdviceOutput> {
    const result = await getFertilizerAdviceFlow(input);
    revalidatePath('/fertilizers');
    return result;
}

export async function getCropDamageAssessment(
    input: CropDamageAssessmentInput,
): Promise<CropDamageAssessmentOutput> {
    const result = await getCropDamageAssessmentFlow(input);
    revalidatePath('/crop-insurance');
    return result;
}
