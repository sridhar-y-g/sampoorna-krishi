'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowUpRight,
  Home,
  Newspaper,
  Sun,
  CloudRain,
  Wind,
  Droplets
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
import { motion } from 'framer-motion';

const featureLinks = NAV_LINKS.filter(link => link.href !== '/dashboard');

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

const WelcomeHeader = () => {
  const { t } = useTranslation();
  return (
    <motion.div variants={itemVariants} className="flex items-start gap-4 mb-8">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.2 }}
          className="bg-green-100 dark:bg-green-900/40 rounded-full p-4 shadow-sm"
        >
            <Home className="h-8 w-8 text-green-600 dark:text-green-400" />
        </motion.div>
        <div>
            <h1 className="font-headline text-3xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-green-700 to-green-500 dark:from-green-400 dark:to-green-200">
                {t('dashboard.welcome.title')}
            </h1>
            <p className="mt-2 text-lg text-muted-foreground font-medium">{t('dashboard.welcome.description')}</p>
        </div>
    </motion.div>
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
    <motion.div variants={itemVariants}>
      <Card className="mb-8 overflow-hidden relative border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950/40 dark:to-emerald-900/20">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
             <Sun className="w-64 h-64 animate-[spin_60s_linear_infinite]" />
          </div>
          <CardContent className="pt-8 pb-8 flex flex-col md:flex-row items-center gap-8 relative z-10">
              <div className="text-center md:text-left md:border-r border-green-200 dark:border-green-800 md:pr-8">
                  <div className="font-bold text-lg text-green-800 dark:text-green-300">
                    {now ? format(now, 'eeee, MMMM d, yyyy') : 'Loading...'}
                  </div>
                  <div className="text-5xl font-black text-green-700 dark:text-green-400 mt-1 tabular-nums">
                    {now ? format(now, 'hh:mm:ss a') : '...'}
                  </div>
              </div>
              <div className="flex-1 flex flex-col sm:flex-row items-center gap-6 justify-center md:justify-start">
                  <div className="relative">
                    <Sun className="h-16 w-16 text-amber-500 drop-shadow-lg" />
                    <CloudRain className="h-8 w-8 text-blue-500 absolute -bottom-2 -right-2 drop-shadow-md animate-bounce" />
                  </div>
                  <div className="text-center sm:text-left">
                      <p className="font-bold text-2xl text-green-900 dark:text-green-100">{t('dashboard.weather.summary')}</p>
                      <p className="text-green-700 dark:text-green-400 font-medium text-sm mt-1">{t('dashboard.weather.details')}</p>
                      <div className="flex items-center justify-center sm:justify-start gap-4 mt-3 text-sm font-semibold text-green-800/70 dark:text-green-200/70">
                         <span className="flex items-center gap-1"><Droplets className="h-4 w-4" /> 45%</span>
                         <span className="flex items-center gap-1"><Wind className="h-4 w-4" /> 12 km/h</span>
                      </div>
                  </div>
              </div>
          </CardContent>
      </Card>
    </motion.div>
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
        <motion.div variants={itemVariants}>
          <Card className="mb-10 border-0 shadow-md bg-card">
              <CardHeader className="border-b bg-muted/20 pb-4">
                  <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Newspaper className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle className="font-headline text-2xl font-bold text-primary">{t('dashboard.articles.title')}</CardTitle>
                  </div>
              </CardHeader>
              <CardContent className="pt-6">
                  <div className="grid gap-6 md:grid-cols-3">
                      {articles.map(article => (
                          <motion.div 
                            key={article.id} 
                            whileHover={{ y: -5 }}
                            className="group relative flex flex-col bg-card rounded-xl overflow-hidden border shadow-sm hover:shadow-xl transition-all duration-300"
                          >
                              <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
                                  <Image
                                      src={article.image}
                                      alt={t(article.titleKey)}
                                      fill
                                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                                      data-ai-hint={article.imageHint}
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                              </div>
                              <div className="p-5 flex flex-col flex-1">
                                <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors">{t(article.titleKey)}</h3>
                                <p className="mt-2 text-sm text-muted-foreground line-clamp-2 flex-1">{t(article.descriptionKey)}</p>
                                <Link href={article.link} className="mt-4 inline-flex items-center text-sm font-bold text-primary hover:text-primary/80">
                                    {t('dashboard.articles.readMore')} 
                                    <ArrowUpRight className="ml-1 h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                </Link>
                              </div>
                          </motion.div>
                      ))}
                  </div>
              </CardContent>
          </Card>
        </motion.div>
    );
}

export default function Dashboard() {
  const { t } = useTranslation();
  const cards = [
    { href: "/agri-ecommerce", titleKey: "dashboard.cards.agriEcommerce.title", descriptionKey: "dashboard.cards.agriEcommerce.description", icon: featureLinks.find(l => l.href === '/agri-ecommerce')?.icon },
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
  ];

  return (
    <motion.div 
      variants={containerVariants} 
      initial="hidden" 
      animate="show"
      className="max-w-7xl mx-auto"
    >
      <WelcomeHeader />
      <WeatherWidget />
      <ArticlesWidget />
      
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-headline font-bold text-primary px-1">Platform Features</h2>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 pb-12">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <motion.div key={card.href} variants={itemVariants} whileHover={{ y: -5 }}>
              <Card className="h-full flex flex-col border shadow-sm hover:shadow-xl hover:border-primary/30 transition-all duration-300 bg-gradient-to-b from-card to-card/50">
                <CardHeader className="pb-3 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
                  <div className="flex items-start justify-between mb-2 relative z-10">
                      <div className="p-2.5 bg-green-100 dark:bg-green-900/50 rounded-xl">
                        {Icon && <Icon className="h-6 w-6 text-green-600 dark:text-green-400" />}
                      </div>
                  </div>
                  <CardTitle className="text-lg font-headline font-extrabold text-foreground relative z-10 leading-tight">
                      {t(card.titleKey)}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-between pt-0 relative z-10">
                  <CardDescription className="text-sm text-muted-foreground mb-6 line-clamp-2">
                      {t(card.descriptionKey)}
                  </CardDescription>
                  <Button asChild variant="default" className="w-full group shadow-md hover:shadow-lg transition-all font-semibold">
                    <Link href={card.href}>
                      {t('dashboard.viewDetails')}
                      <ArrowUpRight className="ml-2 h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  );
}
