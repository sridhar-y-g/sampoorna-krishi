'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/language-provider';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { apiLogActivity } from '@/lib/api';
import { useAuth } from '@/context/auth-context';
import { 
  PawPrint, 
  TrendingUp, 
  MapPin, 
  Phone, 
  Plus, 
  Minus, 
  Coins, 
  AlertCircle, 
  Check, 
  ArrowRight,
  BookOpen,
  DollarSign,
  Edit,
  Trash2
} from 'lucide-react';

interface LivestockAdvisory {
  breed: { en: string; hi: string; kn: string };
  breeding: { en: string; hi: string; kn: string };
  nutrition: { en: string; hi: string; kn: string };
  healthcare: { en: string; hi: string; kn: string };
}

const ADVISORIES: Record<string, LivestockAdvisory> = {
  cattle: {
    breed: {
      en: 'Gir, Sahiwal, Red Sindhi (Indigenous) & Holstein Friesian (HF), Jersey (Exotic/Cross)',
      hi: 'गीर, साहीवाल, लाल सिंधी (देशी) और होल्सटीन फ्रीजियन (एचएफ), जर्सी (विदेशी/क्रॉस)',
      kn: 'ಗೀರ್, ಸಾಹಿವಾಲ್, ಕೆಂಪು ಸಿಂಧಿ (ದೇಸಿ) ಮತ್ತು ಹೋಲ್‌ಸ್ಟೈನ್ ಫ್ರಿಸಿಯನ್ (HF), ಜರ್ಸಿ (ವಿದೇಶಿ/ಮಿಶ್ರ ತಳಿ)'
    },
    breeding: {
      en: 'Perform Artificial Insemination (A.I.) within 12-18 hours of heat detection. Keep a calving interval of 12-14 months.',
      hi: 'गर्मी का पता चलने के 12-18 घंटे के भीतर कृत्रिम गर्भाधान (ए.आई.) करें। 12-14 महीने का ब्याने का अंतराल रखें।',
      kn: 'ಮಾದರಿ ಪತ್ತೆಯಾದ 12-18 ಗಂಟೆಗಳ ಒಳಗೆ ಕೃತಕ ಗರ್ಭಧಾರಣೆ (A.I.) ಮಾಡಿ. ಕರುವಿನ ನಡುವಿನ ಅಂತರ 12-14 ತಿಂಗಳು ಇರಲಿ.'
    },
    nutrition: {
      en: 'Provide 30-35 kg green fodder, 5-6 kg dry fodder, and 1 kg concentrate for maintenance + 400g per liter of milk.',
      hi: 'रखरखाव के लिए 30-35 किलोग्राम हरा चारा, 5-6 किलोग्राम सूखा चारा और 1 किलोग्राम सांद्रता प्रदान करें + प्रति लीटर दूध पर 400 ग्राम अतिरिक्त।',
      kn: 'ನಿರ್ವಹಣೆಗಾಗಿ 30-35 ಕೆಜಿ ಹಸಿರು ಮೇವು, 5-6 ಕೆಜಿ ಒಣ ಮೇವು ಮತ್ತು 1 ಕೆಜಿ ಹಿಂಡಿ ನೀಡಿ + ಪ್ರತಿ ಲೀಟರ್ ಹಾಲಿಗೆ 400 ಗ್ರಾಂ ಹೆಚ್ಚುವರಿ ನೀಡಿ.'
    },
    healthcare: {
      en: 'Vaccinate annually for Foot-and-Mouth Disease (FMD) and Brucellosis. Deworm quarterly.',
      hi: 'खुरपका-मुंहपका रोग (एफएमडी) और ब्रुसेलोसिस के लिए सालाना टीकाकरण करें। त्रैमासिक रूप से कृमिनाशक दवा दें।',
      kn: 'ಕಾಲು ಬಾಯಿ ಜ್ವರ (FMD) ಮತ್ತು ಬ್ರೂಸೆಲೋಸಿಸ್‌ಗಾಗಿ ವಾರ್ಷಿಕ ಲಸಿಕೆ ನೀಡಿ. ಪ್ರತಿ ಮೂರು ತಿಂಗಳಿಗೊಮ್ಮೆ ಜಂತುನಾಶಕ ನೀಡಿ.'
    }
  },
  poultry: {
    breed: {
      en: 'Kari Devendra, Kadaknath, Rhode Island Red (RIR), White Leghorn (Layers)',
      hi: 'कारी देवेंद्र, कड़कनाथ, रोड आइलैंड रेड (आरआईआर), व्हाइट लेघॉर्न (लेयर्स)',
      kn: 'ಕರಿ ದೇವೇಂದ್ರ, ಕಡಕನಾಥ್, ರೋಡ್ ಐಲ್ಯಾಂಡ್ ರೆಡ್ (RIR), ವೈಟ್ ಲೆಗಾರ್ನ್ (ಮೊಟ್ಟೆ ಇಡುವ ಕೋಳಿಗಳು)'
    },
    breeding: {
      en: 'For backyard poultry, maintain a ratio of 1 rooster to 8-10 hens for fertile egg production.',
      hi: 'पिछवाड़े की मुर्गीपालन के लिए, उपजाऊ अंडे के उत्पादन के लिए 1 मुर्गे और 8-10 मुर्गियों का अनुपात बनाए रखें।',
      kn: 'ಹಿತ್ತಲ ಕೋಳಿ ಸಾಕಣೆಯಲ್ಲಿ, ಫಲವತ್ತಾದ ಮೊಟ್ಟೆ ಉತ್ಪಾದನೆಗಾಗಿ 1 ಹುಂಜಕ್ಕೆ 8-10 ಕೋಳಿಗಳ ಅನುಪಾತವನ್ನು ಕಾಪಾಡಿಕೊಳ್ಳಿ.'
    },
    nutrition: {
      en: 'Chicks require Starter mash (22% protein). Grow layers on Grower feed (16% protein) and Shell Grit for calcium.',
      hi: 'चूजों को स्टार्टर मैश (22% प्रोटीन) की आवश्यकता होती है। लेयर्स को ग्रोवर फीड (16% प्रोटीन) और कैल्शियम के लिए शेल ग्रिट पर पालें।',
      kn: 'ಮರಿಗಳಿಗೆ ಸ್ಟಾರ್ಟರ್ ಮ್ಯಾಶ್ (22% ಪ್ರೋಟೀನ್) ಅಗತ್ಯವಿದೆ. ಮೊಟ್ಟೆ ಇಡುವ ಕೋಳಿಗಳಿಗೆ ಗ್ರೋವರ್ ಫೀಡ್ (16% ಪ್ರೋಟೀನ್) ಮತ್ತು ಕ್ಯಾಲ್ಸಿಯಂಗಾಗಿ ಶೆಲ್ ಗ್ರಿಟ್ ನೀಡಿ.'
    },
    healthcare: {
      en: 'Vaccinate for Ranikhet Disease (Newcastle) at day 7 and day 28. Keep litter dry to prevent Coccidiosis.',
      hi: 'रानीखेत रोग (न्यूकैसल) के लिए 7वें और 28वें दिन टीकाकरण करें। कोकसीडिओसिस को रोकने के लिए बिछावन को सूखा रखें।',
      kn: 'ರಾನಿಖೇತ್ ಕಾಯಿಲೆಗೆ (ನ್ಯೂಕ್ಯಾಸಲ್) 7 ನೇ ಮತ್ತು 28 ನೇ ದಿನದಂದು ಲಸಿಕೆ ನೀಡಿ. ಕಾಕ್ಸಿಡಿಯೋಸಿಸ್ ತಡೆಗಟ್ಟಲು ಹಿತ್ತಲನ್ನು ಒಣದಾಗಿಡಿ.'
    }
  },
  sheep: {
    breed: {
      en: 'Deccani, Nellore, Bellary (Meat) & Rambouillet, Merino (Crosses for Wool)',
      hi: 'दक्कनी, नेल्लोर, बेल्लारी (मांस) और रामबौइलेट, मेरिनो (ऊन के लिए क्रॉस)',
      kn: 'ಡೆಕ್ಕನಿ, ನೆಲ್ಲೂರು, ಬೆಳ್ಳಾರಿ (ಮಾಂಸ) ಮತ್ತು ರಾಂಬೌಲೆಟ್, ಮೆರಿನೊ (ಉಣ್ಣೆಗಾಗಿ ಮಿಶ್ರತಳಿ)'
    },
    breeding: {
      en: 'Breed ewes once they reach 12-14 months of age. Avoid breeding close relatives to reduce genetic defects.',
      hi: 'भेड़ों के 12-14 महीने के होने पर उनका प्रजनन कराएं। आनुवंशिक दोषों को कम करने के लिए करीबी रिश्तेदारों के प्रजनन से बचें।',
      kn: 'ಕುರಿಗಳು 12-14 ತಿಂಗಳ ವಯಸ್ಸನ್ನು ತಲುಪಿದ ನಂತರ ಅವುಗಳನ್ನು ತಳಿ ಮಾಡಿ. ಆನುವಂಶಿಕ ದೋಷಗಳನ್ನು ತಡೆಗಟ್ಟಲು ಹತ್ತಿರದ ಸಂಬಂಧಿ ತಳಿ ಮಾಡುವುದನ್ನು ತಪ್ಪಿಸಿ.'
    },
    nutrition: {
      en: 'Allow 6-8 hours of pasture grazing daily. Provide mineral blocks containing copper, selenium, and zinc.',
      hi: 'रोजाना 6-8 घंटे चारागाह में चरने की अनुमति दें। तांबा, सेलेनियम और जस्ता युक्त खनिज ब्लॉक प्रदान करें।',
      kn: 'ಪ್ರತಿದಿನ 6-8 ಗಂಟೆಗಳ ಕಾಲ ಮೇಯಲು ಬಿಡಿ. ತಾಮ್ರ, ಸೆಲೆನಿಯಮ್ ಮತ್ತು ಸತುವು ಒಳಗೊಂಡಿರುವ ಖನಿಜ ಬ್ಲಾಕ್‌ಗಳನ್ನು ಒದಗಿಸಿ.'
    },
    healthcare: {
      en: 'Deworm prior to monsoon. Vaccinate against Enterotoxemia (ET) and Peste des Petits Ruminants (PPR).',
      hi: 'मानसून से पहले कृमिनाशक दवा दें। एंटरोटोक्सिमिया (ईटी) और पेस्ट डेस पेटिट्स रुमिनेंट्स (पीपीआर) के खिलाफ टीकाकरण करें।',
      kn: 'ಮುಂಗಾರು ಆರಂಭಕ್ಕೂ ಮುನ್ನ ಜಂತುನಾಶಕ ನೀಡಿ. ಎಂಟರೊಟಾಕ್ಸಿಮಿಯಾ (ET) ಮತ್ತು ಪಿಪಿಆರ್ (PPR) ಕಾಯಿಲೆಯ ವಿರುದ್ಧ ಲಸಿಕೆ ಹಾಕಿ.'
    }
  }
};

interface LivestockListing {
  id: string;
  category: 'cattle' | 'poultry' | 'sheep' | 'goat';
  breed: string;
  ageMonths: number;
  price: number;
  location: string;
  contact: string;
  description: string;
  imageUrl: string;
}

const DEFAULT_LIVESTOCK: LivestockListing[] = [
  {
    id: 'l1',
    category: 'cattle',
    breed: 'HF Cross Milking Cow',
    ageMonths: 36,
    price: 65000,
    location: 'Mandya, Karnataka',
    contact: '9845012345',
    description: 'Highly productive Holstein Friesian crossbred cow. Yielding 18 liters daily, current 2nd calving. Calm demeanor.',
    imageUrl: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'l2',
    category: 'cattle',
    breed: 'Murrah Buffalo Bull',
    ageMonths: 28,
    price: 95000,
    location: 'Rohtak, Haryana',
    contact: '9911223344',
    description: 'Purebred Murrah buffalo bull suitable for high-quality breeding. Well-built, certified health checks done.',
    imageUrl: 'https://images.unsplash.com/photo-1601614660309-8473bb4624b5?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'l3',
    category: 'sheep',
    breed: 'Nellore Meat Ram',
    ageMonths: 14,
    price: 18000,
    location: 'Nellore, Andhra Pradesh',
    contact: '9440556677',
    description: 'Top-quality Nellore breed ram for breeding or meat. Fast growth rate, disease resistant.',
    imageUrl: 'https://images.unsplash.com/photo-1484557985045-edf25e08da73?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'l4',
    category: 'goat',
    breed: 'Sirohi Breed Goat',
    ageMonths: 18,
    price: 15000,
    location: 'Ajmer, Rajasthan',
    contact: '9829011223',
    description: 'Dual-purpose Sirohi goat (milk & meat). Accustomed to semi-intensive feeding, vaccinated.',
    imageUrl: 'https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?q=80&w=600&auto=format&fit=crop'
  }
];

export default function AnimalHusbandryPage() {
  const { language, translations } = useLanguage();
  const { toast } = useToast();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<'advisory' | 'calculator' | 'marketplace'>('advisory');
  const [activeAdvisory, setActiveAdvisory] = useState<'cattle' | 'poultry' | 'sheep'>('cattle');

  // Calculator state
  const [calcAnimal, setCalcAnimal] = useState<'cattle' | 'poultry' | 'sheep'>('cattle');
  const [animalCount, setAnimalCount] = useState<number>(5);
  const [feedingQuality, setFeedingQuality] = useState<'high' | 'medium' | 'low'>('high');
  const [healthScore, setHealthScore] = useState<number>(4);
  const [calcResult, setCalcResult] = useState<{
    yieldAmount: number;
    unit: string;
    estRevenue: number;
    description: string;
  } | null>(null);

  // Marketplace listings state
  const [listings, setListings] = useState<LivestockListing[]>(DEFAULT_LIVESTOCK);
  const [editingListing, setEditingListing] = useState<LivestockListing | null>(null);
  
  // Listing modal form state
  const [isListOpen, setIsListOpen] = useState(false);
  const [listCategory, setListCategory] = useState<'cattle' | 'poultry' | 'sheep' | 'goat'>('cattle');
  const [listBreed, setListBreed] = useState('');
  const [listAge, setListAge] = useState('');
  const [listPrice, setListPrice] = useState('');
  const [listLocation, setListLocation] = useState('');
  const [listContact, setListContact] = useState('');
  const [listDescription, setListDescription] = useState('');
  const [listImageUrl, setListImageUrl] = useState('');

  // Fallback translations
  const t = translations?.animalHusbandry || {
    pageTitle: "Animal Husbandry & Direct Marketplace",
    pageDescription: "Rearing tips, selective breeding guidelines, yield projections, and direct listing options.",
    livestockAdvisory: "Advisory & Breeding Guidelines",
    directMarketplace: "Direct Livestock Marketplace",
    yieldCalculator: "Yield Projection Simulator",
    sellLivestock: "Sell Your Livestock",
    livestockType: "Livestock Type",
    cattle: "Cattle",
    poultry: "Poultry",
    sheep: "Sheep",
    goats: "Goats",
    age: "Age",
    price: "Price",
    location: "Location",
    contact: "Contact Info",
    listAnimal: "List Livestock for Sale",
    simulatedOutput: "Simulated Output"
  };

  const handleCalculate = () => {
    let yieldPerUnit = 0;
    let pricePerUnit = 0;
    let unit = '';
    let desc = '';

    const feedMultiplier = feedingQuality === 'high' ? 1.2 : feedingQuality === 'medium' ? 1.0 : 0.7;
    const healthMultiplier = 0.5 + (healthScore / 10) * 1.0; // 0.6 to 1.0

    if (calcAnimal === 'cattle') {
      // average 15 liters per day per cattle
      yieldPerUnit = 15 * 30; // Monthly
      pricePerUnit = 45; // ₹45 per liter
      unit = 'Liters of Milk / month';
      desc = language === 'kn' ? 'ಉತ್ತಮ ಗುಣಮಟ್ಟದ ಹಾಲು ಉತ್ಪಾದನೆ ಪ್ರಕ್ಷೇಪಣ' : language === 'hi' ? 'दूध उत्पादन अनुमान' : 'Projected monthly milk yield estimates.';
    } else if (calcAnimal === 'poultry') {
      // average 24 eggs per month per hen
      yieldPerUnit = 24; 
      pricePerUnit = 6; // ₹6 per egg
      unit = 'Eggs / month';
      desc = language === 'kn' ? 'ಮಾಸಿಕ ಮೊಟ್ಟೆ ಉತ್ಪಾದನೆಯ ಅಂದಾಜು' : language === 'hi' ? 'अंडे का उत्पादन अनुमान' : 'Projected monthly egg counts.';
    } else {
      // Sheep/Goat: average 45 kg meat per head or 2.5 kg fiber/wool per head annually
      yieldPerUnit = 40; 
      pricePerUnit = 650; // ₹650 per kg meat
      unit = 'kg of Meat yield';
      desc = language === 'kn' ? 'ಮಾಂಸ ಇಳುವರಿ ಪ್ರಕ್ಷೇಪಣ' : language === 'hi' ? 'मांस उत्पादन अनुमान' : 'Estimated meat yield projections.';
    }

    const totalYield = Math.round(animalCount * yieldPerUnit * feedMultiplier * healthMultiplier);
    const totalRevenue = Math.round(totalYield * pricePerUnit);

    setCalcResult({
      yieldAmount: totalYield,
      unit,
      estRevenue: totalRevenue,
      description: desc
    });

    apiLogActivity('yield_calculation', `Calculated projected yield for ${animalCount} ${calcAnimal} (Revenue: ₹${totalRevenue})`).catch(console.error);
  };

  const openEditListing = (item: LivestockListing) => {
    setEditingListing(item);
    setListCategory(item.category);
    setListBreed(item.breed);
    setListAge(item.ageMonths.toString());
    setListPrice(item.price.toString());
    setListLocation(item.location);
    setListContact(item.contact);
    setListDescription(item.description);
    setListImageUrl(item.imageUrl);
    setIsListOpen(true);
  };

  const closeListModal = () => {
    setIsListOpen(false);
    setEditingListing(null);
    setListBreed('');
    setListAge('');
    setListPrice('');
    setListLocation('');
    setListContact('');
    setListDescription('');
    setListImageUrl('');
  };

  const deleteListing = (id: string) => {
    const item = listings.find(l => l.id === id);
    setListings(prev => prev.filter(l => l.id !== id));
    apiLogActivity('admin_livestock_deleted', `Admin deleted livestock listing: ${item?.breed}`).catch(console.error);
    toast({
      title: "Listing Deleted",
      description: "The livestock listing has been removed from the marketplace.",
    });
  };

  const handleListSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!listBreed || !listAge || !listPrice || !listLocation || !listContact) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const priceNum = Number(listPrice);
    const ageNum = Number(listAge);
    if (isNaN(priceNum) || priceNum <= 0 || isNaN(ageNum) || ageNum <= 0) {
      toast({
        title: "Error",
        description: "Please enter valid price and age values.",
        variant: "destructive"
      });
      return;
    }

    const defaultImages = {
      cattle: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?q=80&w=600',
      poultry: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?q=80&w=600',
      sheep: 'https://images.unsplash.com/photo-1484557985045-edf25e08da73?q=80&w=600',
      goat: 'https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?q=80&w=600'
    };

    if (editingListing) {
      const updatedListing: LivestockListing = {
        ...editingListing,
        category: listCategory,
        breed: listBreed,
        ageMonths: ageNum,
        price: priceNum,
        location: listLocation,
        contact: listContact,
        description: listDescription || 'Healthy breed raised under standard organic farming cooperative guidelines.',
        imageUrl: listImageUrl || editingListing.imageUrl
      };
      setListings(prev => prev.map(l => l.id === editingListing.id ? updatedListing : l));
      apiLogActivity('admin_livestock_edited', `Admin edited livestock listing: ${listBreed} (Price: ₹${priceNum})`).catch(console.error);
      closeListModal();
      toast({
        title: "Listing Updated",
        description: "The livestock listing details have been updated successfully.",
      });
      return;
    }

    const newListing: LivestockListing = {
      id: 'listing_' + Date.now(),
      category: listCategory,
      breed: listBreed,
      ageMonths: ageNum,
      price: priceNum,
      location: listLocation,
      contact: listContact,
      description: listDescription || 'Healthy breed raised under standard organic farming cooperative guidelines.',
      imageUrl: listImageUrl || defaultImages[listCategory]
    };

    setListings(prev => [newListing, ...prev]);
    apiLogActivity('farmer_livestock_listed', `Farmer listed animal: ${listBreed} (Price: ₹${priceNum})`).catch(console.error);
    closeListModal();

    toast({
      title: "Livestock Listed Successfully",
      description: "Direct listing is now visible to nearby regional farming buyers.",
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Header section */}
      <div className="flex items-center justify-between gap-4 mb-8">
        <PageHeader title={t.pageTitle} description={t.pageDescription}>
          <div className="bg-emerald-100 dark:bg-emerald-950 p-4 rounded-full shadow-md">
            <PawPrint className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
          </div>
        </PageHeader>
      </div>

      {/* Main Tabs */}
      <div className="grid grid-cols-3 gap-2 mb-8 bg-slate-100/50 dark:bg-slate-900/30 p-2.5 rounded-2xl border backdrop-blur-sm">
        {(['advisory', 'calculator', 'marketplace'] as const).map((tab) => {
          let label = t.livestockAdvisory;
          if (tab === 'calculator') label = t.yieldCalculator;
          if (tab === 'marketplace') label = t.directMarketplace;

          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3 px-4 text-sm font-bold rounded-xl transition-all duration-300 ${
                activeTab === tab
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20'
                  : 'text-muted-foreground hover:bg-slate-200/50 dark:hover:bg-slate-800/40 hover:text-foreground'
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT 1: ADVISORY & REARING GUIDELINES */}
      {activeTab === 'advisory' && (
        <div className="space-y-6">
          <div className="flex gap-2 p-1.5 bg-slate-100/50 dark:bg-slate-900/40 border rounded-xl max-w-sm">
            {(['cattle', 'poultry', 'sheep'] as const).map((adv) => (
              <button
                key={adv}
                onClick={() => setActiveAdvisory(adv)}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  activeAdvisory === adv 
                    ? 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 shadow-sm' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {adv === 'cattle' ? t.cattle : adv === 'poultry' ? t.poultry : t.sheep}
              </button>
            ))}
          </div>

          <motion.div 
            key={activeAdvisory}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* Guide Card */}
            <Card className="border-slate-200/80 dark:border-slate-850 p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-4 text-emerald-600 dark:text-emerald-400">
                  <BookOpen className="h-5 w-5" />
                  <h3 className="text-lg font-black tracking-tight uppercase">
                    {activeAdvisory.toUpperCase()} Advisory
                  </h3>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <span className="text-xs text-muted-foreground font-black block uppercase tracking-wider">Recommended Breeds</span>
                    <p className="text-sm font-semibold mt-0.5 text-slate-800 dark:text-slate-200">
                      {language === 'kn' ? ADVISORIES[activeAdvisory].breed.kn : language === 'hi' ? ADVISORIES[activeAdvisory].breed.hi : ADVISORIES[activeAdvisory].breed.en}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground font-black block uppercase tracking-wider">Breeding Protocol</span>
                    <p className="text-sm text-slate-700 dark:text-slate-300 mt-0.5 leading-relaxed">
                      {language === 'kn' ? ADVISORIES[activeAdvisory].breeding.kn : language === 'hi' ? ADVISORIES[activeAdvisory].breeding.hi : ADVISORIES[activeAdvisory].breeding.en}
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-6 p-4.5 bg-amber-50/50 dark:bg-amber-950/10 border border-amber-100 dark:border-amber-900/30 rounded-xl flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 leading-normal">
                  {language === 'kn' 
                    ? 'ನೆನಪಿಡಿ: ಗರ್ಭಧಾರಣೆಯ ವಿಳಂಬ ತಡೆಯಲು ಪಶುವೈದ್ಯರ ಸಮಾಲೋಚನೆ ಪಡೆಯಿರಿ.' 
                    : language === 'hi' 
                    ? 'याद रखें: प्रजनन संबंधी समस्याओं से बचने के लिए समय पर पशु चिकित्सक से परामर्श लें।' 
                    : 'Important: Consult your local cooperative vet to ensure timely insemination and healthy breeding.'
                  }
                </p>
              </div>
            </Card>

            {/* Nutrition & Healthcare */}
            <div className="space-y-6">
              <Card className="border-slate-200/80 dark:border-slate-850 p-6">
                <h4 className="font-headline font-black text-sm text-slate-800 dark:text-slate-100 uppercase tracking-wide mb-3">Nutrition & Feeding Management</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {language === 'kn' ? ADVISORIES[activeAdvisory].nutrition.kn : language === 'hi' ? ADVISORIES[activeAdvisory].nutrition.hi : ADVISORIES[activeAdvisory].nutrition.en}
                </p>
              </Card>

              <Card className="border-slate-200/80 dark:border-slate-850 p-6">
                <h4 className="font-headline font-black text-sm text-slate-800 dark:text-slate-100 uppercase tracking-wide mb-3">Vaccination & Healthcare Schedule</h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {language === 'kn' ? ADVISORIES[activeAdvisory].healthcare.kn : language === 'hi' ? ADVISORIES[activeAdvisory].healthcare.hi : ADVISORIES[activeAdvisory].healthcare.en}
                </p>
              </Card>
            </div>
          </motion.div>
        </div>
      )}

      {/* TAB CONTENT 2: YIELD PROJECTION SIMULATOR */}
      {activeTab === 'calculator' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Inputs Section */}
          <Card className="border-slate-200/80 dark:border-slate-850 p-6 space-y-6">
            <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-emerald-500" />
              <span>Yield Projection Inputs</span>
            </h3>

            {/* Animal Selection */}
            <div className="space-y-2">
              <Label className="font-bold text-xs">Select Rearing Category</Label>
              <div className="grid grid-cols-3 gap-2">
                {(['cattle', 'poultry', 'sheep'] as const).map((animal) => (
                  <button
                    key={animal}
                    onClick={() => {
                      setCalcAnimal(animal);
                      setCalcResult(null);
                    }}
                    className={`py-2 px-3 text-xs font-bold rounded-lg border transition-all ${
                      calcAnimal === animal 
                        ? 'bg-emerald-600 border-emerald-600 text-white shadow-md' 
                        : 'bg-muted/30 border-input hover:bg-muted text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {animal.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Animal Count */}
            <div className="space-y-2">
              <Label className="font-bold text-xs">Number of Animals / Heads</Label>
              <div className="flex items-center gap-3">
                <Button variant="outline" onClick={() => setAnimalCount(c => Math.max(1, c - 5))} className="h-10 w-10 p-0">
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="text-lg font-black w-8 text-center">{animalCount}</span>
                <Button variant="outline" onClick={() => setAnimalCount(c => c + 5)} className="h-10 w-10 p-0">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Feeding Quality */}
            <div className="space-y-2">
              <Label className="font-bold text-xs">Feed / Fodder Quality Level</Label>
              <div className="grid grid-cols-3 gap-2">
                {(['high', 'medium', 'low'] as const).map((q) => (
                  <button
                    key={q}
                    onClick={() => {
                      setFeedingQuality(q);
                      setCalcResult(null);
                    }}
                    className={`py-2 px-2 text-xs font-bold rounded-lg border transition-all ${
                      feedingQuality === q 
                        ? 'bg-slate-800 dark:bg-slate-200 border-slate-800 dark:border-slate-250 text-white dark:text-slate-900' 
                        : 'bg-muted/30 border-input hover:bg-muted text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {q.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Veterinary Care Star Rating */}
            <div className="space-y-2">
              <Label className="font-bold text-xs">Healthcare & Bio-Security Level (1-5)</Label>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => {
                      setHealthScore(star);
                      setCalcResult(null);
                    }}
                    className={`h-9 w-9 rounded-lg border font-bold text-sm flex items-center justify-center transition-all ${
                      healthScore >= star 
                        ? 'bg-amber-500 border-amber-500 text-white' 
                        : 'bg-muted/30 hover:bg-muted text-muted-foreground'
                    }`}
                  >
                    {star}
                  </button>
                ))}
              </div>
            </div>

            <Button onClick={handleCalculate} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-11">
              Calculate Projected Yields
            </Button>
          </Card>

          {/* Results Output Section */}
          <Card className="border-slate-200/80 dark:border-slate-850 p-6 flex flex-col justify-between relative overflow-hidden bg-slate-950 text-white">
            <div className="absolute -top-16 -right-16 h-36 w-36 bg-emerald-500/10 rounded-full blur-2xl" />
            
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Coins className="h-5 w-5 text-emerald-400" />
                <h3 className="text-lg font-black tracking-tight">{t.simulatedOutput}</h3>
              </div>

              {calcResult ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-6"
                >
                  <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl">
                    <span className="text-xs text-slate-400 font-bold block uppercase tracking-wider">Projected Output Yield</span>
                    <span className="text-3xl font-black text-emerald-400 block mt-1">
                      {calcResult.yieldAmount.toLocaleString()}
                    </span>
                    <span className="text-xs text-slate-300 font-semibold">{calcResult.unit}</span>
                  </div>

                  <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl">
                    <span className="text-xs text-slate-400 font-bold block uppercase tracking-wider">Estimated Monthly Revenue</span>
                    <span className="text-3xl font-black text-sky-400 block mt-1">
                      ₹{calcResult.estRevenue.toLocaleString()}
                    </span>
                    <span className="text-[11px] text-slate-400">Calculated based on current regional cooperative market prices.</span>
                  </div>

                  <p className="text-xs text-slate-400 italic mt-2">
                    *Note: The projections are simulations based on nutritional and animal husbandry models. Actual yield depends on breed pedigree and environmental factors.
                  </p>
                </motion.div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center py-20 text-slate-400">
                  <TrendingUp className="h-16 w-16 opacity-10 mb-4 animate-pulse" />
                  <p className="font-bold text-sm">Waiting for Simulation Input</p>
                  <p className="text-xs mt-1 max-w-xs">Fill in your livestock quantities, feed level, and care ratings to project yields.</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}

      {/* TAB CONTENT 3: PEER-TO-PEER MARKETPLACE */}
      {activeTab === 'marketplace' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Coins className="h-5 w-5 text-emerald-500" />
                <span>P2P Livestock Exchange</span>
              </h3>
              <p className="text-xs text-muted-foreground mt-1">Buy and sell healthy livestock directly with other farmers. Zero commissions.</p>
            </div>
            
            <Button onClick={() => setIsListOpen(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold">
              <Plus className="mr-1.5 h-4 w-4" /> {t.sellLivestock}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {listings.map((item) => (
              <Card key={item.id} className="overflow-hidden flex flex-col md:flex-row border-slate-200/80 dark:border-slate-850 hover:shadow-lg transition-all duration-300 relative">
                <div className="relative h-48 md:h-auto md:w-48 bg-slate-100 shrink-0">
                  <Image 
                    src={item.imageUrl}
                    alt={item.breed}
                    fill
                    sizes="(max-width: 768px) 100vw, 192px"
                    className="object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-emerald-600 text-white text-[10px] font-black tracking-wide uppercase px-2 py-0.5 rounded shadow-sm">
                    {item.category.toUpperCase()}
                  </div>

                  {user?.is_admin && (
                    <div className="absolute top-3 right-3 z-20 flex gap-1.5 md:flex-col">
                      <Button 
                        onClick={(e) => { e.stopPropagation(); openEditListing(item); }}
                        className="h-8 w-8 p-0 bg-slate-900/80 hover:bg-emerald-600 text-white rounded-full shadow animate-fade-in"
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </Button>
                      <Button 
                        onClick={(e) => { e.stopPropagation(); deleteListing(item.id); }}
                        className="h-8 w-8 p-0 bg-slate-900/80 hover:bg-rose-600 text-white rounded-full shadow animate-fade-in"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  )}
                </div>

                <div className="p-6 flex-grow flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="font-headline font-black text-lg text-slate-800 dark:text-slate-100">{item.breed}</h4>
                      <Badge variant="outline" className="text-xs font-bold shrink-0">{item.ageMonths}m old</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-sky-500" />
                      <span>{item.location}</span>
                    </p>
                    <p className="text-xs text-slate-650 dark:text-slate-350 mt-3 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-4 border-t flex items-center justify-between gap-4">
                    <div>
                      <span className="text-xs text-slate-400 font-bold block uppercase tracking-wide">Listing Price</span>
                      <span className="text-lg font-black text-slate-800 dark:text-slate-100">₹{item.price.toLocaleString()}</span>
                    </div>

                    <a 
                      href={`tel:${item.contact}`} 
                      className="bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-950 dark:hover:bg-emerald-900 text-emerald-700 dark:text-emerald-400 font-bold text-xs h-9 px-4 rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
                    >
                      <Phone className="h-3.5 w-3.5" />
                      <span>Call Farmer</span>
                    </a>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* List Animal Dialogue / Modal */}
      <Dialog open={isListOpen} onOpenChange={(open) => { if (!open) closeListModal(); }}>
        <DialogContent className="max-w-md bg-card max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <PawPrint className="h-6 w-6 text-emerald-500" /> {editingListing ? 'Edit Livestock Details' : t.listAnimal}
            </DialogTitle>
            <DialogDescription>
              {editingListing ? 'Update the details, location, contact, and photograph of your livestock listing.' : 'List your livestock directly in the marketplace catalog. Other regional cooperative buyers will be able to contact you.'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleListSubmit} className="space-y-4 py-2">
            {/* Category */}
            <div className="space-y-1">
              <Label className="font-bold text-xs">Livestock Category *</Label>
              <div className="grid grid-cols-4 gap-2">
                {(['cattle', 'poultry', 'sheep', 'goat'] as const).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setListCategory(cat)}
                    className={`py-2 px-1 text-xs font-bold rounded-lg border transition-all ${
                      listCategory === cat 
                        ? 'bg-emerald-600 border-emerald-600 text-white shadow-md' 
                        : 'bg-muted/30 border-input hover:bg-muted text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {cat.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Breed Name */}
            <div className="space-y-1">
              <Label htmlFor="list-breed" className="font-bold text-xs">Breed / Title *</Label>
              <Input 
                id="list-breed"
                value={listBreed}
                onChange={(e) => setListBreed(e.target.value)}
                placeholder="e.g., Murrah Buffalo, HF Cross Cow"
                className="bg-muted/30 focus-visible:ring-emerald-500 h-10 border" 
                required
              />
            </div>

            {/* Age & Price Row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="list-age" className="font-bold text-xs">Age (Months) *</Label>
                <Input 
                  id="list-age"
                  type="number"
                  value={listAge}
                  onChange={(e) => setListAge(e.target.value)}
                  placeholder="Age in months"
                  className="bg-muted/30 focus-visible:ring-emerald-500 h-10 border"
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="list-price" className="font-bold text-xs">Price (₹) *</Label>
                <Input 
                  id="list-price"
                  type="number"
                  value={listPrice}
                  onChange={(e) => setListPrice(e.target.value)}
                  placeholder="Selling price"
                  className="bg-muted/30 focus-visible:ring-emerald-500 h-10 border"
                  required
                />
              </div>
            </div>

            {/* Location & Contact */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="list-location" className="font-bold text-xs">Location *</Label>
                <Input 
                  id="list-location"
                  value={listLocation}
                  onChange={(e) => setListLocation(e.target.value)}
                  placeholder="e.g., Mandya, Karnataka"
                  className="bg-muted/30 focus-visible:ring-emerald-500 h-10 border"
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="list-contact" className="font-bold text-xs">Contact Phone *</Label>
                <Input 
                  id="list-contact"
                  value={listContact}
                  onChange={(e) => setListContact(e.target.value)}
                  placeholder="e.g., 9845xxxxxx"
                  className="bg-muted/30 focus-visible:ring-emerald-500 h-10 border"
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1">
              <Label htmlFor="list-description" className="font-bold text-xs">Description</Label>
              <textarea 
                id="list-description"
                value={listDescription}
                onChange={(e) => setListDescription(e.target.value)}
                placeholder="Describe animal feeding, medical history, milk yield or weight..."
                className="w-full min-h-[80px] p-3 text-sm rounded-lg border bg-muted/30 focus-visible:ring-emerald-500"
              />
            </div>

            {/* Image URL */}
            <div className="space-y-1">
              <Label htmlFor="list-img" className="font-bold text-xs">Photo URL (Optional)</Label>
              <Input 
                id="list-img"
                value={listImageUrl}
                onChange={(e) => setListImageUrl(e.target.value)}
                placeholder="Paste an Unsplash or direct image link"
                className="bg-muted/30 focus-visible:ring-emerald-500 h-10 border"
              />
            </div>

            <DialogFooter className="pt-4 border-t gap-2">
              <Button type="button" variant="ghost" onClick={closeListModal}>
                Cancel
              </Button>
              <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold">
                {editingListing ? 'Save Listing Changes' : 'Publish Marketplace Listing'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
