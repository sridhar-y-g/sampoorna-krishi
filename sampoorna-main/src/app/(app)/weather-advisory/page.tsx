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
import { Loader2, CloudSun } from 'lucide-react';
import type { WeatherAdvisoryOutput } from '@/ai/flows/weather-advisory';
import { useTranslation } from '@/hooks/use-translation';

const PageHeaderIcon = () => (
    <div className="bg-accent rounded-full p-3 mr-4">
        <CloudSun className="h-6 w-6 text-primary" />
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
      cropType: '',
      location: '',
      farmingStage: '',
    },
  });

  async function onSubmit(values: FormData) {
    setIsLoading(true);
    setAdvisory(null);
    try {
      const result = await getWeatherAdvisory({ ...values, language });
      setAdvisory(result);
    } catch (error) {
      console.error('Error getting weather advisory:', error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <PageHeader
        title={t('weatherAdvisory.pageTitle')}
        description={t('weatherAdvisory.pageDescription')}
      >
        <PageHeaderIcon />
      </PageHeader>
      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t('weatherAdvisory.form.title')}</CardTitle>
            <CardDescription>
              {t('weatherAdvisory.form.description')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="cropType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('weatherAdvisory.form.cropType.label')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('weatherAdvisory.form.cropType.placeholder')} {...field} />
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
                      <FormLabel>{t('weatherAdvisory.form.location.label')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('weatherAdvisory.form.location.placeholder')} {...field} />
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
                      <FormLabel>{t('weatherAdvisory.form.farmingStage.label')}</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
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
                <Button type="submit" disabled={isLoading}>
                   {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t('weatherAdvisory.form.loadingButton')}
                    </>
                  ) : (
                    t('weatherAdvisory.form.submitButton')
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
                        <p className="text-muted-foreground">{t('weatherAdvisory.loading')}</p>
                    </div>
                </CardContent>
                </Card>
            )}
            {advisory && (
                <Card className="bg-accent/50 border-accent">
                <CardHeader>
                    <CardTitle className="font-headline text-2xl text-primary">{t('weatherAdvisory.result.title')}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="whitespace-pre-wrap">{advisory.advisory}</p>
                </CardContent>
                </Card>
            )}
        </div>
      </div>
    </>
  );
}
