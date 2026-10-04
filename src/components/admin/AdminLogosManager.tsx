import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { LogoConfig } from '../../types/store';
import { uploadImageFile, deleteStorageFile } from '../../lib/firebase';
import { 
  Check, 
  Upload, 
  Trash2, 
  Edit3, 
  Plus, 
  Sparkles, 
  Crown, 
  Gem, 
  Diamond, 
  Eye, 
  CheckCircle2, 
  X,
  FileImage,
  RefreshCw,
  AlertCircle
} from 'lucide-react';

export const AdminLogosManager: React.FC = () => {
  const { 
    settings, 
    activeLogo, 
    setActiveLogo, 
    saveLogo, 
    deleteLogo, 
    addToast 
  } = useStore();

  const logos = settings.logos || [];

  const [editingLogo, setEditingLogo] = useState<Partial<LogoConfig> | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [previewBg, setPreviewBg] = useState<'dark' | 'light'>('dark');
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Handle local file upload with Firebase Storage
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      addToast('অনুগ্রহ করে একটি ছবি ফাইল আপলোড করুন (JPG, PNG, SVG, WebP)', 'error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      addToast('ছবির সাইজ ৫MB এর কম হতে হবে', 'error');
      return;
    }

    setIsUploading(true);
    setErrorMessage(null);
    try {
      const downloadUrl = await uploadImageFile(file, 'logos');
      if (editingLogo) {
        setEditingLogo(prev => prev ? {
          ...prev,
          type: 'custom',
          url: downloadUrl
        } : null);
      }
      addToast('লোগো ছবি ক্লাউড স্টোরেজে আপলোড হয়েছে! সংরক্ষণ বাটনে ক্লিক করুন।', 'success');
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMessage(`লোগো আপলোড ব্যর্থ: ${msg}`);
      addToast(`লোগো আপলোড ব্যর্থ: ${msg}`, 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLogo || !editingLogo.name) return;

    setIsSaving(true);
    setErrorMessage(null);
    try {
      const id = editingLogo.id || 'logo-' + Date.now().toString().slice(-4);
      const logoToSave: LogoConfig = {
        id,
        name: editingLogo.name,
        nameBn: editingLogo.nameBn || editingLogo.name,
        type: editingLogo.type || 'custom',
        url: editingLogo.url || '',
        tagline: editingLogo.tagline || 'Online Shopping with Trust',
        taglineBn: editingLogo.taglineBn || 'বিশ্বাসের সাথে অনলাইন শপিং',
        isActive: editingLogo.isActive ?? false
      };

      await saveLogo(logoToSave);
      setShowModal(false);
      setEditingLogo(null);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMessage(`সংরক্ষণ ব্যর্থ: ${msg}`);
      addToast(`লোগো সংরক্ষণ ব্যর্থ: ${msg}`, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSetPrimary = async (logoId: string) => {
    await setActiveLogo(logoId);
    addToast('সক্রিয় লোগো পরিবর্তন করা হয়েছে!', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-blue-900/60">
        <div>
          <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Crown className="w-5 h-5 text-amber-500" />
            <span>ডাইনামিক লোগো ও ব্র্যান্ডিং ম্যানেজার</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            ৩টি লোগোর যেকোনোটি একটি ক্লিকে সক্রিয় করুন অথবা নিজের কাস্টম লোগো আপলোড/এডিট/রিপ্লেস করুন
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingLogo({
              name: 'Custom Brand Logo',
              nameBn: 'কাস্টম ব্র্যান্ড লোগো',
              type: 'custom',
              url: '',
              tagline: settings.storeSlogan,
              taglineBn: settings.storeSloganBn || 'বিশ্বাসের সাথে অনলাইন শপিং',
              isActive: false
            });
            setShowModal(true);
          }}
          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition flex items-center gap-1.5 shadow-md shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন লোগো স্লট যোগ করুন</span>
        </button>
      </div>

      {/* Live Preview Box */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-100 dark:bg-blue-950/40 border border-slate-200 dark:border-blue-900/60 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Eye className="w-4 h-4 text-amber-500" />
            <span>ওয়েবসাইটে বর্তমানে সক্রিয় লোগোর লাইভ প্রিভিউ (Live Header Preview):</span>
          </span>

          <div className="flex items-center gap-1 text-[11px]">
            <button
              type="button"
              onClick={() => setPreviewBg('dark')}
              className={`px-2.5 py-1 rounded-lg font-bold transition ${
                previewBg === 'dark' ? 'bg-[#0B1E3F] text-amber-400 border border-amber-500/40' : 'text-slate-500'
              }`}
            >
              ডার্ক ব্যাকগ্রাউন্ড
            </button>
            <button
              type="button"
              onClick={() => setPreviewBg('light')}
              className={`px-2.5 py-1 rounded-lg font-bold transition ${
                previewBg === 'light' ? 'bg-white text-blue-950 border border-slate-300 shadow-xs' : 'text-slate-500'
              }`}
            >
              লাইট ব্যাকগ্রাউন্ড
            </button>
          </div>
        </div>

        <div className={`p-6 rounded-2xl border transition-all flex items-center justify-between ${
          previewBg === 'dark' 
            ? 'bg-[#0B1E3F] border-blue-900 text-white' 
            : 'bg-white border-slate-200 text-slate-900'
        }`}>
          {/* Logo Representation */}
          <div className="flex items-center gap-3">
            {activeLogo?.type === 'custom' && activeLogo.url ? (
              <img 
                src={activeLogo.url} 
                alt="Active Logo" 
                className="w-12 h-12 rounded-xl object-contain bg-slate-900/10 p-1 border border-amber-500/30"
              />
            ) : activeLogo?.type === 'minimal' ? (
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-400 to-yellow-500 p-0.5 flex items-center justify-center">
                <div className="w-full h-full bg-[#0B1E3F] rounded-[10px] flex items-center justify-center">
                  <Gem className="w-6 h-6 text-amber-400" />
                </div>
              </div>
            ) : activeLogo?.type === 'monogram' ? (
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 p-0.5 flex items-center justify-center">
                <div className="w-full h-full bg-[#07162E] rounded-[10px] flex items-center justify-center">
                  <span className="font-black text-amber-400 text-sm">JS</span>
                </div>
              </div>
            ) : (
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 p-0.5 flex items-center justify-center">
                <div className="w-full h-full bg-[#0B1E3F] rounded-[10px] flex items-center justify-center">
                  <Crown className="w-6 h-6 text-amber-400" />
                </div>
              </div>
            )}

            <div>
              <div className="text-xl font-black uppercase tracking-tight">
                <span className="text-blue-900 dark:text-white">{settings.storeName.split(' ')[0]} </span>
                <span className="text-amber-500">{settings.storeName.split(' ').slice(1).join(' ') || 'STORE'}</span>
              </div>
              <p className="text-xs text-amber-500/90 font-medium">
                “{activeLogo?.taglineBn || activeLogo?.tagline || settings.storeSlogan}”
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-400/40 text-[10px] font-black uppercase flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span>ওয়েবসাইটে লাইভ</span>
            </span>
          </div>
        </div>
      </div>

      {/* 3 Logos Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {logos.map((logo, index) => {
          const isCurrentActive = activeLogo?.id === logo.id;

          return (
            <div
              key={logo.id}
              className={`relative p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
                isCurrentActive
                  ? 'bg-amber-500/10 dark:bg-amber-950/20 border-amber-500 ring-2 ring-amber-500/30 shadow-lg'
                  : 'bg-white dark:bg-blue-950/40 border-slate-200 dark:border-blue-900/60 hover:border-amber-400/50'
              }`}
            >
              {/* Badge & Order */}
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-200 dark:bg-blue-900 text-slate-700 dark:text-slate-300">
                  Logo Option {index + 1}
                </span>

                {isCurrentActive ? (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-black flex items-center gap-1">
                    <Check className="w-3 h-3 stroke-[3]" />
                    <span>সক্রিয় (Active)</span>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleSetPrimary(logo.id)}
                    className="px-2.5 py-1 rounded-xl bg-blue-900 hover:bg-amber-500 hover:text-slate-950 text-amber-300 text-[10px] font-bold transition flex items-center gap-1"
                  >
                    <span>সক্রিয় করুন</span>
                  </button>
                )}
              </div>

              {/* Logo Visual Presentation */}
              <div className="h-28 rounded-xl bg-slate-900/90 dark:bg-[#07162E] border border-blue-950 flex flex-col items-center justify-center p-3 relative overflow-hidden group">
                {logo.type === 'custom' && logo.url ? (
                  <img
                    src={logo.url}
                    alt={logo.name}
                    className="max-h-16 max-w-full object-contain drop-shadow"
                  />
                ) : logo.type === 'minimal' ? (
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-400 to-yellow-500 p-0.5 flex items-center justify-center">
                    <div className="w-full h-full bg-[#0B1E3F] rounded-[10px] flex items-center justify-center">
                      <Gem className="w-6 h-6 text-amber-400" />
                    </div>
                  </div>
                ) : logo.type === 'monogram' ? (
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 p-0.5 flex items-center justify-center">
                    <div className="w-full h-full bg-[#07162E] rounded-[10px] flex items-center justify-center">
                      <span className="font-black text-amber-400 text-sm">JS</span>
                    </div>
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 p-0.5 flex items-center justify-center">
                    <div className="w-full h-full bg-[#0B1E3F] rounded-[10px] flex items-center justify-center">
                      <Crown className="w-6 h-6 text-amber-400" />
                    </div>
                  </div>
                )}

                <span className="text-[10px] text-amber-300/80 font-mono mt-1.5">
                  Type: {logo.type?.toUpperCase()}
                </span>
              </div>

              {/* Title & Info */}
              <div className="space-y-1">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  {logo.nameBn || logo.name}
                </h4>
                <p className="text-[11px] text-slate-400 truncate">
                  স্লোগান: “{logo.taglineBn || logo.tagline}”
                </p>
              </div>

              {/* Actions: Edit, Upload, Delete */}
              <div className="pt-3 border-t border-slate-100 dark:border-blue-900/50 flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setEditingLogo(logo);
                    setShowModal(true);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-800/60 font-bold transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>এডিট / রিপ্লেস</span>
                </button>

                {logos.length > 1 && (
                  <button
                    type="button"
                    onClick={async () => {
                      if (window.confirm(`আপনি কি "${logo.name}" লোগোটি ডিলিট করতে চান?`)) {
                        await deleteLogo(logo.id);
                      }
                    }}
                    className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition"
                    title="Delete Logo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit / Upload Modal */}
      {showModal && editingLogo && (
        <div className="fixed inset-0 z-60 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 animate-fadeIn">
          <div className="w-full max-w-lg bg-white dark:bg-[#0B1E3F] rounded-3xl p-6 border border-slate-200 dark:border-blue-900 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto text-xs text-slate-800 dark:text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-blue-800 pb-3">
              <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Crown className="w-4 h-4 text-amber-500" />
                <span>{editingLogo.id ? 'লোগো এডিট ও আপলোড' : 'নতুন লোগো স্লট তৈরি করুন'}</span>
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
              {/* Logo Name & Bangla Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block mb-1">লোগোর নাম (English)</label>
                  <input
                    type="text"
                    required
                    value={editingLogo.name || ''}
                    onChange={(e) => setEditingLogo({ ...editingLogo, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-blue-950/80 border border-slate-300 dark:border-blue-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="font-bold block mb-1">লোগোর নাম (বাংলা)</label>
                  <input
                    type="text"
                    value={editingLogo.nameBn || ''}
                    onChange={(e) => setEditingLogo({ ...editingLogo, nameBn: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-blue-950/80 border border-slate-300 dark:border-blue-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Logo Type Selector */}
              <div>
                <label className="font-bold block mb-1">লোগোর ধরন (Logo Style / Type)</label>
                <select
                  value={editingLogo.type || 'custom'}
                  onChange={(e: any) => setEditingLogo({ ...editingLogo, type: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-blue-950/80 border border-slate-300 dark:border-blue-800 text-slate-900 dark:text-white font-bold"
                >
                  <option value="custom">Custom Image Upload (ছবি আপলোড / লিংক)</option>
                  <option value="crest">Royal Crown Crest (রাজকীয় মুকুট এম্বলম)</option>
                  <option value="minimal">Modern Minimalist Gold (আধুনিক মিনিমালিস্ট জেম)</option>
                  <option value="monogram">Luxury Monogram Emblem (লাক্সারি মনোগ্রাম)</option>
                </select>
              </div>

              {/* Upload image file directly or paste URL */}
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-3">
                <span className="font-black text-amber-400 block text-xs flex items-center gap-1.5">
                  <Upload className="w-4 h-4" />
                  <span>নিজের ডিভাইস থেকে নতুন লোগো আপলোড করুন:</span>
                </span>

                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <label className={`w-full sm:w-auto px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition cursor-pointer flex items-center justify-center gap-2 shadow-sm ${
                    isUploading ? 'opacity-60 cursor-not-allowed' : ''
                  }`}>
                    {isUploading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
                        <span>ক্লাউড স্টোরেজে আপলোড হচ্ছে...</span>
                      </>
                    ) : (
                      <>
                        <FileImage className="w-4 h-4" />
                        <span>ফাইল বেছে নিন (Upload to Storage)</span>
                      </>
                    )}
                    <input
                      type="file"
                      disabled={isUploading}
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                  <span className="text-[11px] text-slate-400">PNG, SVG, JPG বা WebP ফরম্যাট (Max 5MB)</span>
                </div>

                <div className="pt-2">
                  <label className="font-bold text-slate-300 block mb-1">অথবা ছবির সরাসরি URL লিংক দিন:</label>
                  <input
                    type="url"
                    placeholder="https://example.com/logo.png"
                    value={editingLogo.url || ''}
                    onChange={(e) => setEditingLogo({ ...editingLogo, url: e.target.value, type: 'custom' })}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-blue-950/80 border border-slate-300 dark:border-blue-800 text-slate-900 dark:text-white text-xs font-mono"
                  />
                </div>

                {editingLogo.url && (
                  <div className="p-2 rounded-xl bg-slate-900/60 border border-amber-500/20 flex items-center gap-3">
                    <img src={editingLogo.url} alt="Preview" className="w-10 h-10 object-contain rounded-lg bg-white/10 p-1" />
                    <span className="text-[11px] text-emerald-400 font-bold">ছবি সফলভাবে সিলেক্ট হয়েছে!</span>
                  </div>
                )}
              </div>

              {/* Taglines */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block mb-1">স্লোগান (বাংলা)</label>
                  <input
                    type="text"
                    value={editingLogo.taglineBn || ''}
                    onChange={(e) => setEditingLogo({ ...editingLogo, taglineBn: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-blue-950/80 border border-slate-300 dark:border-blue-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1">স্লোগান (English)</label>
                  <input
                    type="text"
                    value={editingLogo.tagline || ''}
                    onChange={(e) => setEditingLogo({ ...editingLogo, tagline: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-blue-950/80 border border-slate-300 dark:border-blue-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Set as Active toggle */}
              <label className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-100 dark:bg-blue-950/60 border border-slate-200 dark:border-blue-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editingLogo.isActive ?? false}
                  onChange={(e) => setEditingLogo({ ...editingLogo, isActive: e.target.checked })}
                  className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400"
                />
                <span className="font-bold text-slate-900 dark:text-white text-xs">
                  এই লোগোটিকে এখনই মূল ওয়েবসাইটে সক্রিয় (Active) করুন
                </span>
              </label>

              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

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
                  disabled={isSaving || isUploading}
                  className="px-5 py-2 rounded-xl bg-amber-500 text-slate-950 font-black hover:bg-amber-400 shadow-md cursor-pointer disabled:opacity-50 flex items-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
                      <span>সংরক্ষণ হচ্ছে...</span>
                    </>
                  ) : (
                    <span>সংরক্ষণ করুন</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
