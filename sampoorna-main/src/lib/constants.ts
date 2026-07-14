
import {
  Banknote,
  CloudSun,
  HandCoins,
  HeartPulse,
  LayoutDashboard,
  LineChart,
  ScrollText,
  TestTube,
  Wheat,
  ShieldCheck,
  Briefcase,
} from 'lucide-react';

export const NAV_LINKS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/crop-loans', label: 'Crop Loans', icon: Banknote },
  { href: '/market-price', label: 'Market Prices', icon: LineChart },
  { href: '/weather-advisory', label: 'Weather Advisory', icon: CloudSun },
  { href: '/schemes', label: 'Govt. Schemes', icon: ScrollText },
  { href: '/crop-diagnosis', label: 'Crop Diagnosis', icon: HeartPulse },
  { href: '/farming-tips', label: 'Farming Tips', icon: Wheat },
  { href: '/subsidy-finder', label: 'Subsidy Finder', icon: HandCoins },
  { href: '/fertilizers', label: 'Fertilizers', icon: TestTube },
  { href: '/crop-insurance', label: 'Crop Insurance', icon: ShieldCheck },
  { href: '/manage-applications', label: 'Manage Applications', icon: Briefcase },
];

export const FARMING_STAGES = ['Planting', 'Growing', 'Flowering', 'Harvesting'];
export const LOCATIONS = ['Mandya', 'Mysuru', 'Bengaluru', 'Hubballi', 'Mangaluru', 'Belagavi'];
