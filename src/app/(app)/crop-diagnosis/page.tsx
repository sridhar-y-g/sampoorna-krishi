'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { PageHeader } from '@/components/page-header';
import { diagnoseCropHealth } from '@/lib/actions';
import { Loader2, Upload } from 'lucide-react';
import type { DiagnoseCropHealthOutput } from '@/ai/flows/crop-health-diagnosis';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { HeartPulse } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';

const PageHeaderIcon = () => (
    <div className="bg-accent rounded-full p-3 mr-4">
        <HeartPulse className="h-6 w-6 text-primary" />
    </div>
);

export default function CropDiagnosisPage() {
  const { t, language } = useTranslation();

  const formSchema = z.object({
    cropName: z.string().min(2, t('cropDiagnosis.form.cropName.validation')),
    symptoms: z.string().min(10, t('cropDiagnosis.form.symptoms.validation')),
  });

  type FormData = z.infer<typeof formSchema>;

  const [diagnosis, setDiagnosis] = useState<DiagnoseCropHealthOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [photoDataUri, setPhotoDataUri] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cropName: '',
      symptoms: '',
    },
  });

  const placeholderImage = PlaceHolderImages.find(img => img.id === 'crop-diagnosis-placeholder');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) { // 4MB limit
        setError(t('cropDiagnosis.form.fileSizeError'));
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoDataUri(e.target?.result as string);
        setError(null);
        setDiagnosis(null);
      };
      reader.onerror = () => {
        setError(t('cropDiagnosis.form.fileReadError'));
      };
      reader.readAsDataURL(file);
    }
  };

  async function onSubmit(values: FormData) {
    if (!photoDataUri) {
      setError(t('cropDiagnosis.form.photoRequiredError'));
      return;
    }
    setIsLoading(true);
    setDiagnosis(null);
    setError(null);
    try {
      const result = await diagnoseCropHealth({ 
        ...values,
        photoDataUri,
        language,
      });
      setDiagnosis(result);
    } catch (err) {
      console.error('Error diagnosing crop health:', err);
      setError(t('cropDiagnosis.apiError'));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <PageHeader
        title={t('cropDiagnosis.pageTitle')}
        description={t('cropDiagnosis.pageDescription')}
      >
        <PageHeaderIcon />
      </PageHeader>
      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t('cropDiagnosis.form.title')}</CardTitle>
            <CardDescription>
              {t('cropDiagnosis.form.description')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                  <div className="relative aspect-square w-full rounded-lg border-2 border-dashed border-border flex items-center justify-center">
                    {photoDataUri ? (
                      <Image src={photoDataUri} alt="Uploaded plant" fill className="object-contain rounded-lg" />
                    ) : (
                      placeholderImage && <Image src={placeholderImage.imageUrl} alt="Placeholder" fill className="object-cover rounded-lg opacity-30" data-ai-hint={placeholderImage.imageHint} />
                    )}
                    <div className="absolute flex flex-col items-center justify-center text-center p-4">
                        <Upload className="w-10 h-10 text-muted-foreground mb-2" />
                        <p className="text-muted-foreground">
                            <label htmlFor="file-upload" className="font-semibold text-primary cursor-pointer hover:underline">
                            {t('cropDiagnosis.form.upload.click')}
                            </label>
                            {' '}{t('cropDiagnosis.form.upload.orDrag')}
                        </p>
                        <p className="text-xs text-muted-foreground">{t('cropDiagnosis.form.upload.fileTypes')}</p>
                    </div>
                    <Input id="file-upload" type="file" className="absolute w-full h-full opacity-0 cursor-pointer" accept="image/png, image/jpeg, image/webp" onChange={handleFileChange} />
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="cropName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('cropDiagnosis.form.cropName.label')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('cropDiagnosis.form.cropName.placeholder')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="symptoms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('cropDiagnosis.form.symptoms.label')}</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={t('cropDiagnosis.form.symptoms.placeholder')}
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {error && <p className="text-sm text-destructive">{error}</p>}
                
                <Button type="submit" disabled={isLoading || !photoDataUri}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t('cropDiagnosis.form.loadingButton')}
                    </>
                  ) : (
                    t('cropDiagnosis.form.submitButton')
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
                    <div className="flex flex-col items-center justify-center space-y-4">
                        <Loader2 className="h-12 w-12 animate-spin text-primary" />
                        <p className="text-muted-foreground">{t('cropDiagnosis.loading')}</p>
                    </div>
                </CardContent>
                </Card>
            )}
            {diagnosis && (
                <Card className="bg-accent/50 border-accent">
                <CardHeader>
                    <CardTitle className="font-headline text-2xl text-primary">{t('cropDiagnosis.result.title')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <h3 className="font-semibold">{t('cropDiagnosis.result.diagnosis')}</h3>
                        <p className="whitespace-pre-wrap">{diagnosis.diagnosis}</p>
                    </div>
                    <div>
                        <h3 className="font-semibold">{t('cropDiagnosis.result.treatment')}</h3>
                        <p className="whitespace-pre-wrap">{diagnosis.treatmentRecommendations}</p>
                    </div>
                </CardContent>
                </Card>
            )}
        </div>
      </div>
    </>
  );
}
