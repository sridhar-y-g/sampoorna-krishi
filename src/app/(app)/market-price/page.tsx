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
import { Loader2, LineChart, CalendarIcon, Volume2, Waves, TrendingUp, Info, Activity } from 'lucide-react';
import type { MarketPriceForecastOutput } from '@/ai/flows/market-price-forecasting';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { LineChartIcon } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';

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
      currentDate: new Date(),
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
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <PageHeader
        title={t('marketPrice.pageTitle')}
        description={t('marketPrice.pageDescription')}
      />
      
      <div className="grid gap-8 md:grid-cols-1 max-w-4xl mx-auto">
        <Card className="border-0 shadow-lg shadow-primary/5">
          <CardContent className="p-6 md:p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="crop"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold">{t('marketPrice.form.cropName')}</FormLabel>
                        <FormControl>
                          <Input className="bg-muted/50 border-0 focus-visible:ring-primary/50 h-12" placeholder={t('marketPrice.form.enterCrop')} {...field} />
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
                        <FormLabel className="font-semibold">{t('marketPrice.form.marketLocation')}</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-muted/50 border-0 focus-visible:ring-primary/50 h-12">
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
                </div>
                
                <FormField
                  control={form.control}
                  name="currentDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="font-semibold">{t('marketPrice.form.predictionDate')}</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal bg-muted/50 border-0 hover:bg-muted h-12",
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
                              date < new Date("2000-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit" disabled={isLoading} className="w-full text-lg h-14 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-lg shadow-emerald-500/30 transition-all">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      {t('marketPrice.form.loadingButton')}
                    </>
                  ) : (
                    <>
                        <LineChartIcon className="mr-2 h-6 w-6" />
                        {t('marketPrice.form.submitButton')}
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <AnimatePresence mode="wait">
          {isLoading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center justify-center space-y-6 py-12"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl animate-pulse" />
                <Activity className="h-16 w-16 text-emerald-500 animate-pulse relative z-10" />
              </div>
              <h3 className="text-xl font-headline font-semibold text-emerald-700 dark:text-emerald-400">Analyzing Market Trends...</h3>
              <p className="text-muted-foreground text-center max-w-md">Our AI is crunching historical data, weather patterns, and supply chain metrics to forecast the best price.</p>
            </motion.div>
          )}

          {forecast && !isLoading && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              <Card className="border-0 shadow-2xl bg-gradient-to-br from-white to-emerald-50 dark:from-background dark:to-emerald-950/20 overflow-hidden relative">
                <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
                  <TrendingUp className="w-64 h-64" />
                </div>
                
                <CardHeader className="pb-4 relative z-10 border-b border-emerald-100 dark:border-emerald-900/30 bg-white/50 dark:bg-background/50 backdrop-blur-sm">
                    <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
                        <CardTitle className="font-headline text-2xl text-emerald-800 dark:text-emerald-400 flex items-center gap-3">
                            <div className="bg-emerald-100 dark:bg-emerald-900/50 p-2 rounded-lg">
                              <TrendingUp className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            {t('marketPrice.result.title')}
                        </CardTitle>
                        <Button variant="secondary" className="shadow-sm bg-white dark:bg-muted hover:bg-emerald-50 dark:hover:bg-muted/80 text-emerald-700 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-800/30" size="sm" onClick={handleReadAloud} disabled={isReadingAloud}>
                            {isReadingAloud ? <Waves className="mr-2 h-4 w-4 animate-pulse" /> : <Volume2 className="mr-2 h-4 w-4" />}
                            {isReadingAloud ? t('marketPrice.result.reading') : t('marketPrice.result.readAloud')}
                        </Button>
                    </div>
                </CardHeader>
                
                <CardContent className="space-y-8 pt-8 relative z-10">
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="flex flex-col items-center justify-center py-6 bg-white dark:bg-black/20 rounded-2xl border border-emerald-100 dark:border-emerald-900/30 shadow-inner"
                  >
                    <p className="text-sm uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-bold mb-2">Projected Price Range</p>
                    <p className="text-5xl md:text-6xl font-black text-slate-800 dark:text-slate-100 tracking-tight text-center">
                      {forecast.forecast} 
                    </p>
                    <p className="text-lg font-medium text-muted-foreground mt-2">{t('marketPrice.result.priceUnit')}</p>
                  </motion.div>
                  
                  <div className="grid md:grid-cols-2 gap-8">
                    <motion.div 
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="bg-white/60 dark:bg-black/10 p-6 rounded-2xl"
                    >
                      <h3 className="font-bold text-lg flex items-center gap-2 mb-3 text-emerald-900 dark:text-emerald-300">
                        <Info className="h-5 w-5 text-emerald-500" />
                        {t('marketPrice.result.reasoning')}
                      </h3>
                      <p className='text-muted-foreground leading-relaxed'>{forecast.factors}</p>
                    </motion.div>
                    
                    <motion.div 
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="bg-white/60 dark:bg-black/10 p-6 rounded-2xl"
                    >
                        <h3 className="font-bold text-lg flex items-center gap-2 mb-3 text-emerald-900 dark:text-emerald-300">
                          <Activity className="h-5 w-5 text-emerald-500" />
                          {t('marketPrice.result.confidence')}
                        </h3>
                        <p className='text-muted-foreground leading-relaxed'>{forecast.confidence}</p>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
