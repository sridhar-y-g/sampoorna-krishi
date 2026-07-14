
'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowUpRight,
  Home,
  Newspaper,
  Sun,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { NAV_LINKS } from '@/lib/constants';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { useTranslation } from '@/hooks/use-translation';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const featureLinks = NAV_LINKS.filter(link => link.href !== '/dashboard');

const WelcomeHeader = () => {
  const { t } = useTranslation();
  return (
    <div className="flex items-start gap-4 mb-8">
        <div className="bg-accent rounded-full p-3">
            <Home className="h-6 w-6 text-primary" />
        </div>
        <div>
            <h1 className="font-headline text-3xl md:text-4xl font-bold tracking-tight text-primary">
                {t('dashboard.welcome.title')}
            </h1>
            <p className="mt-1 text-lg text-muted-foreground">{t('dashboard.welcome.description')}</p>
        </div>
    </div>
)};

const WeatherWidget = () => {
  const { t } = useTranslation();
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <Card className="mb-8 bg-accent/50 border-accent">
        <CardContent className="pt-6 flex items-center gap-6">
            <div className="text-center">
                <div className="font-bold text-lg">{now ? format(now, 'eeee, MMMM d, yyyy') : 'Loading...'}</div>
                <div className="text-5xl font-bold text-primary">{now ? format(now, 'hh:mm:ss a') : '...'}</div>
            </div>
            <div className="flex-1 flex items-center gap-4">
                <Sun className="h-12 w-12 text-yellow-500" />
                <div>
                    <p className="font-semibold">{t('dashboard.weather.summary')}</p>
                    <p className="text-muted-foreground text-sm">{t('dashboard.weather.details')}</p>
                </div>
            </div>
        </CardContent>
    </Card>
  );
};

const ArticlesWidget = () => {
    const { t } = useTranslation();

    const articles = [
        {
            id: 'article-1',
            titleKey: 'dashboard.articles.article1.title',
            descriptionKey: 'dashboard.articles.article1.description',
            image: PlaceHolderImages.find(img => img.id === 'article-1')?.imageUrl || '',
            imageHint: 'farmer field',
            link: '#'
        },
        {
            id: 'article-2',
            titleKey: 'dashboard.articles.article2.title',
            descriptionKey: 'dashboard.articles.article2.description',
            image: PlaceHolderImages.find(img => img.id === 'article-2')?.imageUrl || '',
            imageHint: 'agriculture technology',
            link: '#'
        },
        {
            id: 'article-3',
            titleKey: 'dashboard.articles.article3.title',
            descriptionKey: 'dashboard.articles.article3.description',
            image: PlaceHolderImages.find(img => img.id === 'article-3')?.imageUrl || '',
            imageHint: 'sustainable farming',
            link: '#'
        },
    ];

    return (
        <Card className="mb-8">
            <CardHeader>
                <div className="flex items-center gap-3">
                    <Newspaper className="h-6 w-6 text-primary" />
                    <CardTitle className="font-headline text-2xl text-primary">{t('dashboard.articles.title')}</CardTitle>
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid gap-6 md:grid-cols-3">
                    {articles.map(article => (
                        <div key={article.id} className="group relative">
                            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg">
                                <Image
                                    src={article.image}
                                    alt={t(article.titleKey)}
                                    fill
                                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                                    data-ai-hint={article.imageHint}
                                />
                            </div>
                            <h3 className="mt-4 font-semibold text-lg">{t(article.titleKey)}</h3>
                            <p className="mt-1 text-sm text-muted-foreground">{t(article.descriptionKey)}</p>
                            <Link href={article.link} className="mt-2 inline-flex items-center text-sm font-semibold text-primary hover:underline">
                                {t('dashboard.articles.readMore')} <ArrowUpRight className="ml-1 h-4 w-4" />
                            </Link>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}


export default function Dashboard() {
  const { t } = useTranslation();
  const cards = [
    { href: "/crop-loans", titleKey: "dashboard.cards.cropLoans.title", descriptionKey: "dashboard.cards.cropLoans.description", icon: featureLinks.find(l => l.href === '/crop-loans')?.icon },
    { href: "/market-price", titleKey: "dashboard.cards.marketPrices.title", descriptionKey: "dashboard.cards.marketPrices.description", icon: featureLinks.find(l => l.href === '/market-price')?.icon },
    { href: "/weather-advisory", titleKey: "dashboard.cards.weatherAdvisory.title", descriptionKey: "dashboard.cards.weatherAdvisory.description", icon: featureLinks.find(l => l.href === '/weather-advisory')?.icon },
    { href: "/schemes", titleKey: "dashboard.cards.governmentSchemes.title", descriptionKey: "dashboard.cards.governmentSchemes.description", icon: featureLinks.find(l => l.href === '/schemes')?.icon },
    { href: "/crop-diagnosis", titleKey: "dashboard.cards.cropHealthDiagnosis.title", descriptionKey: "dashboard.cards.cropHealthDiagnosis.description", icon: featureLinks.find(l => l.href === '/crop-diagnosis')?.icon },
    { href: "/farming-tips", titleKey: "dashboard.cards.aiFarmingTips.title", descriptionKey: "dashboard.cards.aiFarmingTips.description", icon: featureLinks.find(l => l.href === '/farming-tips')?.icon },
    { href: "/subsidy-finder", titleKey: "dashboard.cards.subsidyFinder.title", descriptionKey: "dashboard.cards.subsidyFinder.description", icon: featureLinks.find(l => l.href === '/subsidy-finder')?.icon },
    { href: "/fertilizers", titleKey: "dashboard.cards.aiFertilizerAdvisor.title", descriptionKey: "dashboard.cards.aiFertilizerAdvisor.description", icon: featureLinks.find(l => l.href === '/fertilizers')?.icon },
    { href: "/crop-insurance", titleKey: "dashboard.cards.cropInsurance.title", descriptionKey: "dashboard.cards.cropInsurance.description", icon: featureLinks.find(l => l.href === '/crop-insurance')?.icon },
    { href: "/manage-applications", titleKey: "dashboard.cards.manageApplications.title", descriptionKey: "dashboard.cards.manageApplications.description", icon: featureLinks.find(l => l.href === '/manage-applications')?.icon },
  ]

  return (
    <>
      <WelcomeHeader />
      <WeatherWidget />
      <ArticlesWidget />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.href} className="hover:shadow-lg transition-shadow duration-300 flex flex-col">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                    <CardTitle className="text-xl font-headline font-bold text-primary">
                        {t(card.titleKey)}
                    </CardTitle>
                    {Icon && <Icon className="h-6 w-6 text-muted-foreground" />}
                </div>
                <CardDescription className="text-sm text-muted-foreground">
                    {t(card.descriptionKey)}
                </CardDescription>
              </CardHeader>
              <CardContent className="mt-auto">
                <Button asChild variant="outline" className="w-full group">
                  <Link href={card.href}>
                    {t('dashboard.viewDetails')}
                    <ArrowUpRight className="ml-2 h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </>
  );
}
