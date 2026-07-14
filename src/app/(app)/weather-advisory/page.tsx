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
import { getWeatherAdvisory } from '@/lib/actions';
import { FARMING_STAGES } from '@/lib/constants';
import { Input } from '@/components/ui/input';
import { Loader2, CloudSun, Wind, Droplets, Thermometer, CloudLightning, Sun, CloudRain } from 'lucide-react';
import type { WeatherAdvisoryOutput } from '@/ai/flows/weather-advisory';
import { useTranslation } from '@/hooks/use-translation';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { apiLogActivity } from '@/lib/api';

const PageHeaderIcon = () => (
    <div className="bg-sky-100 dark:bg-sky-900/50 rounded-full p-4 shadow-sm border border-sky-200 dark:border-sky-800">
        <CloudSun className="h-8 w-8 text-sky-600 dark:text-sky-400" />
    </div>
);

export default function WeatherAdvisoryPage() {
  const { t, language } = useTranslation();
  const formSchema = z.object({
    cropType: z.string().min(2, t('weatherAdvisory.form.cropType.validation')),
    location: z.string().min(2, t('weatherAdvisory.form.location.validation')),
    farmingStage: z.string().min(1, t('weatherAdvisory.form.farmingStage.validation')),
  });
  
  type FormData = z.infer<typeof formSchema>;
  
  const [advisory, setAdvisory] = useState<WeatherAdvisoryOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cropType: 'Wheat',
      location: 'Mandya',
      farmingStage: 'Growing',
    },
  });

  async function onSubmit(values: FormData) {
    setIsLoading(true);
    setAdvisory(null);
    try {
      const result = await getWeatherAdvisory({ ...values, language });
      setAdvisory(result);
      apiLogActivity('weather_advisory_query', `Crop: ${values.cropType}, Location: ${values.location}, Stage: ${values.farmingStage}`).catch(console.error);
    } catch (error) {
      console.error('Error getting weather advisory:', error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <PageHeader
        title={t('weatherAdvisory.pageTitle')}
        description={t('weatherAdvisory.pageDescription')}
      >
        <PageHeaderIcon />
      </PageHeader>
      
      <div className="grid gap-8 lg:grid-cols-12 max-w-6xl mx-auto">
        <Card className="lg:col-span-5 border-0 shadow-lg shadow-sky-900/5">
          <CardHeader className="border-b bg-muted/20 pb-6">
            <CardTitle className="text-xl font-headline font-bold text-slate-800 dark:text-slate-200">{t('weatherAdvisory.form.title')}</CardTitle>
            <CardDescription>
              {t('weatherAdvisory.form.description')}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="cropType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold">{t('weatherAdvisory.form.cropType.label')}</FormLabel>
                      <FormControl>
                        <Input className="bg-muted/50 border-0 focus-visible:ring-sky-500 h-12" placeholder={t('weatherAdvisory.form.cropType.placeholder')} {...field} />
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
                      <FormLabel className="font-semibold">{t('weatherAdvisory.form.location.label')}</FormLabel>
                      <FormControl>
                        <Input className="bg-muted/50 border-0 focus-visible:ring-sky-500 h-12" placeholder={t('weatherAdvisory.form.location.placeholder')} {...field} />
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
                      <FormLabel className="font-semibold">{t('weatherAdvisory.form.farmingStage.label')}</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-muted/50 border-0 focus-visible:ring-sky-500 h-12">
                            <SelectValue placeholder={t('weatherAdvisory.form.farmingStage.placeholder')} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {FARMING_STAGES.map((stage) => (
                            <SelectItem key={stage} value={stage}>
                              {t(`weatherAdvisory.farmingStages.${stage.toLowerCase()}`)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading} className="w-full text-lg h-14 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white shadow-lg shadow-sky-500/30 transition-all">
                   {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      {t('weatherAdvisory.form.loadingButton')}
                    </>
                  ) : (
                    <>
                      <CloudSun className="mr-2 h-6 w-6" />
                      {t('weatherAdvisory.form.submitButton')}
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="lg:col-span-7 relative min-h-[400px]">
          <AnimatePresence mode="wait">
            {!isLoading && !advisory && (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-sky-100 dark:border-sky-900/40 rounded-2xl bg-sky-50/50 dark:bg-sky-950/10"
                >
                  <Sun className="h-16 w-16 text-sky-200 dark:text-sky-800 mb-4" />
                  <h3 className="text-xl font-semibold text-slate-400">Awaiting Farm Details</h3>
                  <p className="text-muted-foreground mt-2 max-w-sm">Fill out the form to receive a hyper-localized, AI-generated weather advisory tailored to your specific crop and growth stage.</p>
                </motion.div>
            )}

            {isLoading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 border border-sky-100 dark:border-sky-900/40 rounded-2xl bg-white dark:bg-card shadow-xl"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-sky-500/20 rounded-full blur-xl animate-pulse" />
                  <CloudLightning className="h-16 w-16 text-sky-500 animate-bounce relative z-10" />
                </div>
                <h3 className="text-2xl font-headline font-bold text-sky-700 dark:text-sky-400 mt-6">Analyzing Weather Patterns...</h3>
                <p className="text-muted-foreground mt-3 max-w-md">Our AI is fetching satellite data, local forecasts, and cross-referencing them against the vulnerability profile of {form.getValues('cropType')} at the {form.getValues('farmingStage')} stage.</p>
              </motion.div>
            )}

            {advisory && !isLoading && (
              <motion.div
                key="result"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="h-full"
              >
                <Card className="h-full border-0 shadow-2xl bg-gradient-to-br from-white to-sky-50 dark:from-background dark:to-sky-950/20 overflow-hidden relative">
                  <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
                    <CloudRain className="w-64 h-64" />
                  </div>
                  
                  <CardHeader className="pb-6 relative z-10 border-b border-sky-100 dark:border-sky-900/30 bg-white/50 dark:bg-background/50 backdrop-blur-sm">
                      <CardTitle className="font-headline text-3xl text-sky-800 dark:text-sky-400 flex items-center gap-3">
                          <div className="bg-sky-100 dark:bg-sky-900/50 p-2.5 rounded-xl">
                            <Wind className="h-7 w-7 text-sky-600 dark:text-sky-400" />
                          </div>
                          {t('weatherAdvisory.result.title')}
                      </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="pt-8 relative z-10 prose prose-sky dark:prose-invert max-w-none">
                    <div className="text-lg leading-relaxed text-slate-700 dark:text-slate-300">
                      <ReactMarkdown>
                        {advisory.advisory}
                      </ReactMarkdown>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
