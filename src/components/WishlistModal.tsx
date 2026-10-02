import React from 'react';
import { useStore } from '../context/StoreContext';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { Product } from '../types/store';

interface WishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
}

export const WishlistModal: React.FC<WishlistModalProps> = ({
  isOpen,
  onClose,
  onSelectProduct
}) => {
  const { wishlist, products, toggleWishlist, addToCart } = useStore();

  if (!isOpen) return null;

  const wishlistedProducts = products.filter(p => wishlist.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white dark:bg-[#0B1E3F] rounded-3xl shadow-2xl border border-slate-200 dark:border-blue-900 overflow-hidden my-auto max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-blue-900/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              পছন্দের তালিকা (Wishlist) ({wishlistedProducts.length})
            </h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-4 sm:p-5 space-y-3 flex-1">
          {wishlistedProducts.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-blue-950/50 flex items-center justify-center text-slate-400 mx-auto">
                <Heart className="w-8 h-8" />
              </div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                উইশলিস্ট খালি
              </h3>
              <p className="text-xs text-slate-400">
                পছন্দের পণ্যের ওপর হার্ট আইকন ক্লিক করে উইশলিস্টে যুক্ত করুন।
              </p>
            </div>
          ) : (
            wishlistedProducts.map(p => (
              <div
                key={p.id}
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-blue-950/40 border border-slate-200 dark:border-blue-900/50 text-xs"
              >
                <div
                  className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
                  onClick={() => {
                    onClose();
                    onSelectProduct(p);
                  }}
                >
                  <img src={p.image} alt={p.title} className="w-12 h-12 rounded-xl object-cover bg-white shrink-0" />
                  <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-slate-900 dark:text-white truncate">
                      {p.titleBn || p.title}
                    </h4>
                    <span className="text-amber-500 font-bold block mt-0.5">
                      ৳{(p.discountPrice ?? p.price).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 ml-3">
                  <button
                    onClick={() => {
                      addToCart(p, 1);
                      toggleWishlist(p.id);
                    }}
                    className="p-2 rounded-xl bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 transition"
                    title="Move to cart"
                  >
                    <ShoppingBag className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => toggleWishlist(p.id)}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
                    title="Remove"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
