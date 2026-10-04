import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Logo } from './Logo';
import { 
  Search, 
  ShoppingBag, 
  Heart, 
  User as UserIcon, 
  ShieldCheck, 
  Wallet, 
  Phone, 
  Truck, 
  Menu, 
  X,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface NavbarProps {
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenAuth: () => void;
  onOpenAccount: (tab?: 'orders' | 'wallet' | 'profile') => void;
  onOpenAdmin: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenCart,
  onOpenWishlist,
  onOpenAuth,
  onOpenAccount,
  onOpenAdmin,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory
}) => {
  const { 
    user, 
    userProfile, 
    isAdmin, 
    isDemoAdminMode, 
    toggleDemoAdminMode,
    cart, 
    wishlist, 
    cartSubtotal, 
    settings,
    categories 
  } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const totalCartItems = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#0B1E3F]/95 backdrop-blur-md border-b border-gray-100 dark:border-blue-900/50 shadow-sm transition-colors w-full max-w-full overflow-hidden">
      {/* Top Utility Announcement Bar */}
      <div className="bg-gradient-to-r from-[#07162E] via-[#0B1E3F] to-[#122B5C] text-white text-xs py-1.5 sm:py-2 px-3 sm:px-4 border-b border-amber-500/20 w-full overflow-hidden">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-3 overflow-hidden min-w-0 flex-1">
            <span className="flex items-center gap-1.5 text-amber-400 font-medium truncate text-[10px] sm:text-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 animate-pulse" />
              <span className="truncate">{settings.storeSlogan}</span>
            </span>
            <span className="hidden sm:inline-block text-gray-400">|</span>
            <span className="hidden md:inline-flex items-center gap-1 text-slate-200 truncate text-xs">
              <Truck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="truncate">{settings.announcement}</span>
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <a 
              href={`tel:${settings.phone}`} 
              className="hidden lg:flex items-center gap-1.5 text-gray-300 hover:text-amber-400 transition text-xs"
            >
              <Phone className="w-3 h-3 text-amber-400 shrink-0" />
              <span>{settings.phone}</span>
            </a>

            {/* Demo Admin Quick Toggle */}
            <button
              onClick={toggleDemoAdminMode}
              title="Toggle Admin features for testing and demo"
              className={`text-[10px] sm:text-[11px] px-2 sm:px-2.5 py-0.5 rounded-full font-medium transition flex items-center gap-1 border shrink-0 ${
                isDemoAdminMode 
                  ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold shadow-sm'
                  : 'bg-blue-900/60 text-amber-300 border-amber-500/30 hover:bg-blue-800'
              }`}
            >
              <ShieldCheck className="w-3 h-3 shrink-0" />
              <span>{isDemoAdminMode ? 'অ্যাডমিন' : 'Admin'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2 sm:py-3.5 flex items-center justify-between gap-2 sm:gap-6 w-full">
        {/* Brand Logo */}
        <div className="cursor-pointer shrink-0 min-w-0" onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}>
          <Logo size="md" />
        </div>

        {/* Search Bar - Desktop & Tablet */}
        <div className="hidden md:flex flex-1 max-w-xl relative">
          <div className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="পণ্য বা ব্র্যান্ড খুঁজুন (যেমন: ঘড়ি, পাঞ্জাবি, এয়ারবাডস)..."
              className="w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-blue-950/60 border border-slate-200 dark:border-blue-800/60 rounded-full text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition shadow-inner"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Right Actions (Wallet, Wishlist, Cart, User, Admin) */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Admin Panel Button (Desktop/Tablet) */}
          {isAdmin && (
            <button
              onClick={onOpenAdmin}
              className="relative hidden sm:flex px-2.5 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-xs font-bold shadow-md shadow-amber-500/20 hover:from-amber-400 hover:to-amber-500 transition items-center gap-1.5 shrink-0"
            >
              <ShieldCheck className="w-4 h-4" />
              <span className="hidden md:inline">অ্যাডমিন</span>
            </button>
          )}

          {/* Wallet Balance Badge (Desktop/Tablet) */}
          {user && (
            <button
              onClick={() => onOpenAccount('wallet')}
              className="hidden sm:flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-600/40 rounded-xl hover:bg-amber-100 dark:hover:bg-amber-900/40 transition group shrink-0"
              title="Jihan Wallet"
            >
              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400">
                <Wallet className="w-3.5 h-3.5" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[10px] text-amber-700 dark:text-amber-400/80 font-medium leading-none">ওয়ালেট</span>
                <span className="text-xs font-bold text-slate-900 dark:text-amber-300">
                  ৳{userProfile?.walletBalance ?? 0}
                </span>
              </div>
            </button>
          )}

          {/* Wishlist Button */}
          <button
            onClick={onOpenWishlist}
            className="relative p-2 sm:p-2.5 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-blue-900/50 transition shrink-0"
            title="Wishlist"
          >
            <Heart className="w-5 h-5" />
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-rose-500 text-white text-[10px] sm:text-[11px] font-bold rounded-full flex items-center justify-center shadow-sm">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Cart Button */}
          <button
            onClick={onOpenCart}
            className="flex items-center gap-1.5 p-2 sm:px-3 sm:py-2 rounded-xl bg-blue-50 dark:bg-blue-900/40 border border-blue-200 dark:border-blue-700/50 text-blue-950 dark:text-white hover:bg-blue-100 dark:hover:bg-blue-800/50 transition group shrink-0"
            title="Shopping Cart"
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5 text-amber-500 dark:text-amber-400" />
              {totalCartItems > 0 && (
                <span className="absolute -top-2 -right-2 w-4 h-4 sm:w-5 sm:h-5 bg-amber-500 text-slate-950 text-[10px] sm:text-[11px] font-black rounded-full flex items-center justify-center shadow-sm animate-pulse">
                  {totalCartItems}
                </span>
              )}
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 leading-none">ব্যাগ</span>
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                ৳{cartSubtotal}
              </span>
            </div>
          </button>

          {/* User Account / Auth */}
          {user ? (
            <button
              onClick={() => onOpenAccount('profile')}
              className="flex items-center gap-1.5 p-1 sm:px-3 sm:py-1.5 rounded-xl border border-slate-200 dark:border-blue-800/80 hover:bg-slate-100 dark:hover:bg-blue-900/40 transition shrink-0"
              title={user.displayName || user.email || 'My Account'}
            >
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-gradient-to-tr from-blue-700 to-amber-500 text-white flex items-center justify-center font-bold text-[11px] sm:text-xs uppercase shadow-sm">
                {user.displayName ? user.displayName.charAt(0) : 'U'}
              </div>
              <span className="hidden lg:inline text-xs font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[100px]">
                {user.displayName || user.email?.split('@')[0]}
              </span>
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#0B1E3F] text-white hover:bg-blue-950 dark:bg-white dark:text-[#0B1E3F] dark:hover:bg-amber-100 text-xs font-bold transition shadow-sm shrink-0"
            >
              <UserIcon className="w-4 h-4 text-amber-400 dark:text-amber-600" />
              <span>লগইন</span>
            </button>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 sm:p-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-blue-900/50 shrink-0"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="md:hidden px-3 sm:px-4 pb-2.5 sm:pb-3 w-full">
        <div className="relative w-full">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="পণ্য খুঁজুন (যেমন: ঘড়ি, পাঞ্জাবি)..."
            className="w-full pl-9 pr-8 py-2 bg-slate-50 dark:bg-blue-950/60 border border-slate-200 dark:border-blue-800 rounded-lg text-xs sm:text-sm text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-2.5 text-slate-400"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-[#07162E] border-b border-gray-200 dark:border-blue-900 px-3 sm:px-4 py-4 space-y-3 w-full max-w-full overflow-hidden animate-fadeIn">
          {/* Admin Fast Access in Mobile Menu */}
          {isAdmin && (
            <button
              onClick={() => { onOpenAdmin(); setMobileMenuOpen(false); }}
              className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-xs font-bold shadow-md flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                <span>অ্যাডমিন কন্ট্রোল প্যানেল</span>
              </span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            ক্যাটাগরি সমূহ
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => { setSelectedCategory('all'); setMobileMenuOpen(false); }}
              className={`p-2 text-left text-xs font-medium rounded-lg transition ${
                selectedCategory === 'all' 
                  ? 'bg-amber-500 text-slate-950 font-bold' 
                  : 'bg-slate-100 dark:bg-blue-950/80 text-slate-700 dark:text-slate-200'
              }`}
            >
              সব পণ্য (All)
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => { setSelectedCategory(cat.id); setMobileMenuOpen(false); }}
                className={`p-2 text-left text-xs font-medium rounded-lg transition truncate ${
                  selectedCategory === cat.id 
                    ? 'bg-amber-500 text-slate-950 font-bold' 
                    : 'bg-slate-100 dark:bg-blue-950/80 text-slate-700 dark:text-slate-200'
                }`}
              >
                {cat.nameBn || cat.name}
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-200 dark:border-blue-900 flex flex-col gap-2">
            {user ? (
              <>
                <button
                  onClick={() => { onOpenAccount('orders'); setMobileMenuOpen(false); }}
                  className="w-full py-2 px-3 text-left text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-blue-900/50 rounded-lg flex items-center justify-between"
                >
                  <span>আমার অর্ডার সমূহ (My Orders)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => { onOpenAccount('wallet'); setMobileMenuOpen(false); }}
                  className="w-full py-2 px-3 text-left text-xs font-medium text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30 rounded-lg flex items-center justify-between"
                >
                  <span>জিহান ওয়ালেট (৳{userProfile?.walletBalance ?? 0})</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => { onOpenAccount('profile'); setMobileMenuOpen(false); }}
                  className="w-full py-2 px-3 text-left text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-blue-900/50 rounded-lg flex items-center justify-between"
                >
                  <span>প্রোফাইল ও সেটিংস</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </>
            ) : (
              <button
                onClick={() => { onOpenAuth(); setMobileMenuOpen(false); }}
                className="w-full py-2.5 bg-amber-500 text-slate-950 font-bold rounded-lg text-xs text-center shadow-md cursor-pointer"
              >
                লগইন / একাউন্ট খুলুন
              </button>
            )}

            {/* Quick Call hotline in mobile menu */}
            <a
              href={`tel:${settings.phone}`}
              className="w-full py-2 px-3 text-center text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-amber-400 flex items-center justify-center gap-1.5"
            >
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span>সহায়তার জন্য কল: {settings.phone}</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
