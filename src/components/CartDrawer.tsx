import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { AdBanner } from './AdBanner';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  Tag, 
  Truck, 
  Check, 
  Percent 
} from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  onProceedToCheckout
}) => {
  const {
    cart,
    removeFromCart,
    updateCartQuantity,
    cartSubtotal,
    deliveryFee,
    discountAmount,
    cartTotal,
    selectedDeliveryArea,
    setSelectedDeliveryArea,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    settings
  } = useStore();

  const [couponInput, setCouponInput] = useState('');

  if (!isOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const ok = applyCoupon(couponInput);
    if (ok) setCouponInput('');
  };

  const amountNeededForFreeDelivery = Math.max(0, settings.freeDeliveryThreshold - cartSubtotal);
  const freeDeliveryProgress = Math.min(100, Math.round((cartSubtotal / settings.freeDeliveryThreshold) * 100));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-xs flex justify-end animate-fadeIn">
      <div className="w-full max-w-md bg-white dark:bg-[#0B1E3F] h-full shadow-2xl flex flex-col border-l border-slate-200 dark:border-blue-900">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-blue-900/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-amber-500" />
            <h2 className="font-black text-base text-slate-900 dark:text-white">
              আপনার শপিং ব্যাগ ({cart.length})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Delivery Bar */}
        <div className="px-5 py-3 bg-amber-50 dark:bg-amber-950/30 border-b border-amber-200/50 dark:border-amber-900/30 text-xs">
          <div className="flex items-center justify-between text-amber-800 dark:text-amber-300 font-semibold mb-1">
            <span className="flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5" />
              {amountNeededForFreeDelivery === 0 ? (
                <span className="text-emerald-600 dark:text-emerald-400">অভিনন্দন! আপনি ফ্রি ডেলিভারি পাচ্ছেন!</span>
              ) : (
                <span>আর মাত্র ৳{amountNeededForFreeDelivery} অর্ডারে ফ্রি ডেলিভারি!</span>
              )}
            </span>
            <span>{freeDeliveryProgress}%</span>
          </div>
          <div className="w-full h-1.5 bg-amber-200/60 dark:bg-amber-900/60 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-500 rounded-full transition-all duration-500"
              style={{ width: `${freeDeliveryProgress}%` }}
            ></div>
          </div>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-blue-950/60 flex items-center justify-center text-slate-400">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  আপনার ব্যাগ বর্তমানে খালি
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  পছন্দের পণ্য ব্যাগে যুক্ত করুন এবং অর্ডার সম্পন্ন করুন।
                </p>
              </div>
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold hover:bg-amber-400 transition"
              >
                কেনাকাটা শুরু করুন
              </button>
            </div>
          ) : (
            cart.map((item) => {
              const itemPrice = item.product.discountPrice ?? item.product.price;
              return (
                <div
                  key={item.product.id}
                  className="flex gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-blue-950/40 border border-slate-200 dark:border-blue-900/40 items-center"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.title}
                    className="w-16 h-16 rounded-xl object-cover shrink-0 bg-white"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {item.product.titleBn || item.product.title}
                    </h4>
                    <span className="text-xs font-black text-amber-500 block mt-0.5">
                      ৳{itemPrice.toLocaleString()}
                    </span>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center border border-slate-300 dark:border-blue-800 rounded-lg bg-white dark:bg-blue-950 overflow-hidden">
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                          className="p-1 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-blue-900"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 text-xs font-bold text-slate-900 dark:text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                          className="p-1 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-blue-900"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-500 rounded transition"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Summary & Checkout */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-blue-900/60 bg-white dark:bg-[#07162E] space-y-4">
            {/* Delivery Area Picker */}
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                ডেলিভারি এলাকা নির্বাচন করুন:
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedDeliveryArea('inside')}
                  className={`p-2 rounded-xl border text-xs font-semibold text-center transition ${
                    selectedDeliveryArea === 'inside'
                      ? 'border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400'
                      : 'border-slate-200 dark:border-blue-900 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  ঢাকার ভেতরে (৳{settings.insideDhakaDelivery})
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedDeliveryArea('outside')}
                  className={`p-2 rounded-xl border text-xs font-semibold text-center transition ${
                    selectedDeliveryArea === 'outside'
                      ? 'border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400'
                      : 'border-slate-200 dark:border-blue-900 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  ঢাকার বাইরে (৳{settings.outsideDhakaDelivery})
                </button>
              </div>
            </div>

            {/* Coupon Box */}
            <div>
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300 font-bold">
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span>কুপন “{appliedCoupon.code}” সক্রিয়</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-xs text-rose-500 font-bold hover:underline"
                  >
                    মুছে ফেলুন
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="কুপন কোড (যেমন: JIHAN50)..."
                      className="w-full pl-8 pr-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-blue-950/60 border border-slate-200 dark:border-blue-800 text-slate-900 dark:text-white uppercase"
                    />
                    <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  </div>
                  <button
                    type="submit"
                    className="px-3 py-2 rounded-xl bg-slate-900 dark:bg-blue-900 text-white text-xs font-bold hover:bg-slate-800 transition"
                  >
                    প্রয়োগ
                  </button>
                </form>
              )}
            </div>

            {/* Pricing Breakdown */}
            <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex justify-between">
                <span>পণ্য মূল্য (Subtotal):</span>
                <span className="font-bold text-slate-900 dark:text-white">৳{cartSubtotal.toLocaleString()}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                  <span>ডিসকাউন্ট (Discount):</span>
                  <span>-৳{discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>ডেলিভারি চার্জ:</span>
                <span className="font-bold">
                  {deliveryFee === 0 ? (
                    <span className="text-emerald-600 dark:text-emerald-400">ফ্রি (Free)</span>
                  ) : (
                    `৳${deliveryFee}`
                  )}
                </span>
              </div>
              <div className="pt-2 border-t border-slate-200 dark:border-blue-900/60 flex justify-between text-sm font-black text-slate-900 dark:text-white">
                <span>সর্বমোট (Total):</span>
                <span className="text-base text-amber-500">৳{cartTotal.toLocaleString()}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={() => {
                onClose();
                onProceedToCheckout();
              }}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 font-black text-sm shadow-lg shadow-amber-500/25 hover:from-amber-300 hover:to-amber-500 transition flex items-center justify-center gap-2"
            >
              <span>চেকআউট ও অর্ডার কনফার্ম করুন</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Ad Placement: Cart Drawer Banner */}
            <AdBanner placement="cart_drawer" compact={true} className="mt-2" />
          </div>
        )}
      </div>
    </div>
  );
};
