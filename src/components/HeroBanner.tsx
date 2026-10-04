import React from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  CreditCard, 
  ArrowRight,
  Flame,
  BadgePercent
} from 'lucide-react';

interface HeroBannerProps {
  onShopNow: () => void;
  onExploreOffers: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onShopNow, onExploreOffers }) => {
  return (
    <div className="space-y-4 sm:space-y-6 w-full max-w-full overflow-hidden">
      {/* Main Luxury Hero Section */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#07162E] via-[#0B1E3F] to-[#16366F] text-white p-4 sm:p-10 md:p-14 shadow-2xl border border-amber-500/20 w-full max-w-full">
        {/* Decorative Gold & Blue Glow Elements */}
        <div className="absolute -top-24 -right-24 w-72 sm:w-96 h-72 sm:h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-72 sm:w-96 h-72 sm:h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-5 text-left min-w-0">
            <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-xs sm:text-sm font-semibold tracking-wide backdrop-blur-md max-w-full">
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 animate-spin shrink-0" style={{ animationDuration: '6s' }} />
              <span className="truncate">জিহান স্টোর — বিশ্বাসের সাথে অনলাইন শপিং</span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight break-words">
              সেরা মানের পণ্য, <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500 bg-clip-text text-transparent">
                সবচেয়ে নির্ভরযোগ্য দামে!
              </span>
            </h1>

            <p className="text-xs sm:text-base text-slate-300 max-w-xl leading-relaxed">
              ঘড়ি, ফ্যাশন, গ্যাজেটস এবং লাইফস্টাইল কালেকশন। সমগ্র বাংলাদেশে ক্যাশ অন ডেলিভারি এবং দ্রুততম হোম ডেলিভারির নিশ্চয়তা।
            </p>

            {/* CTAs */}
            <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-2.5 sm:gap-3 pt-2 w-full">
              <button
                onClick={onShopNow}
                className="w-full xs:w-auto px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-amber-500/30 hover:from-amber-300 hover:to-amber-500 hover:scale-[1.02] active:scale-[0.98] transition flex items-center justify-center gap-2"
              >
                <span>কেনাকাটা শুরু করুন</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onExploreOffers}
                className="w-full xs:w-auto px-4 sm:px-5 py-3 sm:py-3.5 rounded-xl bg-blue-900/60 border border-amber-400/30 text-white font-semibold text-xs sm:text-sm hover:bg-blue-800/80 hover:border-amber-400/60 transition flex items-center justify-center gap-2"
              >
                <BadgePercent className="w-4 h-4 text-amber-400" />
                <span>ডিসকাউন্ট ভাউচার</span>
              </button>
            </div>

            {/* Promo Highlight Tags */}
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-4 pt-2 text-[11px] sm:text-xs text-slate-300">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0"></span>
                ক্যাশ অন ডেলিভারি (COD)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0"></span>
                ১৫০০+ অর্ডারে ফ্রি ডেলিভারি
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-400 shrink-0"></span>
                ১০০% আসল পণ্য
              </span>
            </div>
          </div>

          {/* Right Hero Showcase Cards */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-3 sm:gap-4 min-w-0 w-full">
            {/* Promo Card 1 */}
            <div className="group relative rounded-2xl overflow-hidden bg-gradient-to-b from-blue-900/40 to-[#07162E] border border-blue-700/30 p-3 sm:p-4 transition-all hover:border-amber-400/50 hover:shadow-xl min-w-0">
              <div className="absolute top-2 right-2 px-1.5 sm:px-2 py-0.5 rounded-md bg-rose-500 text-white text-[9px] sm:text-[10px] font-black uppercase flex items-center gap-1 z-10">
                <Flame className="w-3 h-3" />
                <span>HOT</span>
              </div>
              <img 
                src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80" 
                alt="Smart Watches" 
                className="w-full h-24 sm:h-32 object-cover rounded-xl mb-2 sm:mb-3 group-hover:scale-105 transition duration-300"
              />
              <span className="text-[10px] sm:text-[11px] text-amber-400 font-semibold block truncate">স্মার্ট গ্যাজেটস</span>
              <h4 className="text-xs font-bold text-white truncate">AMOLED স্মার্টওয়াচ</h4>
              <span className="text-xs font-extrabold text-amber-300 mt-0.5 sm:mt-1 block">৳২,৮৫০</span>
            </div>

            {/* Promo Card 2 */}
            <div className="group relative rounded-2xl overflow-hidden bg-gradient-to-b from-blue-900/40 to-[#07162E] border border-blue-700/30 p-3 sm:p-4 transition-all hover:border-amber-400/50 hover:shadow-xl min-w-0">
              <div className="absolute top-2 right-2 px-1.5 sm:px-2 py-0.5 rounded-md bg-amber-500 text-slate-950 text-[9px] sm:text-[10px] font-black uppercase z-10">
                NEW
              </div>
              <img 
                src="https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=600&auto=format&fit=crop&q=80" 
                alt="Luxury Fragrance" 
                className="w-full h-24 sm:h-32 object-cover rounded-xl mb-2 sm:mb-3 group-hover:scale-105 transition duration-300"
              />
              <span className="text-[10px] sm:text-[11px] text-amber-400 font-semibold block truncate">বিউটি ও পারফিউম</span>
              <h4 className="text-xs font-bold text-white truncate">ফ্রেঞ্চ আম্বার ও ওউদ</h4>
              <span className="text-xs font-extrabold text-amber-300 mt-0.5 sm:mt-1 block">৳২,৯৯০</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Trust Value Badges */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4 w-full">
        <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white dark:bg-[#0B1E3F]/80 border border-slate-200 dark:border-blue-900/60 shadow-sm flex items-center gap-2.5 sm:gap-3.5 hover:border-amber-400/40 transition min-w-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-500/15 flex items-center justify-center text-amber-500 shrink-0">
            <Truck className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">সারা দেশে ডেলিভারি</h4>
            <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 truncate">দ্রুততম পৌঁছানো</p>
          </div>
        </div>

        <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white dark:bg-[#0B1E3F]/80 border border-slate-200 dark:border-blue-900/60 shadow-sm flex items-center gap-2.5 sm:gap-3.5 hover:border-amber-400/40 transition min-w-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-500/15 flex items-center justify-center text-amber-500 shrink-0">
            <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">১০০% আসল পণ্য</h4>
            <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 truncate">কোয়ালিটি চেক ও নিশ্চয়তা</p>
          </div>
        </div>

        <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white dark:bg-[#0B1E3F]/80 border border-slate-200 dark:border-blue-900/60 shadow-sm flex items-center gap-2.5 sm:gap-3.5 hover:border-amber-400/40 transition min-w-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-500/15 flex items-center justify-center text-amber-500 shrink-0">
            <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">সহজ পেমেন্ট</h4>
            <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 truncate">COD, বিকাশ ও ওয়ালেট</p>
          </div>
        </div>

        <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white dark:bg-[#0B1E3F]/80 border border-slate-200 dark:border-blue-900/60 shadow-sm flex items-center gap-2.5 sm:gap-3.5 hover:border-amber-400/40 transition min-w-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-500/15 flex items-center justify-center text-amber-500 shrink-0">
            <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">৭ দিনের রিটার্ন</h4>
            <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 truncate">সহজ বদল ও রিফান্ড</p>
          </div>
        </div>
      </div>
    </div>
  );
};
