'use client';
import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';
import { useTheme } from 'next-themes';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function SettingsPage() {
    const { t } = useTranslation();
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

  return (
    <>
      <PageHeader
        title={t('settings.pageTitle')}
        description={t('settings.pageDescription')}
      >
        <div className="bg-accent rounded-full p-3 mr-4">
            <Settings className="h-6 w-6 text-primary" />
        </div>
      </PageHeader>
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>{t('settings.theme.title')}</CardTitle>
          <CardDescription>
            {t('settings.theme.description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
           <div className="grid gap-6">
              <div className="flex items-center justify-between">
                <Label htmlFor="theme" className="font-semibold">
                  {t('settings.theme.label')}
                </Label>
                {mounted && (
                    <Select value={theme} onValueChange={setTheme}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder={t('settings.theme.selectPlaceholder')} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="light">{t('settings.theme.light')}</SelectItem>
                        <SelectItem value="dark">{t('settings.theme.dark')}</SelectItem>
                        <SelectItem value="system">{t('settings.theme.system')}</SelectItem>
                    </SelectContent>
                    </Select>
                )}
              </div>
            </div>
        </CardContent>
      </Card>
    </>
  );
}
