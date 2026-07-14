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
import { getMarketPriceForecast, textToSpeech } from '@/lib/actions';
import { LOCATIONS } from '@/lib/constants';
import { Loader2, LineChart, CalendarIcon, Volume2, Waves } from 'lucide-react';
import type { MarketPriceForecastOutput } from '@/ai/flows/market-price-forecasting';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { LineChartIcon } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { Input } from '@/components/ui/input';

const formSchema = z.object({
  crop: z.string().min(2, 'Crop name must be at least 2 characters.'),
  location: z.string().min(1, 'Please select a location.'),
  currentDate: z.date({
    required_error: 'A date for prediction is required.',
  }),
});

type FormData = z.infer<typeof formSchema>;

export default function MarketPricePage() {
  const { t, language } = useTranslation();
  const [forecast, setForecast] = useState<MarketPriceForecastOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isReadingAloud, setIsReadingAloud] = useState(false);
  const [audioPlayer, setAudioPlayer] = useState<HTMLAudioElement | null>(null);


  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      crop: 'Rice',
      location: 'Bengaluru',
      currentDate: new Date('2025-09-11'),
    },
  });

  async function onSubmit(values: FormData) {
    setIsLoading(true);
    setForecast(null);
    if(audioPlayer) {
      audioPlayer.pause();
      setIsReadingAloud(false);
    }
    try {
      const result = await getMarketPriceForecast({
          ...values,
          currentDate: format(values.currentDate, 'yyyy-MM-dd'),
          language: language,
      });
      setForecast(result);
    } catch (error) {
      console.error('Error getting market price forecast:', error);
      // You can add a toast notification here to inform the user
    } finally {
      setIsLoading(false);
    }
  }

  async function handleReadAloud() {
    if (!forecast) return;

    if (audioPlayer && !audioPlayer.paused) {
        audioPlayer.pause();
        audioPlayer.currentTime = 0;
        setIsReadingAloud(false);
        return;
    }

    setIsReadingAloud(true);
    try {
        const textToRead = `${t('marketPrice.result.titleForSpeech', { crop: form.getValues('crop'), location: form.getValues('location'), date: format(form.getValues('currentDate'), 'MMMM do, yyyy') })}. ${t('marketPrice.result.forecast')}: ${forecast.forecast}. ${t('marketPrice.result.reasoning')}: ${forecast.factors}.`;
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
        title={t('marketPrice.pageTitle')}
        description={t('marketPrice.pageDescription')}
      />
      <div className="grid gap-8 md:grid-cols-1">
        <Card className="max-w-3xl mx-auto w-full">
          <CardHeader>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="crop"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('marketPrice.form.cropName')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('marketPrice.form.enterCrop')} {...field} />
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
                      <FormLabel>{t('marketPrice.form.marketLocation')}</FormLabel>
                       <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t('marketPrice.form.selectLocation')} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {LOCATIONS.map((location) => (
                            <SelectItem key={location} value={location}>
                              {location}
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
                  name="currentDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>{t('marketPrice.form.predictionDate')}</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>{t('marketPrice.form.pickDate')}</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date < new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading} className="w-full text-lg py-6 bg-green-500 hover:bg-green-600 text-white">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t('marketPrice.form.loadingButton')}
                    </>
                  ) : (
                    <>
                        <LineChartIcon className="mr-2 h-5 w-5" />
                        {t('marketPrice.form.submitButton')}
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
                    <p className="text-muted-foreground">{t('marketPrice.loading')}</p>
                </div>
              </CardContent>
            </Card>
          )}
          {forecast && (
            <Card className="bg-green-50 border-green-200">
                <CardHeader>
                    <div className='flex justify-between items-center'>
                        <CardTitle className="font-headline text-xl text-green-800 flex items-center gap-2">
                            <span className='font-sans text-2xl text-green-600'>$</span> {t('marketPrice.result.title')}
                        </CardTitle>
                        <Button variant="ghost" size="sm" onClick={handleReadAloud} disabled={isReadingAloud}>
                            {isReadingAloud ? <Waves className="mr-2 h-4 w-4 animate-pulse" /> : <Volume2 className="mr-2 h-4 w-4" />}
                            {isReadingAloud ? t('marketPrice.result.reading') : t('marketPrice.result.readAloud')}
                        </Button>
                    </div>
                </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <p className="text-4xl font-bold text-gray-800">{forecast.forecast} <span className="text-lg font-normal text-muted-foreground">{t('marketPrice.result.priceUnit')}</span></p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{t('marketPrice.result.reasoning')}</h3>
                  <p className='text-muted-foreground'>{forecast.factors}</p>
                </div>
                <div>
                    <h3 className="font-semibold text-lg">{t('marketPrice.result.confidence')}</h3>
                    <p className='text-muted-foreground'>{forecast.confidence}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
