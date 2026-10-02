import React from 'react';
import { Crown, Sparkles, Gem, Diamond } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface LogoProps {
  className?: string;
  showSlogan?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Logo: React.FC<LogoProps> = ({ 
  className = '', 
  showSlogan = true, 
  size = 'md' 
}) => {
  const { activeLogo, settings } = useStore();

  const iconSize = size === 'sm' ? 'w-8 h-8' : size === 'lg' ? 'w-12 h-12' : 'w-10 h-10';
  const titleSize = size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-2xl md:text-3xl' : 'text-xl md:text-2xl';
  const sloganSize = size === 'sm' ? 'text-[10px]' : size === 'lg' ? 'text-xs' : 'text-[11px]';

  const storeName = settings.storeName || 'Jihan Store';
  const slogan = settings.storeSloganBn || settings.storeSlogan || 'বিশ্বাসের সাথে অনলাইন শপিং';

  // Words split for dual tone (e.g. JIHAN in navy/white and STORE in gold)
  const words = storeName.split(' ');
  const firstWord = words[0] || 'JIHAN';
  const restWords = words.slice(1).join(' ') || 'STORE';

  return (
    <div className={`flex items-center gap-2.5 sm:gap-3 select-none ${className}`}>
      {/* Dynamic Emblem / Logo Icon */}
      {activeLogo?.type === 'custom' && activeLogo.url ? (
        <div className={`relative ${iconSize} rounded-xl overflow-hidden border border-amber-500/40 p-0.5 shadow-md shrink-0 bg-white dark:bg-[#0B1E3F]`}>
          <img 
            src={activeLogo.url} 
            alt={storeName} 
            className="w-full h-full object-contain rounded-[10px]"
          />
        </div>
      ) : activeLogo?.type === 'minimal' ? (
        <div className={`relative ${iconSize} rounded-xl bg-gradient-to-tr from-amber-400 to-yellow-500 p-0.5 shadow-lg shadow-amber-900/20 shrink-0 flex items-center justify-center`}>
          <div className="w-full h-full bg-[#0B1E3F] rounded-[10px] flex items-center justify-center relative overflow-hidden group">
            <Gem className="w-5 h-5 text-amber-400 drop-shadow-[0_2px_4px_rgba(212,175,55,0.4)]" />
            <Sparkles className="w-2.5 h-2.5 text-amber-300 absolute top-1 right-1 animate-pulse" />
          </div>
        </div>
      ) : activeLogo?.type === 'monogram' ? (
        <div className={`relative ${iconSize} rounded-xl bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 p-0.5 shadow-lg shadow-amber-900/20 shrink-0 flex items-center justify-center`}>
          <div className="w-full h-full bg-[#07162E] rounded-[10px] flex items-center justify-center relative overflow-hidden">
            <span className="font-black text-amber-400 text-xs sm:text-sm tracking-tighter drop-shadow-sm">
              JS
            </span>
            <Diamond className="w-2.5 h-2.5 text-amber-300 absolute top-1 right-1 opacity-70" />
          </div>
        </div>
      ) : (
        /* Default: Royal Crown Crest */
        <div className={`relative ${iconSize} rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 p-0.5 shadow-lg shadow-amber-900/20 shrink-0 flex items-center justify-center`}>
          <div className="w-full h-full bg-[#0B1E3F] rounded-[10px] flex items-center justify-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/20 to-transparent"></div>
            <Crown className="w-5 h-5 text-amber-400 drop-shadow-[0_2px_4px_rgba(212,175,55,0.4)]" />
            <Sparkles className="w-2.5 h-2.5 text-amber-300 absolute top-1 right-1 animate-pulse" />
          </div>
        </div>
      )}

      {/* Brand Text */}
      <div className="flex flex-col text-left">
        <div className="flex items-center gap-1.5 leading-none">
          <span className={`font-black tracking-tight ${titleSize} bg-gradient-to-r from-blue-900 via-blue-800 to-blue-950 bg-clip-text text-transparent dark:from-white dark:via-blue-100 dark:to-amber-200 uppercase`}>
            {firstWord}
          </span>
          <span className={`font-black tracking-tight ${titleSize} bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-600 bg-clip-text text-transparent uppercase`}>
            {restWords}
          </span>
        </div>
        {showSlogan && (
          <span className={`font-medium tracking-wide text-amber-600 dark:text-amber-400/90 ${sloganSize} mt-0.5`}>
            “{slogan}”
          </span>
        )}
      </div>
    </div>
  );
};
