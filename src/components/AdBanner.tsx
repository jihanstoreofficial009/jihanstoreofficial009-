import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { AdPlacement, Advertisement } from '../types/store';
import { ExternalLink, Sparkles, ChevronLeft, ChevronRight, Volume2, Play } from 'lucide-react';

interface AdBannerProps {
  placement: AdPlacement;
  className?: string;
  compact?: boolean;
}

export const AdBanner: React.FC<AdBannerProps> = ({
  placement,
  className = '',
  compact = false
}) => {
  const { ads, recordAdClick, recordAdView } = useStore();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Filter ads for this placement that are active and within date bounds
  const activeAds = ads.filter((ad) => {
    if (!ad.isActive) return false;
    if (ad.placement !== placement) return false;

    const now = new Date().toISOString().slice(0, 10);
    if (ad.startDate && ad.startDate > now) return false;
    if (ad.endDate && ad.endDate < now) return false;

    return true;
  }).sort((a, b) => a.displayOrder - b.displayOrder);

  const currentAd: Advertisement | undefined = activeAds[currentIndex];

  // Auto rotate if multiple ads in same spot
  useEffect(() => {
    if (activeAds.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeAds.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [activeAds.length]);

  // Record impression view once when currentAd changes
  useEffect(() => {
    if (currentAd?.id) {
      recordAdView(currentAd.id);
    }
  }, [currentAd?.id]);

  if (!currentAd) return null;

  const handleClick = () => {
    recordAdClick(currentAd.id);
    if (currentAd.destinationUrl && currentAd.destinationUrl !== '#') {
      window.open(currentAd.destinationUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const isVideo = Boolean(
    currentAd.videoUrl && 
    (currentAd.videoUrl.endsWith('.mp4') || currentAd.videoUrl.includes('youtube.com') || currentAd.videoUrl.includes('youtu.be'))
  );

  return (
    <div
      className={`relative overflow-hidden rounded-2xl md:rounded-3xl border border-amber-500/30 bg-gradient-to-r from-[#0B1E3F] via-[#0F2752] to-[#122B5C] text-white shadow-xl transition-all duration-300 hover:border-amber-400/60 ${className}`}
    >
      {/* Background Graphic or Media */}
      <div className="absolute inset-0 z-0">
        {isVideo && currentAd.videoUrl?.endsWith('.mp4') ? (
          <video
            src={currentAd.videoUrl}
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover opacity-25"
          />
        ) : currentAd.image ? (
          <img
            src={currentAd.image}
            alt={currentAd.title}
            className="w-full h-full object-cover opacity-25 filter blur-[1px] transform scale-105 hover:scale-110 transition-transform duration-1000"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-r from-[#07162E]/95 via-[#0B1E3F]/85 to-[#07162E]/70" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 p-4 sm:p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left: Advertiser badge & texts */}
        <div className="flex-1 space-y-2.5 text-center md:text-left">
          {/* Top badges */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 text-[10px] font-black uppercase tracking-wider">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>বিজ্ঞাপন / Sponsored</span>
            </span>

            {currentAd.advertiserName && (
              <span className="text-[11px] font-bold text-slate-300">
                বিজ্ঞাপনদাতা: <span className="text-amber-400 font-extrabold">{currentAd.advertiserName}</span>
              </span>
            )}
          </div>

          {/* Ad Titles */}
          <div className="space-y-1">
            <h3 className="text-lg sm:text-xl md:text-2xl font-black text-white tracking-tight drop-shadow-sm">
              {currentAd.titleBn || currentAd.title}
            </h3>
            {currentAd.titleBn && currentAd.title !== currentAd.titleBn && (
              <p className="text-xs sm:text-sm text-amber-300/90 font-medium">
                {currentAd.title}
              </p>
            )}
          </div>

          {/* Description */}
          {currentAd.description && (
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              {currentAd.description}
            </p>
          )}
        </div>

        {/* Right / Center: Image Thumbnail or Video Preview + CTA Button */}
        <div className="shrink-0 flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto justify-center">
          {/* Ad Image preview (if compact is false) */}
          {!compact && currentAd.image && (
            <div 
              onClick={handleClick}
              className="relative w-36 h-24 sm:w-44 sm:h-28 rounded-2xl overflow-hidden border border-amber-400/30 shadow-lg cursor-pointer group shrink-0 hidden sm:block"
            >
              <img
                src={currentAd.image}
                alt={currentAd.title}
                className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
              />
              <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-transparent transition" />
            </div>
          )}

          {/* Call to Action Button */}
          <button
            onClick={handleClick}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-amber-900/30 hover:from-amber-300 hover:to-yellow-400 transition-all transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{currentAd.buttonText || 'অফার দেখুন'}</span>
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Multiple Ads Carousel Controls */}
      {activeAds.length > 1 && (
        <div className="relative z-10 px-4 pb-3 flex items-center justify-between border-t border-blue-900/40 pt-2 text-[10px] text-slate-400">
          <div className="flex items-center gap-1.5">
            {activeAds.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-1.5 rounded-full transition-all ${
                  idx === currentIndex ? 'w-5 bg-amber-400' : 'w-2 bg-slate-600 hover:bg-slate-400'
                }`}
                title={`Go to ad ${idx + 1}`}
              />
            ))}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentIndex((prev) => (prev - 1 + activeAds.length) % activeAds.length)}
              className="p-1 rounded-full hover:bg-blue-900/60 text-slate-300"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span>{currentIndex + 1} / {activeAds.length}</span>
            <button
              onClick={() => setCurrentIndex((prev) => (prev + 1) % activeAds.length)}
              className="p-1 rounded-full hover:bg-blue-900/60 text-slate-300"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
