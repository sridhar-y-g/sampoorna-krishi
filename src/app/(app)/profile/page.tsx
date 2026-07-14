'use client';
import { useState } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { PageHeader } from '@/components/page-header';
import { useTranslation } from '@/hooks/use-translation';
import { User, Upload, Loader2 } from 'lucide-react';

const PageHeaderIcon = () => (
    <div className="bg-accent rounded-full p-3 mr-4">
        <User className="h-6 w-6 text-primary" />
    </div>
);

export default function ProfilePage() {
  const { t } = useTranslation();

  const formSchema = z.object({
    name: z.string().min(2, t('profile.form.name.validation')),
    email: z.string().email(t('profile.form.email.validation')),
  });

  type FormData = z.infer<typeof formSchema>;

  const [isLoading, setIsLoading] = useState(false);
  const [photoDataUri, setPhotoDataUri] = useState<string | null>("https://picsum.photos/seed/user-avatar/100/100");
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: 'Farmer',
      email: 'farmer@example.com',
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        setError(t('profile.form.fileSizeError'));
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoDataUri(e.target?.result as string);
        setError(null);
      };
      reader.onerror = () => {
        setError(t('profile.form.fileReadError'));
      };
      reader.readAsDataURL(file);
    }
  };

  async function onSubmit(values: FormData) {
    setIsLoading(true);
    setError(null);
    console.log('Submitting:', { ...values, photoDataUri });
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    // Here you would typically show a success toast
  }

  return (
    <>
      <PageHeader
        title={t('profile.pageTitle')}
        description={t('profile.pageDescription')}
      >
        <PageHeaderIcon />
      </PageHeader>
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>{t('profile.form.title')}</CardTitle>
          <CardDescription>{t('profile.form.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <Image 
                    src={photoDataUri || '/images/default-avatar.png'} 
                    alt="Profile Picture" 
                    width={128} 
                    height={128} 
                    className="rounded-full object-cover w-32 h-32 border-4 border-primary/20"
                  />
                  <label htmlFor="file-upload" className="absolute bottom-0 right-0 flex items-center justify-center w-10 h-10 bg-primary rounded-full text-primary-foreground cursor-pointer hover:bg-primary/90">
                    <Upload className="w-5 h-5"/>
                  </label>
                  <Input id="file-upload" type="file" className="hidden" accept="image/png, image/jpeg, image/webp" onChange={handleFileChange} />
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
              </div>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('profile.form.name.label')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('profile.form.name.placeholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('profile.form.email.label')}</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder={t('profile.form.email.placeholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('profile.form.loadingButton')}
                  </>
                ) : (
                  t('profile.form.submitButton')
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}
