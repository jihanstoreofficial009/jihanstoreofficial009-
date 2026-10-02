import React from 'react';
import { Logo } from './Logo';
import { useStore } from '../context/StoreContext';
import { 
  Phone, 
  Mail, 
  MapPin, 
  ShieldCheck, 
  Truck, 
  Clock, 
  Facebook, 
  Youtube, 
  Smartphone,
  ExternalLink,
  Crown
} from 'lucide-react';

interface FooterProps {
  onOpenAdmin: () => void;
  onOpenAuth: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin, onOpenAuth }) => {
  const { settings, isAdmin, isDemoAdminMode, toggleDemoAdminMode } = useStore();

  return (
    <footer className="bg-[#07162E] text-slate-300 border-t border-amber-500/20 pt-12 pb-8 px-4 sm:px-6 transition-colors">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Col 1: About & Slogan */}
          <div className="space-y-4">
            <Logo size="md" showSlogan={true} />
            <p className="text-xs text-slate-400 leading-relaxed">
              জিহান স্টোর — সারা বাংলাদেশে নির্ভরযোগ্য ও আসল পণ্যের বিশ্বস্ত অনলাইন শপ। ঘড়ি, গ্যাজেটস, ফ্যাশন ও লাইফস্টাইল প্রডাক্ট দ্রুততম সময়ে আপনার দোরগোড়ায়।
            </p>
            <div className="flex items-center gap-3 pt-1">
              <span className="text-xs text-slate-400">সামাজিক যোগাযোগ:</span>
              <a
                href={settings.facebookUrl || 'https://facebook.com'}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-blue-900/60 flex items-center justify-center text-amber-400 hover:bg-amber-500 hover:text-slate-950 transition"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href={settings.youtubeUrl || 'https://youtube.com'}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-blue-900/60 flex items-center justify-center text-amber-400 hover:bg-amber-500 hover:text-slate-950 transition"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Customer Service */}
          <div className="space-y-3 text-xs">
            <h4 className="text-sm font-black text-white uppercase tracking-wider border-b border-blue-900/60 pb-2">
              গ্রাহক সেবা (Customer Care)
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>ক্যাশ অন ডেলিভারি (পণ্য দেখে মূল্য দিন)</li>
              <li>ঢাকার ভেতরে ২৪-৪৮ ঘণ্টায় ডেলিভারি</li>
              <li>ঢাকার বাইরে ৩-৫ দিনে ডেলিভারি</li>
              <li>৭ দিনের সহজ রিটার্ন ও পরিবর্তন গ্যারান্টি</li>
              <li>১০০% জেনুইন ও আসল প্রডাক্ট</li>
            </ul>
          </div>

          {/* Col 3: Contact & Address */}
          <div className="space-y-3 text-xs">
            <h4 className="text-sm font-black text-white uppercase tracking-wider border-b border-blue-900/60 pb-2">
              যোগাযোগের ঠিকানা
            </h4>
            <ul className="space-y-2.5 text-slate-400">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{settings.address}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <a href={`tel:${settings.phone}`} className="hover:text-amber-400 transition">
                  {settings.phone}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <a href={`mailto:${settings.email}`} className="hover:text-amber-400 transition">
                  {settings.email}
                </a>
              </li>
              <li className="flex items-center gap-2 text-amber-400/90 font-medium">
                <Clock className="w-4 h-4 shrink-0" />
                <span>২৪/৭ অনলাইন অর্ডার সুবিধা</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Payment Methods & Admin */}
          <div className="space-y-3 text-xs">
            <h4 className="text-sm font-black text-white uppercase tracking-wider border-b border-blue-900/60 pb-2">
              নিরাপদ পেমেন্ট পার্টনার
            </h4>
            <p className="text-slate-400">
              আমরা ক্যাশ অন ডেলিভারি এবং সকল নির্ভরযোগ্য মাধ্যমে পেমেন্ট গ্রহণ করি:
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="px-2.5 py-1 rounded-md bg-blue-950/80 border border-blue-800 text-[11px] font-bold text-slate-200">
                💵 Cash on Delivery
              </span>
              <span className="px-2.5 py-1 rounded-md bg-pink-950/40 border border-pink-700/60 text-[11px] font-bold text-pink-300">
                bKash
              </span>
              <span className="px-2.5 py-1 rounded-md bg-orange-950/40 border border-orange-700/60 text-[11px] font-bold text-orange-300">
                Nagad
              </span>
              <span className="px-2.5 py-1 rounded-md bg-purple-950/40 border border-purple-700/60 text-[11px] font-bold text-purple-300">
                Rocket
              </span>
              <span className="px-2.5 py-1 rounded-md bg-amber-950/40 border border-amber-600/60 text-[11px] font-bold text-amber-300">
                Jihan Wallet
              </span>
            </div>

            {/* Admin Portal Shortcut */}
            <div className="pt-3 border-t border-blue-900/60">
              <button
                onClick={isAdmin ? onOpenAdmin : onOpenAuth}
                className="text-[11px] font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1.5 transition"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{isAdmin ? 'অ্যাডমিন ড্যাশবোর্ড খুলুন' : 'এডমিন লগইন / প্যানেল'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-blue-900/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Jihan Store. সর্বস্বত্ব সংরক্ষিত। “বিশ্বাসের সাথে অনলাইন শপিং”</p>
          <div className="flex items-center gap-4">
            <span>banani, Dhaka, Bangladesh</span>
            <span>•</span>
            <button
              onClick={toggleDemoAdminMode}
              className="text-amber-500/80 hover:text-amber-400 font-medium"
            >
              {isDemoAdminMode ? 'Exit Admin Mode' : 'Toggle Demo Admin'}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
