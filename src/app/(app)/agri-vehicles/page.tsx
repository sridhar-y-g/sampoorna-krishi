'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/context/language-provider';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Info, ShieldCheck, Scale, Truck, X, Edit, Trash2, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/auth-context';
import { apiLogActivity } from '@/lib/api';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface Vehicle {
  id: string;
  name: string;
  category: 'compact' | 'utility' | 'heavy' | 'harvester' | 'tillers_weeders' | 'sprayers';
  brand: string;
  hp: string;
  priceRange: string;
  bestFor: { en: string; hi: string; kn: string };
  specs: {
    engine: string;
    gears: string;
    liftCapacity?: string;
    fuelTank: string;
  };
  imageUrl: string;
}

const VEHICLES: Vehicle[] = [
  // 1. Compact/Orchard Tractors
  {
    id: 'v1',
    name: 'Mahindra OJA 2121',
    category: 'compact',
    brand: 'Mahindra',
    hp: '21 HP',
    priceRange: '₹4.7 - ₹5.3 Lakh',
    bestFor: {
      en: 'Inter-row cultivation, vineyards, and small orchards.',
      hi: 'अंतर-पंक्ति खेती, अंगूर के बाग और छोटे बगीचे।',
      kn: 'ಸಾಲುಗಳ ನಡುವಿನ ಬೇಸಾಯ, ದ್ರಾಕ್ಷಿ ತೋಟಗಳು ಮತ್ತು ಸಣ್ಣ ಹಣ್ಣಿನ ತೋಟಗಳು.'
    },
    specs: { engine: '3-Cylinder Diesel', gears: '12 Forward + 12 Reverse', liftCapacity: '950 kg', fuelTank: '30L' },
    imageUrl: 'https://images.unsplash.com/photo-1594771804886-a933bb2d609b?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'v2',
    name: 'Swaraj Target 630',
    category: 'compact',
    brand: 'Swaraj',
    hp: '29 HP',
    priceRange: '₹5.3 - ₹5.8 Lakh',
    bestFor: {
      en: 'Sprayings, rotavation, and narrow track farming.',
      hi: 'छिड़काव, रोटावेशन और संकीर्ण ट्रैक खेती।',
      kn: 'ಸಿಂಪರಣೆ, ರೋಟಾವೇಷನ್ ಮತ್ತು ಕಿರಿದಾದ ಟ್ರ್ಯಾಕ್ ಬೇಸಾಯ.'
    },
    specs: { engine: 'Liquid Cooled', gears: '9 Forward + 3 Reverse', liftCapacity: '980 kg', fuelTank: '32L' },
    imageUrl: 'https://images.unsplash.com/photo-1533460004989-cef01064af7e?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'v3',
    name: 'Sonalika GT 20',
    category: 'compact',
    brand: 'Sonalika',
    hp: '20 HP',
    priceRange: '₹3.8 - ₹4.3 Lakh',
    bestFor: {
      en: 'Horticulture, small farm haulage, and garden tilling.',
      hi: 'बागवानी, छोटे खेत की ढुलाई और बगीचे की जुताई।',
      kn: 'ತೋಟಗಾರಿಕೆ, ಸಣ್ಣ ಕೃಷಿ ಸಾಗಣೆ ಮತ್ತು ತೋಟದ ಉಳುಮೆ.'
    },
    specs: { engine: '3-Cylinder', gears: '6 Forward + 2 Reverse', liftCapacity: '800 kg', fuelTank: '28L' },
    imageUrl: 'https://images.unsplash.com/photo-1500937386664-56d159437b7f?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'v4',
    name: 'Eicher 188',
    category: 'compact',
    brand: 'Eicher',
    hp: '18 HP',
    priceRange: '₹3.2 - ₹3.6 Lakh',
    bestFor: {
      en: 'Affordable small landholding cultivation and haulage.',
      hi: 'किफायती छोटी जोत की खेती और ढुलाई।',
      kn: 'ಕೈಗೆಟುಕುವ ಸಣ್ಣ ಹಿಡುವಳಿ ಬೇಸಾಯ ಮತ್ತು ಸಾಗಣೆ.'
    },
    specs: { engine: '1-Cylinder Air Cooled', gears: '8 Forward + 2 Reverse', liftCapacity: '700 kg', fuelTank: '25L' },
    imageUrl: 'https://images.unsplash.com/photo-1594771804886-a933bb2d609b?q=80&w=600&auto=format&fit=crop'
  },

  // 2. Utility Tractors
  {
    id: 'v5',
    name: 'Mahindra 575 DI',
    category: 'utility',
    brand: 'Mahindra',
    hp: '45 HP',
    priceRange: '₹6.8 - ₹7.3 Lakh',
    bestFor: {
      en: 'General farming, heavy ploughing, and water pump operations.',
      hi: 'सामान्य खेती, भारी जुताई और पानी के पंप का संचालन।',
      kn: 'ಸಾಮಾನ್ಯ ಬೇಸಾಯ, ಭಾರೀ ಉಳುಮೆ ಮತ್ತು ನೀರಿನ ಪಂಪ್ ಕಾರ್ಯಾಚರಣೆಗಳು.'
    },
    specs: { engine: '4-Cylinder, 2730 cc', gears: '8 Forward + 2 Reverse', liftCapacity: '1600 kg', fuelTank: '48L' },
    imageUrl: 'https://images.unsplash.com/photo-1533460004989-cef01064af7e?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'v6',
    name: 'John Deere 5050 D',
    category: 'utility',
    brand: 'John Deere',
    hp: '50 HP',
    priceRange: '₹7.9 - ₹8.6 Lakh',
    bestFor: {
      en: 'Modern rotavation, seeding, and heavy haulage.',
      hi: 'आधुनिक रोटावेशन, बुवाई और भारी ढुलाई।',
      kn: 'ಆಧುನಿಕ ರೋಟಾವೇಷನ್, ಬಿತ್ತನೆ ಮತ್ತು ಭಾರೀ ಸಾಗಣೆ.'
    },
    specs: { engine: 'Coolant Cooled Turbocharged', gears: '8 Forward + 4 Reverse', liftCapacity: '1600 kg', fuelTank: '60L' },
    imageUrl: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'v7',
    name: 'Massey Ferguson 241 DI',
    category: 'utility',
    brand: 'Massey Ferguson',
    hp: '42 HP',
    priceRange: '₹6.2 - ₹6.7 Lakh',
    bestFor: {
      en: 'Reliable dry-land cropping, rotavator, and haulage.',
      hi: 'विश्वसनीय शुष्क भूमि फसल, रोटावेटर और ढुलाई।',
      kn: 'ವಿಶ್ವಾಸಾರ್ಹ ಒಣಭೂಮಿ ಬೇಸಾಯ, ರೋಟಾವೇಟರ್ ಮತ್ತು ಸಾಗಣೆ.'
    },
    specs: { engine: '3-Cylinder Simpson', gears: '8 Forward + 2 Reverse', liftCapacity: '1700 kg', fuelTank: '47L' },
    imageUrl: 'https://images.unsplash.com/photo-1500937386664-56d159437b7f?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'v8',
    name: 'Powertrac Euro 50',
    category: 'utility',
    brand: 'Powertrac',
    hp: '50 HP',
    priceRange: '₹7.2 - ₹7.8 Lakh',
    bestFor: {
      en: 'High-speed field preparation, transport, and puddling.',
      hi: 'हाई-स्पीड फील्ड तैयारी, परिवहन और पडलिंग।',
      kn: 'ಹೈ-ಸ್ಪೀಡ್ ಗದ್ದೆ ಸಿದ್ಧತೆ, ಸಾರಿಗೆ ಮತ್ತು ಕೆಸರು ಗದ್ದೆ ಉಳುಮೆ.'
    },
    specs: { engine: '3-Cylinder Diesel', gears: '8 Forward + 2 Reverse', liftCapacity: '2000 kg', fuelTank: '60L' },
    imageUrl: 'https://images.unsplash.com/photo-1533460004989-cef01064af7e?q=80&w=600&auto=format&fit=crop'
  },

  // 3. Heavy-Duty Tractors
  {
    id: 'v9',
    name: 'John Deere 5310',
    category: 'heavy',
    brand: 'John Deere',
    hp: '55 HP',
    priceRange: '₹9.4 - ₹10.6 Lakh',
    bestFor: {
      en: 'Laser leveling, baler, straw reaper, and heavy implements.',
      hi: 'लेजर लेवलिंग, बेलर, स्ट्रॉ रीपर और भारी उपकरण।',
      kn: 'ಲೇಸರ್ ಲೆವೆಲಿಂಗ್, ಬೇಲರ್, ಹುಲ್ಲು ಕೊಯ್ಯುವ ಯಂತ್ರ ಮತ್ತು ಭಾರೀ ಉಪಕರಣಗಳು.'
    },
    specs: { engine: 'Turbocharged Diesel', gears: '9 Forward + 3 Reverse', liftCapacity: '2000 kg', fuelTank: '68L' },
    imageUrl: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'v10',
    name: 'Swaraj 855 FE',
    category: 'heavy',
    brand: 'Swaraj',
    hp: '52 HP',
    priceRange: '₹7.8 - ₹8.4 Lakh',
    bestFor: {
      en: 'Trenching, threshing, and large-scale agricultural transport.',
      hi: 'ट्रेंचिंग, थ्रेसिंग और बड़े पैमाने पर कृषि परिवहन।',
      kn: 'ಕಂದಕ ನಿರ್ಮಾಣ, ಒಕ್ಕಣೆ ಮತ್ತು ದೊಡ್ಡ ಪ್ರಮಾಣದ ಕೃಷಿ ಸಾರಿಗೆ.'
    },
    specs: { engine: '3-Cylinder Water Cooled', gears: '8 Forward + 2 Reverse', liftCapacity: '1700 kg', fuelTank: '62L' },
    imageUrl: 'https://images.unsplash.com/photo-1533460004989-cef01064af7e?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'v11',
    name: 'New Holland 3630 TX Super',
    category: 'heavy',
    brand: 'New Holland',
    hp: '55 HP',
    priceRange: '₹8.2 - ₹9.1 Lakh',
    bestFor: {
      en: 'Heavy duty harvesting, land grading, and double-disk harrowing.',
      hi: 'भारी फसल कटाई, भूमि ग्रेडिंग और डबल-डिस्क हैरोइंग।',
      kn: 'ಭಾರೀ ಕೊಯ್ಲು, ಭೂಮಿ ಶ್ರೇಣೀಕರಣ ಮತ್ತು ಡಬಲ್-ಡಿಸ್ಕ್ ಹ್ಯಾರೋಯಿಂಗ್.'
    },
    specs: { engine: '3-Cylinder Double Clutch', gears: '8 Forward + 2 Reverse', liftCapacity: '1800 kg', fuelTank: '60L' },
    imageUrl: 'https://images.unsplash.com/photo-1500937386664-56d159437b7f?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'v12',
    name: 'Sonalika Tiger DI 65',
    category: 'heavy',
    brand: 'Sonalika',
    hp: '65 HP',
    priceRange: '₹11.2 - ₹12.5 Lakh',
    bestFor: {
      en: 'Large estate cultivation, subsoiling, and deep tillage.',
      hi: 'बड़ी संपदा की खेती, सबसॉइलिंग और गहरी जुताई।',
      kn: 'ದೊಡ್ಡ ಎಸ್ಟೇಟ್ ಬೇಸಾಯ, ಉಪಮಣ್ಣು ಸಡಿಲಗೊಳಿಸುವಿಕೆ ಮತ್ತು ಆಳವಾದ ಉಳುಮೆ.'
    },
    specs: { engine: '4-Cylinder CRDi', gears: '12 Forward + 12 Reverse', liftCapacity: '2200 kg', fuelTank: '65L' },
    imageUrl: 'https://images.unsplash.com/photo-1533460004989-cef01064af7e?q=80&w=600&auto=format&fit=crop'
  },

  // 4. Harvesters
  {
    id: 'v13',
    name: 'Preet 982 Combine Harvester',
    category: 'harvester',
    brand: 'Preet',
    hp: '100 HP',
    priceRange: '₹22 - ₹25 Lakh',
    bestFor: {
      en: 'Multi-crop harvesting (paddy, wheat, maize, soybean) in dry/wet conditions.',
      hi: 'शुष्क/गीली परिस्थितियों में बहु-फसल कटाई (धान, गेहूं, मक्का, सोयाबीन)।',
      kn: 'ಒಣ/ಒದ್ದೆಯಾದ ಪರಿಸ್ಥಿತಿಗಳಲ್ಲಿ ಬಹು-ಬೆಳೆ ಕೊಯ್ಲು (ಭತ್ತ, ಗೋಧಿ, ಮೆಕ್ಕೆಜೋಳ, ಸೋಯಾಬೀನ್).'
    },
    specs: { engine: '4-Cylinder Turbocharged', gears: '4 Forward + 1 Reverse', liftCapacity: 'N/A', fuelTank: '240L' },
    imageUrl: 'https://images.unsplash.com/photo-1592982537447-6f2a6a0c7c18?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'v14',
    name: 'Kartar 4000 Harvester',
    category: 'harvester',
    brand: 'Kartar',
    hp: '101 HP',
    priceRange: '₹24 - ₹27 Lakh',
    bestFor: {
      en: 'Rapid paddy threshing and grain reaping.',
      hi: 'तेजी से धान गहाई और अनाज की कटाई।',
      kn: 'ವೇಗದ ಭತ್ತ ಒಕ್ಕಣೆ ಮತ್ತು ಧಾನ್ಯ ಕೊಯ್ಲು.'
    },
    specs: { engine: 'Ashok Leyland Engine', gears: '4 Forward + 1 Reverse', liftCapacity: 'N/A', fuelTank: '200L' },
    imageUrl: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?q=80&w=600&auto=format&fit=crop'
  },

  // 5. Tillers & Weeders
  {
    id: 'v15',
    name: 'VST Shakti 135 DI Power Tiller',
    category: 'tillers_weeders',
    brand: 'VST Shakti',
    hp: '13 HP',
    priceRange: '₹1.8 - ₹2.1 Lakh',
    bestFor: {
      en: 'Wetland puddling, weeding, and marginal land tillage.',
      hi: 'गीली भूमि में पडलिंग, निराई और सीमांत भूमि की जुताई।',
      kn: 'ಕೆಸರು ಗದ್ದೆ ಉಳುಮೆ, ಕಳೆ ಕೀಳುವುದು ಮತ್ತು ಸಣ್ಣ ಭೂಮಿ ಉಳುಮೆ.'
    },
    specs: { engine: 'Horizontal Single-Cylinder', gears: '6 Forward + 2 Reverse', liftCapacity: 'N/A', fuelTank: '11L' },
    imageUrl: 'https://images.unsplash.com/photo-1500937386664-56d159437b7f?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'v16',
    name: 'Honda F300 Power Weeder',
    category: 'tillers_weeders',
    brand: 'Honda',
    hp: '2.0 HP',
    priceRange: '₹45,000 - ₹55,000',
    bestFor: {
      en: 'Vegetable bed preparation and inter-cultivation weeding.',
      hi: 'सब्जियों के लिए क्यारी तैयार करना और अंतर-खेती निराई।',
      kn: 'ತರಕಾರಿ ಪಾತಿ ತಯಾರಿಕೆ ಮತ್ತು ಸಾಲುಗಳ ನಡುವಿನ ಕಳೆ ಕೀಳುವುದು.'
    },
    specs: { engine: '4-Stroke Petrol OHC', gears: '1 Forward', liftCapacity: 'N/A', fuelTank: '1.0L' },
    imageUrl: 'https://images.unsplash.com/photo-1515150144380-bca9f1650ed9?q=80&w=600&auto=format&fit=crop'
  },

  // 6. Sprayers
  {
    id: 'v17',
    name: 'Mitra Airotec Orchard Sprayer',
    category: 'sprayers',
    brand: 'Mitra',
    hp: '24+ HP tractor PTO',
    priceRange: '₹2.8 - ₹3.4 Lakh',
    bestFor: {
      en: 'Uniform fungicide and pesticide spraying in citrus and grapes orchards.',
      hi: 'नींबू वर्गीय फलों और अंगूर के बागों में समान रूप से कवकनाशी और कीटनाशक का छिड़काव।',
      kn: 'ಲಿಂಬೆ ಜಾತಿಯ ಹಣ್ಣುಗಳು ಮತ್ತು ದ್ರಾಕ್ಷಿ ತೋಟಗಳಲ್ಲಿ ಏಕರೂಪದ ಶಿಲೀಂಧ್ರನಾಶಕ ಮತ್ತು ಕೀಟನಾಶಕ ಸಿಂಪರಣೆ.'
    },
    specs: { engine: 'Tractor PTO Driven', gears: '2 Speed Gearbox', liftCapacity: '600L Tank', fuelTank: 'N/A' },
    imageUrl: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?q=80&w=600&auto=format&fit=crop'
  }
];

export default function AgriVehiclesPage() {
  const { language, translations } = useLanguage();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [vehiclesList, setVehiclesList] = useState<Vehicle[]>(VEHICLES);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [compareList, setCompareList] = useState<Vehicle[]>([]);

  // Admin form modal state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState<'compact' | 'utility' | 'heavy' | 'harvester' | 'tillers_weeders' | 'sprayers'>('compact');
  const [formBrand, setFormBrand] = useState('');
  const [formHp, setFormHp] = useState('');
  const [formPriceRange, setFormPriceRange] = useState('');
  const [formBestForEn, setFormBestForEn] = useState('');
  const [formBestForHi, setFormBestForHi] = useState('');
  const [formBestForKn, setFormBestForKn] = useState('');
  const [formEngine, setFormEngine] = useState('');
  const [formGears, setFormGears] = useState('');
  const [formLift, setFormLift] = useState('');
  const [formFuel, setFormFuel] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('');

  // Safe translations hook fallback
  const t = translations?.agriVehicles || {
    pageTitle: "Agricultural Vehicles in India",
    pageDescription: "Explore categories of farming machinery, estimated market prices, and key specifications.",
    compareVehicles: "Vehicle Comparison",
    compactTractors: "Compact/Orchard Tractors",
    utilityTractors: "Utility Tractors",
    heavyTractors: "Heavy-Duty Tractors",
    harvesters: "Combine Harvesters",
    weeders: "Power Weeders & Tillers",
    sprayers: "Self-Propelled Sprayers",
    implements: "Attachments & Implements",
    brand: "Brand",
    priceRange: "Price Range",
    power: "Power/Horsepower",
    usage: "Best For"
  };

  const categories = [
    { id: 'all', label: language === 'kn' ? 'ಎಲ್ಲಾ ವಾಹನಗಳು' : language === 'hi' ? 'सभी वाहन' : 'All Vehicles' },
    { id: 'compact', label: t.compactTractors },
    { id: 'utility', label: t.utilityTractors },
    { id: 'heavy', label: t.heavyTractors },
    { id: 'harvester', label: t.harvesters },
    { id: 'tillers_weeders', label: t.weeders },
    { id: 'sprayers', label: t.sprayers }
  ];

  const filteredVehicles = selectedCategory === 'all' 
    ? vehiclesList 
    : vehiclesList.filter(v => v.category === selectedCategory);

  const toggleCompare = (vehicle: Vehicle) => {
    setCompareList(prev => {
      const exists = prev.find(v => v.id === vehicle.id);
      if (exists) {
        return prev.filter(v => v.id !== vehicle.id);
      }
      if (prev.length >= 3) {
        toast({
          title: language === 'kn' ? 'ಹೋಲಿಕೆ ಮಿತಿ ಮೀರಿದೆ' : language === 'hi' ? 'तुलना सीमा समाप्त' : 'Comparison Limit Reached',
          description: language === 'kn' ? 'ನೀವು ಗರಿಷ್ಠ 3 ವಾಹನಗಳನ್ನು ಮಾತ್ರ ಹೋಲಿಸಬಹುದು.' : language === 'hi' ? 'आप अधिकतम 3 वाहनों की ही तुलना कर सकते हैं।' : 'You can compare a maximum of 3 vehicles side-by-side.',
          variant: 'destructive'
        });
        return prev;
      }
      return [...prev, vehicle];
    });
  };

  const openCreateVehicle = () => {
    setEditingVehicle(null);
    setFormName('');
    setFormCategory('compact');
    setFormBrand('');
    setFormHp('');
    setFormPriceRange('');
    setFormBestForEn('');
    setFormBestForHi('');
    setFormBestForKn('');
    setFormEngine('');
    setFormGears('');
    setFormLift('');
    setFormFuel('');
    setFormImageUrl('');
    setIsFormOpen(true);
  };

  const openEditVehicle = (v: Vehicle) => {
    setEditingVehicle(v);
    setFormName(v.name);
    setFormCategory(v.category);
    setFormBrand(v.brand);
    setFormHp(v.hp);
    setFormPriceRange(v.priceRange);
    setFormBestForEn(v.bestFor.en);
    setFormBestForHi(v.bestFor.hi);
    setFormBestForKn(v.bestFor.kn);
    setFormEngine(v.specs.engine);
    setFormGears(v.specs.gears);
    setFormLift(v.specs.liftCapacity || '');
    setFormFuel(v.specs.fuelTank);
    setFormImageUrl(v.imageUrl);
    setIsFormOpen(true);
  };

  const closeVehicleForm = () => {
    setIsFormOpen(false);
    setEditingVehicle(null);
  };

  const deleteVehicle = (id: string) => {
    const v = vehiclesList.find(item => item.id === id);
    setVehiclesList(prev => prev.filter(item => item.id !== id));
    setCompareList(prev => prev.filter(item => item.id !== id));
    apiLogActivity('admin_vehicle_deleted', `Admin deleted vehicle: ${v?.name}`).catch(console.error);
    toast({
      title: "Vehicle Deleted",
      description: "The vehicle has been removed from the directory.",
    });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formBrand || !formHp || !formPriceRange || !formBestForEn || !formEngine || !formGears || !formFuel) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const defaultImages = {
      compact: 'https://images.unsplash.com/photo-1594771804886-a933bb2d609b?q=80&w=600',
      utility: 'https://images.unsplash.com/photo-1533460004989-cef01064af7e?q=80&w=600',
      heavy: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?q=80&w=600',
      harvester: 'https://images.unsplash.com/photo-1592982537447-6f2a6a0c7c18?q=80&w=600',
      tillers_weeders: 'https://images.unsplash.com/photo-1500937386664-56d159437b7f?q=80&w=600',
      sprayers: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?q=80&w=600'
    };

    if (editingVehicle) {
      const updatedVehicle: Vehicle = {
        ...editingVehicle,
        name: formName,
        category: formCategory,
        brand: formBrand,
        hp: formHp,
        priceRange: formPriceRange,
        bestFor: {
          en: formBestForEn,
          hi: formBestForHi || formBestForEn,
          kn: formBestForKn || formBestForEn
        },
        specs: {
          engine: formEngine,
          gears: formGears,
          liftCapacity: formLift || undefined,
          fuelTank: formFuel
        },
        imageUrl: formImageUrl || editingVehicle.imageUrl
      };

      setVehiclesList(prev => prev.map(item => item.id === editingVehicle.id ? updatedVehicle : item));
      apiLogActivity('admin_vehicle_edited', `Admin edited vehicle: ${formName}`).catch(console.error);
      toast({
        title: "Vehicle Updated",
        description: "The vehicle details have been updated successfully.",
      });
    } else {
      const newVehicle: Vehicle = {
        id: 'vehicle_' + Date.now(),
        name: formName,
        category: formCategory,
        brand: formBrand,
        hp: formHp,
        priceRange: formPriceRange,
        bestFor: {
          en: formBestForEn,
          hi: formBestForHi || formBestForEn,
          kn: formBestForKn || formBestForEn
        },
        specs: {
          engine: formEngine,
          gears: formGears,
          liftCapacity: formLift || undefined,
          fuelTank: formFuel
        },
        imageUrl: formImageUrl || defaultImages[formCategory]
      };

      setVehiclesList(prev => [newVehicle, ...prev]);
      apiLogActivity('admin_vehicle_added', `Admin added vehicle: ${formName}`).catch(console.error);
      toast({
        title: "Vehicle Created",
        description: "The vehicle has been added to the directory.",
      });
    }

    closeVehicleForm();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Header section */}
      <div className="flex items-center justify-between gap-4 mb-8">
        <PageHeader title={t.pageTitle} description={t.pageDescription}>
          <div className="bg-sky-100 dark:bg-sky-950 p-4 rounded-full shadow-md">
            <Truck className="w-8 h-8 text-sky-600 dark:text-sky-400" />
          </div>
        </PageHeader>

        {user?.is_admin && (
          <Button onClick={openCreateVehicle} className="bg-sky-600 hover:bg-sky-700 text-white font-bold h-12 px-6 rounded-xl shadow-lg shadow-sky-500/20 transition-all flex items-center gap-2">
            <Plus className="w-5 h-5" />
            <span>Add Vehicle</span>
          </Button>
        )}
      </div>

      {/* Category Pills Selector */}
      <div className="flex flex-wrap items-center gap-2 mb-8 bg-slate-100/50 dark:bg-slate-900/30 p-2.5 rounded-2xl border backdrop-blur-sm">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 text-sm font-bold rounded-xl transition-all duration-300 ${
              selectedCategory === cat.id
                ? 'bg-sky-600 text-white shadow-lg shadow-sky-500/20'
                : 'text-muted-foreground hover:bg-slate-200/50 dark:hover:bg-slate-800/40 hover:text-foreground'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Comparison Drawer / Section if any items are added */}
      <AnimatePresence>
        {compareList.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="mb-8 p-6 bg-slate-900 text-slate-100 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-black tracking-tight flex items-center gap-2">
                <Scale className="h-5 w-5 text-sky-400" />
                <span>{t.compareVehicles} ({compareList.length}/3)</span>
              </h3>
              <Button 
                variant="ghost" 
                onClick={() => setCompareList([])} 
                className="text-slate-400 hover:text-white h-8 w-8 p-0"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {compareList.map((vehicle) => (
                <div key={vehicle.id} className="bg-slate-850 p-4 rounded-2xl border border-slate-800 relative">
                  <button 
                    onClick={() => toggleCompare(vehicle)}
                    className="absolute top-2 right-2 bg-slate-800/80 hover:bg-rose-900/60 p-1.5 rounded-full transition"
                  >
                    <X className="h-4 w-4 text-slate-400 hover:text-white" />
                  </button>
                  <p className="font-bold text-sky-400 text-sm mb-1">{vehicle.brand}</p>
                  <h4 className="font-black text-base text-white">{vehicle.name}</h4>
                  
                  <div className="mt-4 space-y-2.5 text-xs text-slate-300 border-t border-slate-800 pt-3">
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-bold">{t.power}</span>
                      <span className="font-semibold text-slate-200">{vehicle.hp}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-bold">{t.priceRange}</span>
                      <span className="font-semibold text-emerald-400">{vehicle.priceRange}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-bold">Engine</span>
                      <span className="font-semibold text-slate-200">{vehicle.specs.engine}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-bold">Transmission</span>
                      <span className="font-semibold text-slate-200">{vehicle.specs.gears}</span>
                    </div>
                    {vehicle.specs.liftCapacity && (
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-bold">Hydraulics</span>
                        <span className="font-semibold text-slate-200">{vehicle.specs.liftCapacity}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-bold">Fuel Tank</span>
                      <span className="font-semibold text-slate-200">{vehicle.specs.fuelTank}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Directory Grid */}
      <motion.div 
        layout 
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <AnimatePresence>
          {filteredVehicles.map((vehicle) => {
            const isComparing = compareList.some(v => v.id === vehicle.id);
            return (
              <motion.div
                key={vehicle.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="h-full overflow-hidden flex flex-col justify-between group hover:shadow-xl dark:hover:shadow-sky-950/20 border-slate-200/80 dark:border-slate-800 transition-all duration-300 relative">
                  <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                    <Image
                      src={vehicle.imageUrl}
                      alt={vehicle.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent" />
                    
                    {/* Floating Badges */}
                    <div className="absolute top-3 left-3 bg-sky-600/90 backdrop-blur-sm text-white px-2.5 py-1 rounded-full text-[10px] font-black tracking-wide uppercase shadow-sm">
                      {vehicle.hp}
                    </div>

                    <div className="absolute top-3 right-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm text-slate-800 dark:text-slate-200 px-2.5 py-1 rounded-full text-[10px] font-black uppercase shadow-sm">
                      {vehicle.brand}
                    </div>

                    {user?.is_admin && (
                      <div className="absolute top-14 right-3 z-20 flex flex-col gap-1.5">
                        <Button 
                          onClick={(e) => { e.stopPropagation(); openEditVehicle(vehicle); }}
                          className="h-8 w-8 p-0 bg-slate-900/80 hover:bg-sky-600 text-white rounded-full shadow"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                        <Button 
                          onClick={(e) => { e.stopPropagation(); deleteVehicle(vehicle.id); }}
                          className="h-8 w-8 p-0 bg-slate-900/80 hover:bg-rose-600 text-white rounded-full shadow"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    )}
                  </div>

                  <CardHeader className="p-6 pb-2">
                    <CardTitle className="text-lg font-black text-slate-800 dark:text-slate-100 leading-tight">
                      {vehicle.name}
                    </CardTitle>
                    <CardDescription className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                      <Info className="h-3 w-3" />
                      <span>{language === 'kn' ? vehicle.bestFor.kn : language === 'hi' ? vehicle.bestFor.hi : vehicle.bestFor.en}</span>
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="p-6 pt-2 pb-4 space-y-2 text-xs flex-grow">
                    <div className="h-[1px] bg-slate-100 dark:bg-slate-800 my-2" />
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div>
                        <span className="text-slate-400 font-bold block uppercase tracking-wider scale-90 origin-left">Engine</span>
                        <span className="font-semibold text-slate-700 dark:text-slate-300">{vehicle.specs.engine}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-bold block uppercase tracking-wider scale-90 origin-left">Gears</span>
                        <span className="font-semibold text-slate-700 dark:text-slate-300">{vehicle.specs.gears}</span>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="p-6 pt-0 border-t bg-slate-50/50 dark:bg-slate-950/20 flex items-center justify-between mt-auto">
                    <div>
                      <span className="text-[10px] text-slate-400 font-black block uppercase tracking-wide">Est. Price</span>
                      <span className="text-base font-black text-emerald-600 dark:text-emerald-400">{vehicle.priceRange}</span>
                    </div>

                    <Button
                      onClick={() => toggleCompare(vehicle)}
                      variant={isComparing ? 'default' : 'outline'}
                      className={`h-9 text-xs font-bold px-3 ${
                        isComparing 
                          ? 'bg-sky-600 hover:bg-sky-700 text-white' 
                          : 'border-sky-600/30 text-sky-600 hover:bg-sky-50 dark:hover:bg-sky-950/20'
                      }`}
                    >
                      <Scale className="mr-1.5 h-3.5 w-3.5" />
                      {isComparing 
                        ? (language === 'kn' ? 'ಹೋಲಿಕೆಯಿಂದ ತೆಗೆ' : language === 'hi' ? 'तुलना से हटाएं' : 'Remove')
                        : (language === 'kn' ? 'ಹೋಲಿಸು' : language === 'hi' ? 'तुलना करें' : 'Compare')
                      }
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* Admin Add/Edit Vehicle Modal */}
      <Dialog open={isFormOpen} onOpenChange={(open) => { if (!open) closeVehicleForm(); }}>
        <DialogContent className="max-w-md bg-card max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Truck className="h-6 w-6 text-sky-600" /> {editingVehicle ? 'Edit Vehicle Details' : 'Add New Vehicle'}
            </DialogTitle>
            <DialogDescription>
              {editingVehicle ? 'Update the specifications, horsepower, price, or photo of this vehicle.' : 'Enter specifications and details to add a new agricultural vehicle to the catalog.'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleFormSubmit} className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="form-name" className="font-bold text-xs">Model Name *</Label>
                <Input id="form-name" value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="e.g. Swaraj 855 FE" required />
              </div>
              <div className="space-y-1">
                <Label htmlFor="form-brand" className="font-bold text-xs">Brand *</Label>
                <Input id="form-brand" value={formBrand} onChange={(e) => setFormBrand(e.target.value)} placeholder="e.g. Swaraj" required />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="font-bold text-xs">Category *</Label>
              <select value={formCategory} onChange={(e) => setFormCategory(e.target.value as any)} className="w-full h-10 px-3 text-sm rounded-lg border bg-muted/30 focus-visible:ring-sky-500">
                <option value="compact">Compact/Orchard Tractor</option>
                <option value="utility">Utility Tractor</option>
                <option value="heavy">Heavy-Duty Tractor</option>
                <option value="harvester">Combine Harvester</option>
                <option value="tillers_weeders">Power Tiller/Weeder</option>
                <option value="sprayers">Sprayer</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="form-hp" className="font-bold text-xs">Horsepower *</Label>
                <Input id="form-hp" value={formHp} onChange={(e) => setFormHp(e.target.value)} placeholder="e.g. 52 HP" required />
              </div>
              <div className="space-y-1">
                <Label htmlFor="form-price" className="font-bold text-xs">Price Range *</Label>
                <Input id="form-price" value={formPriceRange} onChange={(e) => setFormPriceRange(e.target.value)} placeholder="e.g. ₹7.8 - ₹8.4 Lakh" required />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="best-en" className="font-bold text-xs">Description / Usage (English) *</Label>
              <Input id="best-en" value={formBestForEn} onChange={(e) => setFormBestForEn(e.target.value)} placeholder="e.g. Best for dryland ploughing" required />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="best-hi" className="font-bold text-xs">Usage (Hindi)</Label>
                <Input id="best-hi" value={formBestForHi} onChange={(e) => setFormBestForHi(e.target.value)} placeholder="Usage in Hindi" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="best-kn" className="font-bold text-xs">Usage (Kannada)</Label>
                <Input id="best-kn" value={formBestForKn} onChange={(e) => setFormBestForKn(e.target.value)} placeholder="Usage in Kannada" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="form-engine" className="font-bold text-xs">Engine Spec *</Label>
                <Input id="form-engine" value={formEngine} onChange={(e) => setFormEngine(e.target.value)} placeholder="e.g. 3-Cylinder Diesel" required />
              </div>
              <div className="space-y-1">
                <Label htmlFor="form-gears" className="font-bold text-xs">Gearbox Spec *</Label>
                <Input id="form-gears" value={formGears} onChange={(e) => setFormGears(e.target.value)} placeholder="e.g. 8 Forward + 2 Reverse" required />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="form-lift" className="font-bold text-xs">Lift Capacity (Optional)</Label>
                <Input id="form-lift" value={formLift} onChange={(e) => setFormLift(e.target.value)} placeholder="e.g. 1700 kg" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="form-fuel" className="font-bold text-xs">Fuel Tank Capacity *</Label>
                <Input id="form-fuel" value={formFuel} onChange={(e) => setFormFuel(e.target.value)} placeholder="e.g. 60L" required />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="form-img" className="font-bold text-xs">Image URL (Optional)</Label>
              <Input id="form-img" value={formImageUrl} onChange={(e) => setFormImageUrl(e.target.value)} placeholder="Paste an Unsplash or direct image link" />
            </div>

            <DialogFooter className="pt-4 border-t gap-2">
              <Button type="button" variant="ghost" onClick={closeVehicleForm}>Cancel</Button>
              <Button type="submit" className="bg-sky-600 hover:bg-sky-700 text-white font-bold">
                {editingVehicle ? 'Save Vehicle Changes' : 'Create Vehicle Listing'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
