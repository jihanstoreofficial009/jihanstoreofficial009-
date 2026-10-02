import React from 'react';
import { Product } from '../types/store';
import { useStore } from '../context/StoreContext';
import { Heart, ShoppingBag, Star, Zap } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onBuyNow: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect, onBuyNow }) => {
  const { addToCart, toggleWishlist, isWishlisted } = useStore();
  const wishlisted = isWishlisted(product.id);

  const discountPercent = product.discountPrice 
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100) 
    : 0;

  const currentPrice = product.discountPrice ?? product.price;

  return (
    <div className="group relative rounded-2xl bg-white dark:bg-[#0B1E3F]/80 border border-slate-200 dark:border-blue-900/60 overflow-hidden shadow-sm hover:shadow-xl hover:border-amber-400/50 transition-all duration-300 flex flex-col">
      {/* Top Badges & Wishlist Button */}
      <div className="relative w-full aspect-square bg-slate-100 dark:bg-blue-950/40 overflow-hidden cursor-pointer" onClick={() => onSelect(product)}>
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Promo Badge */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start">
          {product.badge && (
            <span className="px-2 py-0.5 rounded-md bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow-sm">
              {product.badge}
            </span>
          )}
          {discountPercent > 0 && (
            <span className="px-2 py-0.5 rounded-md bg-rose-600 text-white text-[10px] font-black tracking-wider shadow-sm">
              -{discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition shadow-md ${
            wishlisted
              ? 'bg-rose-500 text-white'
              : 'bg-white/80 dark:bg-blue-950/80 text-slate-600 dark:text-slate-300 hover:text-rose-500'
          }`}
          title={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-4 h-4 ${wishlisted ? 'fill-white' : ''}`} />
        </button>

        {/* Stock warning */}
        {product.stock <= 5 && product.stock > 0 && (
          <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-amber-500/90 text-slate-950 text-[10px] font-bold">
            মাত্র {product.stock}টি বাকি!
          </div>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center">
            <span className="px-3 py-1 bg-rose-600 text-white text-xs font-black uppercase rounded-lg">
              স্টক শেষ (Out of Stock)
            </span>
          </div>
        )}
      </div>

      {/* Card Info */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1.5 cursor-pointer" onClick={() => onSelect(product)}>
          {/* Rating */}
          <div className="flex items-center gap-1.5 text-xs text-amber-500">
            <div className="flex items-center">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="ml-1 font-bold text-slate-700 dark:text-slate-300">
                {product.rating.toFixed(1)}
              </span>
            </div>
            <span className="text-[11px] text-slate-400">
              ({product.reviewsCount})
            </span>
          </div>

          {/* Title */}
          <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-amber-500 transition">
            {product.titleBn || product.title}
          </h3>
          {product.titleBn && (
            <p className="text-[11px] text-slate-400 truncate">
              {product.title}
            </p>
          )}
        </div>

        {/* Pricing & CTA */}
        <div className="pt-2 border-t border-slate-100 dark:border-blue-900/60 space-y-3">
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-base sm:text-lg font-black text-slate-900 dark:text-amber-400">
                ৳{currentPrice.toLocaleString()}
              </span>
              {product.discountPrice && (
                <span className="text-xs text-slate-400 line-through">
                  ৳{product.price.toLocaleString()}
                </span>
              )}
            </div>

            <span className={`text-[10px] font-semibold ${product.stock > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500'}`}>
              {product.stock > 0 ? 'স্টকে আছে' : 'স্টক শেষ'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => addToCart(product, 1)}
              disabled={product.stock <= 0}
              className="w-full py-2 px-2 rounded-xl bg-blue-50 dark:bg-blue-900/40 border border-blue-200 dark:border-blue-700/60 text-blue-950 dark:text-white text-xs font-bold hover:bg-blue-100 dark:hover:bg-blue-800/50 disabled:opacity-50 transition flex items-center justify-center gap-1.5"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-amber-500" />
              <span>কার্ট</span>
            </button>

            <button
              onClick={() => onBuyNow(product)}
              disabled={product.stock <= 0}
              className="w-full py-2 px-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-xs font-bold shadow-sm hover:from-amber-400 hover:to-amber-500 disabled:opacity-50 transition flex items-center justify-center gap-1"
            >
              <Zap className="w-3.5 h-3.5 fill-slate-950" />
              <span>কিনুন</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
