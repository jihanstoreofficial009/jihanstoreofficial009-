export interface Product {
  id: string;
  title: string;
  titleBn?: string;
  price: number;
  discountPrice?: number;
  category: string;
  image: string;
  images?: string[];
  stock: number;
  rating: number;
  reviewsCount: number;
  isFeatured?: boolean;
  badge?: string;
  description: string;
  sku?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  nameBn?: string;
  icon: string;
  image?: string;
  itemCount?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentMethod = 'cod' | 'wallet' | 'bkash' | 'nagad' | 'rocket' | 'upay' | 'bank';
export type PaymentStatus = 'unpaid' | 'paid' | 'refunded';

export interface Order {
  id: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  phone: string;
  address: string;
  city: string;
  note?: string;
  items: {
    productId: string;
    title: string;
    price: number;
    quantity: number;
    image: string;
  }[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  trxId?: string;
  orderStatus: OrderStatus;
  createdAt: string;
  updatedAt?: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  phone?: string;
  address?: string;
  city?: string;
  walletBalance: number;
  role: 'customer' | 'admin';
  createdAt?: string;
}

export type TransactionType = 'deposit' | 'withdraw' | 'payment' | 'refund';
export type TransactionStatus = 'pending' | 'approved' | 'rejected';

export interface WalletTransaction {
  id: string;
  userId: string;
  userEmail: string;
  userName?: string;
  type: TransactionType;
  amount: number;
  method: 'bkash' | 'nagad' | 'rocket' | 'bank' | 'wallet_deduct';
  senderNumber?: string;
  trxId?: string;
  status: TransactionStatus;
  adminNote?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Coupon {
  id?: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrder: number;
  isActive: boolean;
  expiryDate?: string;
}

export interface PaymentAccount {
  id: string;
  provider: 'bkash' | 'nagad' | 'rocket' | 'upay' | 'bank' | 'wallet';
  accountName: string;
  accountNumber: string;
  accountType: 'Personal' | 'Merchant' | 'Agent' | 'Savings' | 'Current';
  instructions?: string;
  qrCodeUrl?: string;
  icon?: string;
  isPrimary?: boolean;
  isEnabled: boolean;
  displayOrder: number;
  bankBranch?: string;
  routingNumber?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TelegramBotConfig {
  id: string;
  botName: string;
  botUsername?: string;
  botToken: string;
  chatId: string;
  isEnabled: boolean;
  isConnected?: boolean;
  lastUsedAt?: string;
  totalDispatches?: number;
  createdAt?: string;
}

export interface LogoConfig {
  id: string;
  name: string;
  nameBn?: string;
  type: 'crest' | 'minimal' | 'monogram' | 'custom';
  url?: string;
  tagline?: string;
  taglineBn?: string;
  isActive: boolean;
  isEnabled?: boolean;
  displayOrder?: number;
}

export interface AddressItem {
  id: string;
  title: string;
  address: string;
  city: string;
  phone?: string;
  isDefault: boolean;
  isEnabled: boolean;
  displayOrder?: number;
}

export interface ContactNumber {
  id: string;
  title: string;
  number: string;
  type: 'phone' | 'whatsapp' | 'support' | 'billing';
  isDefault: boolean;
  isEnabled: boolean;
  displayOrder?: number;
}

export interface EmailContact {
  id: string;
  title: string;
  email: string;
  isDefault: boolean;
  isEnabled: boolean;
  displayOrder?: number;
}

export interface SocialLinkItem {
  id: string;
  platform: 'facebook' | 'youtube' | 'instagram' | 'tiktok' | 'twitter' | 'linkedin' | 'whatsapp' | 'other';
  title: string;
  url: string;
  isEnabled: boolean;
  displayOrder: number;
}

export type AdPlacement = 'home_top' | 'home_middle' | 'home_bottom' | 'product_page' | 'category_page' | 'cart_drawer';

export interface Advertisement {
  id: string;
  title: string;
  titleBn?: string;
  description: string;
  advertiserName: string;
  image: string;
  videoUrl?: string;
  destinationUrl: string;
  buttonText: string;
  placement: AdPlacement;
  displayOrder: number;
  isActive: boolean;
  startDate?: string;
  endDate?: string;
  clicks: number;
  views: number;
  createdAt: string;
  updatedAt?: string;
}

export interface StoreSettings {
  storeName: string;
  storeNameBn?: string;
  storeSlogan: string;
  storeSloganBn?: string;
  activeLogoId: string;
  logos: LogoConfig[];
  addresses: AddressItem[];
  phones: ContactNumber[];
  emails: EmailContact[];
  whatsapps: ContactNumber[];
  socialLinks: SocialLinkItem[];
  paymentAccounts?: PaymentAccount[];
  telegramBots?: TelegramBotConfig[];
  telegramLastBotIndex?: number;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  insideDhakaDelivery: number;
  outsideDhakaDelivery: number;
  freeDeliveryThreshold: number;
  announcement: string;
  bkashNumber: string;
  nagadNumber: string;
  facebookUrl?: string;
  youtubeUrl?: string;
  telegramBotToken?: string;
  telegramChatId?: string;
  googleManagementId?: string;
}

export interface Review {
  id: string;
  productId?: string;
  productTitle?: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  photoUrl?: string;
  rating: number;
  comment: string;
  status: 'pending' | 'approved' | 'hidden';
  isVerifiedPurchase: boolean;
  createdAt: string;
  updatedAt?: string;
}
