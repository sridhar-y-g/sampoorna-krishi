'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { PageHeader } from '@/components/page-header';
import { findSubsidies } from '@/lib/actions';
import { Loader2, HandCoins } from 'lucide-react';
import type { FindSubsidiesOutput } from '@/ai/flows/subsidy-finder';
import { Textarea } from '@/components/ui/textarea';
import { useTranslation } from '@/hooks/use-translation';

const PageHeaderIcon = () => (
    <div className="bg-accent rounded-full p-3 mr-4">
        <HandCoins className="h-6 w-6 text-primary" />
    </div>
);

export default function SubsidyFinderPage() {
  const { t, language } = useTranslation();
  const [subsidies, setSubsidies] = useState<FindSubsidiesOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const formSchema = z.object({
    query: z.string().min(10, t('subsidyFinder.form.query.validation')),
  });
  
  type FormData = z.infer<typeof formSchema>;

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      query: '',
    },
  });

  async function onSubmit(values: FormData) {
    setIsLoading(true);
    setSubsidies(null);
    try {
      const result = await findSubsidies({ ...values, language });
      setSubsidies(result);
    } catch (error) {
      console.error('Error finding subsidies:', error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <PageHeader
        title={t('subsidyFinder.pageTitle')}
        description={t('subsidyFinder.pageDescription')}
      >
        <PageHeaderIcon />
      </PageHeader>
      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t('subsidyFinder.form.title')}</CardTitle>
            <CardDescription>
              {t('subsidyFinder.form.description')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="query"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder={t('subsidyFinder.form.query.placeholder')}
                          className="min-h-[150px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading}>
                   {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t('subsidyFinder.form.loadingButton')}
                    </>
                  ) : (
                    t('subsidyFinder.form.submitButton')
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
                        <p className="text-muted-foreground">{t('subsidyFinder.loading')}</p>
                    </div>
                </CardContent>
                </Card>
            )}
            {subsidies && (
                <Card className="bg-accent/50 border-accent">
                <CardHeader>
                    <CardTitle className="font-headline text-2xl text-primary">{t('subsidyFinder.result.title')}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="whitespace-pre-wrap">{subsidies.subsidies}</p>
                </CardContent>
                </Card>
            )}
        </div>
      </div>
    </>
  );
}
