'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';

import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Progress } from '@/components/ui/progress';

import { getCropDamageAssessment, textToSpeech } from '@/lib/actions';
import type { CropDamageAssessmentOutput } from '@/ai/flows/crop-damage-assessment';
import { useTranslation } from '@/hooks/use-translation';
import { cn } from '@/lib/utils';

import { CalendarIcon, FileText, Loader2, ShieldCheck, Volume2, Waves } from 'lucide-react';

const PageHeaderIcon = () => (
    <div className="bg-accent rounded-full p-3 mr-4">
        <ShieldCheck className="h-6 w-6 text-primary" />
    </div>
);

export default function CropInsurancePage() {
  const { t, language } = useTranslation();
  
  const formSchema = z.object({
    cropType: z.string().min(2, t('cropInsurance.form.cropType.validation')),
    location: z.string().min(2, t('cropInsurance.form.location.validation')),
    incidentDate: z.date({ required_error: t('cropInsurance.form.incidentDate.validation') }),
    incidentDescription: z.string().min(10, t('cropInsurance.form.incidentDescription.validation')),
  });

  type FormData = z.infer<typeof formSchema>;

  const [assessment, setAssessment] = useState<CropDamageAssessmentOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isReadingAloud, setIsReadingAloud] = useState(false);
  const [audioPlayer, setAudioPlayer] = useState<HTMLAudioElement | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cropType: '',
      location: '',
      incidentDescription: '',
    },
  });

  async function onSubmit(values: FormData) {
    setIsLoading(true);
    setAssessment(null);
    if(audioPlayer) {
      audioPlayer.pause();
      setIsReadingAloud(false);
    }
    try {
      const result = await getCropDamageAssessment({
        ...values,
        incidentDate: format(values.incidentDate, 'yyyy-MM-dd'),
        language,
      });
      setAssessment(result);
    } catch (error) {
      console.error('Error getting crop damage assessment:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleReadAloud() {
    if (!assessment) return;

    if (audioPlayer && !audioPlayer.paused) {
        audioPlayer.pause();
        audioPlayer.currentTime = 0;
        setIsReadingAloud(false);
        return;
    }

    setIsReadingAloud(true);
    try {
        const textToRead = [
            t('cropInsurance.result.title'),
            `${t('cropInsurance.result.estimatedDamage')}: ${assessment.estimatedDamagePercentage}%.`,
            `${t('cropInsurance.result.confidence')}: ${assessment.confidence}.`,
            `${t('cropInsurance.result.assessmentSummary.title')}: ${assessment.assessmentSummary}`,
            `${t('cropInsurance.result.nextSteps.title')}: ${assessment.nextSteps.join('. ')}`,
            assessment.disclaimer,
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
        title={t('cropInsurance.pageTitle')}
        description={t('cropInsurance.pageDescription')}
      >
        <PageHeaderIcon />
      </PageHeader>
      
      <div className="grid gap-8 md:grid-cols-1">
        <Card className="max-w-4xl mx-auto w-full">
          <CardHeader>
            <CardTitle>{t('cropInsurance.form.title')}</CardTitle>
            <CardDescription>{t('cropInsurance.form.description')}</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="cropType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('cropInsurance.form.cropType.label')}</FormLabel>
                        <FormControl>
                          <Input placeholder={t('cropInsurance.form.cropType.placeholder')} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('cropInsurance.form.location.label')}</FormLabel>
                        <FormControl>
                          <Input placeholder={t('cropInsurance.form.location.placeholder')} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="incidentDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>{t('cropInsurance.form.incidentDate.label')}</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                              >
                                {field.value ? format(field.value, "PPP") : <span>{t('cropInsurance.form.incidentDate.placeholder')}</span>}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="incidentDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('cropInsurance.form.incidentDescription.label')}</FormLabel>
                        <FormControl>
                          <Textarea placeholder={t('cropInsurance.form.incidentDescription.placeholder')} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button type="submit" disabled={isLoading} className="w-full text-lg py-6 bg-primary hover:bg-primary/90 text-primary-foreground">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t('cropInsurance.form.loadingButton')}
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="mr-2 h-5 w-5" />
                      {t('cropInsurance.form.submitButton')}
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="space-y-6 max-w-4xl mx-auto w-full">
          {isLoading && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center justify-center space-y-4 min-h-[300px]">
                  <Loader2 className="h-12 w-12 animate-spin text-primary" />
                  <p className="text-muted-foreground">{t('cropInsurance.loading')}</p>
                </div>
              </CardContent>
            </Card>
          )}
          {assessment && (
            <Card className="bg-green-50 border-green-200">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="font-headline text-2xl text-green-800 flex items-center gap-2">
                    <FileText className="h-6 w-6 text-green-600" /> {t('cropInsurance.result.title')}
                  </CardTitle>
                  <Button variant="ghost" size="sm" onClick={handleReadAloud} disabled={isReadingAloud}>
                    {isReadingAloud ? <Waves className="mr-2 h-4 w-4 animate-pulse" /> : <Volume2 className="mr-2 h-4 w-4" />}
                    {isReadingAloud ? t('cropInsurance.result.reading') : t('cropInsurance.result.readAloud')}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold">{t('cropInsurance.result.estimatedDamage')}</h3>
                  <div className="flex items-center gap-4 mt-2">
                    <Progress value={assessment.estimatedDamagePercentage} className="w-full h-4" />
                    <span className="text-xl font-bold text-primary">{assessment.estimatedDamagePercentage}%</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{t('cropInsurance.result.confidence')}: {assessment.confidence}</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold">{t('cropInsurance.result.assessmentSummary.title')}</h3>
                  <p className="text-muted-foreground mt-1">{assessment.assessmentSummary}</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold">{t('cropInsurance.result.nextSteps.title')}</h3>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground mt-1">
                    {assessment.nextSteps.map((step, index) => (
                      <li key={index}>{step}</li>
                    ))}
                  </ul>
                </div>

                <p className="text-xs text-muted-foreground pt-4 italic">{assessment.disclaimer}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
