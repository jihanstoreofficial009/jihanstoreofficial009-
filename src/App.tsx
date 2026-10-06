import React, { useState, useEffect, useMemo, useRef } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { CategorySection } from './components/CategorySection';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { CustomerAuthModal } from './components/CustomerAuthModal';
import { CustomerAccountModal } from './components/CustomerAccountModal';
import { AdminDashboard } from './components/AdminDashboard';
import { OrderInvoiceModal } from './components/OrderInvoiceModal';
import { WishlistModal } from './components/WishlistModal';
import { ReviewsAndOffersSection } from './components/ReviewsAndOffersSection';
import { Footer } from './components/Footer';
import { ToastContainer } from './components/ToastContainer';
import { AdBanner } from './components/AdBanner';
import { Product, Order } from './types/store';
import { 
  SlidersHorizontal, 
  ArrowUpDown, 
  Search, 
  Sparkles, 
  PackageCheck,
  ShoppingBag,
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  Clock,
  ShieldCheck
} from 'lucide-react';

const MainStoreContent: React.FC = () => {
  const { 
    products, 
    isAdmin, 
    settings, 
    user, 
    cart, 
    addToCart, 
    orders 
  } = useStore();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [priceRange, setPriceRange] = useState<number>(10000);

  // Modals State
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [accountTab, setAccountTab] = useState<'orders' | 'wallet' | 'profile'>('orders');
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [activeInvoiceOrder, setActiveInvoiceOrder] = useState<Order | null>(null);

  // Check URL path or hash for /admin route
  useEffect(() => {
    const checkRoute = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;
      if (path.includes('/admin') || hash === '#admin') {
        setIsAdminOpen(true);
      }
    };
    checkRoute();
    window.addEventListener('popstate', checkRoute);
    window.addEventListener('hashchange', checkRoute);
    return () => {
      window.removeEventListener('popstate', checkRoute);
      window.removeEventListener('hashchange', checkRoute);
    };
  }, []);

  // Authorized Gmail login auto-routes straight into secure Admin Panel
  const prevAdminRef = useRef(false);
  useEffect(() => {
    if (isAdmin && !prevAdminRef.current) {
      setIsAdminOpen(true);
    }
    prevAdminRef.current = isAdmin;
  }, [isAdmin]);

  // Filter and Sort Products
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchCategory = selectedCategory === 'all' || product.category === selectedCategory;
      const effectivePrice = product.discountPrice ?? product.price;
      const matchPrice = effectivePrice <= priceRange;
      
      const q = searchQuery.toLowerCase().trim();
      const matchSearch = q === '' ||
        product.title.toLowerCase().includes(q) ||
        (product.titleBn && product.titleBn.toLowerCase().includes(q)) ||
        product.category.toLowerCase().includes(q) ||
        (product.description && product.description.toLowerCase().includes(q));

      return matchCategory && matchPrice && matchSearch;
    }).sort((a, b) => {
      const priceA = a.discountPrice ?? a.price;
      const priceB = b.discountPrice ?? b.price;
      if (sortBy === 'price-asc') return priceA - priceB;
      if (sortBy === 'price-desc') return priceB - priceA;
      if (sortBy === 'rating') return b.rating - a.rating;
      // Default: featured first
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;
      return 0;
    });
  }, [products, selectedCategory, searchQuery, sortBy, priceRange]);

  const handleBuyNow = (product: Product, quantity = 1) => {
    addToCart(product, quantity);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleOpenAccount = (tab: 'orders' | 'wallet' | 'profile' = 'orders') => {
    if (!user) {
      setIsAuthOpen(true);
    } else {
      setAccountTab(tab);
      setIsAccountOpen(true);
    }
  };

  const handleViewOrderDetails = (orderId: string) => {
    const found = orders.find(o => o.id === orderId);
    if (found) {
      setActiveInvoiceOrder(found);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#07162E] text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950 w-full max-w-full overflow-x-hidden">
      {/* Navbar */}
      <Navbar
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenAccount={handleOpenAccount}
        onOpenAdmin={() => setIsAdminOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-4 sm:py-8 space-y-8 sm:space-y-12 overflow-x-hidden">
        {/* Hero Section */}
        {selectedCategory === 'all' && !searchQuery && (
          <>
            <HeroBanner
              onShopNow={() => {
                const el = document.getElementById('products-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              onExploreOffers={() => {
                const el = document.getElementById('offers-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            {/* Ad Placement: Home Top (Hero Sub-Banner) */}
            <AdBanner placement="home_top" />
          </>
        )}

        {/* Categories Section */}
        <CategorySection
          selectedCategory={selectedCategory}
          onSelectCategory={(catId) => {
            setSelectedCategory(catId);
            const el = document.getElementById('products-section');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* Ad Placement: Home Middle (Between Categories & Products) */}
        <AdBanner placement="home_middle" />

        {/* Products Listing Section */}
        <section id="products-section" className="space-y-4 sm:space-y-6 pt-2 sm:pt-4 w-full">
          {/* Section Header & Filters */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 pb-3 sm:pb-4 border-b border-slate-200 dark:border-blue-900/60 w-full">
            <div>
              <h2 className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span>
                  {selectedCategory === 'all' 
                    ? 'আমাদের জনপ্রিয় পণ্যসমূহ' 
                    : `${selectedCategory.toUpperCase()} ক্যাটাগরির পণ্য`}
                </span>
                <span className="text-xs font-bold text-slate-400 font-mono">
                  ({filteredProducts.length} টি)
                </span>
              </h2>
              {searchQuery && (
                <p className="text-xs text-amber-500 font-semibold mt-1">
                  “{searchQuery}” এর জন্য সার্চ ফলাফল
                </p>
              )}
            </div>

            {/* Sorting & Filter Controls */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
              <div className="flex items-center gap-1.5 bg-white dark:bg-[#0B1E3F] border border-slate-200 dark:border-blue-800 rounded-xl px-2.5 sm:px-3 py-1.5 sm:py-2">
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-400 font-medium">সর্ট:</span>
                <select
                  value={sortBy}
                  onChange={(e: any) => setSortBy(e.target.value)}
                  className="bg-transparent text-slate-800 dark:text-slate-200 font-bold focus:outline-none cursor-pointer text-xs"
                >
                  <option value="featured" className="dark:bg-[#0B1E3F]">ফিচার্ড (Featured)</option>
                  <option value="price-asc" className="dark:bg-[#0B1E3F]">দাম: কম থেকে বেশি</option>
                  <option value="price-desc" className="dark:bg-[#0B1E3F]">দাম: বেশি থেকে কম</option>
                  <option value="rating" className="dark:bg-[#0B1E3F]">টপ রেটিং (Top Rating)</option>
                </select>
              </div>

              {selectedCategory !== 'all' && (
                <button
                  onClick={() => setSelectedCategory('all')}
                  className="px-3 py-1.5 sm:py-2 rounded-xl bg-slate-200 dark:bg-blue-900/50 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-300 transition text-xs"
                >
                  ফিল্টার ক্লিয়ার
                </button>
              )}
            </div>
          </div>

          {/* Product Grid */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12 sm:py-16 space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-blue-950/60 flex items-center justify-center text-slate-400 mx-auto">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                কোনো পণ্য খুঁজে পাওয়া যায়নি
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                অন্য কোনো নামে সার্চ করুন অথবা সব ক্যাটাগরি অপশন সিলেক্ট করুন।
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="px-5 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition"
              >
                সব পণ্য দেখুন
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-6 w-full">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelect={(p) => setSelectedProduct(p)}
                  onBuyNow={(p) => handleBuyNow(p, 1)}
                />
              ))}
            </div>
          )}
        </section>

        {/* Offers & Customer Reviews Section */}
        <section id="offers-section" className="w-full">
          <ReviewsAndOffersSection />
        </section>

        {/* Ad Placement: Home Bottom (Before Contact & Support) */}
        <AdBanner placement="home_bottom" />

        {/* Contact Section */}
        <section className="rounded-2xl sm:rounded-3xl bg-white dark:bg-[#0B1E3F]/80 border border-slate-200 dark:border-blue-900/60 p-4 sm:p-10 shadow-sm space-y-5 sm:space-y-6 overflow-hidden w-full max-w-full">
          <div className="text-center max-w-xl mx-auto space-y-1">
            <span className="text-xs font-bold text-amber-500 uppercase tracking-widest block">
              সাহায্য ও যোগাযোগ
            </span>
            <h2 className="text-xl sm:text-3xl font-black text-slate-900 dark:text-white">
              আমাদের সাথে সরাসরি কথা বলুন
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              যেকোনো অর্ডার, প্রশ্ন বা সহায়তার জন্য আমাদের প্রতিনিধি প্রস্তুত
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 w-full">
            <a
              href={`tel:${settings.phone}`}
              className="p-3.5 sm:p-5 rounded-xl sm:rounded-2xl bg-slate-50 dark:bg-blue-950/40 border border-slate-200 dark:border-blue-900/40 flex items-center gap-3 sm:gap-4 hover:border-amber-400/50 transition group min-w-0"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-amber-500/15 text-amber-500 flex items-center justify-center shrink-0 group-hover:scale-110 transition">
                <Phone className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-xs text-slate-400 font-medium truncate">হটলাইন ও অর্ডার কল</h4>
                <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white block mt-0.5 truncate">{settings.phone}</span>
                <span className="text-[10px] text-emerald-600 font-semibold block truncate">সকাল ৯টা - রাত ১১টা</span>
              </div>
            </a>

            <a
              href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noreferrer"
              className="p-3.5 sm:p-5 rounded-xl sm:rounded-2xl bg-slate-50 dark:bg-blue-950/40 border border-slate-200 dark:border-blue-900/40 flex items-center gap-3 sm:gap-4 hover:border-emerald-400/50 transition group min-w-0"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center shrink-0 group-hover:scale-110 transition">
                <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-xs text-slate-400 font-medium truncate">হোয়াটসঅ্যাপ চ্যাট</h4>
                <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white block mt-0.5 truncate">{settings.whatsapp}</span>
                <span className="text-[10px] text-emerald-600 font-semibold block truncate">তাৎক্ষণিক উত্তর</span>
              </div>
            </a>

            <a
              href={`mailto:${settings.email}`}
              className="p-3.5 sm:p-5 rounded-xl sm:rounded-2xl bg-slate-50 dark:bg-blue-950/40 border border-slate-200 dark:border-blue-900/40 flex items-center gap-3 sm:gap-4 hover:border-blue-400/50 transition group min-w-0"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-blue-500/15 text-blue-500 flex items-center justify-center shrink-0 group-hover:scale-110 transition">
                <Mail className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-xs text-slate-400 font-medium truncate">অফিশিয়াল ইমেইল</h4>
                <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white block mt-0.5 truncate">{settings.email}</span>
                <span className="text-[10px] text-slate-400 font-semibold block truncate">২৪ ঘণ্টার মধ্যে ফিডব্যাক</span>
              </div>
            </a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      {/* Floating Toast Notification Container */}
      <ToastContainer />

      {/* MODALS */}
      {/* 1. Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
      />

      {/* 2. Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onViewOrderDetails={handleViewOrderDetails}
      />

      {/* 3. Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onBuyNow={(p, qty) => handleBuyNow(p, qty)}
      />

      {/* 4. Customer Auth Modal */}
      <CustomerAuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

      {/* 5. Customer Account & Wallet Modal */}
      <CustomerAccountModal
        isOpen={isAccountOpen}
        onClose={() => setIsAccountOpen(false)}
        initialTab={accountTab}
        onViewInvoice={(ord) => setActiveInvoiceOrder(ord)}
      />

      {/* 6. Wishlist Modal */}
      <WishlistModal
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        onSelectProduct={(p) => setSelectedProduct(p)}
      />

      {/* 7. Admin Dashboard */}
      <AdminDashboard
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        onViewInvoice={(ord) => setActiveInvoiceOrder(ord)}
      />

      {/* 8. Order Invoice / Cash Memo Modal */}
      <OrderInvoiceModal
        order={activeInvoiceOrder}
        onClose={() => setActiveInvoiceOrder(null)}
      />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <MainStoreContent />
    </StoreProvider>
  );
}
