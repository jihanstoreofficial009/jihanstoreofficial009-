import React from 'react';
import { Crown, Sparkles } from 'lucide-react';

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
  const iconSize = size === 'sm' ? 'w-8 h-8' : size === 'lg' ? 'w-12 h-12' : 'w-10 h-10';
  const titleSize = size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-2xl md:text-3xl' : 'text-xl md:text-2xl';
  const sloganSize = size === 'sm' ? 'text-[10px]' : size === 'lg' ? 'text-xs' : 'text-[11px]';

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Royal Gold Emblem */}
      <div className={`relative ${iconSize} rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 p-0.5 shadow-lg shadow-amber-900/20 shrink-0 flex items-center justify-center`}>
        <div className="w-full h-full bg-[#0B1E3F] rounded-[10px] flex items-center justify-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/20 to-transparent"></div>
          <Crown className="w-5 h-5 text-amber-400 drop-shadow-[0_2px_4px_rgba(212,175,55,0.4)]" />
          <Sparkles className="w-2.5 h-2.5 text-amber-300 absolute top-1 right-1 animate-pulse" />
        </div>
      </div>

      {/* Brand Text */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className={`font-black tracking-tight ${titleSize} bg-gradient-to-r from-blue-900 via-blue-800 to-blue-950 bg-clip-text text-transparent dark:from-white dark:via-blue-100 dark:to-amber-200`}>
            JIHAN
          </span>
          <span className={`font-black tracking-tight ${titleSize} bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-600 bg-clip-text text-transparent`}>
            STORE
          </span>
        </div>
        {showSlogan && (
          <span className={`font-medium tracking-wide text-amber-600 dark:text-amber-400/90 ${sloganSize}`}>
            “বিশ্বাসের সাথে অনলাইন শপিং”
          </span>
        )}
      </div>
    </div>
  );
};
