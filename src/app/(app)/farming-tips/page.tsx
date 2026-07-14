
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
import { getFarmingTips, textToSpeech } from '@/lib/actions';
import { FARMING_STAGES } from '@/lib/constants';
import { Input } from '@/components/ui/input';
import { Loader2, Lightbulb, Link as LinkIcon, Volume2, Waves, Wheat } from 'lucide-react';
import type { FarmingTipsOutput } from '@/ai/flows/farming-tips';
import { useTranslation } from '@/hooks/use-translation';
import Link from 'next/link';

const PageHeaderIcon = () => (
    <div className="bg-accent rounded-full p-3 mr-4">
        <Wheat className="h-6 w-6 text-primary" />
    </div>
);

export default function FarmingTipsPage() {
  const { t, language } = useTranslation();
  const formSchema = z.object({
    cropName: z.string().min(2, t('farmingTips.form.cropName.validation')),
    farmingStage: z.string().min(1, t('farmingTips.form.farmingStage.validation')),
    soilType: z.string().optional(),
  });
  
  type FormData = z.infer<typeof formSchema>;
  
  const [tips, setTips] = useState<FarmingTipsOutput | null>(null);
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
    setTips(null);
    if(audioPlayer) {
      audioPlayer.pause();
      setIsReadingAloud(false);
    }
    try {
      const result = await getFarmingTips({ ...values, language });
      setTips(result);
    } catch (error) {
      console.error('Error getting farming tips:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleReadAloud() {
    if (!tips) return;

    if (audioPlayer && !audioPlayer.paused) {
        audioPlayer.pause();
        audioPlayer.currentTime = 0;
        setIsReadingAloud(false);
        return;
    }

    setIsReadingAloud(true);
    try {
        const textToRead = `${t('farmingTips.result.title')}. ${t('farmingTips.result.category')}: ${tips.category}. ${tips.tips.join(' ')}`;
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
        title={t('farmingTips.pageTitle')}
        description={t('farmingTips.pageDescription')}
      >
        <PageHeaderIcon />
      </PageHeader>
      <div className="grid gap-8 md:grid-cols-1">
        <Card className="max-w-3xl mx-auto w-full">
          <CardHeader>
            <CardTitle>{t('farmingTips.form.title')}</CardTitle>
            <CardDescription>{t('farmingTips.form.description')}</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="cropName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('farmingTips.form.cropName.label')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('farmingTips.form.cropName.placeholder')} {...field} />
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
                      <FormLabel>{t('farmingTips.form.farmingStage.label')}</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t('farmingTips.form.farmingStage.placeholder')} />
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
                      <FormLabel>{t('farmingTips.form.soilType.label')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('farmingTips.form.soilType.placeholder')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading} className="w-full text-lg py-6 bg-green-500 hover:bg-green-600 text-white">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t('farmingTips.form.loadingButton')}
                    </>
                  ) : (
                    <>
                        <Lightbulb className="mr-2 h-5 w-5" />
                        {t('farmingTips.form.submitButton')}
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="space-y-6 max-w-3xl mx-auto w-full">
          {isLoading && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center justify-center space-y-4 min-h-[200px]">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    <p className="text-muted-foreground">{t('farmingTips.loading')}</p>
                </div>
              </CardContent>
            </Card>
          )}
          {tips && (
            <Card className="bg-green-50 border-green-200">
                <CardHeader>
                    <div className='flex justify-between items-center'>
                        <CardTitle className="font-headline text-xl text-green-800 flex items-center gap-2">
                           <Lightbulb className="h-6 w-6 text-green-600" /> {t('farmingTips.result.title')}
                        </CardTitle>
                        <Button variant="ghost" size="sm" onClick={handleReadAloud} disabled={isReadingAloud}>
                            {isReadingAloud ? <Waves className="mr-2 h-4 w-4 animate-pulse" /> : <Volume2 className="mr-2 h-4 w-4" />}
                            {isReadingAloud ? t('farmingTips.result.reading') : t('farmingTips.result.readAloud')}
                        </Button>
                    </div>
                    <CardDescription>{t('farmingTips.result.category')}: {tips.category}</CardDescription>
                </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <ul className="space-y-2 list-disc pl-5">
                    {tips.tips.map((tip, index) => (
                      <li key={index} className="text-muted-foreground">{tip}</li>
                    ))}
                  </ul>
                </div>
                {tips.relatedVideos && tips.relatedVideos.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{t('farmingTips.result.relatedVideos')}</h3>
                    <div className="space-y-2">
                      {tips.relatedVideos.map((video, index) => (
                        <Link href={video.url} key={index} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-primary hover:underline">
                          <LinkIcon className="h-4 w-4" />
                          <span>{video.title}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
                 <p className="text-xs text-muted-foreground pt-4">{t('farmingTips.result.disclaimer')}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
