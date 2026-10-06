import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Review } from '../../types/store';
import { 
  Star, 
  Check, 
  X, 
  Trash2, 
  Edit3, 
  Eye, 
  EyeOff, 
  Printer, 
  Filter, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Search,
  MessageSquare,
  ShieldCheck,
  User,
  ShoppingBag
} from 'lucide-react';

export const AdminReviewsManager: React.FC = () => {
  const { reviews, updateReviewStatus, editReview, deleteReview, addToast, settings } = useStore();

  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'hidden'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Edit Modal State
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [editRating, setEditRating] = useState<number>(5);
  const [editName, setEditName] = useState('');
  const [editComment, setEditComment] = useState('');
  const [editStatus, setEditStatus] = useState<'pending' | 'approved' | 'hidden'>('approved');
  const [isSaving, setIsSaving] = useState(false);

  const filteredReviews = reviews.filter(rev => {
    const matchesFilter = filter === 'all' || rev.status === filter;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || 
      rev.userName.toLowerCase().includes(q) || 
      rev.comment.toLowerCase().includes(q) ||
      (rev.productTitle && rev.productTitle.toLowerCase().includes(q));
    return matchesFilter && matchesSearch;
  });

  const pendingCount = reviews.filter(r => r.status === 'pending').length;
  const approvedCount = reviews.filter(r => r.status === 'approved').length;
  const hiddenCount = reviews.filter(r => r.status === 'hidden').length;

  const handleOpenEdit = (rev: Review) => {
    setEditingReview(rev);
    setEditRating(rev.rating);
    setEditName(rev.userName);
    setEditComment(rev.comment);
    setEditStatus(rev.status);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingReview) return;
    setIsSaving(true);
    try {
      await editReview({
        ...editingReview,
        userName: editName.trim(),
        rating: editRating,
        comment: editComment.trim(),
        status: editStatus,
        updatedAt: new Date().toISOString()
      });
      setEditingReview(null);
    } catch {
      // Handled in context
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`আপনি কি "${name}"-এর রিভিউটি স্থায়ীভাবে মুছে ফেলতে চান?`)) {
      await deleteReview(id);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-amber-500/10 via-slate-900 to-[#0B1E3F] border border-amber-500/20 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1 max-w-xl">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <Star className="w-4 h-4 fill-amber-400" />
            </div>
            <h2 className="text-lg sm:text-xl font-black text-white">
              গ্রাহক রিভিউ ও মূল্যায়ন ব্যবস্থাপনা (Reviews Manager)
            </h2>
          </div>
          <p className="text-xs text-slate-300">
            গ্রাহকদের জমা দেওয়া মতামত যাচাই (Approve), প্রকাশ (Publish), লুকানো (Hide) অথবা অনুপযুক্ত রিভিউ স্থায়ীভাবে মুছে (Delete) ফেলুন।
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="self-start md:self-center px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-2 border border-white/20 transition shrink-0"
        >
          <Printer className="w-4 h-4" />
          <span>রিপোর্ট প্রিন্ট করুন</span>
        </button>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              filter === 'all'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'bg-white dark:bg-blue-950/60 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-blue-900/60'
            }`}
          >
            সকল ({reviews.length})
          </button>

          <button
            onClick={() => setFilter('pending')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
              filter === 'pending'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'bg-white dark:bg-blue-950/60 text-amber-500 dark:text-amber-400 border border-slate-200 dark:border-blue-900/60'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>অপেক্ষমাণ ({pendingCount})</span>
          </button>

          <button
            onClick={() => setFilter('approved')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
              filter === 'approved'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'bg-white dark:bg-blue-950/60 text-emerald-600 dark:text-emerald-400 border border-slate-200 dark:border-blue-900/60'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>অনুমোদিত / প্রকাশিত ({approvedCount})</span>
          </button>

          <button
            onClick={() => setFilter('hidden')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
              filter === 'hidden'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'bg-white dark:bg-blue-950/60 text-slate-400 border border-slate-200 dark:border-blue-900/60'
            }`}
          >
            <EyeOff className="w-3.5 h-3.5" />
            <span>লুকানো ({hiddenCount})</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative max-w-xs w-full">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="গ্রাহকের নাম বা মন্তব্য খুঁজুন..."
            className="w-full pl-9 pr-3 py-2 bg-white dark:bg-blue-950/60 border border-slate-200 dark:border-blue-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Reviews List */}
      {filteredReviews.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-[#0B1E3F] border border-slate-200 dark:border-blue-900/60 space-y-2">
          <MessageSquare className="w-8 h-8 text-slate-400 mx-auto" />
          <p className="text-sm font-bold text-slate-700 dark:text-slate-300">কোনো রিভিউ পাওয়া যায়নি</p>
          <p className="text-xs text-slate-400">এই ফিল্টারে বর্তমানে কোনো গ্রাহকের রিভিউ জমা নেই।</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredReviews.map((rev) => {
            return (
              <div
                key={rev.id}
                className="p-5 rounded-3xl bg-white dark:bg-[#0B1E3F] border border-slate-200 dark:border-blue-900/60 shadow-sm flex flex-col justify-between space-y-4 hover:border-amber-400/40 transition"
              >
                <div className="space-y-3">
                  {/* Top user row */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {rev.photoUrl ? (
                        <img 
                          src={rev.photoUrl} 
                          alt={rev.userName} 
                          className="w-10 h-10 rounded-full object-cover border border-amber-400/30 shrink-0" 
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-amber-600 text-slate-950 font-bold text-xs flex items-center justify-center shrink-0 uppercase shadow-xs">
                          {rev.userName.slice(0, 2)}
                        </div>
                      )}
                      <div>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                          {rev.userName}
                        </h4>
                        <span className="text-[10px] text-slate-400 block">
                          {new Date(rev.createdAt).toLocaleString('bn-BD', { dateStyle: 'medium', timeStyle: 'short' })}
                        </span>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div>
                      {rev.status === 'approved' && (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 font-bold text-[10px] flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>অনুমোদিত</span>
                        </span>
                      )}
                      {rev.status === 'pending' && (
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-500 font-bold text-[10px] flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>অপেক্ষমাণ</span>
                        </span>
                      )}
                      {rev.status === 'hidden' && (
                        <span className="px-2.5 py-0.5 rounded-full bg-slate-500/10 border border-slate-500/30 text-slate-400 font-bold text-[10px] flex items-center gap-1">
                          <EyeOff className="w-3 h-3" />
                          <span>লুকানো</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Rating Stars */}
                  <div className="flex items-center gap-1 text-amber-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-4 h-4 ${s <= rev.rating ? 'fill-amber-400' : 'text-slate-300 dark:text-slate-700'}`}
                      />
                    ))}
                    <span className="ml-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
                      {rev.rating} / 5
                    </span>
                  </div>

                  {/* Product Tag if available */}
                  {rev.productTitle && (
                    <div className="text-[11px] text-blue-400 flex items-center gap-1.5 font-medium">
                      <ShoppingBag className="w-3 h-3 shrink-0" />
                      <span className="truncate">{rev.productTitle}</span>
                    </div>
                  )}

                  {/* Comment */}
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed italic bg-slate-50 dark:bg-blue-950/40 p-3 rounded-2xl border border-slate-200/60 dark:border-blue-900/40">
                    "{rev.comment}"
                  </p>
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-slate-100 dark:border-blue-900/50 flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    {rev.status !== 'approved' && (
                      <button
                        onClick={() => updateReviewStatus(rev.id, 'approved')}
                        className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 font-bold text-[11px] flex items-center gap-1 border border-emerald-500/30 transition"
                      >
                        <Check className="w-3 h-3" />
                        <span>অনুমোদন করুন</span>
                      </button>
                    )}

                    {rev.status === 'approved' && (
                      <button
                        onClick={() => updateReviewStatus(rev.id, 'hidden')}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-blue-950 hover:bg-slate-200 text-slate-400 font-bold text-[11px] flex items-center gap-1 border border-slate-300 dark:border-blue-800 transition"
                      >
                        <EyeOff className="w-3 h-3" />
                        <span>লুকান</span>
                      </button>
                    )}

                    {rev.status === 'hidden' && (
                      <button
                        onClick={() => updateReviewStatus(rev.id, 'approved')}
                        className="px-2.5 py-1 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 font-bold text-[11px] flex items-center gap-1 border border-sky-500/30 transition"
                      >
                        <Eye className="w-3 h-3" />
                        <span>পুনরায় প্রকাশ</span>
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(rev)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-amber-500 hover:bg-amber-500/10 transition"
                      title="রিভিউ সম্পাদনা করুন"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(rev.id, rev.userName)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 transition"
                      title="রিভিউ মুছে ফেলুন"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Review Modal */}
      {editingReview && (
        <div className="fixed inset-0 z-60 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 animate-fadeIn">
          <div className="w-full max-w-md bg-white dark:bg-[#0B1E3F] rounded-3xl p-6 border border-slate-200 dark:border-blue-900 space-y-4 max-h-[90vh] overflow-y-auto text-xs">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-amber-500" />
                <span>রিভিউ সম্পাদনা করুন</span>
              </h3>
              <button 
                onClick={() => setEditingReview(null)}
                className="w-7 h-7 rounded-full bg-slate-100 dark:bg-blue-950 text-slate-400 hover:text-white flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3.5">
              <div>
                <label className="font-bold block mb-1 text-slate-700 dark:text-slate-300">
                  গ্রাহকের নাম
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-blue-950/60 border border-slate-200 dark:border-blue-800 text-xs"
                />
              </div>

              <div>
                <label className="font-bold block mb-1 text-slate-700 dark:text-slate-300">
                  স্টার রেটিং (১ থেকে ৫)
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setEditRating(num)}
                      className={`p-2 rounded-xl border transition ${
                        editRating >= num 
                          ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold' 
                          : 'bg-slate-100 dark:bg-blue-950 border-slate-200 dark:border-blue-900 text-slate-400'
                      }`}
                    >
                      <Star className={`w-4 h-4 ${editRating >= num ? 'fill-slate-950' : ''}`} />
                    </button>
                  ))}
                  <span className="font-bold text-amber-400 ml-2">{editRating} Star</span>
                </div>
              </div>

              <div>
                <label className="font-bold block mb-1 text-slate-700 dark:text-slate-300">
                  গ্রাহকের মন্তব্য / রিভিউ
                </label>
                <textarea
                  rows={4}
                  required
                  value={editComment}
                  onChange={(e) => setEditComment(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-blue-950/60 border border-slate-200 dark:border-blue-800 text-xs"
                ></textarea>
              </div>

              <div>
                <label className="font-bold block mb-1 text-slate-700 dark:text-slate-300">
                  স্ট্যাটাস
                </label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-blue-950/60 border border-slate-200 dark:border-blue-800 text-xs"
                >
                  <option value="approved">✅ অনুমোদিত / প্রকাশিত (Approved)</option>
                  <option value="pending">⏳ অপেক্ষমাণ (Pending Review)</option>
                  <option value="hidden">👁️ লুকানো (Hidden)</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-blue-900 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingReview(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-blue-950 text-slate-700 dark:text-slate-300 font-bold text-xs"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition flex items-center gap-2"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{isSaving ? 'সংরক্ষণ হচ্ছে...' : 'পরিবর্তন সেভ করুন'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
