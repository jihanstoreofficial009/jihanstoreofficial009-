import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { 
  auth, 
  db, 
  googleProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail, 
  signOut, 
  onAuthStateChanged,
  User,
  ADMIN_EMAIL,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  handleFirestoreError,
  OperationType,
  increment
} from '../lib/firebase';
import { 
  Product, 
  Category, 
  CartItem, 
  Order, 
  UserProfile, 
  WalletTransaction, 
  Coupon, 
  StoreSettings, 
  Review,
  OrderStatus,
  Advertisement,
  LogoConfig,
  AddressItem,
  ContactNumber,
  SocialLinkItem,
  EmailContact
} from '../types/store';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_CATEGORIES, 
  INITIAL_SETTINGS, 
  INITIAL_COUPONS, 
  INITIAL_REVIEWS,
  INITIAL_ADS,
  INITIAL_LOGOS,
  INITIAL_ADDRESSES,
  INITIAL_PHONES,
  INITIAL_WHATSAPPS,
  INITIAL_EMAILS,
  INITIAL_SOCIAL_LINKS
} from '../data/initialData';
import {
  notifyNewOrder,
  notifyOrderStatusChanged,
  notifyWalletDepositRequest,
  notifyWalletWithdrawRequest,
  notifyNewReview,
  testTelegramConnection
} from '../lib/telegram';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface StoreContextType {
  user: User | null;
  userProfile: UserProfile | null;
  isAdmin: boolean;
  isDemoAdminMode: boolean;
  toggleDemoAdminMode: () => void;
  loadingAuth: boolean;
  products: Product[];
  categories: Category[];
  cart: CartItem[];
  wishlist: string[];
  orders: Order[];
  walletTransactions: WalletTransaction[];
  coupons: Coupon[];
  settings: StoreSettings;
  reviews: Review[];
  ads: Advertisement[];
  activeLogo: LogoConfig;
  appliedCoupon: Coupon | null;
  cartSubtotal: number;
  deliveryFee: number;
  discountAmount: number;
  cartTotal: number;
  selectedDeliveryArea: 'inside' | 'outside';
  setSelectedDeliveryArea: (area: 'inside' | 'outside') => void;
  toasts: Toast[];
  addToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  
  // Shopping Cart & Wishlist
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;

  // Authentication
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  signupWithEmail: (email: string, pass: string, name: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;

  // Orders
  placeOrder: (orderPayload: {
    customerName: string;
    phone: string;
    address: string;
    city: string;
    note?: string;
    paymentMethod: 'cod' | 'wallet' | 'bkash' | 'nagad';
    trxId?: string;
  }) => Promise<string>;
  cancelOrder: (orderId: string) => Promise<void>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;

  // Wallet
  requestDeposit: (amount: number, method: 'bkash' | 'nagad' | 'rocket' | 'bank', senderNumber: string, trxId: string) => Promise<void>;
  requestWithdraw: (amount: number, method: 'bkash' | 'nagad' | 'rocket' | 'bank', recipientNumber: string) => Promise<void>;
  approveTransaction: (tx: WalletTransaction) => Promise<void>;
  rejectTransaction: (txId: string, adminNote: string) => Promise<void>;

  // Admin Actions
  saveProduct: (product: Partial<Product>) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  saveCategory: (category: Partial<Category>) => Promise<void>;
  deleteCategory: (categoryId: string) => Promise<void>;
  saveCoupon: (coupon: Coupon) => Promise<void>;
  deleteCoupon: (code: string) => Promise<void>;
  updateStoreSettings: (newSettings: Partial<StoreSettings>) => Promise<void>;
  seedInitialDataToFirestore: () => Promise<void>;
  addReview: (review: { productId?: string; rating: number; comment: string }) => Promise<void>;
  sendTelegramTestNotification: (token?: string, chatId?: string) => Promise<{ success: boolean; error?: string }>;

  // Dynamic Branding & Logo Manager
  setActiveLogo: (logoId: string) => Promise<void>;
  saveLogo: (logo: LogoConfig) => Promise<void>;
  deleteLogo: (logoId: string) => Promise<void>;

  // Multi-Address & Multi-Contact Manager
  saveAddress: (address: AddressItem) => Promise<void>;
  deleteAddress: (id: string) => Promise<void>;
  saveContact: (contact: ContactNumber) => Promise<void>;
  deleteContact: (id: string, type: 'phone' | 'whatsapp') => Promise<void>;
  saveEmailContact: (email: EmailContact) => Promise<void>;
  deleteEmailContact: (id: string) => Promise<void>;
  saveSocialLink: (link: SocialLinkItem) => Promise<void>;
  deleteSocialLink: (id: string) => Promise<void>;

  // Advanced Ad Manager
  saveAd: (ad: Partial<Advertisement>) => Promise<void>;
  deleteAd: (adId: string) => Promise<void>;
  toggleAdStatus: (adId: string, isActive: boolean) => Promise<void>;
  recordAdClick: (adId: string) => Promise<void>;
  recordAdView: (adId: string) => Promise<void>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [isDemoAdminMode, setIsDemoAdminMode] = useState<boolean>(() => {
    return localStorage.getItem('jihan_demo_admin') === 'true';
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const cached = localStorage.getItem('jihan_products_cache');
    return cached ? JSON.parse(cached) : INITIAL_PRODUCTS;
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const cached = localStorage.getItem('jihan_categories_cache');
    return cached ? JSON.parse(cached) : INITIAL_CATEGORIES;
  });

  const [settings, setSettings] = useState<StoreSettings>(() => {
    const cached = localStorage.getItem('jihan_settings_cache');
    return cached ? JSON.parse(cached) : INITIAL_SETTINGS;
  });

  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const cached = localStorage.getItem('jihan_coupons_cache');
    return cached ? JSON.parse(cached) : INITIAL_COUPONS;
  });

  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);

  // Dynamic Ads state
  const [ads, setAds] = useState<Advertisement[]>(() => {
    try {
      const cached = localStorage.getItem('jihan_ads_cache');
      return cached ? JSON.parse(cached) : INITIAL_ADS;
    } catch {
      return INITIAL_ADS;
    }
  });

  // Dynamically resolve the currently active logo
  const activeLogo: LogoConfig = useMemo(() => {
    const list = settings.logos && settings.logos.length > 0 ? settings.logos : INITIAL_LOGOS;
    return list.find(l => l.id === settings.activeLogoId) || list.find(l => l.isActive) || list[0] || INITIAL_LOGOS[0];
  }, [settings.logos, settings.activeLogoId]);

  // Cart & Wishlist state
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem('jihan_store_cart');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('jihan_store_wishlist');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [selectedDeliveryArea, setSelectedDeliveryArea] = useState<'inside' | 'outside'>('inside');

  // Orders and Wallet
  const [orders, setOrders] = useState<Order[]>([]);
  const [walletTransactions, setWalletTransactions] = useState<WalletTransaction[]>([]);

  // Toasts
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Sync cart to localStorage
  useEffect(() => {
    localStorage.setItem('jihan_store_cart', JSON.stringify(cart));
  }, [cart]);

  // Sync wishlist to localStorage
  useEffect(() => {
    localStorage.setItem('jihan_store_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Admin evaluation
  const isAdmin = useMemo(() => {
    if (isDemoAdminMode) return true;
    if (user?.email && user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) return true;
    if (userProfile?.role === 'admin') return true;
    return false;
  }, [user, userProfile, isDemoAdminMode]);

  const toggleDemoAdminMode = () => {
    setIsDemoAdminMode(prev => {
      const next = !prev;
      localStorage.setItem('jihan_demo_admin', String(next));
      addToast(next ? 'Admin Mode Activated (Demo Access)' : 'Exited Admin Mode', 'info');
      return next;
    });
  };

  // Listen to Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Fetch or create user profile
        try {
          const userRef = doc(db, 'users', currentUser.uid);
          const snap = await getDoc(userRef);
          if (snap.exists()) {
            const data = snap.data() as UserProfile;
            setUserProfile(data);
          } else {
            const isDefaultAdmin = currentUser.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();
            const newProfile: UserProfile = {
              uid: currentUser.uid,
              email: currentUser.email || '',
              displayName: currentUser.displayName || currentUser.email?.split('@')[0] || 'Customer',
              walletBalance: isDefaultAdmin ? 50000 : 0,
              role: isDefaultAdmin ? 'admin' : 'customer',
              createdAt: new Date().toISOString()
            };
            await setDoc(userRef, newProfile);
            setUserProfile(newProfile);

            if (isDefaultAdmin) {
              // Ensure all default ads are registered in Firestore
              for (const ad of INITIAL_ADS) {
                setDoc(doc(db, 'ads', ad.id), ad, { merge: true }).catch(() => {});
              }
            }
          }
        } catch (err) {
          console.warn('Could not sync user profile with Firestore:', err);
          setUserProfile({
            uid: currentUser.uid,
            email: currentUser.email || '',
            displayName: currentUser.displayName || 'Customer',
            walletBalance: 0,
            role: currentUser.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase() ? 'admin' : 'customer'
          });
        }
      } else {
        setUserProfile(null);
      }
      setLoadingAuth(false);
    });

    return () => unsubscribe();
  }, []);

  // Real-time Firestore Listeners: Products, Categories, Settings, Reviews
  useEffect(() => {
    // 1. Products
    const prodPath = 'products';
    const unsubProducts = onSnapshot(
      collection(db, prodPath),
      (snapshot) => {
        if (!snapshot.empty) {
          const list = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Product));
          setProducts(list);
          localStorage.setItem('jihan_products_cache', JSON.stringify(list));
        } else {
          // If Firestore collection is empty, use initial seed products
          setProducts(INITIAL_PRODUCTS);
        }
      },
      (error) => {
        console.warn('Firestore Products onSnapshot error (using fallback):', error);
      }
    );

    // 2. Categories
    const catPath = 'categories';
    const unsubCats = onSnapshot(
      collection(db, catPath),
      (snapshot) => {
        if (!snapshot.empty) {
          const list = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Category));
          setCategories(list);
          localStorage.setItem('jihan_categories_cache', JSON.stringify(list));
        }
      },
      (error) => {
        console.warn('Firestore Categories onSnapshot error:', error);
      }
    );

    // 3. Settings
    const setDocRef = doc(db, 'store_settings', 'general');
    const unsubSettings = onSnapshot(
      setDocRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data() as StoreSettings;
          setSettings(data);
          localStorage.setItem('jihan_settings_cache', JSON.stringify(data));
        }
      },
      (error) => {
        console.warn('Firestore Store Settings onSnapshot error:', error);
      }
    );

    // 4. Coupons
    const coupPath = 'coupons';
    const unsubCoupons = onSnapshot(
      collection(db, coupPath),
      (snapshot) => {
        if (!snapshot.empty) {
          const list = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Coupon));
          setCoupons(list);
          localStorage.setItem('jihan_coupons_cache', JSON.stringify(list));
        }
      },
      (error) => {
        console.warn('Firestore Coupons onSnapshot error:', error);
      }
    );

    // 5. Reviews
    const revPath = 'reviews';
    const unsubReviews = onSnapshot(
      collection(db, revPath),
      (snapshot) => {
        if (!snapshot.empty) {
          const list = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Review));
          setReviews(list);
        }
      },
      (error) => {
        console.warn('Firestore Reviews onSnapshot error:', error);
      }
    );

    // 6. Dynamic Ads
    const adsPath = 'ads';
    const unsubAds = onSnapshot(
      collection(db, adsPath),
      (snapshot) => {
        if (!snapshot.empty) {
          const list = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Advertisement));
          list.sort((a, b) => a.displayOrder - b.displayOrder);
          setAds(list);
          localStorage.setItem('jihan_ads_cache', JSON.stringify(list));
        } else {
          setAds(INITIAL_ADS);
        }
      },
      (error) => {
        console.warn('Firestore Ads onSnapshot error:', error);
      }
    );

    return () => {
      unsubProducts();
      unsubCats();
      unsubSettings();
      unsubCoupons();
      unsubReviews();
      unsubAds();
    };
  }, []);

  // User Profile listener to keep wallet balance up-to-date
  useEffect(() => {
    if (!user) return;
    const unsubProfile = onSnapshot(
      doc(db, 'users', user.uid),
      (docSnap) => {
        if (docSnap.exists()) {
          setUserProfile(docSnap.data() as UserProfile);
        }
      },
      (err) => console.warn('User profile listener error:', err)
    );
    return () => unsubProfile();
  }, [user]);

  // Orders Listener
  useEffect(() => {
    if (!user && !isDemoAdminMode) {
      setOrders([]);
      return;
    }

    try {
      const ordersCol = collection(db, 'orders');
      let q = isAdmin 
        ? query(ordersCol) 
        : query(ordersCol, where('userId', '==', user?.uid || ''));

      const unsubOrders = onSnapshot(
        q,
        (snapshot) => {
          const list = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Order));
          // Sort by creation date descending
          list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setOrders(list);
        },
        (error) => {
          console.warn('Orders query error:', error);
        }
      );
      return () => unsubOrders();
    } catch (e) {
      console.warn('Error setting up orders listener:', e);
    }
  }, [user, isAdmin, isDemoAdminMode]);

  // Wallet Transactions Listener
  useEffect(() => {
    if (!user && !isDemoAdminMode) {
      setWalletTransactions([]);
      return;
    }

    try {
      const txCol = collection(db, 'wallet_transactions');
      let q = isAdmin 
        ? query(txCol) 
        : query(txCol, where('userId', '==', user?.uid || ''));

      const unsubTx = onSnapshot(
        q,
        (snapshot) => {
          const list = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as WalletTransaction));
          list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setWalletTransactions(list);
        },
        (error) => {
          console.warn('Wallet transactions query error:', error);
        }
      );
      return () => unsubTx();
    } catch (e) {
      console.warn('Error setting up wallet transactions listener:', e);
    }
  }, [user, isAdmin, isDemoAdminMode]);

  // Cart Calculations
  const cartSubtotal = useMemo(() => {
    return cart.reduce((sum, item) => {
      const price = item.product.discountPrice ?? item.product.price;
      return sum + price * item.quantity;
    }, 0);
  }, [cart]);

  const deliveryFee = useMemo(() => {
    if (cart.length === 0) return 0;
    if (cartSubtotal >= settings.freeDeliveryThreshold) return 0;
    return selectedDeliveryArea === 'inside' ? settings.insideDhakaDelivery : settings.outsideDhakaDelivery;
  }, [cartSubtotal, selectedDeliveryArea, settings, cart.length]);

  const discountAmount = useMemo(() => {
    if (!appliedCoupon || cartSubtotal === 0) return 0;
    if (cartSubtotal < appliedCoupon.minOrder) return 0;
    if (appliedCoupon.discountType === 'percentage') {
      return Math.round((cartSubtotal * appliedCoupon.discountValue) / 100);
    }
    return Math.min(appliedCoupon.discountValue, cartSubtotal);
  }, [appliedCoupon, cartSubtotal]);

  const cartTotal = useMemo(() => {
    if (cart.length === 0) return 0;
    return Math.max(0, cartSubtotal - discountAmount + deliveryFee);
  }, [cartSubtotal, discountAmount, deliveryFee, cart.length]);

  // Cart Handlers
  const addToCart = (product: Product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        const newQty = Math.min(product.stock, existing.quantity + quantity);
        return prev.map(item => item.product.id === product.id ? { ...item, quantity: newQty } : item);
      }
      return [...prev, { product, quantity: Math.min(product.stock, quantity) }];
    });
    addToast(`"${product.title.substring(0, 26)}..." যোগ করা হয়েছে!`, 'success');
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
    addToast('পণ্যটি ব্যাগ থেকে সরানো হয়েছে', 'info');
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => prev.map(item => {
      if (item.product.id === productId) {
        const safeQty = Math.min(item.product.stock, quantity);
        return { ...item, quantity: safeQty };
      }
      return item;
    }));
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  // Wishlist Handlers
  const toggleWishlist = (productId: string) => {
    setWishlist(prev => {
      const exists = prev.includes(productId);
      if (exists) {
        addToast('উইশলিস্ট থেকে সরানো হয়েছে', 'info');
        return prev.filter(id => id !== productId);
      } else {
        addToast('উইশলিস্টে যুক্ত করা হয়েছে!', 'success');
        return [...prev, productId];
      }
    });
  };

  const isWishlisted = (productId: string) => wishlist.includes(productId);

  const applyCoupon = (code: string): boolean => {
    const clean = code.trim().toUpperCase();
    const found = coupons.find(c => c.code.toUpperCase() === clean && c.isActive);
    if (!found) {
      addToast('ভুল বা মেয়াদোত্তীর্ণ কুপন কোড', 'error');
      return false;
    }
    if (cartSubtotal < found.minOrder) {
      addToast(`এই কুপন ব্যবহারের জন্য সর্বনিম্ন ৳${found.minOrder} টাকার অর্ডার প্রয়োজন`, 'error');
      return false;
    }
    setAppliedCoupon(found);
    addToast(`কুপন "${found.code}" সফলভাবে অ্যাপ্লাই হয়েছে!`, 'success');
    return true;
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    addToast('কুপন মুছে ফেলা হয়েছে', 'info');
  };

  // Auth Operations
  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      addToast('গুগল দিয়ে সফলভাবে লগইন হয়েছে!', 'success');
    } catch (err: any) {
      console.error(err);
      addToast(err?.message || 'লগইন ব্যর্থ হয়েছে', 'error');
      throw err;
    }
  };

  const loginWithEmail = async (email: string, pass: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, pass);
      addToast('সফলভাবে লগইন হয়েছে!', 'success');
    } catch (err: any) {
      console.error(err);
      addToast(err?.message || 'ইমেইল অথবা পাসওয়ার্ড ভুল', 'error');
      throw err;
    }
  };

  const signupWithEmail = async (email: string, pass: string, name: string) => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, pass);
      const isDefaultAdmin = email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
      const newProfile: UserProfile = {
        uid: cred.user.uid,
        email,
        displayName: name || email.split('@')[0],
        walletBalance: isDefaultAdmin ? 50000 : 0,
        role: isDefaultAdmin ? 'admin' : 'customer',
        createdAt: new Date().toISOString()
      };
      await setDoc(doc(db, 'users', cred.user.uid), newProfile);
      setUserProfile(newProfile);
      addToast('একাউন্ট তৈরি সফল হয়েছে!', 'success');
    } catch (err: any) {
      console.error(err);
      addToast(err?.message || 'রেজিস্ট্রেশন ব্যর্থ হয়েছে', 'error');
      throw err;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      addToast(`পাসওয়ার্ড রিসেট লিংক ${email} এ পাঠানো হয়েছে!`, 'success');
    } catch (err: any) {
      console.error(err);
      addToast(err?.message || 'পাসওয়ার্ড রিসেট লিংক পাঠাতে সমস্যা হয়েছে', 'error');
      throw err;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setUserProfile(null);
      addToast('লগআউট সম্পন্ন হয়েছে', 'info');
    } catch (err: any) {
      console.error(err);
    }
  };

  const updateUserProfile = async (data: Partial<UserProfile>) => {
    if (!user) return;
    try {
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, {
        ...data,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      setUserProfile(prev => prev ? { ...prev, ...data } : null);
      addToast('প্রোফাইল আপডেট হয়েছে!', 'success');
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `users/${user.uid}`);
    }
  };

  // Orders
  const placeOrder = async (orderPayload: {
    customerName: string;
    phone: string;
    address: string;
    city: string;
    note?: string;
    paymentMethod: 'cod' | 'wallet' | 'bkash' | 'nagad';
    trxId?: string;
  }): Promise<string> => {
    if (cart.length === 0) {
      throw new Error('কার্ট খালি!');
    }

    const currentUserId = user?.uid || (isDemoAdminMode ? 'demo-admin' : 'guest_' + Date.now());
    const currentEmail = user?.email || (isDemoAdminMode ? ADMIN_EMAIL : 'guest@jihanstore.com');

    // If payment method is wallet, check balance
    if (orderPayload.paymentMethod === 'wallet') {
      const currentBalance = userProfile?.walletBalance || 0;
      if (currentBalance < cartTotal) {
        throw new Error(`ওয়ালেট ব্যালেন্স অপর্যাপ্ত! আপনার ব্যালেন্স ৳${currentBalance}, প্রয়োজন ৳${cartTotal}। দয়া করে ডিপোজিট করুন বা ক্যাশ অন ডেলিভারি সিলেক্ট করুন।`);
      }
    }

    const orderId = 'ORD-' + Date.now().toString().slice(-6);
    const orderData: Order = {
      id: orderId,
      userId: currentUserId,
      customerName: orderPayload.customerName,
      customerEmail: currentEmail,
      phone: orderPayload.phone,
      address: orderPayload.address,
      city: orderPayload.city,
      note: orderPayload.note || '',
      items: cart.map(item => ({
        productId: item.product.id,
        title: item.product.title,
        price: item.product.discountPrice ?? item.product.price,
        quantity: item.quantity,
        image: item.product.image
      })),
      subtotal: cartSubtotal,
      deliveryFee,
      discount: discountAmount,
      totalAmount: cartTotal,
      paymentMethod: orderPayload.paymentMethod,
      paymentStatus: orderPayload.paymentMethod === 'wallet' ? 'paid' : (orderPayload.trxId ? 'paid' : 'unpaid'),
      trxId: orderPayload.trxId || '',
      orderStatus: 'pending',
      createdAt: new Date().toISOString()
    };

    try {
      // Save order to Firestore
      await setDoc(doc(db, 'orders', orderId), orderData);

      // If paid via wallet, deduct user wallet and record transaction
      if (orderPayload.paymentMethod === 'wallet' && user) {
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, {
          walletBalance: increment(-cartTotal)
        });

        // Add wallet transaction record
        const txId = 'TX-ORD-' + Date.now().toString().slice(-6);
        const txDoc: WalletTransaction = {
          id: txId,
          userId: user.uid,
          userEmail: user.email || '',
          userName: orderPayload.customerName,
          type: 'payment',
          amount: cartTotal,
          method: 'wallet_deduct',
          status: 'approved',
          adminNote: `Order #${orderId} payment`,
          createdAt: new Date().toISOString()
        };
        await setDoc(doc(db, 'wallet_transactions', txId), txDoc);
      }

      // Decrement product stock if possible
      for (const item of cart) {
        try {
          const pRef = doc(db, 'products', item.product.id);
          await updateDoc(pRef, {
            stock: increment(-item.quantity)
          });
        } catch {
          // Non-blocking stock update
        }
      }

      clearCart();
      addToast(`অর্ডার #${orderId} সফলভাবে গ্রহন করা হয়েছে!`, 'success');

      // Trigger instant Telegram Bot notification to admin
      notifyNewOrder(orderData, settings.telegramBotToken, settings.telegramChatId).catch(err => {
        console.warn('Telegram notification failed:', err);
      });

      return orderId;
    } catch (err) {
      console.error('Order creation error:', err);
      // Fallback local persistence if offline
      setOrders(prev => [orderData, ...prev]);
      clearCart();
      addToast(`অর্ডার #${orderId} সফলভাবে সাবমিট হয়েছে!`, 'success');

      // Trigger instant Telegram Bot notification to admin
      notifyNewOrder(orderData, settings.telegramBotToken, settings.telegramChatId).catch(err => {
        console.warn('Telegram notification failed:', err);
      });

      return orderId;
    }
  };

  const cancelOrder = async (orderId: string) => {
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, {
        orderStatus: 'cancelled',
        updatedAt: new Date().toISOString()
      });
      addToast(`অর্ডার #${orderId} বাতিল করা হয়েছে`, 'info');

      const foundOrder = orders.find(o => o.id === orderId);
      if (foundOrder) {
        notifyOrderStatusChanged(
          orderId,
          foundOrder.customerName,
          foundOrder.phone,
          'cancelled',
          foundOrder.totalAmount,
          settings.telegramBotToken,
          settings.telegramChatId
        ).catch(() => {});
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `orders/${orderId}`);
    }
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, {
        orderStatus: status,
        updatedAt: new Date().toISOString()
      });
      addToast(`অর্ডারের স্ট্যাটাস "${status.toUpperCase()}" এ আপডেট করা হয়েছে`, 'success');

      const foundOrder = orders.find(o => o.id === orderId);
      if (foundOrder) {
        notifyOrderStatusChanged(
          orderId,
          foundOrder.customerName,
          foundOrder.phone,
          status,
          foundOrder.totalAmount,
          settings.telegramBotToken,
          settings.telegramChatId
        ).catch(() => {});
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `orders/${orderId}`);
    }
  };

  // Wallet
  const requestDeposit = async (amount: number, method: 'bkash' | 'nagad' | 'rocket' | 'bank', senderNumber: string, trxId: string) => {
    if (!user) throw new Error('ডিপোজিট রিকোয়েস্টের জন্য লগইন প্রয়োজন');
    const txId = 'DEP-' + Date.now().toString().slice(-6);
    const tx: WalletTransaction = {
      id: txId,
      userId: user.uid,
      userEmail: user.email || '',
      userName: userProfile?.displayName || user.displayName || 'Customer',
      type: 'deposit',
      amount,
      method,
      senderNumber,
      trxId,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    try {
      await setDoc(doc(db, 'wallet_transactions', txId), tx);
      addToast('ডিপোজিট রিকোয়েস্ট সাবমিট হয়েছে! অ্যাডমিন যাচাই করে ব্যালেন্স যুক্ত করবেন।', 'success');

      // Notify Telegram
      notifyWalletDepositRequest(tx, settings.telegramBotToken, settings.telegramChatId).catch(() => {});
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `wallet_transactions/${txId}`);
    }
  };

  const requestWithdraw = async (amount: number, method: 'bkash' | 'nagad' | 'rocket' | 'bank', recipientNumber: string) => {
    if (!user) throw new Error('উত্তোলন রিকোয়েস্টের জন্য লগইন প্রয়োজন');
    if ((userProfile?.walletBalance || 0) < amount) {
      throw new Error('অপর্যাপ্ত ওয়ালেট ব্যালেন্স!');
    }

    const txId = 'WTH-' + Date.now().toString().slice(-6);
    const tx: WalletTransaction = {
      id: txId,
      userId: user.uid,
      userEmail: user.email || '',
      userName: userProfile?.displayName || user.displayName || 'Customer',
      type: 'withdraw',
      amount,
      method,
      senderNumber: recipientNumber,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    try {
      await setDoc(doc(db, 'wallet_transactions', txId), tx);
      addToast('উত্তোলন রিকোয়েস্ট সাবমিট হয়েছে! অ্যাডমিন অ্যাপ্রুভ করলে টাকা পাঠানো হবে।', 'success');

      // Notify Telegram
      notifyWalletWithdrawRequest(tx, settings.telegramBotToken, settings.telegramChatId).catch(() => {});
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `wallet_transactions/${txId}`);
    }
  };

  const approveTransaction = async (tx: WalletTransaction) => {
    try {
      const txRef = doc(db, 'wallet_transactions', tx.id);
      await updateDoc(txRef, {
        status: 'approved',
        updatedAt: new Date().toISOString()
      });

      // Update user wallet balance
      const delta = tx.type === 'deposit' ? tx.amount : -tx.amount;
      const userRef = doc(db, 'users', tx.userId);
      await updateDoc(userRef, {
        walletBalance: increment(delta)
      });

      addToast(`লেনদেন #${tx.id} সফলভাবে অ্যাপ্রুভ করা হয়েছে!`, 'success');
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `wallet_transactions/${tx.id}`);
    }
  };

  const rejectTransaction = async (txId: string, adminNote: string) => {
    try {
      const txRef = doc(db, 'wallet_transactions', txId);
      await updateDoc(txRef, {
        status: 'rejected',
        adminNote,
        updatedAt: new Date().toISOString()
      });
      addToast(`লেনদেন #${txId} বাতিল করা হয়েছে`, 'info');
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `wallet_transactions/${txId}`);
    }
  };

  // Admin Product CRUD
  const saveProduct = async (productData: Partial<Product>) => {
    const id = productData.id || 'prod-' + Date.now().toString().slice(-6);
    const payload: Product = {
      id,
      title: productData.title || 'New Product',
      titleBn: productData.titleBn || '',
      price: Number(productData.price) || 0,
      discountPrice: productData.discountPrice ? Number(productData.discountPrice) : undefined,
      category: productData.category || 'electronics',
      image: productData.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
      images: productData.images || [productData.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800'],
      stock: Number(productData.stock) || 10,
      rating: productData.rating || 5,
      reviewsCount: productData.reviewsCount || 0,
      isFeatured: !!productData.isFeatured,
      badge: productData.badge || '',
      description: productData.description || '',
      sku: productData.sku || 'JS-' + id,
      updatedAt: new Date().toISOString()
    };

    try {
      await setDoc(doc(db, 'products', id), payload, { merge: true });
      addToast('পণ্য সফলভাবে সেভ করা হয়েছে!', 'success');
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `products/${id}`);
    }
  };

  const deleteProduct = async (productId: string) => {
    try {
      await deleteDoc(doc(db, 'products', productId));
      addToast('পণ্যটি সফলভাবে ডিলিট করা হয়েছে', 'info');
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `products/${productId}`);
    }
  };

  const saveCategory = async (catData: Partial<Category>) => {
    const id = catData.id || 'cat-' + Date.now().toString().slice(-5);
    const payload: Category = {
      id,
      name: catData.name || 'Category',
      nameBn: catData.nameBn || '',
      icon: catData.icon || 'Sparkles',
      image: catData.image || '',
      itemCount: catData.itemCount || 0
    };
    try {
      await setDoc(doc(db, 'categories', id), payload, { merge: true });
      addToast('ক্যাটাগরি সেভ হয়েছে!', 'success');
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `categories/${id}`);
    }
  };

  const deleteCategory = async (categoryId: string) => {
    try {
      await deleteDoc(doc(db, 'categories', categoryId));
      addToast('ক্যাটাগরি ডিলিট হয়েছে', 'info');
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `categories/${categoryId}`);
    }
  };

  const saveCoupon = async (coupon: Coupon) => {
    try {
      await setDoc(doc(db, 'coupons', coupon.code.toUpperCase()), coupon);
      addToast('কুপন কোড সেভ হয়েছে!', 'success');
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `coupons/${coupon.code}`);
    }
  };

  const deleteCoupon = async (code: string) => {
    try {
      await deleteDoc(doc(db, 'coupons', code.toUpperCase()));
      addToast('কুপন ডিলিট হয়েছে', 'info');
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `coupons/${code}`);
    }
  };

  const updateStoreSettings = async (newSettings: Partial<StoreSettings>) => {
    try {
      await setDoc(doc(db, 'store_settings', 'general'), newSettings, { merge: true });
      setSettings(prev => ({ ...prev, ...newSettings }));
      addToast('স্টোর সেটিংস সফলভাবে আপডেট হয়েছে!', 'success');
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'store_settings/general');
    }
  };

  const addReview = async (rev: { productId?: string; rating: number; comment: string }) => {
    const revId = 'REV-' + Date.now().toString().slice(-6);
    const newRev: Review = {
      id: revId,
      productId: rev.productId || '',
      userId: user?.uid || 'guest',
      userName: userProfile?.displayName || user?.displayName || 'Customer',
      rating: rev.rating,
      comment: rev.comment,
      isVerifiedPurchase: true,
      createdAt: new Date().toISOString()
    };
    try {
      await setDoc(doc(db, 'reviews', revId), newRev);
      addToast('রিভিউ যোগ করার জন্য ধন্যবাদ!', 'success');

      // Trigger Telegram notification
      const prod = products.find(p => p.id === rev.productId);
      notifyNewReview({
        userName: newRev.userName,
        rating: newRev.rating,
        comment: newRev.comment,
        productTitle: prod?.titleBn || prod?.title
      }, settings.telegramBotToken, settings.telegramChatId).catch(() => {});
    } catch (err) {
      // Local fallback
      setReviews(prev => [newRev, ...prev]);
      addToast('রিভিউ সফলভাবে জমা হয়েছে!', 'success');

      const prod = products.find(p => p.id === rev.productId);
      notifyNewReview({
        userName: newRev.userName,
        rating: newRev.rating,
        comment: newRev.comment,
        productTitle: prod?.titleBn || prod?.title
      }, settings.telegramBotToken, settings.telegramChatId).catch(() => {});
    }
  };

  const sendTelegramTestNotification = async (token?: string, chatId?: string) => {
    return testTelegramConnection(token || settings.telegramBotToken, chatId || settings.telegramChatId);
  };

  // Dynamic Branding & Logo Manager
  const setActiveLogo = async (logoId: string) => {
    const logos = (settings.logos || INITIAL_LOGOS).map(l => ({
      ...l,
      isActive: l.id === logoId
    }));
    await updateStoreSettings({ activeLogoId: logoId, logos });
    addToast('লোগো সফলভাবে অ্যাক্টিভ করা হয়েছে!', 'success');
  };

  const saveLogo = async (logo: LogoConfig) => {
    const list = settings.logos && settings.logos.length > 0 ? settings.logos : INITIAL_LOGOS;
    const exists = list.some(l => l.id === logo.id);
    let updated = exists 
      ? list.map(l => l.id === logo.id ? logo : l)
      : [...list, logo];
    if (logo.isActive) {
      updated = updated.map(l => ({ ...l, isActive: l.id === logo.id }));
    }
    await updateStoreSettings({ 
      logos: updated,
      activeLogoId: logo.isActive ? logo.id : settings.activeLogoId
    });
    addToast('লোগো সফলভাবে সংরক্ষিত হয়েছে!', 'success');
  };

  const deleteLogo = async (logoId: string) => {
    const list = settings.logos && settings.logos.length > 0 ? settings.logos : INITIAL_LOGOS;
    if (list.length <= 1) {
      addToast('কমপক্ষে একটি লোগো থাকা বাধ্যতামূলক', 'error');
      return;
    }
    const filtered = list.filter(l => l.id !== logoId);
    const newActiveId = settings.activeLogoId === logoId ? filtered[0].id : settings.activeLogoId;
    await updateStoreSettings({ logos: filtered, activeLogoId: newActiveId });
    addToast('লোগো মুছে ফেলা হয়েছে', 'info');
  };

  // Multi-Address & Multi-Contact Manager
  const saveAddress = async (addressItem: AddressItem) => {
    const list: AddressItem[] = settings.addresses && settings.addresses.length > 0 ? settings.addresses : INITIAL_ADDRESSES;
    const exists = list.some((a: AddressItem) => a.id === addressItem.id);
    let updated = exists
      ? list.map((a: AddressItem) => a.id === addressItem.id ? addressItem : a)
      : [...list, addressItem];
    if (addressItem.isDefault) {
      updated = updated.map((a: AddressItem) => ({ ...a, isDefault: a.id === addressItem.id }));
    }
    await updateStoreSettings({ 
      addresses: updated,
      address: addressItem.isDefault ? addressItem.address : settings.address
    });
    addToast('ঠিকানা সংরক্ষিত হয়েছে!', 'success');
  };

  const deleteAddress = async (id: string) => {
    const list = (settings.addresses || INITIAL_ADDRESSES).filter((a: AddressItem) => a.id !== id);
    await updateStoreSettings({ addresses: list });
    addToast('ঠিকানা মুছে ফেলা হয়েছে', 'info');
  };

  const saveContact = async (contact: ContactNumber) => {
    if (contact.type === 'whatsapp') {
      const list: ContactNumber[] = settings.whatsapps && settings.whatsapps.length > 0 ? settings.whatsapps : INITIAL_WHATSAPPS;
      const exists = list.some((c: ContactNumber) => c.id === contact.id);
      let updated = exists ? list.map((c: ContactNumber) => c.id === contact.id ? contact : c) : [...list, contact];
      if (contact.isDefault) {
        updated = updated.map((c: ContactNumber) => ({ ...c, isDefault: c.id === contact.id }));
      }
      await updateStoreSettings({ whatsapps: updated, whatsapp: contact.isDefault ? contact.number : settings.whatsapp });
    } else {
      const list: ContactNumber[] = settings.phones && settings.phones.length > 0 ? settings.phones : INITIAL_PHONES;
      const exists = list.some((c: ContactNumber) => c.id === contact.id);
      let updated = exists ? list.map((c: ContactNumber) => c.id === contact.id ? contact : c) : [...list, contact];
      if (contact.isDefault) {
        updated = updated.map((c: ContactNumber) => ({ ...c, isDefault: c.id === contact.id }));
      }
      await updateStoreSettings({ phones: updated, phone: contact.isDefault ? contact.number : settings.phone });
    }
    addToast('যোগাযোগ নম্বর সংরক্ষিত হয়েছে!', 'success');
  };

  const deleteContact = async (id: string, type: 'phone' | 'whatsapp') => {
    if (type === 'whatsapp') {
      const list = (settings.whatsapps || INITIAL_WHATSAPPS).filter((c: ContactNumber) => c.id !== id);
      await updateStoreSettings({ whatsapps: list });
    } else {
      const list = (settings.phones || INITIAL_PHONES).filter((c: ContactNumber) => c.id !== id);
      await updateStoreSettings({ phones: list });
    }
    addToast('নম্বর মুছে ফেলা হয়েছে', 'info');
  };

  const saveEmailContact = async (emailItem: EmailContact) => {
    const list: EmailContact[] = settings.emails && settings.emails.length > 0 ? settings.emails : INITIAL_EMAILS;
    const exists = list.some((e: EmailContact) => e.id === emailItem.id);
    let updated = exists ? list.map((e: EmailContact) => e.id === emailItem.id ? emailItem : e) : [...list, emailItem];
    if (emailItem.isDefault) {
      updated = updated.map((e: EmailContact) => ({ ...e, isDefault: e.id === emailItem.id }));
    }
    await updateStoreSettings({ emails: updated, email: emailItem.isDefault ? emailItem.email : settings.email });
    addToast('ইমেইল সংরক্ষিত হয়েছে!', 'success');
  };

  const deleteEmailContact = async (id: string) => {
    const list = (settings.emails || INITIAL_EMAILS).filter((e: EmailContact) => e.id !== id);
    await updateStoreSettings({ emails: list });
    addToast('ইমেইল মুছে ফেলা হয়েছে', 'info');
  };

  const saveSocialLink = async (link: SocialLinkItem) => {
    const list: SocialLinkItem[] = settings.socialLinks && settings.socialLinks.length > 0 ? settings.socialLinks : INITIAL_SOCIAL_LINKS;
    const exists = list.some((s: SocialLinkItem) => s.id === link.id);
    const updated = exists ? list.map((s: SocialLinkItem) => s.id === link.id ? link : s) : [...list, link];
    updated.sort((a: SocialLinkItem, b: SocialLinkItem) => a.displayOrder - b.displayOrder);
    await updateStoreSettings({ socialLinks: updated });
    addToast('সোশ্যাল লিংক সংরক্ষিত হয়েছে!', 'success');
  };

  const deleteSocialLink = async (id: string) => {
    const list = (settings.socialLinks || INITIAL_SOCIAL_LINKS).filter((s: SocialLinkItem) => s.id !== id);
    await updateStoreSettings({ socialLinks: list });
    addToast('সোশ্যাল লিংক মুছে ফেলা হয়েছে', 'info');
  };

  // Advanced Ad Manager
  const saveAd = async (adData: Partial<Advertisement>) => {
    const id = adData.id || 'ad-' + Date.now().toString().slice(-6);
    const payload: Advertisement = {
      id,
      title: adData.title || 'Special Promotion',
      titleBn: adData.titleBn || '',
      description: adData.description || '',
      advertiserName: adData.advertiserName || 'Jihan Store',
      image: adData.image || 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200',
      videoUrl: adData.videoUrl || '',
      destinationUrl: adData.destinationUrl || '#',
      buttonText: adData.buttonText || 'অফার দেখুন',
      placement: adData.placement || 'home_top',
      displayOrder: Number(adData.displayOrder) || 1,
      isActive: adData.isActive !== false,
      startDate: adData.startDate || '',
      endDate: adData.endDate || '',
      clicks: adData.clicks || 0,
      views: adData.views || 0,
      createdAt: adData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    try {
      await setDoc(doc(db, 'ads', id), payload, { merge: true });
      addToast('বিজ্ঞাপন সফলভাবে সংরক্ষিত হয়েছে!', 'success');
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `ads/${id}`);
    }
  };

  const deleteAd = async (adId: string) => {
    try {
      await deleteDoc(doc(db, 'ads', adId));
      addToast('বিজ্ঞাপনটি মুছে ফেলা হয়েছে', 'info');
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `ads/${adId}`);
    }
  };

  const toggleAdStatus = async (adId: string, isActive: boolean) => {
    try {
      const existingAd = ads.find(a => a.id === adId) || INITIAL_ADS.find(a => a.id === adId);
      const dataToSave = existingAd
        ? { ...existingAd, isActive, updatedAt: new Date().toISOString() }
        : { id: adId, isActive, updatedAt: new Date().toISOString() };

      await setDoc(doc(db, 'ads', adId), dataToSave, { merge: true });
      addToast(isActive ? 'বিজ্ঞাপন সক্রিয় করা হয়েছে' : 'বিজ্ঞাপন বন্ধ করা হয়েছে', 'info');
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `ads/${adId}`);
    }
  };

  const recordAdClick = async (adId: string) => {
    try {
      const adRef = doc(db, 'ads', adId);
      const snap = await getDoc(adRef);
      if (snap.exists()) {
        await updateDoc(adRef, {
          clicks: increment(1)
        });
      }
    } catch {
      // Non-blocking
    }
  };

  const recordAdView = async (adId: string) => {
    try {
      const adRef = doc(db, 'ads', adId);
      const snap = await getDoc(adRef);
      if (snap.exists()) {
        await updateDoc(adRef, {
          views: increment(1)
        });
      }
    } catch {
      // Non-blocking
    }
  };

  // Seed default items into Firestore so the database is populated with rich data!
  const seedInitialDataToFirestore = async () => {
    try {
      // Seed products
      for (const p of INITIAL_PRODUCTS) {
        await setDoc(doc(db, 'products', p.id), p, { merge: true });
      }
      // Seed categories
      for (const c of INITIAL_CATEGORIES) {
        await setDoc(doc(db, 'categories', c.id), c, { merge: true });
      }
      // Seed settings
      await setDoc(doc(db, 'store_settings', 'general'), INITIAL_SETTINGS, { merge: true });
      // Seed coupons
      for (const cp of INITIAL_COUPONS) {
        await setDoc(doc(db, 'coupons', cp.code), cp, { merge: true });
      }
      // Seed reviews
      for (const r of INITIAL_REVIEWS) {
        await setDoc(doc(db, 'reviews', r.id), r, { merge: true });
      }
      // Seed ads
      for (const a of INITIAL_ADS) {
        await setDoc(doc(db, 'ads', a.id), a, { merge: true });
      }
      addToast('জিহান স্টোরের প্রাথমিক ডাটাবেজ সফলভাবে লোড হয়েছে!', 'success');
    } catch (err) {
      console.error('Seed error:', err);
      addToast('ডাটা সিড করতে সমস্যা হয়েছে', 'error');
    }
  };

  return (
    <StoreContext.Provider
      value={{
        user,
        userProfile,
        isAdmin,
        isDemoAdminMode,
        toggleDemoAdminMode,
        loadingAuth,
        products,
        categories,
        cart,
        wishlist,
        orders,
        walletTransactions,
        coupons,
        settings,
        reviews,
        ads,
        activeLogo,
        appliedCoupon,
        cartSubtotal,
        deliveryFee,
        discountAmount,
        cartTotal,
        selectedDeliveryArea,
        setSelectedDeliveryArea,
        toasts,
        addToast,
        removeToast,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        toggleWishlist,
        isWishlisted,
        applyCoupon,
        removeCoupon,
        loginWithGoogle,
        loginWithEmail,
        signupWithEmail,
        resetPassword,
        logout,
        updateUserProfile,
        placeOrder,
        cancelOrder,
        updateOrderStatus,
        requestDeposit,
        requestWithdraw,
        approveTransaction,
        rejectTransaction,
        saveProduct,
        deleteProduct,
        saveCategory,
        deleteCategory,
        saveCoupon,
        deleteCoupon,
        updateStoreSettings,
        seedInitialDataToFirestore,
        addReview,
        sendTelegramTestNotification,
        setActiveLogo,
        saveLogo,
        deleteLogo,
        saveAddress,
        deleteAddress,
        saveContact,
        deleteContact,
        saveEmailContact,
        deleteEmailContact,
        saveSocialLink,
        deleteSocialLink,
        saveAd,
        deleteAd,
        toggleAdStatus,
        recordAdClick,
        recordAdView
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
