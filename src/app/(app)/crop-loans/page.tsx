'use client';
import { PageHeader } from '@/components/page-header';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Banknote, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from '@/hooks/use-translation';
import { useRouter } from 'next/navigation';

export default function CropLoansPage() {
  const { t } = useTranslation();
  const router = useRouter();

  const loanData = [
    {
      id: 'kcc',
      titleKey: 'cropLoans.loans.kcc.title',
      providerKey: 'cropLoans.loans.kcc.provider',
      image: PlaceHolderImages.find(img => img.id === 'loan-kcc')?.imageUrl || '',
      imageHint: 'credit card payment',
      interestRateKey: 'cropLoans.loans.kcc.interestRate',
      maxAmountKey: 'cropLoans.loans.kcc.maxAmount',
      tenureKey: 'cropLoans.loans.kcc.tenure',
      eligibilityKeys: [
        'cropLoans.loans.kcc.eligibility.0',
        'cropLoans.loans.kcc.eligibility.1',
        'cropLoans.loans.kcc.eligibility.2',
      ],
      officialLink: 'https://www.nabard.org/content.aspx?id=517'
    },
    {
      id: 'gold-loan',
      titleKey: 'cropLoans.loans.gold-loan.title',
      providerKey: 'cropLoans.loans.gold-loan.provider',
      image: PlaceHolderImages.find(img => img.id === 'loan-gold')?.imageUrl || '',
      imageHint: 'gold coins stack',
      interestRateKey: 'cropLoans.loans.gold-loan.interestRate',
      maxAmountKey: 'cropLoans.loans.gold-loan.maxAmount',
      tenureKey: 'cropLoans.loans.gold-loan.tenure',
      eligibilityKeys: [
          'cropLoans.loans.gold-loan.eligibility.0',
          'cropLoans.loans.gold-loan.eligibility.1'
      ],
      officialLink: 'https://sbi.co.in/web/agri-rural/agriculture-banking/agri-gold-loan'
    },
    {
      id: 'tractor-loan',
      titleKey: 'cropLoans.loans.tractor-loan.title',
      providerKey: 'cropLoans.loans.tractor-loan.provider',
      image: PlaceHolderImages.find(img => img.id === 'loan-tractor')?.imageUrl || '',
      imageHint: 'woman on tractor',
      interestRateKey: 'cropLoans.loans.tractor-loan.interestRate',
      maxAmountKey: 'cropLoans.loans.tractor-loan.maxAmount',
      tenureKey: 'cropLoans.loans.tractor-loan.tenure',
      eligibilityKeys: [
          'cropLoans.loans.tractor-loan.eligibility.0',
          'cropLoans.loans.tractor-loan.eligibility.1'
      ],
      officialLink: 'https://www.hdfcbank.com/personal/borrow/popular-loans/tractor-loan'
    },
    {
      id: 'solar-pump-loan',
      titleKey: 'cropLoans.loans.solar-pump-loan.title',
      providerKey: 'cropLoans.loans.solar-pump-loan.provider',
      image: PlaceHolderImages.find(img => img.id === 'loan-solar-pump')?.imageUrl || '',
      imageHint: 'solar panels farm',
      interestRateKey: 'cropLoans.loans.solar-pump-loan.interestRate',
      maxAmountKey: 'cropLoans.loans.solar-pump-loan.maxAmount',
      tenureKey: 'cropLoans.loans.solar-pump-loan.tenure',
      eligibilityKeys: [
          'cropLoans.loans.solar-pump-loan.eligibility.0',
          'cropLoans.loans.solar-pump-loan.eligibility.1',
      ],
      officialLink: '#'
    },
    {
      id: 'warehouse-receipt-loan',
      titleKey: 'cropLoans.loans.warehouse-receipt-loan.title',
      providerKey: 'cropLoans.loans.warehouse-receipt-loan.provider',
      image: PlaceHolderImages.find(img => img.id === 'loan-warehouse')?.imageUrl || '',
      imageHint: 'warehouse grain sacks',
      interestRateKey: 'cropLoans.loans.warehouse-receipt-loan.interestRate',
      maxAmountKey: 'cropLoans.loans.warehouse-receipt-loan.maxAmount',
      tenureKey: 'cropLoans.loans.warehouse-receipt-loan.tenure',
      eligibilityKeys: [
          'cropLoans.loans.warehouse-receipt-loan.eligibility.0',
      ],
      officialLink: '#'
    },
  ];

  const handleApplyNow = () => {
    router.push('/manage-applications');
  };

  const handleOfficialLink = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };


  return (
    <>
      <PageHeader
        title={t('cropLoans.pageTitle')}
        description={t('cropLoans.pageDescription')}
      >
        <div className="bg-accent rounded-full p-3 mr-4">
          <Banknote className="h-6 w-6 text-primary" />
        </div>
      </PageHeader>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {loanData.map((loan) => (
          <Card key={loan.id} className="flex flex-col">
            <CardHeader>
                <div className="relative aspect-video w-full mb-4">
                    <Image
                        src={loan.image}
                        alt={t(loan.titleKey)}
                        fill
                        className="rounded-md object-cover"
                        data-ai-hint={loan.imageHint}
                    />
                </div>
                <CardTitle className="font-headline text-2xl text-primary">{t(loan.titleKey)}</CardTitle>
                <CardDescription>{t(loan.providerKey)}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow space-y-4">
                <div>
                    <h4 className="font-semibold text-sm">{t('cropLoans.interestRate')}</h4>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">{t(loan.interestRateKey)}</Badge>
                </div>
                <div>
                    <h4 className="font-semibold text-sm">{t('cropLoans.maxAmount')}</h4>
                    <p className="text-sm text-muted-foreground">{t(loan.maxAmountKey)}</p>
                </div>
                <div>
                    <h4 className="font-semibold text-sm">{t('cropLoans.tenure')}</h4>
                    <p className="text-sm text-muted-foreground">{t(loan.tenureKey)}</p>
                </div>
                <div>
                    <h4 className="font-semibold text-sm">{t('cropLoans.eligibility')}</h4>
                    <ul className="list-disc pl-5 text-sm text-muted-foreground">
                        {loan.eligibilityKeys.map((itemKey) => <li key={itemKey}>{t(itemKey)}</li>)}
                    </ul>
                </div>
            </CardContent>
            <CardFooter className="bg-muted/50 p-4 mt-auto flex gap-2">
              <Button className="w-full bg-amber-300 hover:bg-amber-400 text-amber-900" onClick={handleApplyNow}>{t('cropLoans.applyNow')}</Button>
              <Button variant="outline" className="w-full" onClick={() => handleOfficialLink(loan.officialLink)}>
                {t('cropLoans.officialLink')} <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </>
  );
}
