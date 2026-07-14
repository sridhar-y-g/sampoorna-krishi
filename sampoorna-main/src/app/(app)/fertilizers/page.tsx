'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PageHeader } from '@/components/page-header';
import { getFertilizerAdvice, textToSpeech } from '@/lib/actions';
import { FARMING_STAGES } from '@/lib/constants';
import { Input } from '@/components/ui/input';
import { Loader2, TestTube, Volume2, Waves } from 'lucide-react';
import type { FertilizerAdviceOutput } from '@/ai/flows/fertilizer-advisor';
import { useTranslation } from '@/hooks/use-translation';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const PageHeaderIcon = () => (
    <div className="bg-accent rounded-full p-3 mr-4">
        <TestTube className="h-6 w-6 text-primary" />
    </div>
);

export default function FertilizersPage() {
  const { t, language } = useTranslation();

  const formSchema = z.object({
    cropName: z.string().min(2, t('fertilizerAdvisor.form.cropName.validation')),
    farmingStage: z.string().min(1, t('fertilizerAdvisor.form.farmingStage.validation')),
    soilType: z.string().optional(),
  });
  
  type FormData = z.infer<typeof formSchema>;
  
  const [advice, setAdvice] = useState<FertilizerAdviceOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isReadingAloud, setIsReadingAloud] = useState(false);
  const [audioPlayer, setAudioPlayer] = useState<HTMLAudioElement | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cropName: '',
      farmingStage: '',
      soilType: '',
    },
  });

  async function onSubmit(values: FormData) {
    setIsLoading(true);
    setAdvice(null);
    if(audioPlayer) {
      audioPlayer.pause();
      setIsReadingAloud(false);
    }
    try {
      const result = await getFertilizerAdvice({ ...values, language });
      setAdvice(result);
    } catch (error) {
      console.error('Error getting fertilizer advice:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleReadAloud() {
    if (!advice) return;

    if (audioPlayer && !audioPlayer.paused) {
        audioPlayer.pause();
        audioPlayer.currentTime = 0;
        setIsReadingAloud(false);
        return;
    }

    setIsReadingAloud(true);
    try {
        const textToRead = [
            t('fertilizerAdvisor.result.title'),
            ...advice.recommendations.map(rec => 
                `${rec.fertilizerName}. ${t('fertilizerAdvisor.result.whyRecommended')}: ${rec.recommendationReason}. ${t('fertilizerAdvisor.result.applicationGuidance')}: ${rec.applicationGuidance}. ${t('fertilizerAdvisor.result.typicalAmount')}: ${rec.typicalAmount}.`
            ),
            `${t('fertilizerAdvisor.result.generalNotes')}: ${advice.generalNotes}`
        ].join(' ');

        const { audioDataUri } = await textToSpeech({ text: textToRead });
        const audio = new Audio(audioDataUri);
        setAudioPlayer(audio);
        audio.play();
        audio.onended = () => setIsReadingAloud(false);
    } catch (error) {
        console.error("Error with text-to-speech:", error);
        setIsReadingAloud(false);
    }
  }

  return (
    <>
      <PageHeader
        title={t('fertilizerAdvisor.pageTitle')}
        description={t('fertilizerAdvisor.pageDescription')}
      >
        <PageHeaderIcon />
      </PageHeader>
      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t('fertilizerAdvisor.form.title')}</CardTitle>
            <CardDescription>{t('fertilizerAdvisor.form.description')}</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="cropName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('fertilizerAdvisor.form.cropName.label')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('fertilizerAdvisor.form.cropName.placeholder')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="farmingStage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('fertilizerAdvisor.form.farmingStage.label')}</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t('fertilizerAdvisor.form.farmingStage.placeholder')} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {FARMING_STAGES.map((stage) => (
                            <SelectItem key={stage} value={stage}>
                              {t(`farmingTips.farmingStages.${stage.toLowerCase()}`)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="soilType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('fertilizerAdvisor.form.soilType.label')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('fertilizerAdvisor.form.soilType.placeholder')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t('fertilizerAdvisor.form.loadingButton')}
                    </>
                  ) : (
                    t('fertilizerAdvisor.form.submitButton')
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {isLoading && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center justify-center space-y-4 min-h-[200px]">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    <p className="text-muted-foreground">{t('fertilizerAdvisor.loading')}</p>
                </div>
              </CardContent>
            </Card>
          )}
          {advice && (
            <Card className="bg-green-50 border-green-200">
                <CardHeader>
                    <div className='flex justify-between items-center'>
                        <CardTitle className="font-headline text-xl text-green-800 flex items-center gap-2">
                            <TestTube className="h-6 w-6 text-green-600" /> {t('fertilizerAdvisor.result.title')}
                        </CardTitle>
                        <Button variant="ghost" size="sm" onClick={handleReadAloud} disabled={isReadingAloud}>
                            {isReadingAloud ? <Waves className="mr-2 h-4 w-4 animate-pulse" /> : <Volume2 className="mr-2 h-4 w-4" />}
                            {isReadingAloud ? t('fertilizerAdvisor.result.reading') : t('fertilizerAdvisor.result.readAloud')}
                        </Button>
                    </div>
                </CardHeader>
              <CardContent className="space-y-4">
                <Accordion type="single" collapsible defaultValue="item-0" className="w-full">
                    {advice.recommendations.map((rec, index) => (
                        <AccordionItem value={`item-${index}`} key={index}>
                            <AccordionTrigger className="font-bold text-lg text-primary">{rec.fertilizerName}</AccordionTrigger>
                            <AccordionContent className="space-y-3">
                                <div>
                                    <h4 className="font-semibold">{t('fertilizerAdvisor.result.whyRecommended')}</h4>
                                    <p className="text-muted-foreground">{rec.recommendationReason}</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold">{t('fertilizerAdvisor.result.applicationGuidance')}</h4>
                                    <p className="text-muted-foreground">{rec.applicationGuidance}</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold">{t('fertilizerAdvisor.result.typicalAmount')}</h4>
                                    <p className="text-muted-foreground">{rec.typicalAmount}</p>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>

                 <div className="pt-4">
                    <h3 className="font-semibold text-lg">{t('fertilizerAdvisor.result.generalNotes')}</h3>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{advice.generalNotes}</p>
                </div>

                 <p className="text-xs text-muted-foreground pt-4">{t('fertilizerAdvisor.result.disclaimer')}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
