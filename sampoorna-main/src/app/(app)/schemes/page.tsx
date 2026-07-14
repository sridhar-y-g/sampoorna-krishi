
'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { PageHeader } from '@/components/page-header';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ExternalLink } from 'lucide-react';
import { ScrollText } from 'lucide-react';
import { useTranslation } from '@/hooks/use-translation';

const PageHeaderIcon = () => (
    <div className="bg-accent rounded-full p-3 mr-4">
        <ScrollText className="h-6 w-6 text-primary" />
    </div>
);


export default function SchemesPage() {
  const { t } = useTranslation();

  const schemesData = [
    {
      id: 'pm-kisan',
      titleKey: 'schemes.schemes.pm-kisan.title',
      descriptionKey: 'schemes.schemes.pm-kisan.description',
      eligibilityKey: 'schemes.schemes.pm-kisan.eligibility',
      benefitsKey: 'schemes.schemes.pm-kisan.benefits.0',
      image: PlaceHolderImages.find(img => img.id === 'scheme-1')?.imageUrl || '',
      officialLink: 'https://pmkisan.gov.in/',
    },
    {
      id: 'pmksy',
      titleKey: 'schemes.schemes.pmksy.title',
      descriptionKey: 'schemes.schemes.pmksy.description',
      eligibilityKey: 'schemes.schemes.pmksy.eligibility',
      benefitsKey: 'schemes.schemes.pmksy.benefits.0',
      image: PlaceHolderImages.find(img => img.id === 'scheme-2')?.imageUrl || '',
      officialLink: 'https://pmksy.gov.in/',
    },
    {
      id: 'shc',
      titleKey: 'schemes.schemes.shc.title',
      descriptionKey: 'schemes.schemes.shc.description',
      eligibilityKey: 'schemes.schemes.shc.eligibility',
      benefitsKey: 'schemes.schemes.shc.benefits.0',
      image: PlaceHolderImages.find(img => img.id === 'scheme-3')?.imageUrl || '',
      officialLink: 'https://soilhealth.dac.gov.in/',
    },
    {
      id: 'pmfby',
      titleKey: 'schemes.schemes.pmfby.title',
      descriptionKey: 'schemes.schemes.pmfby.description',
      eligibilityKey: 'schemes.schemes.pmfby.eligibility',
      benefitsKey: 'schemes.schemes.pmfby.benefits.0',
      image: PlaceHolderImages.find(img => img.id === 'scheme-4')?.imageUrl || '',
      officialLink: 'https://pmfby.gov.in/',
    },
    {
      id: 'nmsa',
      titleKey: 'schemes.schemes.nmsa.title',
      descriptionKey: 'schemes.schemes.nmsa.description',
      eligibilityKey: 'schemes.schemes.nmsa.eligibility',
      benefitsKey: 'schemes.schemes.nmsa.benefits.0',
      image: PlaceHolderImages.find(img => img.id === 'scheme-5')?.imageUrl || '',
      officialLink: 'https://nmsa.dac.gov.in/',
    },
    {
      id: 'pkvy',
      titleKey: 'schemes.schemes.pkvy.title',
      descriptionKey: 'schemes.schemes.pkvy.description',
      eligibilityKey: 'schemes.schemes.pkvy.eligibility',
      benefitsKey: 'schemes.schemes.pkvy.benefits.0',
      image: PlaceHolderImages.find(img => img.id === 'scheme-6')?.imageUrl || '',
      officialLink: 'https://pgsindia-ncof.gov.in/pkvy/index.aspx',
    },
    {
      id: 'kisan-samman',
      titleKey: 'schemes.schemes.kisan-samman.title',
      descriptionKey: 'schemes.schemes.kisan-samman.description',
      eligibilityKey: 'schemes.schemes.kisan-samman.eligibility',
      benefitsKey: 'schemes.schemes.kisan-samman.benefits.0',
      image: PlaceHolderImages.find(img => img.id === 'scheme-7')?.imageUrl || '',
      officialLink: 'https://www.pmkisan.gov.in/',
    }
  ];

  return (
    <>
      <PageHeader
        title={t('schemes.pageTitle')}
        description={t('schemes.pageDescription')}
      >
        <PageHeaderIcon />
      </PageHeader>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
        {schemesData.map((scheme) => (
          <Card key={scheme.id} className="flex flex-col">
            <CardHeader>
              <div className="relative aspect-video w-full mb-4">
                  <Image
                    src={scheme.image}
                    alt={t(scheme.titleKey)}
                    fill
                    className="rounded-md object-cover"
                    data-ai-hint="farming scheme"
                  />
              </div>
              <CardTitle className="font-headline text-2xl text-primary">{t(scheme.titleKey)}</CardTitle>
              <CardDescription>{t(scheme.descriptionKey)}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div>
                <h4 className="font-semibold mb-1">{t('schemes.keyBenefit')}</h4>
                <p className="text-sm text-muted-foreground">{t(scheme.benefitsKey)}</p>
              </div>
              <div className="mt-4">
                <h4 className="font-semibold mb-1">{t('schemes.eligibility')}</h4>
                <p className="text-sm text-muted-foreground">{t(scheme.eligibilityKey)}</p>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/50 p-4 mt-auto flex gap-2">
                <Button className="w-full bg-amber-300 hover:bg-amber-400 text-amber-900">{t('schemes.applyNow')}</Button>
                <Button variant="outline" className="w-full" asChild>
                    <Link href={scheme.officialLink} target="_blank" rel="noopener noreferrer">
                        {t('schemes.officialLink')} <ExternalLink className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </>
  );
}
