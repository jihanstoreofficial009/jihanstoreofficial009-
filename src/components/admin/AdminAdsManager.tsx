import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Advertisement, AdPlacement } from '../../types/store';
import { 
  Megaphone, 
  Plus, 
  Trash2, 
  Edit3, 
  ExternalLink, 
  Eye, 
  MousePointerClick, 
  TrendingUp, 
  Play, 
  Pause, 
  ArrowUp, 
  ArrowDown, 
  X, 
  Upload, 
  FileImage, 
  Video, 
  Sparkles,
  Calendar,
  Building2,
  CheckCircle2
} from 'lucide-react';

const PLACEMENT_LABELS: Record<AdPlacement, { label: string; labelBn: string; color: string }> = {
  home_top: { label: 'Home Top (Hero Sub-Banner)', labelBn: 'হোম টপ (হিরোর নিচে)', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
  home_middle: { label: 'Home Middle (Categories & Products)', labelBn: 'হোম মিডল (ক্যাটাগরি ও পণ্যের মাঝে)', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  home_bottom: { label: 'Home Bottom (Before Footer)', labelBn: 'হোম বটম (কন্টাক্ট সেকশনের উপরে)', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
  category_page: { label: 'Category Page Banner', labelBn: 'ক্যাটাগরি সেকশন / পেজ', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
  product_page: { label: 'Product Detail Modal / Page', labelBn: 'পণ্য বিস্তারিত পেইজ', color: 'bg-rose-500/20 text-rose-400 border-rose-500/30' },
  cart_drawer: { label: 'Cart Drawer Slide-over', labelBn: 'শপিং কার্ট ড্রয়ার', color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' }
};

export const AdminAdsManager: React.FC = () => {
  const { 
    ads, 
    saveAd, 
    deleteAd, 
    toggleAdStatus, 
    addToast 
  } = useStore();

  const [selectedPlacement, setSelectedPlacement] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingAd, setEditingAd] = useState<Partial<Advertisement> | null>(null);

  // Overall Stats
  const totalViews = ads.reduce((sum, a) => sum + (a.views || 0), 0);
  const totalClicks = ads.reduce((sum, a) => sum + (a.clicks || 0), 0);
  const averageCtr = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : '0.0';
  const activeCount = ads.filter(a => a.isActive).length;

  // Filtered Ads
  const filteredAds = ads.filter(a => {
    if (selectedPlacement === 'all') return true;
    return a.placement === selectedPlacement;
  }).sort((a, b) => (a.displayOrder || 1) - (b.displayOrder || 1));

  // Local File Upload for Ad Image
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      addToast('অনুগ্রহ করে একটি ছবি ফাইল আপলোড করুন', 'error');
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      addToast('ছবির সাইজ ৩MB এর কম হতে হবে', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result && editingAd) {
        setEditingAd({
          ...editingAd,
          image: result
        });
        addToast('বিজ্ঞাপন ব্যানার ছবি লোড হয়েছে!', 'success');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAd || !editingAd.title) {
      addToast('বিজ্ঞাপনের শিরোনাম দিন', 'error');
      return;
    }

    await saveAd(editingAd);
    setShowModal(false);
    setEditingAd(null);
  };

  const handleReorder = async (ad: Advertisement, direction: 'up' | 'down') => {
    const currentOrder = ad.displayOrder || 1;
    const newOrder = direction === 'up' ? Math.max(1, currentOrder - 1) : currentOrder + 1;
    await saveAd({ ...ad, displayOrder: newOrder });
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-blue-900/60">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black">
              <Megaphone className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white">
              অ্যাডভান্সড অ্যাড ম্যানেজার (বিজ্ঞাপন ও প্রচার সেল)
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            নিজের স্টোরের পাশাপাশি স্যামসাং, অ্যাপেক্স বা যেকোনো থার্ড-পার্টি ব্র্যান্ডের বিজ্ঞাপন ওয়েবসাইট জুড়ে পরিচালনা করুন
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingAd({
              title: '',
              titleBn: '',
              description: '',
              advertiserName: 'Jihan Store Official',
              image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200',
              videoUrl: '',
              destinationUrl: 'https://',
              buttonText: 'অফার দেখুন',
              placement: 'home_top',
              displayOrder: ads.length + 1,
              isActive: true,
              startDate: new Date().toISOString().slice(0, 10),
              endDate: ''
            });
            setShowModal(true);
          }}
          className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition flex items-center gap-2 shadow-md shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন বিজ্ঞাপন তৈরি করুন</span>
        </button>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3.5 rounded-2xl bg-white dark:bg-blue-950/40 border border-slate-200 dark:border-blue-900/60 shadow-xs space-y-1">
          <span className="text-slate-400 font-bold block">মোট বিজ্ঞাপন</span>
          <div className="text-2xl font-black text-slate-900 dark:text-white">{ads.length} টি</div>
          <span className="text-[10px] text-emerald-500 font-semibold">{activeCount} টি সক্রিয় (Live)</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-white dark:bg-blue-950/40 border border-slate-200 dark:border-blue-900/60 shadow-xs space-y-1">
          <span className="text-slate-400 font-bold flex items-center gap-1">
            <Eye className="w-3.5 h-3.5 text-blue-400" />
            <span>মোট ভিউ (Views)</span>
          </span>
          <div className="text-2xl font-black text-blue-400">{totalViews.toLocaleString()}</div>
          <span className="text-[10px] text-slate-400">ইম্প্রেশন সংখ্যা</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-white dark:bg-blue-950/40 border border-slate-200 dark:border-blue-900/60 shadow-xs space-y-1">
          <span className="text-slate-400 font-bold flex items-center gap-1">
            <MousePointerClick className="w-3.5 h-3.5 text-amber-400" />
            <span>মোট ক্লিক (Clicks)</span>
          </span>
          <div className="text-2xl font-black text-amber-400">{totalClicks.toLocaleString()}</div>
          <span className="text-[10px] text-slate-400">বিজ্ঞাপনে ক্লিক সংখ্যা</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-white dark:bg-blue-950/40 border border-slate-200 dark:border-blue-900/60 shadow-xs space-y-1">
          <span className="text-slate-400 font-bold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <span>ক্লিক রেট (CTR)</span>
          </span>
          <div className="text-2xl font-black text-emerald-400">{averageCtr}%</div>
          <span className="text-[10px] text-slate-400">এভারেজ এনগেজমেন্ট</span>
        </div>
      </div>

      {/* Placement Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        <button
          type="button"
          onClick={() => setSelectedPlacement('all')}
          className={`px-3 py-1.5 rounded-xl font-bold transition shrink-0 ${
            selectedPlacement === 'all'
              ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
              : 'bg-slate-100 dark:bg-blue-950/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
          }`}
        >
          সব বিজ্ঞাপন ({ads.length})
        </button>

        {(Object.keys(PLACEMENT_LABELS) as AdPlacement[]).map((p) => {
          const count = ads.filter(a => a.placement === p).length;
          return (
            <button
              key={p}
              type="button"
              onClick={() => setSelectedPlacement(p)}
              className={`px-3 py-1.5 rounded-xl font-bold transition shrink-0 flex items-center gap-1.5 ${
                selectedPlacement === p
                  ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                  : 'bg-slate-100 dark:bg-blue-950/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              <span>{PLACEMENT_LABELS[p].labelBn}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-800/20 dark:bg-blue-900/60 font-mono">
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Ads List Cards */}
      <div className="space-y-3">
        {filteredAds.length === 0 ? (
          <div className="text-center py-12 rounded-2xl border border-dashed border-slate-300 dark:border-blue-900/60 space-y-3">
            <Megaphone className="w-10 h-10 text-slate-400 mx-auto" />
            <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">
              এই অবস্থানে কোনো বিজ্ঞাপন নেই
            </h4>
            <p className="text-xs text-slate-400">
              উপরের “নতুন বিজ্ঞাপন তৈরি করুন” বাটনে ক্লিক করে বিজ্ঞাপন যুক্ত করুন।
            </p>
          </div>
        ) : (
          filteredAds.map((ad) => {
            const placementInfo = PLACEMENT_LABELS[ad.placement] || PLACEMENT_LABELS.home_top;
            const ctr = (ad.views || 0) > 0 ? (((ad.clicks || 0) / (ad.views || 1)) * 100).toFixed(1) : '0.0';

            return (
              <div
                key={ad.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                  ad.isActive 
                    ? 'bg-white dark:bg-blue-950/40 border-slate-200 dark:border-blue-900/60' 
                    : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-70'
                }`}
              >
                {/* Left: Thumbnail & Main info */}
                <div className="flex items-start sm:items-center gap-3.5 flex-1 min-w-0">
                  {/* Media Thumbnail */}
                  <div className="relative w-20 h-16 sm:w-24 sm:h-18 rounded-xl overflow-hidden bg-slate-100 dark:bg-blue-900/50 border border-slate-200 dark:border-blue-800 shrink-0">
                    {ad.image ? (
                      <img src={ad.image} alt={ad.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <FileImage className="w-6 h-6" />
                      </div>
                    )}
                    {ad.videoUrl && (
                      <div className="absolute top-1 right-1 p-0.5 rounded bg-black/70 text-amber-400">
                        <Video className="w-3 h-3" />
                      </div>
                    )}
                  </div>

                  {/* Title & Advertiser attribution */}
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md border ${placementInfo.color}`}>
                        {placementInfo.labelBn}
                      </span>
                      <span className="text-[10px] font-bold text-amber-500 flex items-center gap-1">
                        <Building2 className="w-3 h-3" />
                        <span>বিজ্ঞাপনদাতা: {ad.advertiserName}</span>
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        ক্রম: #{ad.displayOrder}
                      </span>
                    </div>

                    <h4 className="font-black text-sm text-slate-900 dark:text-white truncate">
                      {ad.titleBn || ad.title}
                    </h4>

                    {ad.description && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                        {ad.description}
                      </p>
                    )}

                    <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-0.5">
                      <a 
                        href={ad.destinationUrl} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="text-blue-500 hover:underline flex items-center gap-1 font-mono truncate max-w-[200px]"
                      >
                        <ExternalLink className="w-3 h-3 shrink-0" />
                        <span>{ad.destinationUrl}</span>
                      </a>
                      {ad.endDate && (
                        <span className="flex items-center gap-1 text-slate-400">
                          <Calendar className="w-3 h-3" />
                          <span>মেয়াদ: {ad.endDate}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Metrics & Action Buttons */}
                <div className="flex flex-wrap items-center justify-between sm:justify-end gap-3 w-full md:w-auto pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-blue-900/50">
                  {/* Views & Clicks */}
                  <div className="flex items-center gap-3 text-xs bg-slate-50 dark:bg-blue-900/30 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-blue-800">
                    <div className="text-center">
                      <span className="text-[10px] text-slate-400 block">ভিউ</span>
                      <span className="font-black text-blue-400">{(ad.views || 0).toLocaleString()}</span>
                    </div>
                    <div className="w-px h-6 bg-slate-200 dark:bg-blue-800" />
                    <div className="text-center">
                      <span className="text-[10px] text-slate-400 block">ক্লিক</span>
                      <span className="font-black text-amber-400">{(ad.clicks || 0).toLocaleString()}</span>
                    </div>
                    <div className="w-px h-6 bg-slate-200 dark:bg-blue-800" />
                    <div className="text-center">
                      <span className="text-[10px] text-slate-400 block">CTR</span>
                      <span className="font-black text-emerald-400">{ctr}%</span>
                    </div>
                  </div>

                  {/* Priority Reordering */}
                  <div className="flex items-center gap-0.5 bg-slate-100 dark:bg-blue-900/40 rounded-xl p-0.5 border border-slate-200 dark:border-blue-800">
                    <button
                      type="button"
                      onClick={() => handleReorder(ad, 'up')}
                      className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-amber-400 hover:bg-slate-200 dark:hover:bg-blue-800 rounded-lg transition"
                      title="Move Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleReorder(ad, 'down')}
                      className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-amber-400 hover:bg-slate-200 dark:hover:bg-blue-800 rounded-lg transition"
                      title="Move Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Pause / Resume Button */}
                  <button
                    type="button"
                    onClick={() => toggleAdStatus(ad.id, !ad.isActive)}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs transition flex items-center gap-1.5 cursor-pointer ${
                      ad.isActive
                        ? 'bg-amber-500/15 text-amber-500 border border-amber-500/30 hover:bg-amber-500 hover:text-slate-950'
                        : 'bg-slate-200 dark:bg-blue-900/60 text-slate-500 hover:text-slate-200'
                    }`}
                  >
                    {ad.isActive ? (
                      <>
                        <Pause className="w-3.5 h-3.5 fill-current" />
                        <span>পজ করুন</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>লাইভ করুন</span>
                      </>
                    )}
                  </button>

                  {/* Edit Button */}
                  <button
                    type="button"
                    onClick={() => {
                      setEditingAd(ad);
                      setShowModal(true);
                    }}
                    className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-800 font-bold transition"
                    title="Edit"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  {/* Delete Button */}
                  <button
                    type="button"
                    onClick={async () => {
                      if (window.confirm(`আপনি কি "${ad.title}" বিজ্ঞাপনটি ডিলিট করতে চান?`)) {
                        await deleteAd(ad.id);
                      }
                    }}
                    className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Ad Add/Edit Modal */}
      {showModal && editingAd && (
        <div className="fixed inset-0 z-60 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 animate-fadeIn">
          <div className="w-full max-w-2xl bg-white dark:bg-[#0B1E3F] rounded-3xl p-6 border border-slate-200 dark:border-blue-900 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto text-xs text-slate-800 dark:text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-blue-800 pb-3">
              <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-amber-500" />
                <span>{editingAd.id ? 'বিজ্ঞাপন সম্পাদনা করুন (Edit Ad)' : 'নতুন বিজ্ঞাপন তৈরি করুন (Create Ad)'}</span>
              </h3>
              <button 
                type="button" 
                onClick={() => setShowModal(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              {/* Advertiser Name & Placement */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block mb-1">
                    বিজ্ঞাপনদাতার নাম (Advertiser Name) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="যেমন: Samsung, Apex, বা Jihan Store"
                    value={editingAd.advertiserName || ''}
                    onChange={(e) => setEditingAd({ ...editingAd, advertiserName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-blue-950/80 border border-slate-300 dark:border-blue-800 text-slate-900 dark:text-white font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold block mb-1">
                    বিজ্ঞাপনের অবস্থান (Placement Position) *
                  </label>
                  <select
                    value={editingAd.placement || 'home_top'}
                    onChange={(e: any) => setEditingAd({ ...editingAd, placement: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-blue-950/80 border border-slate-300 dark:border-blue-800 text-slate-900 dark:text-white font-bold"
                  >
                    <option value="home_top">Home Top (হিরো ব্যানারের নিচে)</option>
                    <option value="home_middle">Home Middle (ক্যাটাগরি ও পণ্যের মাঝে)</option>
                    <option value="home_bottom">Home Bottom (কন্টাক্ট সেকশনের উপরে)</option>
                    <option value="category_page">Category Page (ক্যাটাগরি পেজ/ফিল্টারে)</option>
                    <option value="product_page">Product Page (পণ্য বিস্তারিত পপআপে)</option>
                    <option value="cart_drawer">Cart Drawer (শপিং কার্ট স্লাইডারে)</option>
                  </select>
                </div>
              </div>

              {/* Title & Bengali Title */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block mb-1">বিজ্ঞাপন শিরোনাম (English) *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 50% Off Samsung Galaxy"
                    value={editingAd.title || ''}
                    onChange={(e) => setEditingAd({ ...editingAd, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-blue-950/80 border border-slate-300 dark:border-blue-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="font-bold block mb-1">বিজ্ঞাপন শিরোনাম (বাংলা)</label>
                  <input
                    type="text"
                    placeholder="যেমন: ৫০% পর্যন্ত আকর্ষণীয় ছাড়!"
                    value={editingAd.titleBn || ''}
                    onChange={(e) => setEditingAd({ ...editingAd, titleBn: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-blue-950/80 border border-slate-300 dark:border-blue-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="font-bold block mb-1">বিজ্ঞাপনের বিবরণ / অফার ডিটেইলস</label>
                <textarea
                  rows={2}
                  placeholder="অফারের বিস্তারিত বা ক্যাশব্যাক তথ্য লিখুন..."
                  value={editingAd.description || ''}
                  onChange={(e) => setEditingAd({ ...editingAd, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-blue-950/80 border border-slate-300 dark:border-blue-800 text-slate-900 dark:text-white"
                />
              </div>

              {/* Media: Image Upload / URL & Video URL */}
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-3">
                <span className="font-black text-amber-400 block text-xs flex items-center gap-1.5">
                  <FileImage className="w-4 h-4" />
                  <span>বিজ্ঞাপন ব্যানার ও মিডিয়া নির্বাচন:</span>
                </span>

                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <label className="w-full sm:w-auto px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition cursor-pointer flex items-center justify-center gap-2 shadow-sm">
                    <Upload className="w-4 h-4" />
                    <span>ডিভাইস থেকে ছবি আপলোড</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                  <span className="text-[11px] text-slate-400">অথবা নিচের বক্সে ছবির সরাসরি URL লিংক দিন</span>
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">ছবির URL লিংক (Image URL)</label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={editingAd.image || ''}
                    onChange={(e) => setEditingAd({ ...editingAd, image: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-blue-950/80 border border-slate-300 dark:border-blue-800 text-slate-900 dark:text-white font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">ভিডিও লিংক (ঐচ্ছিক - MP4 বা YouTube URL)</label>
                  <input
                    type="url"
                    placeholder="https://example.com/promo.mp4"
                    value={editingAd.videoUrl || ''}
                    onChange={(e) => setEditingAd({ ...editingAd, videoUrl: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-blue-950/80 border border-slate-300 dark:border-blue-800 text-slate-900 dark:text-white font-mono text-xs"
                  />
                </div>

                {editingAd.image && (
                  <div className="p-2 rounded-xl bg-slate-900/60 border border-amber-500/20 flex items-center gap-3">
                    <img src={editingAd.image} alt="Preview" className="w-16 h-12 object-cover rounded-lg" />
                    <span className="text-[11px] text-emerald-400 font-bold">ছবি সফলভাবে সংযুক্ত হয়েছে!</span>
                  </div>
                )}
              </div>

              {/* Button text & Destination URL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block mb-1">বাটন টেক্সট (Button Text) *</label>
                  <input
                    type="text"
                    required
                    placeholder="যেমন: অফার দেখুন, এখনই কিনুন, ভিজিট করুন"
                    value={editingAd.buttonText || ''}
                    onChange={(e) => setEditingAd({ ...editingAd, buttonText: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-blue-950/80 border border-slate-300 dark:border-blue-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="font-bold block mb-1">গন্তব্য ওয়েবসাইট লিংক (Destination URL) *</label>
                  <input
                    type="url"
                    required
                    placeholder="https://www.advertiser.com/deal"
                    value={editingAd.destinationUrl || ''}
                    onChange={(e) => setEditingAd({ ...editingAd, destinationUrl: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-blue-950/80 border border-slate-300 dark:border-blue-800 text-slate-900 dark:text-white font-mono text-xs"
                  />
                </div>
              </div>

              {/* Start Date, End Date, Display Order */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold block mb-1">শুরুর তারিখ (Start Date)</label>
                  <input
                    type="date"
                    value={editingAd.startDate || ''}
                    onChange={(e) => setEditingAd({ ...editingAd, startDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-blue-950/80 border border-slate-300 dark:border-blue-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="font-bold block mb-1">শেষের তারিখ (End Date - ঐচ্ছিক)</label>
                  <input
                    type="date"
                    value={editingAd.endDate || ''}
                    onChange={(e) => setEditingAd({ ...editingAd, endDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-blue-950/80 border border-slate-300 dark:border-blue-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="font-bold block mb-1">প্রদর্শন ক্রম (Display Order)</label>
                  <input
                    type="number"
                    min={1}
                    value={editingAd.displayOrder || 1}
                    onChange={(e) => setEditingAd({ ...editingAd, displayOrder: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-blue-950/80 border border-slate-300 dark:border-blue-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Active status */}
              <label className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-100 dark:bg-blue-950/60 border border-slate-200 dark:border-blue-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editingAd.isActive ?? true}
                  onChange={(e) => setEditingAd({ ...editingAd, isActive: e.target.checked })}
                  className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400"
                />
                <span className="font-bold text-slate-900 dark:text-white text-xs">
                  বিজ্ঞাপনটি সক্রিয় রাখুন (Live on Website)
                </span>
              </label>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-blue-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-blue-900/60 font-bold hover:bg-slate-300 text-slate-700 dark:text-slate-300"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-amber-500 text-slate-950 font-black hover:bg-amber-400 shadow-md cursor-pointer"
                >
                  বিজ্ঞাপন সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
