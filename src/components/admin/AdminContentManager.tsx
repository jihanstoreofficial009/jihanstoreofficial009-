import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { StoreSettings, AddressItem, ContactNumber, EmailContact, SocialLinkItem } from '../../types/store';
import { 
  Building, 
  MapPin, 
  Phone, 
  Mail, 
  Share2, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  Bot, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Truck, 
  DollarSign, 
  MessageCircle,
  ExternalLink,
  Sliders,
  X
} from 'lucide-react';

export const AdminContentManager: React.FC = () => {
  const { 
    settings, 
    updateStoreSettings, 
    saveAddress, 
    deleteAddress, 
    saveContact, 
    deleteContact, 
    saveEmailContact, 
    deleteEmailContact, 
    saveSocialLink, 
    deleteSocialLink, 
    sendTelegramTestNotification, 
    addToast 
  } = useStore();

  const [activeSubTab, setActiveSubTab] = useState<'general' | 'addresses' | 'contacts' | 'social' | 'telegram'>('general');

  // General Store Settings State
  const [formSettings, setFormSettings] = useState<StoreSettings>(settings);

  // Address Modal State
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Partial<AddressItem> | null>(null);

  // Contact Modal State
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactType, setContactType] = useState<'phone' | 'whatsapp'>('phone');
  const [editingContact, setEditingContact] = useState<Partial<ContactNumber> | null>(null);

  // Email Modal State
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [editingEmail, setEditingEmail] = useState<Partial<EmailContact> | null>(null);

  // Social Modal State
  const [showSocialModal, setShowSocialModal] = useState(false);
  const [editingSocial, setEditingSocial] = useState<Partial<SocialLinkItem> | null>(null);

  // Telegram test state
  const [isSendingTelegram, setIsSendingTelegram] = useState(false);
  const [telegramStatus, setTelegramStatus] = useState<string | null>(null);

  // Handlers for General Settings Save
  const handleSaveGeneralSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateStoreSettings(formSettings);
    addToast('স্টোর সেটিংস সফলভাবে আপডেট হয়েছে!', 'success');
  };

  // Handlers for Address Save
  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAddress || !editingAddress.title || !editingAddress.address) return;

    const id = editingAddress.id || 'addr-' + Date.now().toString().slice(-4);
    await saveAddress({
      id,
      title: editingAddress.title,
      address: editingAddress.address,
      city: editingAddress.city || 'Dhaka',
      phone: editingAddress.phone || '',
      isDefault: editingAddress.isDefault ?? false,
      isEnabled: editingAddress.isEnabled ?? true
    });
    setShowAddressModal(false);
    setEditingAddress(null);
  };

  // Handlers for Contact Save
  const handleSaveContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingContact || !editingContact.title || !editingContact.number) return;

    const id = editingContact.id || (contactType === 'whatsapp' ? 'wa-' : 'ph-') + Date.now().toString().slice(-4);
    await saveContact({
      id,
      title: editingContact.title,
      number: editingContact.number,
      type: contactType,
      isDefault: editingContact.isDefault ?? false,
      isEnabled: editingContact.isEnabled ?? true
    });
    setShowContactModal(false);
    setEditingContact(null);
  };

  // Handlers for Email Save
  const handleSaveEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEmail || !editingEmail.title || !editingEmail.email) return;

    const id = editingEmail.id || 'em-' + Date.now().toString().slice(-4);
    await saveEmailContact({
      id,
      title: editingEmail.title,
      email: editingEmail.email,
      isDefault: editingEmail.isDefault ?? false,
      isEnabled: editingEmail.isEnabled ?? true
    });
    setShowEmailModal(false);
    setEditingEmail(null);
  };

  // Handlers for Social Link Save
  const handleSaveSocial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSocial || !editingSocial.title || !editingSocial.url) return;

    const id = editingSocial.id || 'soc-' + Date.now().toString().slice(-4);
    await saveSocialLink({
      id,
      platform: editingSocial.platform || 'facebook',
      title: editingSocial.title,
      url: editingSocial.url,
      isEnabled: editingSocial.isEnabled ?? true,
      displayOrder: Number(editingSocial.displayOrder) || 1
    });
    setShowSocialModal(false);
    setEditingSocial(null);
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-blue-900/60">
        <div>
          <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Sliders className="w-5 h-5 text-amber-500" />
            <span>ডাইনামিক ওয়েবসাইট কন্টেন্ট ও স্টোর সেটিংস</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            স্টোরের নাম, বাংলা নাম, স্লোগান, একাধিক ঠিকানা, মোবাইল/হোয়াটসঅ্যাপ, সোশ্যাল লিংক ও টেলিগ্রাম বট পরিচালনা
          </p>
        </div>
      </div>

      {/* Sub-tab Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200 dark:border-blue-900/50 text-xs">
        <button
          type="button"
          onClick={() => setActiveSubTab('general')}
          className={`py-2 px-3.5 rounded-xl font-bold transition shrink-0 flex items-center gap-1.5 ${
            activeSubTab === 'general'
              ? 'bg-amber-500 text-slate-950 shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-blue-900/40'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>স্টোর নাম ও ডেলিভারি</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('addresses')}
          className={`py-2 px-3.5 rounded-xl font-bold transition shrink-0 flex items-center gap-1.5 ${
            activeSubTab === 'addresses'
              ? 'bg-amber-500 text-slate-950 shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-blue-900/40'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>একাধিক ঠিকানা ({settings.addresses?.length || 0})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('contacts')}
          className={`py-2 px-3.5 rounded-xl font-bold transition shrink-0 flex items-center gap-1.5 ${
            activeSubTab === 'contacts'
              ? 'bg-amber-500 text-slate-950 shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-blue-900/40'
          }`}
        >
          <Phone className="w-4 h-4" />
          <span>ফোন, হোয়াটসঅ্যাপ ও ইমেইল</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('social')}
          className={`py-2 px-3.5 rounded-xl font-bold transition shrink-0 flex items-center gap-1.5 ${
            activeSubTab === 'social'
              ? 'bg-amber-500 text-slate-950 shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-blue-900/40'
          }`}
        >
          <Share2 className="w-4 h-4" />
          <span>সোশ্যাল মিডিয়া লিংক ({settings.socialLinks?.length || 0})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('telegram')}
          className={`py-2 px-3.5 rounded-xl font-bold transition shrink-0 flex items-center gap-1.5 ${
            activeSubTab === 'telegram'
              ? 'bg-amber-500 text-slate-950 shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-blue-900/40'
          }`}
        >
          <Bot className="w-4 h-4" />
          <span>টেলিগ্রাম বট ও গুগল ট্যাগ</span>
        </button>
      </div>

      {/* SUB-TAB 1: GENERAL SETTINGS */}
      {activeSubTab === 'general' && (
        <form onSubmit={handleSaveGeneralSettings} className="space-y-4 max-w-3xl text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold block mb-1">স্টোরের নাম (English)</label>
              <input
                type="text"
                required
                value={formSettings.storeName}
                onChange={(e) => setFormSettings({ ...formSettings, storeName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-blue-950/60 border border-slate-300 dark:border-blue-800 text-slate-900 dark:text-white font-bold"
              />
            </div>

            <div>
              <label className="font-bold block mb-1">স্টোরের বাংলা নাম (Bangla Name)</label>
              <input
                type="text"
                placeholder="যেমন: জিহান স্টোর"
                value={formSettings.storeNameBn || ''}
                onChange={(e) => setFormSettings({ ...formSettings, storeNameBn: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-blue-950/60 border border-slate-300 dark:border-blue-800 text-slate-900 dark:text-white font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold block mb-1">ট্যাগলাইন / স্লোগান (বাংলা)</label>
              <input
                type="text"
                value={formSettings.storeSloganBn || formSettings.storeSlogan}
                onChange={(e) => setFormSettings({ ...formSettings, storeSloganBn: e.target.value, storeSlogan: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-blue-950/60 border border-slate-300 dark:border-blue-800 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="font-bold block mb-1">ট্যাগলাইন (English)</label>
              <input
                type="text"
                value={formSettings.storeSlogan}
                onChange={(e) => setFormSettings({ ...formSettings, storeSlogan: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-blue-950/60 border border-slate-300 dark:border-blue-800 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="font-bold block mb-1">টপ অ্যানাউন্সমেন্ট বার মেসেজ (Top Announcement Bar)</label>
            <input
              type="text"
              value={formSettings.announcement}
              onChange={(e) => setFormSettings({ ...formSettings, announcement: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-blue-950/60 border border-slate-300 dark:border-blue-800 text-slate-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="font-bold block mb-1">ঢাকার ভেতরে ডেলিভারি চার্জ (৳)</label>
              <input
                type="number"
                value={formSettings.insideDhakaDelivery}
                onChange={(e) => setFormSettings({ ...formSettings, insideDhakaDelivery: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-blue-950/60 border border-slate-300 dark:border-blue-800 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="font-bold block mb-1">ঢাকার বাইরে ডেলিভারি চার্জ (৳)</label>
              <input
                type="number"
                value={formSettings.outsideDhakaDelivery}
                onChange={(e) => setFormSettings({ ...formSettings, outsideDhakaDelivery: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-blue-950/60 border border-slate-300 dark:border-blue-800 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="font-bold block mb-1">ফ্রি ডেলিভারি থ্রেশহোল্ড (৳)</label>
              <input
                type="number"
                value={formSettings.freeDeliveryThreshold}
                onChange={(e) => setFormSettings({ ...formSettings, freeDeliveryThreshold: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-blue-950/60 border border-slate-300 dark:border-blue-800 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold block mb-1">বিকাশ সেন্ড মানি নম্বর (bKash Number)</label>
              <input
                type="text"
                value={formSettings.bkashNumber}
                onChange={(e) => setFormSettings({ ...formSettings, bkashNumber: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-blue-950/60 border border-slate-300 dark:border-blue-800 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="font-bold block mb-1">নগদ সেন্ড মানি নম্বর (Nagad Number)</label>
              <input
                type="text"
                value={formSettings.nagadNumber}
                onChange={(e) => setFormSettings({ ...formSettings, nagadNumber: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-blue-950/60 border border-slate-300 dark:border-blue-800 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-black hover:bg-amber-400 transition shadow-md cursor-pointer"
            >
              স্টোর সেটিংস সংরক্ষণ করুন
            </button>
          </div>
        </form>
      )}

      {/* SUB-TAB 2: MULTI-ADDRESSES */}
      {activeSubTab === 'addresses' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                শাখা ও অফিস ঠিকানাসমূহ (Multiple Addresses)
              </h3>
              <p className="text-xs text-slate-400">
                হেড অফিস, উত্তরা সাপোর্ট বা চট্টগ্রাম ডেলিভারি হাবের ঠিকানা যোগ বা সম্পাদনা করুন
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setEditingAddress({
                  title: '',
                  address: '',
                  city: 'Dhaka',
                  phone: settings.phone,
                  isDefault: false,
                  isEnabled: true
                });
                setShowAddressModal(true);
              }}
              className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>নতুন ঠিকানা যোগ করুন</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {(settings.addresses || []).map((addr) => (
              <div
                key={addr.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-3 text-xs ${
                  addr.isDefault 
                    ? 'bg-amber-500/10 dark:bg-amber-950/20 border-amber-500 ring-1 ring-amber-500/30' 
                    : 'bg-white dark:bg-blue-950/40 border-slate-200 dark:border-blue-900/60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-black text-slate-900 dark:text-white text-sm">
                      {addr.title}
                    </span>
                    {addr.isDefault && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black uppercase">
                        Default
                      </span>
                    )}
                  </div>

                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    {addr.address}, {addr.city}
                  </p>

                  {addr.phone && (
                    <span className="text-[11px] text-amber-500 font-semibold block mt-1">
                      ফোন: {addr.phone}
                    </span>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-blue-900/50 flex items-center justify-between">
                  <span className={`text-[10px] font-bold ${addr.isEnabled ? 'text-emerald-500' : 'text-slate-400'}`}>
                    {addr.isEnabled ? 'সক্রিয় (Active)' : 'বন্ধ (Disabled)'}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingAddress(addr);
                        setShowAddressModal(true);
                      }}
                      className="p-1.5 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/40 rounded-lg"
                      title="Edit"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    {(settings.addresses?.length || 0) > 1 && (
                      <button
                        type="button"
                        onClick={() => deleteAddress(addr.id)}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: CONTACT NUMBERS & EMAILS */}
      {activeSubTab === 'contacts' && (
        <div className="space-y-6">
          {/* Phone Numbers */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-500" />
                <span>হটলাইন ও ফোন নম্বর সমূহ</span>
              </h4>
              <button
                type="button"
                onClick={() => {
                  setContactType('phone');
                  setEditingContact({ title: '', number: '', type: 'phone', isDefault: false, isEnabled: true });
                  setShowContactModal(true);
                }}
                className="px-3 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>নতুন ফোন নম্বর</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {(settings.phones || []).map((ph) => (
                <div key={ph.id} className="p-3.5 rounded-2xl bg-white dark:bg-blue-950/40 border border-slate-200 dark:border-blue-900/60 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">{ph.title}</span>
                    <span className="text-amber-500 font-mono font-bold">{ph.number}</span>
                    {ph.isDefault && <span className="text-[10px] text-emerald-400 block font-semibold">(Primary Hotline)</span>}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        setContactType('phone');
                        setEditingContact(ph);
                        setShowContactModal(true);
                      }}
                      className="p-1.5 text-blue-500 hover:bg-blue-50 rounded"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    {(settings.phones?.length || 0) > 1 && (
                      <button
                        type="button"
                        onClick={() => deleteContact(ph.id, 'phone')}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 rounded"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* WhatsApp Numbers */}
          <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-blue-900/50">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>হোয়াটসঅ্যাপ চ্যাট নম্বর সমূহ</span>
              </h4>
              <button
                type="button"
                onClick={() => {
                  setContactType('whatsapp');
                  setEditingContact({ title: '', number: '', type: 'whatsapp', isDefault: false, isEnabled: true });
                  setShowContactModal(true);
                }}
                className="px-3 py-1.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>নতুন হোয়াটসঅ্যাপ</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {(settings.whatsapps || []).map((wa) => (
                <div key={wa.id} className="p-3.5 rounded-2xl bg-white dark:bg-blue-950/40 border border-slate-200 dark:border-blue-900/60 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">{wa.title}</span>
                    <span className="text-emerald-400 font-mono font-bold">{wa.number}</span>
                    {wa.isDefault && <span className="text-[10px] text-amber-400 block font-semibold">(Default Chat)</span>}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        setContactType('whatsapp');
                        setEditingContact(wa);
                        setShowContactModal(true);
                      }}
                      className="p-1.5 text-blue-500 hover:bg-blue-50 rounded"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    {(settings.whatsapps?.length || 0) > 1 && (
                      <button
                        type="button"
                        onClick={() => deleteContact(wa.id, 'whatsapp')}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 rounded"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Email Contacts */}
          <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-blue-900/50">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-400" />
                <span>ইমেইল কন্টাক্ট সমূহ</span>
              </h4>
              <button
                type="button"
                onClick={() => {
                  setEditingEmail({ title: '', email: '', isDefault: false, isEnabled: true });
                  setShowEmailModal(true);
                }}
                className="px-3 py-1.5 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-500 transition flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>নতুন ইমেইল যোগ করুন</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {(settings.emails || []).map((em) => (
                <div key={em.id} className="p-3.5 rounded-2xl bg-white dark:bg-blue-950/40 border border-slate-200 dark:border-blue-900/60 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">{em.title}</span>
                    <span className="text-blue-400 font-mono text-[11px] truncate block max-w-[180px]">{em.email}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingEmail(em);
                        setShowEmailModal(true);
                      }}
                      className="p-1.5 text-blue-500 hover:bg-blue-50 rounded"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    {(settings.emails?.length || 0) > 1 && (
                      <button
                        type="button"
                        onClick={() => deleteEmailContact(em.id)}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 rounded"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: SOCIAL MEDIA LINKS */}
      {activeSubTab === 'social' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                সোশ্যাল মিডিয়া ও কমিউনিটি লিংক
              </h3>
              <p className="text-xs text-slate-400">
                ফেসবুক, ইউটিউব, টিকটক, ইনস্টাগ্রাম ও হোয়াটসঅ্যাপ লিংক পরিচালনা করুন
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setEditingSocial({
                  title: 'Facebook Page',
                  platform: 'facebook',
                  url: 'https://facebook.com/',
                  isEnabled: true,
                  displayOrder: (settings.socialLinks?.length || 0) + 1
                });
                setShowSocialModal(true);
              }}
              className="px-3.5 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>নতুন সোশ্যাল লিংক</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {(settings.socialLinks || []).map((soc) => (
              <div
                key={soc.id}
                className="p-4 rounded-2xl bg-white dark:bg-blue-950/40 border border-slate-200 dark:border-blue-900/60 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-slate-900 dark:text-white text-sm">{soc.title}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-900/40 text-amber-300 font-mono uppercase">
                      {soc.platform}
                    </span>
                  </div>
                  <a
                    href={soc.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-slate-400 hover:text-amber-400 truncate block max-w-[200px] text-[11px]"
                  >
                    {soc.url}
                  </a>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingSocial(soc);
                      setShowSocialModal(true);
                    }}
                    className="p-1.5 text-blue-500 hover:bg-blue-50 rounded"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteSocialLink(soc.id)}
                    className="p-1.5 text-rose-500 hover:bg-rose-50 rounded"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 5: TELEGRAM & GOOGLE MANAGEMENT */}
      {activeSubTab === 'telegram' && (
        <div className="space-y-4 max-w-2xl text-xs">
          <div className="p-5 rounded-2xl bg-gradient-to-tr from-[#0F2449] via-[#0B1E3F] to-[#1E3A8A] text-white border border-amber-500/30 space-y-4 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-amber-300">
                    টেলিগ্রাম বট ও রিয়েল-টাইম নোটিফিকেশন সিস্টেম
                  </h4>
                  <span className="text-[11px] text-slate-300 block">
                    অর্ডার রিপোর্ট ও যাবতীয় নোটিফিকেশন সরাসরি টেলিগ্রাম বোটে পান
                  </span>
                </div>
              </div>

              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[10px] font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>কানেক্টেড</span>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-800">
              <div>
                <label className="font-bold text-slate-200 block mb-1">টেলিগ্রাম বট API টোকেন</label>
                <input
                  type="text"
                  value={formSettings.telegramBotToken || '8714872675:AAGsB9U_eCOIG5Os75KisW_ieJaEkKTdS6U'}
                  onChange={(e) => setFormSettings({ ...formSettings, telegramBotToken: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-blue-950/80 border border-slate-300 dark:border-blue-700 text-slate-900 dark:text-white font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="font-bold text-slate-200 block mb-1">টেলিগ্রাম ইউজার আইডি (Chat ID)</label>
                <input
                  type="text"
                  value={formSettings.telegramChatId || '6607631932'}
                  onChange={(e) => setFormSettings({ ...formSettings, telegramChatId: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-blue-950/80 border border-slate-300 dark:border-blue-700 text-slate-900 dark:text-white font-mono text-[11px]"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-200 block mb-1">গুগল ম্যানেজমেন্ট আইডি (Measurement ID)</label>
              <input
                type="text"
                value={formSettings.googleManagementId || 'G-MCXPLT5B3D'}
                onChange={(e) => setFormSettings({ ...formSettings, googleManagementId: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-blue-950/80 border border-slate-300 dark:border-blue-700 text-slate-900 dark:text-white font-mono text-[11px]"
              />
            </div>

            {/* Test Telegram button */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-blue-800/60">
              <button
                type="button"
                disabled={isSendingTelegram}
                onClick={async () => {
                  setIsSendingTelegram(true);
                  setTelegramStatus(null);
                  try {
                    const res = await sendTelegramTestNotification(
                      formSettings.telegramBotToken || '8714872675:AAGsB9U_eCOIG5Os75KisW_ieJaEkKTdS6U',
                      formSettings.telegramChatId || '6607631932'
                    );
                    if (res.success) {
                      setTelegramStatus('success');
                      addToast('টেলিগ্রাম বোটে টেস্ট নোটিফিকেশন সফলভাবে পাঠানো হয়েছে!', 'success');
                    } else {
                      setTelegramStatus('error');
                      addToast(`এরর: ${res.error || 'পাঠানো যায়নি'}`, 'error');
                    }
                  } catch {
                    setTelegramStatus('error');
                    addToast('টেলিগ্রাম টেস্ট মেসেজ পাঠাতে সমস্যা হয়েছে', 'error');
                  } finally {
                    setIsSendingTelegram(false);
                  }
                }}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition flex items-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSendingTelegram ? 'মেসেজ পাঠানো হচ্ছে...' : 'টেলিগ্রাম বোটে টেস্ট মেসেজ পাঠান'}</span>
              </button>

              {telegramStatus === 'success' && (
                <span className="text-emerald-300 font-bold text-xs flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>সফলভাবে টেলিগ্রামে পাঠানো হয়েছে!</span>
                </span>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={async () => {
              await updateStoreSettings({
                telegramBotToken: formSettings.telegramBotToken,
                telegramChatId: formSettings.telegramChatId,
                googleManagementId: formSettings.googleManagementId
              });
              addToast('টেলিগ্রাম ও গুগল আইডি সংরক্ষিত হয়েছে!', 'success');
            }}
            className="px-5 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 transition"
          >
            টেলিগ্রাম ক্রেডেনশিয়াল সংরক্ষণ করুন
          </button>
        </div>
      )}

      {/* Address Modal */}
      {showAddressModal && editingAddress && (
        <div className="fixed inset-0 z-60 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 animate-fadeIn">
          <div className="w-full max-w-md bg-white dark:bg-[#0B1E3F] rounded-3xl p-5 border border-slate-200 dark:border-blue-900 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                {editingAddress.id ? 'ঠিকানা সম্পাদনা' : 'নতুন শাখা ঠিকানা যোগ'}
              </h3>
              <button type="button" onClick={() => setShowAddressModal(false)}><X className="w-4 h-4" /></button>
            </div>

            <form onSubmit={handleSaveAddress} className="space-y-3">
              <div>
                <label className="font-bold block mb-1">ঠিকানার নাম / শাখা (Title)</label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: বনানী ফ্ল্যাগশিপ অফিস"
                  value={editingAddress.title || ''}
                  onChange={(e) => setEditingAddress({ ...editingAddress, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-blue-950/80 border border-slate-300 dark:border-blue-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">পূর্ণ ঠিকানা (Address)</label>
                <input
                  type="text"
                  required
                  placeholder="House #, Road #, Area"
                  value={editingAddress.address || ''}
                  onChange={(e) => setEditingAddress({ ...editingAddress, address: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-blue-950/80 border border-slate-300 dark:border-blue-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold block mb-1">শহর (City)</label>
                  <input
                    type="text"
                    value={editingAddress.city || 'Dhaka'}
                    onChange={(e) => setEditingAddress({ ...editingAddress, city: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-blue-950/80 border border-slate-300 dark:border-blue-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1">যোগাযোগ ফোন</label>
                  <input
                    type="text"
                    value={editingAddress.phone || ''}
                    onChange={(e) => setEditingAddress({ ...editingAddress, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-blue-950/80 border border-slate-300 dark:border-blue-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingAddress.isDefault ?? false}
                    onChange={(e) => setEditingAddress({ ...editingAddress, isDefault: e.target.checked })}
                    className="w-4 h-4 rounded text-amber-500"
                  />
                  <span>মূল ঠিকানা (Default Hub)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingAddress.isEnabled ?? true}
                    onChange={(e) => setEditingAddress({ ...editingAddress, isEnabled: e.target.checked })}
                    className="w-4 h-4 rounded text-amber-500"
                  />
                  <span>সক্রিয় রাখুন</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button type="button" onClick={() => setShowAddressModal(false)} className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-blue-900">বাতিল</button>
                <button type="submit" className="px-4 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold">সংরক্ষণ</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Contact Modal (Phone / WhatsApp) */}
      {showContactModal && editingContact && (
        <div className="fixed inset-0 z-60 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 animate-fadeIn">
          <div className="w-full max-w-md bg-white dark:bg-[#0B1E3F] rounded-3xl p-5 border border-slate-200 dark:border-blue-900 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                {contactType === 'whatsapp' ? 'হোয়াটসঅ্যাপ নম্বর' : 'ফোন নম্বর'} যোগ/এডিট
              </h3>
              <button type="button" onClick={() => setShowContactModal(false)}><X className="w-4 h-4" /></button>
            </div>

            <form onSubmit={handleSaveContact} className="space-y-3">
              <div>
                <label className="font-bold block mb-1">লেবেল / পদবী (Title)</label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: হটলাইন, কাস্টমার কেয়ার"
                  value={editingContact.title || ''}
                  onChange={(e) => setEditingContact({ ...editingContact, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-blue-950/80 border border-slate-300 dark:border-blue-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">নম্বর (Number)</label>
                <input
                  type="text"
                  required
                  placeholder="+880 1800-123456"
                  value={editingContact.number || ''}
                  onChange={(e) => setEditingContact({ ...editingContact, number: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-blue-950/80 border border-slate-300 dark:border-blue-800 text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div className="flex items-center gap-4 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingContact.isDefault ?? false}
                    onChange={(e) => setEditingContact({ ...editingContact, isDefault: e.target.checked })}
                    className="w-4 h-4 rounded text-amber-500"
                  />
                  <span>ডিফল্ট কন্টাক্ট (Primary)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingContact.isEnabled ?? true}
                    onChange={(e) => setEditingContact({ ...editingContact, isEnabled: e.target.checked })}
                    className="w-4 h-4 rounded text-amber-500"
                  />
                  <span>সক্রিয় রাখুন</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button type="button" onClick={() => setShowContactModal(false)} className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-blue-900">বাতিল</button>
                <button type="submit" className="px-4 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold">সংরক্ষণ</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Email Modal */}
      {showEmailModal && editingEmail && (
        <div className="fixed inset-0 z-60 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 animate-fadeIn">
          <div className="w-full max-w-md bg-white dark:bg-[#0B1E3F] rounded-3xl p-5 border border-slate-200 dark:border-blue-900 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">ইমেইল কন্টাক্ট যোগ/এডিট</h3>
              <button type="button" onClick={() => setShowEmailModal(false)}><X className="w-4 h-4" /></button>
            </div>

            <form onSubmit={handleSaveEmail} className="space-y-3">
              <div>
                <label className="font-bold block mb-1">লেবেল / পদবী (Title)</label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: প্রধান ইমেইল, কাস্টমার সাপোর্ট"
                  value={editingEmail.title || ''}
                  onChange={(e) => setEditingEmail({ ...editingEmail, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-blue-950/80 border border-slate-300 dark:border-blue-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">ইমেইল ঠিকানা</label>
                <input
                  type="email"
                  required
                  placeholder="contact@jihanstore.com"
                  value={editingEmail.email || ''}
                  onChange={(e) => setEditingEmail({ ...editingEmail, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-blue-950/80 border border-slate-300 dark:border-blue-800 text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div className="flex items-center gap-4 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingEmail.isDefault ?? false}
                    onChange={(e) => setEditingEmail({ ...editingEmail, isDefault: e.target.checked })}
                    className="w-4 h-4 rounded text-amber-500"
                  />
                  <span>প্রধান ইমেইল (Primary)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingEmail.isEnabled ?? true}
                    onChange={(e) => setEditingEmail({ ...editingEmail, isEnabled: e.target.checked })}
                    className="w-4 h-4 rounded text-amber-500"
                  />
                  <span>সক্রিয় রাখুন</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button type="button" onClick={() => setShowEmailModal(false)} className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-blue-900">বাতিল</button>
                <button type="submit" className="px-4 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold">সংরক্ষণ</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Social Link Modal */}
      {showSocialModal && editingSocial && (
        <div className="fixed inset-0 z-60 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 animate-fadeIn">
          <div className="w-full max-w-md bg-white dark:bg-[#0B1E3F] rounded-3xl p-5 border border-slate-200 dark:border-blue-900 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">সোশ্যাল লিংক যোগ/এডিট</h3>
              <button type="button" onClick={() => setShowSocialModal(false)}><X className="w-4 h-4" /></button>
            </div>

            <form onSubmit={handleSaveSocial} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold block mb-1">প্ল্যাটফর্ম</label>
                  <select
                    value={editingSocial.platform || 'facebook'}
                    onChange={(e: any) => setEditingSocial({ ...editingSocial, platform: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-blue-950/80 border border-slate-300 dark:border-blue-800 text-slate-900 dark:text-white font-bold"
                  >
                    <option value="facebook">Facebook</option>
                    <option value="youtube">YouTube</option>
                    <option value="instagram">Instagram</option>
                    <option value="tiktok">TikTok</option>
                    <option value="whatsapp">WhatsApp</option>
                    <option value="twitter">Twitter / X</option>
                    <option value="linkedin">LinkedIn</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold block mb-1">লেবেল / নাম</label>
                  <input
                    type="text"
                    required
                    placeholder="যেমন: Facebook Page"
                    value={editingSocial.title || ''}
                    onChange={(e) => setEditingSocial({ ...editingSocial, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-blue-950/80 border border-slate-300 dark:border-blue-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold block mb-1">URL লিংক</label>
                <input
                  type="url"
                  required
                  placeholder="https://facebook.com/jihanstore"
                  value={editingSocial.url || ''}
                  onChange={(e) => setEditingSocial({ ...editingSocial, url: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-blue-950/80 border border-slate-300 dark:border-blue-800 text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">প্রদর্শন ক্রম (Order)</label>
                <input
                  type="number"
                  min={1}
                  value={editingSocial.displayOrder || 1}
                  onChange={(e) => setEditingSocial({ ...editingSocial, displayOrder: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-blue-950/80 border border-slate-300 dark:border-blue-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button type="button" onClick={() => setShowSocialModal(false)} className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-blue-900">বাতিল</button>
                <button type="submit" className="px-4 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold">সংরক্ষণ</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
