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
  Instagram,
  Smartphone,
  ExternalLink,
  MessageCircle,
  Twitter,
  Linkedin
} from 'lucide-react';

interface FooterProps {
  onOpenAdmin: () => void;
  onOpenAuth: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin, onOpenAuth }) => {
  const { settings, isAdmin, isDemoAdminMode, toggleDemoAdminMode } = useStore();

  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'facebook': return <Facebook className="w-4 h-4" />;
      case 'youtube': return <Youtube className="w-4 h-4" />;
      case 'instagram': return <Instagram className="w-4 h-4" />;
      case 'whatsapp': return <MessageCircle className="w-4 h-4" />;
      case 'twitter': return <Twitter className="w-4 h-4" />;
      case 'linkedin': return <Linkedin className="w-4 h-4" />;
      default: return <ExternalLink className="w-4 h-4" />;
    }
  };

  const activeAddresses = settings.addresses?.filter(a => a.isEnabled) || [];
  const activePhones = settings.phones?.filter(p => p.isEnabled) || [];
  const activeWhatsapps = settings.whatsapps?.filter(w => w.isEnabled) || [];
  const activeEmails = settings.emails?.filter(e => e.isEnabled) || [];
  const activeSocialLinks = settings.socialLinks?.filter(s => s.isEnabled) || [];

  return (
    <footer className="bg-[#07162E] text-slate-300 border-t border-amber-500/20 pt-12 pb-8 px-4 sm:px-6 transition-colors">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Col 1: About & Dynamic Slogan */}
          <div className="space-y-4">
            <Logo size="md" showSlogan={true} />
            <p className="text-xs text-slate-400 leading-relaxed">
              {settings.storeNameBn || settings.storeName} — সারা বাংলাদেশে নির্ভরযোগ্য ও আসল পণ্যের বিশ্বস্ত অনলাইন শপ। ফ্যাশন, গ্যাজেটস ও লাইফস্টাইল প্রডাক্ট দ্রুততম সময়ে আপনার দোরগোড়ায়।
            </p>
            
            {/* Dynamic Social Links */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] text-slate-400 block font-semibold">সোশ্যাল মিডিয়ায় যুক্ত থাকুন:</span>
              <div className="flex flex-wrap items-center gap-2">
                {activeSocialLinks.length > 0 ? (
                  activeSocialLinks.map((soc) => (
                    <a
                      key={soc.id}
                      href={soc.url}
                      target="_blank"
                      rel="noreferrer"
                      title={soc.title}
                      className="w-8 h-8 rounded-full bg-blue-900/60 flex items-center justify-center text-amber-400 hover:bg-amber-500 hover:text-slate-950 transition"
                    >
                      {getSocialIcon(soc.platform)}
                    </a>
                  ))
                ) : (
                  <>
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
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Col 2: Customer Service */}
          <div className="space-y-3 text-xs">
            <h4 className="text-sm font-black text-white uppercase tracking-wider border-b border-blue-900/60 pb-2">
              গ্রাহক সেবা (Customer Care)
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>ক্যাশ অন ডেলিভারি (পণ্য দেখে মূল্য দিন)</li>
              <li>ঢাকার ভেতরে ২৪-৪৮ ঘণ্টায় ডেলিভারি (৳{settings.insideDhakaDelivery})</li>
              <li>ঢাকার বাইরে ৩-৫ দিনে ডেলিভারি (৳{settings.outsideDhakaDelivery})</li>
              <li>৳{settings.freeDeliveryThreshold} এর বেশি অর্ডারে ফ্রি ডেলিভারি</li>
              <li>৭ দিনের সহজ রিটার্ন ও পরিবর্তন সুবিধা</li>
              <li>১০০% জেনুইন ও আসল প্রডাক্টের নিশ্চয়তা</li>
            </ul>
          </div>

          {/* Col 3: Dynamic Addresses & Multi-Contacts */}
          <div className="space-y-3 text-xs">
            <h4 className="text-sm font-black text-white uppercase tracking-wider border-b border-blue-900/60 pb-2">
              অফিস ও যোগাযোগের ঠিকানা
            </h4>
            <ul className="space-y-2.5 text-slate-400">
              {/* Addresses */}
              {activeAddresses.length > 0 ? (
                activeAddresses.map((addr) => (
                  <li key={addr.id} className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-200 block text-[11px]">
                        {addr.title} {addr.isDefault && <span className="text-amber-400 text-[10px] font-semibold">(মেইন হাব)</span>}
                      </span>
                      <span>{addr.address}, {addr.city}</span>
                    </div>
                  </li>
                ))
              ) : (
                <li className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>{settings.address}</span>
                </li>
              )}

              {/* Phones */}
              {activePhones.length > 0 ? (
                activePhones.map((ph) => (
                  <li key={ph.id} className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-400 block">{ph.title}:</span>
                      <a href={`tel:${ph.number}`} className="hover:text-amber-400 font-bold transition text-slate-200">
                        {ph.number}
                      </a>
                    </div>
                  </li>
                ))
              ) : (
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                  <a href={`tel:${settings.phone}`} className="hover:text-amber-400 font-bold transition text-slate-200">
                    {settings.phone}
                  </a>
                </li>
              )}

              {/* WhatsApp */}
              {activeWhatsapps.length > 0 ? (
                activeWhatsapps.map((wa) => (
                  <li key={wa.id} className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-400 block">{wa.title}:</span>
                      <a
                        href={`https://wa.me/${wa.number.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-emerald-400 hover:underline font-bold"
                      >
                        {wa.number}
                      </a>
                    </div>
                  </li>
                ))
              ) : (
                <li className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <a
                    href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-400 hover:underline font-bold"
                  >
                    {settings.whatsapp}
                  </a>
                </li>
              )}

              {/* Emails */}
              {activeEmails.length > 0 ? (
                activeEmails.map((em) => (
                  <li key={em.id} className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                    <a href={`mailto:${em.email}`} className="hover:text-amber-400 transition truncate max-w-[200px]">
                      {em.email}
                    </a>
                  </li>
                ))
              ) : (
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                  <a href={`mailto:${settings.email}`} className="hover:text-amber-400 transition truncate max-w-[200px]">
                    {settings.email}
                  </a>
                </li>
              )}
            </ul>
          </div>

          {/* Col 4: Payment Methods & Admin Access */}
          <div className="space-y-3 text-xs">
            <h4 className="text-sm font-black text-white uppercase tracking-wider border-b border-blue-900/60 pb-2">
              নিরাপদ পেমেন্ট পার্টনার
            </h4>
            <p className="text-slate-400">
              আমরা ক্যাশ অন ডেলিভারি এবং সকল বিশ্বস্ত মাধ্যমে পেমেন্ট গ্রহণ করি:
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="px-2.5 py-1 rounded-md bg-blue-950/80 border border-blue-800 text-[11px] font-bold text-slate-200">
                💵 Cash on Delivery
              </span>
              <span className="px-2.5 py-1 rounded-md bg-pink-950/40 border border-pink-700/60 text-[11px] font-bold text-pink-300">
                bKash: {settings.bkashNumber ? settings.bkashNumber.split(' ')[0] : '01800123456'}
              </span>
              <span className="px-2.5 py-1 rounded-md bg-orange-950/40 border border-orange-700/60 text-[11px] font-bold text-orange-300">
                Nagad: {settings.nagadNumber ? settings.nagadNumber.split(' ')[0] : '01800123456'}
              </span>
              <span className="px-2.5 py-1 rounded-md bg-purple-950/40 border border-purple-700/60 text-[11px] font-bold text-purple-300">
                Jihan Wallet
              </span>
            </div>

            <div className="pt-4 border-t border-blue-900/50 flex flex-col gap-2">
              <button
                onClick={onOpenAdmin}
                className="w-full py-2 rounded-xl bg-gradient-to-r from-amber-500/20 to-amber-600/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500 hover:text-slate-950 font-bold transition flex items-center justify-center gap-1.5"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>অ্যাডমিন কন্ট্রোল প্যানেল</span>
              </button>

              <button
                onClick={toggleDemoAdminMode}
                className="text-[10px] text-slate-500 hover:text-amber-400 text-center transition"
              >
                {isDemoAdminMode ? 'এডমিন ডেমো মোড সক্রিয় (বন্ধ করুন)' : 'এডমিন ডেমো মোড চালু করুন'}
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Guarantee Badges */}
        <div className="pt-8 border-t border-blue-900/60 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} {settings.storeName}. সর্বস্বত্ব সংরক্ষিত। {settings.storeSlogan}</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>গোপনীয়তা নীতি (Privacy)</span>
            <span>•</span>
            <span>শর্তাবলী (Terms)</span>
            <span>•</span>
            <span>রিটার্ন ও রিফান্ড পলিসি</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
