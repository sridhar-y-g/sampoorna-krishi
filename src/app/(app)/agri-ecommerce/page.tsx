'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '@/hooks/use-translation';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { apiLogActivity } from '@/lib/api';
import { useAuth } from '@/context/auth-context';
import { 
  ShoppingBag, 
  Search, 
  Star, 
  Trash2, 
  Plus, 
  Minus, 
  Calendar, 
  Clock, 
  Check, 
  DollarSign,
  Briefcase,
  X,
  Edit
} from 'lucide-react';

// Custom inline SVG components for modern visual appeal
const SeedsIcon = () => (
  <svg className="w-12 h-12 text-emerald-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C9.5 6.5 6.5 9.5 2 12C6.5 14.5 9.5 17.5 12 22C14.5 17.5 17.5 14.5 22 12C17.5 9.5 14.5 6.5 12 2Z" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
    <circle cx="12" cy="12" r="3" fill="currentColor"/>
  </svg>
);

const TractorIcon = () => (
  <svg className="w-12 h-12 text-sky-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 13h15" />
    <path d="M16 18a2 2 0 1 0 4 0a2 2 0 1 0-4 0" />
    <path d="M6 16a4 4 0 1 0 8 0a4 4 0 1 0-8 0" />
    <path d="M14 8h-4l-3 5h7V8z" />
    <path d="M6 12V9a2 2 0 0 1 2-2h4" />
  </svg>
);

const SmartToolIcon = () => (
  <svg className="w-12 h-12 text-indigo-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
);

interface Product {
  id: string;
  name: string;
  category: 'inputs' | 'vehicles' | 'tools';
  price: number;
  unit: string;
  rating: number;
  badge: string;
  badgeType: 'subsidized' | 'organic' | 'featured' | 'standard';
  description: string;
  specifications: string[];
  isRentable: boolean;
  imageUrl: string;
}

const PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Organic Seeds Premium Combo',
    category: 'inputs',
    price: 499,
    unit: 'combo pack',
    rating: 4.8,
    badge: 'Organic',
    badgeType: 'organic',
    description: 'High-germination organic seeds package including wheat, paddy, and mustard seeds for optimal crop growth.',
    specifications: ['100% Organic', 'High Germination Rate', 'Disease Resistant'],
    isRentable: false,
    imageUrl: 'https://images.unsplash.com/photo-1492496913980-501348b61469?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600&q=80'
  },
  {
    id: 'p1_1',
    name: 'Hybrid Paddy Seeds (BAS-370)',
    category: 'inputs',
    price: 850,
    unit: '10kg bag',
    rating: 4.9,
    badge: 'High Yield',
    badgeType: 'featured',
    description: 'High-yielding hybrid basmati paddy seeds with strong disease resistance and excellent germination rates.',
    specifications: ['Hybrid F1', 'Disease Resistant', 'Germination > 95%'],
    isRentable: false,
    imageUrl: 'https://images.unsplash.com/photo-1535254973040-607b474cb50d?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'p1_2',
    name: 'Heirloom Kitchen Garden Kit',
    category: 'inputs',
    price: 299,
    unit: 'kit (12 varieties)',
    rating: 4.7,
    badge: 'Home Garden',
    badgeType: 'organic',
    description: 'A handpicked selection of open-pollinated heirloom vegetable seeds ideal for home kitchen gardens.',
    specifications: ['12 Varieties', 'Non-GMO', 'Open-Pollinated'],
    isRentable: false,
    imageUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'p1_3',
    name: 'High-Yield Wheat Seeds (HD-2967)',
    category: 'inputs',
    price: 950,
    unit: '40kg bag',
    rating: 4.8,
    badge: 'Govt. Certified',
    badgeType: 'subsidized',
    description: 'Certified premium wheat seeds suitable for major Indian agricultural zones, delivering excellent flour quality.',
    specifications: ['HD-2967 Strain', 'Rust Resistant', 'Yield 5.5 t/ha'],
    isRentable: false,
    imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'p1_4',
    name: 'Fast-Growing Greens Combo Pack',
    category: 'inputs',
    price: 180,
    unit: 'pack of 5',
    rating: 4.6,
    badge: 'Fast Harvest',
    badgeType: 'organic',
    description: 'Specialized leafy green seeds (Spinach, Coriander, Amaranth, Methi) that harvest within 30 days.',
    specifications: ['Leafy Greens', 'Harvest in 30 Days', 'High Nutrient'],
    isRentable: false,
    imageUrl: 'https://images.unsplash.com/photo-1515150144380-bca9f1650ed9?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'p2',
    name: 'Bio-Fertilizer (Nitrogen Rich)',
    category: 'inputs',
    price: 349,
    unit: '5kg bag',
    rating: 4.5,
    badge: 'Govt. Approved',
    badgeType: 'subsidized',
    description: 'Rich organic nitrogen soil enhancer promoting robust green growth and optimal root structure.',
    specifications: ['Eco-Friendly', 'Rich in Nitrogen', 'Soil-conditioning'],
    isRentable: false,
    imageUrl: 'https://images.unsplash.com/photo-1759411364609-aeb30eb034e4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600&q=80'
  },
  {
    id: 'p3',
    name: 'Natural Neem Pest Control Spray',
    category: 'inputs',
    price: 289,
    unit: '1L bottle',
    rating: 4.6,
    badge: '100% Bio',
    badgeType: 'organic',
    description: 'Cold-pressed natural neem oil pesticide that effectively repels pests without leaving chemical residues.',
    specifications: ['No toxic chemicals', 'Broad-spectrum protection', 'Safe for soil'],
    isRentable: false,
    imageUrl: 'https://images.unsplash.com/photo-1524055988636-436cfa46e59e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600&q=80'
  },
  {
    id: 'p4',
    name: 'Mahindra Yuvo 575 DI Tractor',
    category: 'vehicles',
    price: 1500,
    unit: 'day',
    rating: 4.7,
    badge: '50% Subsidy',
    badgeType: 'subsidized',
    description: 'Powerful 45 HP modern agricultural tractor. Suitable for heavy ploughing, seeding, and hauling.',
    specifications: ['45 HP Engine', 'Dual Clutch', 'Power Steering'],
    isRentable: true,
    imageUrl: 'https://images.unsplash.com/photo-1533460004989-cef01064af7e?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'p5',
    name: 'John Deere Combine Harvester',
    category: 'vehicles',
    price: 3500,
    unit: 'day',
    rating: 4.9,
    badge: 'Operator Included',
    badgeType: 'featured',
    description: 'Advanced multi-crop harvester designed to reap, thresh, and clean grain crops efficiently in single pass.',
    specifications: ['High output capacity', 'Certified operator included', 'Fuel efficient'],
    isRentable: true,
    imageUrl: 'https://images.unsplash.com/photo-1592982537447-6f2a6a0c7c18?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'p6',
    name: 'Smart Crop Spraying Drone',
    category: 'vehicles',
    price: 2400,
    unit: 'day',
    rating: 4.8,
    badge: 'Smart Tech',
    badgeType: 'featured',
    description: 'Precision automated spraying drone mapping crops and applying fertilizers/pest control with zero waste.',
    specifications: ['10L payload tank', 'AI flight planning', 'Pilot included'],
    isRentable: true,
    imageUrl: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'p7',
    name: 'Modern Soil pH & Moisture Meter',
    category: 'tools',
    price: 1299,
    unit: 'unit',
    rating: 4.7,
    badge: 'Best Seller',
    badgeType: 'featured',
    description: 'Digital display reading probe to monitor soil moisture level and pH to optimize fertilizer usage.',
    specifications: ['Instant readings', 'No batteries required', 'Long metal probe'],
    isRentable: false,
    imageUrl: 'https://images.unsplash.com/photo-1624806992928-9c7a04a8383d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600&q=80'
  },
  {
    id: 'p8',
    name: 'IoT Automated Drip Irrigation Controller',
    category: 'tools',
    price: 4499,
    unit: 'system',
    rating: 4.9,
    badge: 'Solar Powered',
    badgeType: 'featured',
    description: 'Wi-Fi/Bluetooth enabled watering timer syncs with weather conditions to optimize irrigation schedules.',
    specifications: ['Solar battery', 'App-controlled', 'Weather adaptive'],
    isRentable: false,
    imageUrl: 'https://images.unsplash.com/photo-1743706017581-5bc067dde7c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600&q=80'
  },
  {
    id: 'p9',
    name: 'Traditional Steel Spades & Shovels Set',
    category: 'tools',
    price: 749,
    unit: 'set of 3',
    rating: 4.4,
    badge: 'Forged Steel',
    badgeType: 'standard',
    description: 'Heavy-duty ergonomic hand tools for tilling, weeding, and land layout preparation.',
    specifications: ['Forged carbon steel', 'Ergonomic wooden grip', 'High durability'],
    isRentable: false,
    imageUrl: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?q=80&w=600&auto=format&fit=crop'
  }
];

interface CartItem {
  product: Product;
  quantity: number;
}

export default function AgriEcommercePage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { user } = useAuth();

  const [productsList, setProductsList] = useState<Product[]>(PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'inputs' | 'vehicles' | 'tools'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  // Booking Modal States (For renting vehicles)
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingProduct, setBookingProduct] = useState<Product | null>(null);
  const [bookingDays, setBookingDays] = useState(1);
  const [bookingDate, setBookingDate] = useState('');
  const [includeOperator, setIncludeOperator] = useState(false);

  // Success animations states
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Sell Your Product States
  const [isSellOpen, setIsSellOpen] = useState(false);
  const [sellName, setSellName] = useState('');
  const [sellCategory, setSellCategory] = useState<'inputs' | 'vehicles' | 'tools'>('inputs');
  const [sellPrice, setSellPrice] = useState<string>('');
  const [sellUnit, setSellUnit] = useState('');
  const [sellDescription, setSellDescription] = useState('');
  const [sellSpecs, setSellSpecs] = useState('');
  const [sellImageUrl, setSellImageUrl] = useState('');

  const openEditProduct = (product: Product) => {
    setEditingProduct(product);
    setSellName(product.name);
    setSellCategory(product.category);
    setSellPrice(product.price.toString());
    setSellUnit(product.unit);
    setSellDescription(product.description);
    setSellSpecs(product.specifications.join(', '));
    setSellImageUrl(product.imageUrl);
    setIsSellOpen(true);
  };

  const closeSellModal = () => {
    setIsSellOpen(false);
    setEditingProduct(null);
    setSellName('');
    setSellCategory('inputs');
    setSellPrice('');
    setSellUnit('');
    setSellDescription('');
    setSellSpecs('');
    setSellImageUrl('');
  };

  const deleteProduct = (productId: string) => {
    const prod = productsList.find(p => p.id === productId);
    setProductsList(prev => prev.filter(p => p.id !== productId));
    apiLogActivity('admin_product_deleted', `Admin deleted product: ${prod?.name}`).catch(console.error);
    toast({
      title: "Product Deleted",
      description: "The product has been removed from the catalog.",
    });
  };

  const handleSellSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sellName || !sellPrice || !sellUnit || !sellDescription) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const priceNum = Number(sellPrice);
    if (isNaN(priceNum) || priceNum <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid price.",
        variant: "destructive"
      });
      return;
    }

    const defaultImages = {
      inputs: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?q=80&w=600&auto=format&fit=crop',
      vehicles: 'https://images.unsplash.com/photo-1533460004989-cef01064af7e?q=80&w=600&auto=format&fit=crop',
      tools: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?q=80&w=600&auto=format&fit=crop'
    };

    if (editingProduct) {
      const updatedProduct: Product = {
        ...editingProduct,
        name: sellName,
        category: sellCategory,
        price: priceNum,
        unit: sellUnit,
        description: sellDescription,
        specifications: sellSpecs ? sellSpecs.split(',').map(s => s.trim()) : [],
        isRentable: sellCategory === 'vehicles',
        imageUrl: sellImageUrl || editingProduct.imageUrl
      };
      setProductsList(prev => prev.map(p => p.id === editingProduct.id ? updatedProduct : p));
      apiLogActivity('admin_product_edited', `Admin edited product: ${sellName} (₹${priceNum})`).catch(console.error);
      toast({
        title: "Product Updated",
        description: "The product information and photo have been updated successfully.",
      });
      closeSellModal();
      return;
    }

    const newProduct: Product = {
      id: 'farmer_' + Date.now(),
      name: sellName,
      category: sellCategory,
      price: priceNum,
      unit: sellUnit,
      rating: 5.0,
      badge: 'Farmer Listed',
      badgeType: 'organic',
      description: sellDescription,
      specifications: sellSpecs ? sellSpecs.split(',').map(s => s.trim()) : [],
      isRentable: sellCategory === 'vehicles',
      imageUrl: sellImageUrl || defaultImages[sellCategory]
    };

    setProductsList(prev => [newProduct, ...prev]);
    apiLogActivity('farmer_product_listed', `Farmer listed new product: ${sellName} (₹${priceNum} / ${sellUnit})`).catch(console.error);
    closeSellModal();

    toast({
      title: "Product Listed Successfully",
      description: "Your product is now listed in the Agri Mall database.",
    });
  };

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { product, quantity: 1 }];
    });
    toast({
      title: "Added to Bag",
      description: `${product.name} has been added to your shopping bag.`,
    });
    apiLogActivity('add_to_cart', `Added ${product.name} to bag (Price: ₹${product.price})`).catch(console.error);
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prev) => 
      prev.map(item => {
        if (item.product.id === productId) {
          const nextQty = item.quantity + delta;
          return nextQty > 0 ? { ...item, quantity: nextQty } : null;
        }
        return item;
      }).filter((item): item is CartItem => item !== null)
    );
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
    toast({
      title: "Removed from Bag",
      description: "Item has been removed from your shopping bag.",
    });
  };

  const openBooking = (product: Product) => {
    setBookingProduct(product);
    setBookingDays(1);
    setBookingDate(new Date().toISOString().split('T')[0]);
    setIsBookingOpen(true);
    setBookingSuccess(false);
  };

  const handleConfirmBooking = () => {
    if (!bookingDate) {
      toast({
        title: "Error",
        description: "Please select a booking start date.",
        variant: "destructive"
      });
      return;
    }
    setBookingSuccess(true);
    const estLease = ((bookingProduct?.price || 0) * bookingDays + (includeOperator ? 300 * bookingDays : 0)).toLocaleString();
    apiLogActivity('lease_request', `Requested lease for ${bookingProduct?.name} for ${bookingDays} days starting ${bookingDate} (Est. Lease: ₹${estLease})`).catch(console.error);
    setTimeout(() => {
      setIsBookingOpen(false);
      setBookingSuccess(false);
      toast({
        title: "Lease Request Submitted",
        description: `Your booking for ${bookingProduct?.name} has been sent successfully. An advisor will contact you soon.`,
      });
    }, 2000);
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setCheckoutSuccess(true);
    apiLogActivity('agri_checkout', `Placed order with ${cart.length} items (Total: ₹${cartTotal})`).catch(console.error);
    setTimeout(() => {
      setCart([]);
      setCheckoutSuccess(false);
      toast({
        title: "Order Placed Successfully",
        description: "Your digital farming order has been received and is being processed.",
      });
    }, 2500);
  };

  const filteredProducts = productsList.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const cartTotal = cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <PageHeader 
          title="Agri Mall & Equipment" 
          description="E-commerce store for agricultural inputs, tool catalogs, and vehicle leasing."
        >
          <div className="bg-emerald-100 dark:bg-emerald-950 p-4 rounded-full shadow-md">
            <ShoppingBag className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
          </div>
        </PageHeader>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <Button 
            onClick={() => setIsSellOpen(true)}
            className="bg-sky-600 hover:bg-sky-700 text-white font-bold h-12 px-6 rounded-xl shadow-lg shadow-sky-500/20 transition-all flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            <span>Sell Your Product</span>
          </Button>

          {/* Floating Cart Drawer Button */}
          <Sheet>
            <SheetTrigger asChild>
              <Button className="relative bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-12 px-6 rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" />
                <span>Shopping Bag</span>
                {cartItemCount > 0 && (
                  <motion.span 
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    key={cartItemCount}
                    className="absolute -top-2 -right-2 bg-rose-500 text-white text-xs font-black rounded-full h-6 w-6 flex items-center justify-center border-2 border-white dark:border-background shadow-md"
                  >
                    {cartItemCount}
                  </motion.span>
                )}
              </Button>
            </SheetTrigger>
          <SheetContent className="w-full sm:max-w-md bg-card flex flex-col justify-between p-6">
            <SheetHeader className="pb-4 border-b">
              <SheetTitle className="text-2xl font-black text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
                <ShoppingBag className="w-6 h-6" /> Your Farming Bag
              </SheetTitle>
              <SheetDescription>Review and complete your agricultural purchases.</SheetDescription>
            </SheetHeader>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              <AnimatePresence mode="popLayout">
                {checkoutSuccess ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center text-center py-12"
                  >
                    <div className="h-20 w-20 bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                      <Check className="h-10 w-10 animate-bounce" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">Processing Order...</h3>
                    <p className="text-muted-foreground text-sm mt-2 max-w-xs">Connecting to secure gateway. Directing transaction details to TiDB registry...</p>
                  </motion.div>
                ) : cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center text-center py-16 text-muted-foreground">
                    <ShoppingBag className="w-16 h-16 opacity-20 mb-4" />
                    <p className="font-bold">Your bag is empty</p>
                    <p className="text-sm mt-1">Browse products and add inputs or tools to get started.</p>
                  </div>
                ) : (
                  cart.map((item) => (
                    <motion.div 
                      key={item.product.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex items-center gap-4 bg-muted/40 p-3 rounded-xl border border-muted"
                    >
                      <div className="flex-1">
                        <h4 className="font-bold text-sm leading-tight text-slate-800 dark:text-slate-200">{item.product.name}</h4>
                        <p className="text-xs text-muted-foreground mt-1">₹{item.product.price} / {item.product.unit}</p>
                      </div>
                      
                      {/* Quantity Selector */}
                      <div className="flex items-center gap-2 border bg-card rounded-lg p-1">
                        <button onClick={() => updateQuantity(item.product.id, -1)} className="p-1 hover:bg-muted rounded text-slate-600">
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.product.id, 1)} className="p-1 hover:bg-muted rounded text-slate-600">
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button onClick={() => removeFromCart(item.product.id)} className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>

            {/* Cart Footer */}
            {!checkoutSuccess && cart.length > 0 && (
              <div className="border-t pt-4 space-y-4">
                <div className="flex items-center justify-between text-base font-bold text-slate-800 dark:text-slate-200">
                  <span>Subtotal</span>
                  <span>₹{cartTotal.toLocaleString()}</span>
                </div>
                <p className="text-xs text-muted-foreground">Taxes and delivery charges are calculated at dispatch. All seed and bio-fertilizer inputs receive applicable state subsidies.</p>
                <Button onClick={handleCheckout} className="w-full bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold h-12 shadow-lg shadow-emerald-500/20">
                  Checkout & Place Order
                </Button>
              </div>
            )}
          </SheetContent>
        </Sheet>
      </div>
    </div>

      {/* Hero Showcase / Intro Panel */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-800 via-teal-900 to-cyan-950 text-white p-8 md:p-12 mb-10 shadow-xl">
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
          <Briefcase className="w-64 h-64" />
        </div>
        <div className="max-w-2xl relative z-10">
          <Badge className="bg-emerald-500 text-white font-black px-3 py-1 mb-4">MEMBER BENEFIT</Badge>
          <h2 className="text-3xl md:text-4xl font-headline font-black leading-tight text-white mb-4">
            Direct Farm Inputs & Mechanized Agriculture Mall
          </h2>
          <p className="text-emerald-100/90 text-base md:text-lg leading-relaxed mb-6">
            Get high-grade seeds, fertilizers, and traditional tools directly. Lease state-of-the-art tractors and smart IoT soil sensors with government-approved subsidized schemes.
          </p>
          <div className="flex flex-wrap gap-4 text-xs font-semibold text-emerald-200">
            <span className="flex items-center gap-1 bg-white/10 px-3 py-1.5 rounded-full"><Check className="w-3.5 h-3.5" /> 100% Quality Seeds</span>
            <span className="flex items-center gap-1 bg-white/10 px-3 py-1.5 rounded-full"><Check className="w-3.5 h-3.5" /> Tractor Rentals</span>
            <span className="flex items-center gap-1 bg-white/10 px-3 py-1.5 rounded-full"><Check className="w-3.5 h-3.5" /> Smart Crop Monitors</span>
          </div>
        </div>
      </div>

      {/* Category Tabs & Search Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 pb-6 border-b">
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-3">
          {[
            { id: 'all', label: 'All Store' },
            { id: 'inputs', label: 'Inputs & Seeds', icon: SeedsIcon },
            { id: 'vehicles', label: 'Vehicles Rental', icon: TractorIcon },
            { id: 'tools', label: 'Farming Tools', icon: SmartToolIcon },
          ].map((cat) => {
            const ActiveIcon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as any)}
                className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold transition-all ${
                  selectedCategory === cat.id 
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/25' 
                    : 'bg-muted/40 hover:bg-muted text-muted-foreground hover:text-slate-800'
                }`}
              >
                {ActiveIcon && <span className="scale-50 -my-3 -mx-2"><ActiveIcon /></span>}
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-11 bg-muted/30 focus-visible:ring-emerald-500 border-0" 
            placeholder="Search inputs, vehicles, tools..." 
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Products Grid */}
      <motion.div 
        layout
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 pb-16"
      >
        <AnimatePresence mode="popLayout">
          {filteredProducts.length === 0 ? (
            <motion.div 
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full text-center py-16 text-muted-foreground border-2 border-dashed rounded-3xl"
            >
              <Search className="h-12 w-12 mx-auto opacity-20 mb-3" />
              <p className="font-bold text-lg">No matches found</p>
              <p className="text-sm mt-1">Try resetting your category filters or adjusting the search term.</p>
            </motion.div>
          ) : (
            filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.2 }}
                className="h-full"
              >
                <Card className="h-full flex flex-col justify-between border-0 shadow-md bg-card overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
                  <div className="relative aspect-video w-full overflow-hidden bg-muted">
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    <div className="absolute top-3 left-3">
                      <Badge className={`font-bold border-0 px-2.5 py-1 shadow-md ${
                        product.badgeType === 'organic' ? 'bg-emerald-600 hover:bg-emerald-600 text-white' :
                        product.badgeType === 'subsidized' ? 'bg-amber-500 hover:bg-amber-500 text-slate-900 font-extrabold' :
                        product.badgeType === 'featured' ? 'bg-indigo-600 hover:bg-indigo-600 text-white' :
                        'bg-slate-600 hover:bg-slate-600 text-white'
                      }`}>
                        {product.badge}
                      </Badge>
                    </div>

                    <div className="absolute top-3 right-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm rounded-full px-2.5 py-1 flex items-center gap-1 text-xs font-bold text-amber-500 shadow-md">
                      <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                      <span>{product.rating}</span>
                    </div>

                    {user?.is_admin && (
                      <div className="absolute top-14 right-3 z-20 flex flex-col gap-1.5">
                        <Button 
                          onClick={(e) => { e.stopPropagation(); openEditProduct(product); }}
                          className="h-8 w-8 p-0 bg-slate-900/80 hover:bg-sky-600 text-white rounded-full shadow"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                        <Button 
                          onClick={(e) => { e.stopPropagation(); deleteProduct(product.id); }}
                          className="h-8 w-8 p-0 bg-slate-900/80 hover:bg-rose-600 text-white rounded-full shadow"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="p-6 pb-4 flex-grow flex flex-col justify-between">
                    <div>
                      <CardTitle className="text-xl font-headline font-black text-slate-800 dark:text-slate-100 line-clamp-1">
                        {product.name}
                      </CardTitle>
                      <CardDescription className="text-sm text-muted-foreground mt-2 line-clamp-2 h-10">
                        {product.description}
                      </CardDescription>
                    </div>

                    {/* Specs / Highlights */}
                    <div className="mt-4 space-y-2">
                      {product.specifications.map((spec, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          <span>{spec}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <CardFooter className="p-6 pt-0 border-t bg-muted/20 flex items-center justify-between gap-4 mt-auto">
                    {/* Pricing */}
                    <div>
                      <span className="text-2xl font-black text-slate-800 dark:text-slate-200">₹{product.price}</span>
                      <span className="text-xs text-muted-foreground"> / {product.unit}</span>
                    </div>

                    {/* CTA button */}
                    {product.isRentable ? (
                      <Button onClick={() => openBooking(product)} className="bg-sky-600 hover:bg-sky-700 text-white font-bold px-4 h-10">
                        <Calendar className="mr-2 h-4 w-4" /> Rent Now
                      </Button>
                    ) : (
                      <Button onClick={() => addToCart(product)} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 h-10">
                        <Plus className="mr-1 h-4 w-4" /> Add
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </motion.div>

      {/* Booking Dialogue / Modal for vehicles lease request */}
      <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
        <DialogContent className="max-w-md bg-card">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Calendar className="h-6 w-6 text-sky-500" /> Lease Registration
            </DialogTitle>
            <DialogDescription>
              Book specialized equipment for tilling, seeding, or crop monitoring.
            </DialogDescription>
          </DialogHeader>

          {bookingSuccess ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center text-center py-8"
            >
              <div className="h-16 w-16 bg-sky-100 dark:bg-sky-950/40 text-sky-600 rounded-full flex items-center justify-center mb-4">
                <Check className="h-8 w-8 animate-bounce" />
              </div>
              <h4 className="text-lg font-bold">Booking Request Sent</h4>
              <p className="text-xs text-muted-foreground mt-2 max-w-xs">Connecting request registry... Dispatching ticket to local cooperative board.</p>
            </motion.div>
          ) : (
            <div className="space-y-4 py-2">
              <div className="p-4 bg-muted/40 rounded-xl border">
                <p className="font-bold text-slate-800 dark:text-slate-200">{bookingProduct?.name}</p>
                <p className="text-sm text-muted-foreground mt-1">₹{bookingProduct?.price} per day rate</p>
              </div>

              {/* Start Date */}
              <div className="space-y-2">
                <Label className="font-bold">Lease Start Date</Label>
                <Input 
                  type="date" 
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="bg-muted/30 focus-visible:ring-sky-500 h-10 border-0" 
                />
              </div>

              {/* Booking duration */}
              <div className="space-y-2">
                <Label className="font-bold">Duration (Days)</Label>
                <div className="flex items-center gap-3">
                  <Button variant="outline" onClick={() => setBookingDays(d => Math.max(1, d - 1))} className="h-10 w-10 p-0">
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="text-lg font-black w-8 text-center">{bookingDays}</span>
                  <Button variant="outline" onClick={() => setBookingDays(d => d + 1)} className="h-10 w-10 p-0">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Operator Inclusion */}
              <div className="flex items-center gap-3 p-3 bg-sky-50/50 dark:bg-sky-950/15 rounded-xl border border-sky-100 dark:border-sky-900/30">
                <input 
                  type="checkbox" 
                  id="include-operator" 
                  checked={includeOperator} 
                  onChange={(e) => setIncludeOperator(e.target.checked)} 
                  className="h-4.5 w-4.5 accent-sky-600 rounded cursor-pointer"
                />
                <Label htmlFor="include-operator" className="cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Include professional machine operator (Additional ₹300 / day)
                </Label>
              </div>

              <Separator />

              {/* Calculation summary */}
              <div className="flex justify-between items-center py-2 text-sm font-bold text-slate-800 dark:text-slate-200">
                <span>Total Estimated Lease</span>
                <span className="text-lg font-black text-sky-600 dark:text-sky-400">
                  ₹{((bookingProduct?.price || 0) * bookingDays + (includeOperator ? 300 * bookingDays : 0)).toLocaleString()}
                </span>
              </div>
            </div>
          )}

          <DialogFooter className="mt-4">
            {!bookingSuccess && (
              <>
                <Button variant="ghost" onClick={() => setIsBookingOpen(false)}>Cancel</Button>
                <Button onClick={handleConfirmBooking} className="bg-sky-600 hover:bg-sky-700 text-white font-bold">
                  Confirm Booking Lease
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Sell Your Product Dialogue / Modal */}
      <Dialog open={isSellOpen} onOpenChange={(open) => { if(!open) closeSellModal(); }}>
        <DialogContent className="max-w-md bg-card max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Plus className="h-6 w-6 text-sky-500" /> {editingProduct ? 'Edit Product Details' : 'Sell Your Product'}
            </DialogTitle>
            <DialogDescription>
              {editingProduct ? 'Update product description, price, features, or photographs.' : 'List your agricultural inputs, tools, or vehicles for lease directly to other farmers.'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSellSubmit} className="space-y-4 py-2">
            {/* Product Name */}
            <div className="space-y-1">
              <Label htmlFor="sell-name" className="font-bold text-xs">Product Name *</Label>
              <Input 
                id="sell-name"
                value={sellName}
                onChange={(e) => setSellName(e.target.value)}
                placeholder="e.g., Premium Basmati Seeds, Iron Rake"
                className="bg-muted/30 focus-visible:ring-sky-500 h-10 border" 
                required
              />
            </div>

            {/* Category */}
            <div className="space-y-1">
              <Label className="font-bold text-xs">Category *</Label>
              <div className="grid grid-cols-3 gap-2">
                {(['inputs', 'vehicles', 'tools'] as const).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSellCategory(cat)}
                    className={`py-2 px-3 text-xs font-bold rounded-lg border transition-all ${
                      sellCategory === cat 
                        ? 'bg-sky-600 border-sky-600 text-white shadow-md' 
                        : 'bg-muted/30 border-input hover:bg-muted text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {cat.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Price & Unit row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="sell-price" className="font-bold text-xs">Price (₹) *</Label>
                <Input 
                  id="sell-price"
                  type="number"
                  value={sellPrice}
                  onChange={(e) => setSellPrice(e.target.value)}
                  placeholder="Price"
                  className="bg-muted/30 focus-visible:ring-sky-500 h-10 border"
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="sell-unit" className="font-bold text-xs">Unit *</Label>
                <Input 
                  id="sell-unit"
                  value={sellUnit}
                  onChange={(e) => setSellUnit(e.target.value)}
                  placeholder="e.g., kg, bag, day"
                  className="bg-muted/30 focus-visible:ring-sky-500 h-10 border"
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1">
              <Label htmlFor="sell-description" className="font-bold text-xs">Description *</Label>
              <textarea 
                id="sell-description"
                value={sellDescription}
                onChange={(e) => setSellDescription(e.target.value)}
                placeholder="Describe your product benefits, quality, and condition..."
                className="w-full min-h-[80px] p-3 text-sm rounded-lg border bg-muted/30 focus-visible:ring-sky-500"
                required
              />
            </div>

            {/* Specifications */}
            <div className="space-y-1">
              <Label htmlFor="sell-specs" className="font-bold text-xs">Key Specs (Comma-separated)</Label>
              <Input 
                id="sell-specs"
                value={sellSpecs}
                onChange={(e) => setSellSpecs(e.target.value)}
                placeholder="e.g., 100% organic, rust-free, 45 HP"
                className="bg-muted/30 focus-visible:ring-sky-500 h-10 border"
              />
            </div>

            {/* Image URL */}
            <div className="space-y-1">
              <Label htmlFor="sell-img" className="font-bold text-xs">Image URL (Optional)</Label>
              <Input 
                id="sell-img"
                value={sellImageUrl}
                onChange={(e) => setSellImageUrl(e.target.value)}
                placeholder="Paste an Unsplash or direct image link"
                className="bg-muted/30 focus-visible:ring-sky-500 h-10 border"
              />
            </div>

            <DialogFooter className="pt-4 border-t gap-2">
              <Button type="button" variant="ghost" onClick={closeSellModal}>
                Cancel
              </Button>
              <Button type="submit" className="bg-sky-600 hover:bg-sky-700 text-white font-bold">
                {editingProduct ? 'Save Product Changes' : 'List Product for Sale'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
