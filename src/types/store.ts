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
export type PaymentMethod = 'cod' | 'wallet' | 'bkash' | 'nagad';
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

export interface StoreSettings {
  storeName: string;
  storeSlogan: string;
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
}

export interface Review {
  id: string;
  productId?: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  isVerifiedPurchase: boolean;
  createdAt: string;
}
