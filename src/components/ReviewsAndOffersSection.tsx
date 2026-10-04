import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  Star, 
  CheckCircle2, 
  MessageSquare, 
  Tag, 
  Copy, 
  Check, 
  HelpCircle, 
  ChevronDown,
  Sparkles
} from 'lucide-react';

export const ReviewsAndOffersSection: React.FC = () => {
  const { reviews, coupons, applyCoupon, addToast } = useStore();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleCopyCoupon = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    applyCoupon(code);
    setTimeout(() => setCopiedCode(null), 3000);
  };

  const faqs = [
    {
      q: 'ক্যাশ অন ডেলিভারি (Cash on Delivery) সুবিধা আছে কি?',
      a: 'হ্যাঁ! সমগ্র বাংলাদেশে ক্যাশ অন ডেলিভারি সুবিধা রয়েছে। পণ্য হাতে পেয়ে সম্পূর্ণ দেখে মূল্য পরিশোধ করতে পারবেন।'
    },
    {
      q: 'ডেলিভারি পেতে কতদিন সময় লাগে?',
      a: 'ঢাকার ভেতরে সাধারণত ২৪ থেকে ৪৮ ঘণ্টার মধ্যে এবং ঢাকার বাইরে ৩ থেকে ৫ কার্যদিবসের মধ্যে ডেলিভারি সম্পন্ন হয়।'
    },
    {
      q: 'পণ্য পছন্দ না হলে বা ত্রুটি থাকলে পরিবর্তনের নিয়ম কী?',
      a: 'পণ্য পাওয়ার পর কোনো ত্রুটি দেখা দিলে ৭ দিনের মধ্যে আমাদের কাস্টমার কেয়ারে কল বা হোয়াটসঅ্যাপ করে সহজে রিটার্ন অথবা পরিবর্তন করতে পারবেন।'
    },
    {
      q: 'জিহান ওয়ালেট (Jihan Wallet) কীভাবে ব্যবহার করব?',
      a: 'আপনি বিকাশ বা নগদের মাধ্যমে আপনার ওয়ালেটে টাকা জমা (Deposit) রাখতে পারেন এবং চেকআউটের সময় কোনো ঝামেলা ছাড়াই ১-ক্লিকে তাৎক্ষণিক পেমেন্ট করতে পারেন।'
    }
  ];

  return (
    <div className="space-y-8 sm:space-y-12 py-4 sm:py-6 w-full max-w-full overflow-hidden">
      {/* Active Coupons Banner */}
      <div className="rounded-2xl sm:rounded-3xl bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 text-slate-950 p-4 sm:p-8 shadow-xl max-w-full overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-between gap-5 sm:gap-6">
          <div className="space-y-2 text-center md:text-left min-w-0">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950 text-amber-300 text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>ডিসকাউন্ট ভাউচার ও প্রমোশন</span>
            </div>
            <h3 className="text-xl sm:text-3xl font-black text-slate-950 leading-tight">
              অর্ডারে অতিরিক্ত ছাড় পেতে কুপন কোড ব্যবহার করুন!
            </h3>
            <p className="text-xs sm:text-sm font-semibold text-slate-900/80">
              ক্লিক করে কোড কপি করুন এবং চেকআউটে স্বয়ংক্রিয়ভাবে ডিসকাউন্ট উপভোগ করুন।
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5 sm:gap-3 justify-center w-full md:w-auto">
            {coupons.map((c) => (
              <button
                key={c.code}
                onClick={() => handleCopyCoupon(c.code)}
                className="group relative p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-white/95 backdrop-blur-md border-2 border-dashed border-amber-800/40 hover:border-slate-950 transition flex items-center justify-between gap-2.5 sm:gap-3 shadow-md hover:scale-105 active:scale-95 w-full sm:w-auto max-w-full min-w-0"
              >
                <div className="text-left min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span className="font-mono font-black text-sm tracking-wider text-slate-900 truncate">
                      {c.code}
                    </span>
                  </div>
                  <span className="text-[10px] sm:text-[11px] font-bold text-emerald-700 block mt-0.5 truncate">
                    {c.discountType === 'percentage' ? `${c.discountValue}% ছাড়` : `৳${c.discountValue} ছাড়`} (মিনিমাম ৳{c.minOrder})
                  </span>
                </div>

                <div className="w-7 h-7 rounded-lg bg-amber-100 group-hover:bg-amber-500 group-hover:text-slate-950 flex items-center justify-center transition shrink-0">
                  {copiedCode === c.code ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-slate-700" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <div className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-1.5">
          <span className="text-xs font-bold text-amber-500 uppercase tracking-widest block">
            গ্রাহক পর্যালোচনা
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            আমাদের সন্তুষ্ট গ্রাহকদের মতামত
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            জিহান স্টোরের সততা, গুণমান ও দ্রুত সেবার বাস্তব অভিজ্ঞতা
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {reviews.slice(0, 3).map((rev) => (
            <div
              key={rev.id}
              className="p-5 rounded-3xl bg-white dark:bg-[#0B1E3F]/80 border border-slate-200 dark:border-blue-900/60 shadow-sm flex flex-col justify-between space-y-4 hover:border-amber-400/50 transition"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-amber-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-4 h-4 ${s <= rev.rating ? 'fill-amber-400' : 'text-slate-300'}`}
                      />
                    ))}
                  </div>
                  {rev.isVerifiedPurchase && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3" />
                      যাচাইকৃত ক্রেতা
                    </span>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed italic">
                  “{rev.comment}”
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-blue-900/50 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-700 to-amber-500 text-white flex items-center justify-center font-bold text-xs uppercase shadow-xs">
                  {rev.userName.charAt(0)}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    {rev.userName}
                  </h4>
                  <span className="text-[10px] text-slate-400 block">
                    {new Date(rev.createdAt).toLocaleDateString('bn-BD', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="space-y-4 max-w-3xl mx-auto">
        <div className="text-center space-y-1">
          <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center justify-center gap-2">
            <HelpCircle className="w-5 h-5 text-amber-500" />
            <span>সচরাচর জিজ্ঞাসিত প্রশ্নাবলী (FAQ)</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            অর্ডার, ডেলিভারি ও পেমেন্ট সংক্রান্ত জরুরি তথ্য
          </p>
        </div>

        <div className="space-y-2">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 dark:border-blue-900/60 bg-white dark:bg-[#0B1E3F]/60 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between text-xs sm:text-sm font-bold text-slate-900 dark:text-white hover:text-amber-500 transition"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180 text-amber-500' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-blue-900/40 pt-2">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
