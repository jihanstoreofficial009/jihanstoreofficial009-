import { Product, Category, StoreSettings, Coupon, Review } from '../types/store';

export const INITIAL_SETTINGS: StoreSettings = {
  storeName: 'Jihan Store',
  storeSlogan: 'বিশ্বাসের সাথে অনলাইন শপিং',
  phone: '+880 1800-123456',
  whatsapp: '+8801800123456',
  email: 'jihanstoreofficial009@gmail.com',
  address: 'House #42, Road #11, Banani, Dhaka-1213, Bangladesh',
  insideDhakaDelivery: 60,
  outsideDhakaDelivery: 120,
  freeDeliveryThreshold: 1500,
  announcement: '🎉 বিশেষ অফার! ১৫০০ টাকার বেশি অর্ডারে ফ্রি হোম ডেলিভারি! কুপন কোড: JIHAN50',
  bkashNumber: '01800123456 (Personal / Send Money)',
  nagadNumber: '01800123456 (Personal / Send Money)',
  facebookUrl: 'https://facebook.com/jihanstore',
  youtubeUrl: 'https://youtube.com/@jihanstore'
};

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'electronics', name: 'Electronics & Gadgets', nameBn: 'ইলেকট্রনিক্স ও গ্যাজেট', icon: 'Smartphone', itemCount: 12 },
  { id: 'fashion-men', name: "Men's Fashion", nameBn: 'মেনস ফ্যাশন', icon: 'Shirt', itemCount: 18 },
  { id: 'fashion-women', name: "Women's Collection", nameBn: 'উইমেনস কালেকশন', icon: 'Sparkles', itemCount: 15 },
  { id: 'watches', name: 'Luxury Watches', nameBn: 'লাক্সারি ঘড়ি', icon: 'Watch', itemCount: 8 },
  { id: 'beauty', name: 'Beauty & Perfume', nameBn: 'বিউটি ও পারফিউম', icon: 'Heart', itemCount: 10 },
  { id: 'home', name: 'Home & Living', nameBn: 'হোম ও কিচেন', icon: 'Home', itemCount: 14 },
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    title: 'Smart Fitness Watch Pro with AMOLED Display',
    titleBn: 'স্মার্ট ফিটনেস ওয়াচ প্রো এমোলেড ডিসপ্লে',
    price: 3450,
    discountPrice: 2850,
    category: 'watches',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80'
    ],
    stock: 24,
    rating: 4.8,
    reviewsCount: 38,
    isFeatured: true,
    badge: 'HOT SALE',
    description: 'High precision heart rate sensor, blood oxygen tracker, 1.43 inch curved AMOLED screen, 10 days battery backup with water resistance IP68 rating.',
    sku: 'JS-WTC-01',
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-2',
    title: 'Wireless Active Noise Cancelling Earbuds',
    titleBn: 'অ্যাক্টিভ নয়েজ ক্যানসেলিং ওয়্যারলেস এয়ারবাডস',
    price: 2490,
    discountPrice: 1950,
    category: 'electronics',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=800&auto=format&fit=crop&q=80'
    ],
    stock: 18,
    rating: 4.9,
    reviewsCount: 52,
    isFeatured: true,
    badge: 'BESTSELLER',
    description: 'Crisp studio-grade sound with deep bass, 35dB hybrid ANC, transparency mode, ergonomic fit and up to 36 hours playback with charging case.',
    sku: 'JS-AUD-02',
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-3',
    title: 'Premium Royal Blue Embroidered Panjabi',
    titleBn: 'প্রিমিয়াম রয়্যাল ব্লু কারুকাজ খচিত পাঞ্জাবি',
    price: 2850,
    discountPrice: 2350,
    category: 'fashion-men',
    image: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=800&auto=format&fit=crop&q=80'
    ],
    stock: 15,
    rating: 4.7,
    reviewsCount: 29,
    isFeatured: true,
    badge: 'PREMIUM',
    description: '100% pure combed cotton with intricate gold and navy embroidery along collar and placket. Perfect for Eid, weddings and celebrations.',
    sku: 'JS-FAS-03',
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-4',
    title: 'French Amber & Oud Luxury Eau De Parfum 100ml',
    titleBn: 'ফ্রেঞ্চ আম্বার ও ওউদ লাক্সারি পারফিউম ১০০ মিলি',
    price: 3600,
    discountPrice: 2990,
    category: 'beauty',
    image: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=800&auto=format&fit=crop&q=80',
    stock: 12,
    rating: 5.0,
    reviewsCount: 41,
    isFeatured: true,
    badge: 'LUXURY',
    description: 'Long-lasting woody amber fragrance with notes of saffron, Bulgarian rose, royal agarwood and Madagascar vanilla.',
    sku: 'JS-PRF-04',
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-5',
    title: 'Designer Traditional Silk Saree with Zari Border',
    titleBn: 'ডিজাইনার ট্র্যাডিশনাল সিল্ক শাড়ি জরি পাড়',
    price: 4950,
    discountPrice: 3890,
    category: 'fashion-women',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80',
    stock: 9,
    rating: 4.9,
    reviewsCount: 22,
    isFeatured: true,
    badge: 'EXCLUSIVE',
    description: 'Artisanal handwoven soft silk with royal gold zari pallu and body work. Includes matching unstitched blouse piece.',
    sku: 'JS-SAR-05',
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-6',
    title: 'Smart Touch Electric Aroma Diffuser & Humidifier',
    titleBn: 'স্মার্ট টাচ অ্যারোমা ডিফিউজার ও হিউমিডিফায়ার',
    price: 1850,
    discountPrice: 1450,
    category: 'home',
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&auto=format&fit=crop&q=80',
    stock: 30,
    rating: 4.6,
    reviewsCount: 19,
    isFeatured: false,
    badge: 'NEW',
    description: 'Ultrasonic whisper-quiet mist maker, 7-color soothing LED lights, auto shut-off safety switch and 500ml water capacity.',
    sku: 'JS-HOM-06',
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-7',
    title: 'Fast Magnetic Wireless Power Bank 10,000mAh',
    titleBn: 'ফাস্ট ম্যাগনেটিক ওয়্যারলেস পাওয়ার ব্যাংক',
    price: 2150,
    discountPrice: 1750,
    category: 'electronics',
    image: 'https://images.unsplash.com/photo-1622445262464-84b1456045b6?w=800&auto=format&fit=crop&q=80',
    stock: 22,
    rating: 4.8,
    reviewsCount: 34,
    isFeatured: false,
    badge: 'POPULAR',
    description: '20W PD Type-C fast charge + 15W MagSafe snap-on magnetic charging. Pocket-sized lightweight aluminum shell.',
    sku: 'JS-PWR-07',
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-8',
    title: 'Men’s Genuine Leather Chronograph Watch',
    titleBn: 'জেনুইন লেদার স্ট্র্যাপ ক্রোনোগ্রাফ ঘড়ি',
    price: 4200,
    discountPrice: 3200,
    category: 'watches',
    image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80',
    stock: 7,
    rating: 4.9,
    reviewsCount: 17,
    isFeatured: true,
    badge: 'LIMITED',
    description: 'Japanese quartz movement, scratch-resistant sapphire crystal glass, 3 ATM water resistance and hand-stitched Italian leather strap.',
    sku: 'JS-WTC-08',
    createdAt: new Date().toISOString()
  }
];

export const INITIAL_COUPONS: Coupon[] = [
  { code: 'JIHAN50', discountType: 'fixed', discountValue: 50, minOrder: 500, isActive: true },
  { code: 'RAMADAN15', discountType: 'percentage', discountValue: 15, minOrder: 1200, isActive: true },
  { code: 'WELCOME100', discountType: 'fixed', discountValue: 100, minOrder: 1500, isActive: true }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    productId: 'prod-1',
    userId: 'u1',
    userName: 'Tanvir Ahmed',
    rating: 5,
    comment: 'অসাধারণ কোয়ালিটি! ঘড়ির ডিসপ্লে খুব স্মুথ এবং ব্যাটারি ব্যাকআপ দারুণ। ২ দিনের মধ্যে ডেলিভারি পেয়েছি। ধন্যবাদ জিহান স্টোর!',
    isVerifiedPurchase: true,
    createdAt: '2026-09-28T10:30:00Z'
  },
  {
    id: 'rev-2',
    productId: 'prod-2',
    userId: 'u2',
    userName: 'Nusrat Jahan',
    rating: 5,
    comment: 'সাউন্ড কোয়ালিটি অসম্ভব ভালো। নয়েজ ক্যানসেলেশন বেশ কাজের। জেনুইন প্রডাক্ট দেয়ার জন্য জিহান স্টোরের ওপর বিশ্বাস রাখা যায়।',
    isVerifiedPurchase: true,
    createdAt: '2026-09-29T14:15:00Z'
  },
  {
    id: 'rev-3',
    productId: 'prod-3',
    userId: 'u3',
    userName: 'Mohammad Rafiqul Islam',
    rating: 5,
    comment: 'পাঞ্জাবির কাপড় অত্যন্ত মোলায়েম এবং রয়্যাল ব্লু কালার টা সামনাসামনি আরও আকর্ষণীয় দেখায়। সাইজ ফিটিং নিখুঁত!',
    isVerifiedPurchase: true,
    createdAt: '2026-09-30T18:40:00Z'
  }
];
