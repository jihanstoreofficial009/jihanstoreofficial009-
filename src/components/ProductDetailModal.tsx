import React, { useState } from 'react';
import { Product } from '../types/store';
import { useStore } from '../context/StoreContext';
import { AdBanner } from './AdBanner';
import { 
  X, 
  Star, 
  ShoppingBag, 
  Heart, 
  Zap, 
  Truck, 
  ShieldCheck, 
  RotateCcw,
  CheckCircle2,
  Plus,
  Minus,
  MessageSquare
} from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onBuyNow: (product: Product, quantity: number) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onBuyNow
}) => {
  const { addToCart, toggleWishlist, isWishlisted, reviews, addReview, user } = useStore();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  if (!product) return null;

  const currentPrice = product.discountPrice ?? product.price;
  const wishlisted = isWishlisted(product.id);
  const activeImage = selectedImage || product.image;
  const allImages = product.images && product.images.length > 0 ? product.images : [product.image];

  const productReviews = reviews.filter(r => r.productId === product.id && r.status === 'approved');

  const handleAddToCart = () => {
    addToCart(product, quantity);
    onClose();
  };

  const handleBuyNow = () => {
    onBuyNow(product, quantity);
    onClose();
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;
    setIsSubmittingReview(true);
    await addReview({
      productId: product.id,
      rating: reviewRating,
      comment: reviewComment.trim()
    });
    setReviewComment('');
    setIsSubmittingReview(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-white dark:bg-[#0B1E3F] rounded-3xl shadow-2xl border border-slate-200 dark:border-blue-900/80 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-slate-100 dark:bg-blue-950/80 text-slate-700 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white flex items-center justify-center transition shadow-md"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-4 sm:p-6 md:p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-start">
            {/* Left: Images */}
            <div className="md:col-span-6 space-y-3">
              <div className="relative w-full aspect-square rounded-2xl bg-slate-100 dark:bg-blue-950/50 overflow-hidden border border-slate-200 dark:border-blue-900/50">
                <img
                  src={activeImage}
                  alt={product.title}
                  className="w-full h-full object-cover object-center"
                />
                {product.badge && (
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-amber-500 text-slate-950 text-xs font-black uppercase tracking-wider shadow">
                    {product.badge}
                  </span>
                )}
              </div>

              {/* Thumbnails */}
              {allImages.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {allImages.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(img)}
                      className={`w-16 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition ${
                        activeImage === img ? 'border-amber-500 scale-95' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Info & Actions */}
            <div className="md:col-span-6 space-y-5 text-left">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-900 dark:text-blue-300 text-xs font-semibold uppercase tracking-wider">
                    {product.category}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    SKU: {product.sku || 'JS-' + product.id}
                  </span>
                </div>

                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-snug">
                  {product.titleBn || product.title}
                </h1>
                {product.titleBn && (
                  <p className="text-xs text-slate-400 mt-1">
                    {product.title}
                  </p>
                )}

                {/* Rating */}
                <div className="flex items-center gap-2 mt-2.5">
                  <div className="flex items-center text-amber-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-4 h-4 ${s <= Math.round(product.rating) ? 'fill-amber-400' : 'text-slate-300 dark:text-slate-600'}`}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {product.rating.toFixed(1)}
                  </span>
                  <span className="text-xs text-slate-400">
                    ({product.reviewsCount} টি রিভিউ)
                  </span>
                </div>
              </div>

              {/* Price & Stock */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-blue-950/60 border border-slate-200 dark:border-blue-900/60 space-y-1">
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-amber-400">
                    ৳{currentPrice.toLocaleString()}
                  </span>
                  {product.discountPrice && (
                    <span className="text-base text-slate-400 line-through">
                      ৳{product.price.toLocaleString()}
                    </span>
                  )}
                  {product.discountPrice && (
                    <span className="px-2 py-0.5 rounded-md bg-rose-500 text-white text-xs font-bold">
                      -{Math.round(((product.price - product.discountPrice) / product.price) * 100)}% ছাড়
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 pt-1 text-xs">
                  <span className={`font-bold ${product.stock > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500'}`}>
                    {product.stock > 0 ? `ইন স্টক (${product.stock} টি পণ্য মজুদ আছে)` : 'স্টক শেষ'}
                  </span>
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  পরিমাণ (Quantity):
                </span>
                <div className="flex items-center border border-slate-300 dark:border-blue-800 rounded-xl bg-white dark:bg-blue-950 overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-blue-900 disabled:opacity-30"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 text-sm font-bold text-slate-900 dark:text-white">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                    className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-blue-900 disabled:opacity-30"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Buttons */}
              <div className="space-y-2.5 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <button
                    onClick={handleAddToCart}
                    disabled={product.stock <= 0}
                    className="w-full py-3 px-4 rounded-xl bg-blue-100 dark:bg-blue-900/60 border border-blue-300 dark:border-blue-700 text-blue-950 dark:text-white font-bold text-sm hover:bg-blue-200 dark:hover:bg-blue-800/60 transition flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4 text-amber-500" />
                    <span>কার্টে যোগ করুন</span>
                  </button>

                  <button
                    onClick={handleBuyNow}
                    disabled={product.stock <= 0}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 font-bold text-sm shadow-md shadow-amber-500/20 hover:from-amber-300 hover:to-amber-500 transition flex items-center justify-center gap-2"
                  >
                    <Zap className="w-4 h-4 fill-slate-950" />
                    <span>এখনই অর্ডার করুন</span>
                  </button>
                </div>

                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`w-full py-2.5 rounded-xl border text-xs font-semibold transition flex items-center justify-center gap-2 ${
                    wishlisted
                      ? 'border-rose-300 bg-rose-50 text-rose-600 dark:bg-rose-950/30 dark:border-rose-800 dark:text-rose-400'
                      : 'border-slate-200 dark:border-blue-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-blue-900/40'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${wishlisted ? 'fill-rose-500' : ''}`} />
                  <span>{wishlisted ? 'উইশলিস্ট থেকে সরান' : 'পছন্দের তালিকায় রাখুন (Wishlist)'}</span>
                </button>
              </div>

              {/* Delivery Assurance */}
              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-200 dark:border-blue-900/60 text-center">
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-blue-950/40">
                  <Truck className="w-4 h-4 mx-auto text-amber-500 mb-1" />
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">ক্যাশ অন ডেলিভারি</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-blue-950/40">
                  <ShieldCheck className="w-4 h-4 mx-auto text-amber-500 mb-1" />
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">১০০% আসল পণ্য</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-blue-950/40">
                  <RotateCcw className="w-4 h-4 mx-auto text-amber-500 mb-1" />
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">৭ দিনের রিটার্ন</span>
                </div>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-blue-900/60">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              পণ্যের বিবরণ ও বৈশিষ্ট্য
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
          </div>

          {/* Ad Placement: Product Page Banner */}
          <AdBanner placement="product_page" compact={true} />

          {/* Customer Reviews Section */}
          <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-blue-900/60">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-amber-500" />
                <span>গ্রাহক রিভিউ ও মতামত ({productReviews.length})</span>
              </h3>
            </div>

            {/* Submit Review */}
            <form onSubmit={handleSubmitReview} className="p-4 rounded-2xl bg-slate-50 dark:bg-blue-950/40 border border-slate-200 dark:border-blue-900/50 space-y-3">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                আপনার মতামত দিন:
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">রেটিং:</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setReviewRating(num)}
                      className="p-0.5 text-amber-400 hover:scale-125 transition"
                    >
                      <Star className={`w-4 h-4 ${num <= reviewRating ? 'fill-amber-400' : 'text-slate-300'}`} />
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="পণ্যটি সম্পর্কে আপনার বাস্তব অভিজ্ঞতা লিখুন..."
                rows={2}
                className="w-full p-2.5 text-xs rounded-xl bg-white dark:bg-blue-900/40 border border-slate-200 dark:border-blue-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />

              <button
                type="submit"
                disabled={isSubmittingReview || !reviewComment.trim()}
                className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold hover:bg-amber-400 disabled:opacity-50 transition"
              >
                {isSubmittingReview ? 'জমা হচ্ছে...' : 'রিভিউ জমা দিন'}
              </button>
            </form>

            {/* List Reviews */}
            <div className="space-y-3">
              {productReviews.length === 0 ? (
                <p className="text-xs text-slate-400 italic">
                  এখনও কোনো রিভিউ যুক্ত হয়নি। আপনিই প্রথম রিভিউ দিন!
                </p>
              ) : (
                productReviews.map((rev) => (
                  <div key={rev.id} className="p-3.5 rounded-xl bg-white dark:bg-blue-950/30 border border-slate-100 dark:border-blue-900/40 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          {rev.userName}
                        </span>
                        {rev.isVerifiedPurchase && (
                          <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                            <CheckCircle2 className="w-3 h-3" />
                            যাচাইকৃত ক্রেতা
                          </span>
                        )}
                      </div>
                      <div className="flex items-center text-amber-400">
                        {[1, 2, 3, 4, 5].map(s => (
                          <Star key={s} className={`w-3 h-3 ${s <= rev.rating ? 'fill-amber-400' : 'text-slate-300'}`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {rev.comment}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
