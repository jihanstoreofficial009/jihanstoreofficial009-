import { 
  Product, 
  Category, 
  StoreSettings, 
  Coupon, 
  Review, 
  LogoConfig, 
  AddressItem, 
  ContactNumber, 
  EmailContact, 
  SocialLinkItem, 
  Advertisement,
  TelegramBotConfig,
  PaymentAccount
} from '../types/store';

export const INITIAL_TELEGRAM_BOTS: TelegramBotConfig[] = [
  {
    id: 'bot-1',
    botName: 'Jihan Dispatcher #1 (Primary)',
    botUsername: '@jihanstore_bot',
    botToken: '8714872675:AAGsB9U_eCOIG5Os75KisW_ieJaEkKTdS6U',
    chatId: '6607631932',
    isEnabled: true,
    isConnected: true,
    totalDispatches: 0,
    createdAt: new Date().toISOString()
  },
  {
    id: 'bot-2',
    botName: 'Jihan Dispatcher #2 (Backup / Secondary)',
    botUsername: '@jihan_store_backup_bot',
    botToken: '8714872675:AAGsB9U_eCOIG5Os75KisW_ieJaEkKTdS6U',
    chatId: '6607631932',
    isEnabled: true,
    isConnected: true,
    totalDispatches: 0,
    createdAt: new Date().toISOString()
  }
];

export const INITIAL_PAYMENT_ACCOUNTS: PaymentAccount[] = [
  {
    id: 'pay-bkash-1',
    provider: 'bkash',
    accountName: 'জিহান স্টোর (অফিশিয়াল বিকাশ পার্সোনাল)',
    accountNumber: '01710238359',
    accountType: 'Personal',
    instructions: 'বিকাশ অ্যাপ অথবা *247# ডায়াল করে "Send Money" করুন 01710238359 নম্বরে। সফল হলে নিচের ঘরে TrxID এবং আপনার বিকাশ নম্বর দিন।',
    isEnabled: true,
    isPrimary: true,
    displayOrder: 1
  },
  {
    id: 'pay-nagad-1',
    provider: 'nagad',
    accountName: 'জিহান স্টোর (অফিশিয়াল নগদ পার্সোনাল)',
    accountNumber: '01867841638',
    accountType: 'Personal',
    instructions: 'নগদ অ্যাপ অথবা *167# ডায়াল করে "Send Money" করুন 01867841638 নম্বরে। সফল হলে নিচের ঘরে TrxID এবং আপনার নগদ নম্বর দিন।',
    isEnabled: true,
    isPrimary: true,
    displayOrder: 2
  },
  {
    id: 'pay-rocket-1',
    provider: 'rocket',
    accountName: 'জিহান স্টোর রকেট অ্যাকাউন্ট',
    accountNumber: '01867841638-9',
    accountType: 'Personal',
    instructions: 'রকেট পার্সোনাল নম্বরে সেন্ড মানি করুন। এরপর ট্রানজেকশন আইডি (TrxID) দিন।',
    isEnabled: true,
    isPrimary: true,
    displayOrder: 3
  },
  {
    id: 'pay-upay-1',
    provider: 'upay',
    accountName: 'জিহান স্টোর উপায় অ্যাকাউন্ট',
    accountNumber: '01867841638',
    accountType: 'Personal',
    instructions: 'উপায় অ্যাকাউন্টে ক্যাশ ইন অথবা সেন্ড মানি করুন।',
    isEnabled: true,
    isPrimary: true,
    displayOrder: 4
  },
  {
    id: 'pay-bank-1',
    provider: 'bank',
    accountName: 'JIHAN STORE LTD',
    accountNumber: 'Islami Bank Bangladesh Ltd - A/C 20501234567890 (Sandwip Branch)',
    bankBranch: 'Sandwip Branch, Chittagong',
    accountType: 'Current',
    instructions: 'ব্যাংক ডিপোজিট বা ফান্ড ট্রান্সফার করে স্লিপ/TrxID প্রদান করুন।',
    isEnabled: true,
    isPrimary: true,
    displayOrder: 5
  },
  {
    id: 'pay-wallet-1',
    provider: 'wallet',
    accountName: 'জিহান ওয়ালেট ইন্সট্যান্ট পেমেন্ট',
    accountNumber: 'Instant Wallet Deduction',
    accountType: 'Personal',
    instructions: 'আপনার জমানো ব্যালেন্স দিয়ে ১ সেকেন্ডে অর্ডার সম্পন্ন করুন।',
    isEnabled: true,
    isPrimary: true,
    displayOrder: 6
  }
];

export const INITIAL_LOGOS: LogoConfig[] = [
  {
    id: 'logo-crest',
    name: 'Royal Crown Crest (Classic)',
    nameBn: 'রয়্যাল ক্রাউন ক্রেস্ট (ক্লাসিক)',
    type: 'crest',
    tagline: 'Online Shopping with Trust',
    taglineBn: 'বিশ্বাসের সাথে অনলাইন শপিং',
    isActive: true
  },
  {
    id: 'logo-minimal',
    name: 'Modern Minimalist Gold',
    nameBn: 'মডার্ন মিনিমালিস্ট গোল্ড',
    type: 'minimal',
    tagline: 'Premium Lifestyle Store',
    taglineBn: 'প্রিমিয়াম লাইফস্টাইল স্টোর',
    isActive: false
  },
  {
    id: 'logo-monogram',
    name: 'Luxury Monogram Emblem',
    nameBn: 'লাক্সারি মনোগ্রাম এম্বলম',
    type: 'monogram',
    tagline: 'Elegance & Authenticity',
    taglineBn: 'অভিজাত্য ও আস্থার প্রতীক',
    isActive: false
  }
];

export const INITIAL_ADDRESSES: AddressItem[] = [
  {
    id: 'addr-banani',
    title: 'বনানী ফ্ল্যাগশিপ অফিস (Banani Hub)',
    address: 'House #42, Road #11, Block-E, Banani',
    city: 'Dhaka-1213',
    phone: '+880 1800-123456',
    isDefault: true,
    isEnabled: true
  },
  {
    id: 'addr-uttara',
    title: 'উত্তরা কাস্টমার সাপোর্ট পয়েন্ট',
    address: 'Sector #3, Road #7, Uttara Model Town',
    city: 'Dhaka-1230',
    phone: '+880 1700-654321',
    isDefault: false,
    isEnabled: true
  },
  {
    id: 'addr-ctg',
    title: 'চট্টগ্রাম ডেলিভারি ডিপো',
    address: 'Agrabad Commercial Area',
    city: 'Chittagong-4100',
    phone: '+880 1900-987654',
    isDefault: false,
    isEnabled: true
  }
];

export const INITIAL_PHONES: ContactNumber[] = [
  { id: 'ph-1', title: 'হটলাইন (24/7 Hotline)', number: '+880 1800-123456', type: 'phone', isDefault: true, isEnabled: true },
  { id: 'ph-2', title: 'অর্ডার সাপোর্ট ও ট্র্যাকিং', number: '+880 1700-654321', type: 'support', isDefault: false, isEnabled: true }
];

export const INITIAL_WHATSAPPS: ContactNumber[] = [
  { id: 'wa-1', title: 'অফিসিয়াল হোয়াটসঅ্যাপ চ্যাট', number: '+8801800123456', type: 'whatsapp', isDefault: true, isEnabled: true },
  { id: 'wa-2', title: 'কাস্টমার কেয়ার হোয়াটসঅ্যাপ', number: '+8801700654321', type: 'whatsapp', isDefault: false, isEnabled: true }
];

export const INITIAL_EMAILS: EmailContact[] = [
  { id: 'em-1', title: 'প্রধান ইমেইল', email: 'jihanstoreofficial009@gmail.com', isDefault: true, isEnabled: true },
  { id: 'em-2', title: 'কাস্টমার কেয়ার', email: 'support@jihanstore.com', isDefault: false, isEnabled: true }
];

export const INITIAL_SOCIAL_LINKS: SocialLinkItem[] = [
  { id: 'soc-fb', platform: 'facebook', title: 'Facebook Page', url: 'https://facebook.com/jihanstore', isEnabled: true, displayOrder: 1 },
  { id: 'soc-yt', platform: 'youtube', title: 'YouTube Channel', url: 'https://youtube.com/@jihanstore', isEnabled: true, displayOrder: 2 },
  { id: 'soc-ig', platform: 'instagram', title: 'Instagram', url: 'https://instagram.com/jihanstore', isEnabled: true, displayOrder: 3 },
  { id: 'soc-tt', platform: 'tiktok', title: 'TikTok', url: 'https://tiktok.com/@jihanstore', isEnabled: true, displayOrder: 4 },
  { id: 'soc-wa', platform: 'whatsapp', title: 'WhatsApp Community', url: 'https://wa.me/8801800123456', isEnabled: true, displayOrder: 5 }
];

export const INITIAL_SETTINGS: StoreSettings = {
  storeName: 'Jihan Store',
  storeNameBn: 'জিহান স্টোর',
  storeSlogan: 'বিশ্বাসের সাথে অনলাইন শপিং',
  storeSloganBn: 'বিশ্বাসের সাথে অনলাইন শপিং',
  activeLogoId: 'logo-crest',
  logos: INITIAL_LOGOS,
  addresses: INITIAL_ADDRESSES,
  phones: INITIAL_PHONES,
  whatsapps: INITIAL_WHATSAPPS,
  emails: INITIAL_EMAILS,
  socialLinks: INITIAL_SOCIAL_LINKS,
  paymentAccounts: INITIAL_PAYMENT_ACCOUNTS,
  telegramBots: INITIAL_TELEGRAM_BOTS,
  telegramLastBotIndex: -1,
  phone: '+880 1800-123456',
  whatsapp: '+8801800123456',
  email: 'jihanstoreofficial009@gmail.com',
  address: 'House #42, Road #11, Block-E, Banani, Dhaka-1213, Bangladesh',
  insideDhakaDelivery: 60,
  outsideDhakaDelivery: 120,
  freeDeliveryThreshold: 1500,
  announcement: '🎉 বিশেষ অফার! ১৫০০ টাকার বেশি অর্ডারে ফ্রি হোম ডেলিভারি! কুপন কোড: JIHAN50',
  bkashNumber: '01800123456 (Personal / Send Money)',
  nagadNumber: '01800123456 (Personal / Send Money)',
  facebookUrl: 'https://facebook.com/jihanstore',
  youtubeUrl: 'https://youtube.com/@jihanstore',
  telegramBotToken: '8714872675:AAGsB9U_eCOIG5Os75KisW_ieJaEkKTdS6U',
  telegramChatId: '6607631932',
  googleManagementId: 'G-MCXPLT5B3D'
};

export const INITIAL_ADS: Advertisement[] = [
  {
    id: 'ad-top-samsung',
    title: 'Samsung Galaxy Special Promotion',
    titleBn: 'স্যামসাং গ্যালাক্সি ধামাকা অফার - ২৫% পর্যন্ত ছাড়!',
    description: 'অফিশিয়াল ওয়ারেন্টি সহ স্যামসাং স্মার্টফোন ও স্মার্ট এক্সেসরিজে উপভোগ করুন বিশেষ ক্যাশব্যাক।',
    advertiserName: 'Samsung Bangladesh Ltd',
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=1200&auto=format&fit=crop&q=80',
    destinationUrl: 'https://www.samsung.com/bd/',
    buttonText: 'অফার দেখুন',
    placement: 'home_top',
    displayOrder: 1,
    isActive: true,
    startDate: '2026-09-01',
    endDate: '2026-12-31',
    clicks: 142,
    views: 1820,
    createdAt: new Date().toISOString()
  },
  {
    id: 'ad-middle-apex',
    title: 'Apex Premium Leather Collection',
    titleBn: 'অ্যাপেক্স প্রিমিয়াম জেনুইন লেদার কালেকশন - ফ্ল্যাট ৳৫০০ ক্যাশব্যাক',
    description: 'হাতে তৈরি খাঁটি চামড়ার জুতো ও ওয়ালেট। জেনুইন কোয়ালিটি ও ১ বছরের ওয়ারেন্টি।',
    advertiserName: 'Apex Footwear Limited',
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=1200&auto=format&fit=crop&q=80',
    destinationUrl: 'https://www.apexfootwearltd.com/',
    buttonText: 'ভিজিট করুন',
    placement: 'home_middle',
    displayOrder: 1,
    isActive: true,
    clicks: 89,
    views: 1250,
    createdAt: new Date().toISOString()
  },
  {
    id: 'ad-cart-bkash',
    title: 'bKash Instant 10% Cashback',
    titleBn: 'বিকাশ পেমেন্টে ১০% ইনস্ট্যান্ট ক্যাশব্যাক!',
    description: 'জিহান স্টোরে সর্বনিম্ন ১,০০০ টাকা অর্ডারে বিকাশ পেমেন্ট করলেই ক্যাশব্যাক পান।',
    advertiserName: 'bKash Limited',
    image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&auto=format&fit=crop&q=80',
    destinationUrl: 'https://www.bkash.com/',
    buttonText: 'ক্যাশব্যাক নিন',
    placement: 'cart_drawer',
    displayOrder: 1,
    isActive: true,
    clicks: 65,
    views: 940,
    createdAt: new Date().toISOString()
  },
  {
    id: 'ad-bottom-mega',
    title: 'Jihan Mega Festival Discounts',
    titleBn: 'জিহান মেগা ফেস্টিভ্যাল ডিসকাউন্ট - কুপন কোড: RAMADAN15',
    description: 'পোশাক, গ্যাজেটস ও কিচেন আইটেমে আকর্ষণীয় ১৫% অতিরিক্ত ছাড় উপভোগ করুন।',
    advertiserName: 'Jihan Store Official',
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&auto=format&fit=crop&q=80',
    destinationUrl: '#products-section',
    buttonText: 'কেনাকাটা করুন',
    placement: 'home_bottom',
    displayOrder: 1,
    isActive: true,
    clicks: 210,
    views: 3100,
    createdAt: new Date().toISOString()
  },
  {
    id: 'ad-product-care',
    title: '100% Original Brand Guarantee',
    titleBn: '১০০% আসল পণ্যের গ্যারান্টি ও ৭ দিনের ফ্রি রিটার্ন',
    description: 'জিহান স্টোরের প্রতিটি পণ্যে পাচ্ছেন অফিসিয়াল কোয়ালিটি নিশ্চয়তা ও ঝামেলাহীন এক্সচেঞ্জ।',
    advertiserName: 'Jihan Care Guarantee',
    image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&auto=format&fit=crop&q=80',
    destinationUrl: '#',
    buttonText: 'পলিসি পড়ুন',
    placement: 'product_page',
    displayOrder: 1,
    isActive: true,
    clicks: 44,
    views: 780,
    createdAt: new Date().toISOString()
  }
];

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
    status: 'approved',
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
    status: 'approved',
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
    status: 'approved',
    createdAt: '2026-09-30T18:40:00Z'
  }
];
