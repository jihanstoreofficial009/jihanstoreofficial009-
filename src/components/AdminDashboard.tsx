import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  X, 
  LayoutDashboard, 
  Package, 
  FolderTree, 
  ShoppingBag, 
  Users, 
  Wallet, 
  Tag, 
  Sliders, 
  Download, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  AlertCircle,
  Database,
  Search,
  ExternalLink,
  DollarSign,
  TrendingUp,
  FileSpreadsheet,
  ShieldCheck,
  Megaphone,
  Bot,
  Send,
  CheckCircle2,
  Crown
} from 'lucide-react';
import { Product, Category, Order, OrderStatus, WalletTransaction, Coupon, StoreSettings } from '../types/store';
import { AdminLogosManager } from './admin/AdminLogosManager';
import { AdminAdsManager } from './admin/AdminAdsManager';
import { AdminContentManager } from './admin/AdminContentManager';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  onViewInvoice: (order: Order) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  onViewInvoice
}) => {
  const {
    products,
    categories,
    orders,
    walletTransactions,
    coupons,
    settings,
    saveProduct,
    deleteProduct,
    saveCategory,
    deleteCategory,
    saveCoupon,
    deleteCoupon,
    updateOrderStatus,
    approveTransaction,
    rejectTransaction,
    updateStoreSettings,
    seedInitialDataToFirestore,
    addToast,
    sendTelegramTestNotification
  } = useStore();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'orders' | 'products' | 'categories' | 'logos' | 'ads' | 'wallet' | 'coupons' | 'settings' | 'export'
  >('overview');

  const [isSendingTelegramTest, setIsSendingTelegramTest] = useState(false);
  const [telegramTestStatus, setTelegramTestStatus] = useState<string | null>(null);

  // Product Modal Form State
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);

  // Category Modal Form State
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Partial<Category> | null>(null);

  // Coupon Modal Form State
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponType, setCouponType] = useState<'percentage' | 'fixed'>('fixed');
  const [couponValue, setCouponValue] = useState<number>(50);
  const [couponMin, setCouponMin] = useState<number>(500);

  // Orders Filter & Search
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [orderSearch, setOrderSearch] = useState<string>('');

  // Settings State
  const [settingsForm, setSettingsForm] = useState<StoreSettings>(settings);

  // Product Search
  const [productSearch, setProductSearch] = useState('');

  if (!isOpen) return null;

  // Overview Calculations
  const totalRevenue = orders
    .filter(o => o.orderStatus !== 'cancelled')
    .reduce((sum, o) => sum + o.totalAmount, 0);
  const pendingOrdersCount = orders.filter(o => o.orderStatus === 'pending').length;
  const pendingWalletCount = walletTransactions.filter(t => t.status === 'pending').length;
  const lowStockProducts = products.filter(p => p.stock <= 5);

  // Handlers for Product Save
  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    await saveProduct(editingProduct);
    setShowProductModal(false);
    setEditingProduct(null);
  };

  // Handlers for Category Save
  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;
    await saveCategory(editingCategory);
    setShowCategoryModal(false);
    setEditingCategory(null);
  };

  // Handlers for Coupon Save
  const handleCouponSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveCoupon({
      code: couponCode.trim().toUpperCase(),
      discountType: couponType,
      discountValue: couponValue,
      minOrder: couponMin,
      isActive: true
    });
    setShowCouponModal(false);
    setCouponCode('');
  };

  // Handlers for Settings Save
  const handleSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateStoreSettings(settingsForm);
  };

  // CSV Exporter Helper
  const exportToCSV = (data: any[], filename: string) => {
    if (data.length === 0) {
      addToast('এক্সপোর্ট করার জন্য কোনো তথ্য নেই', 'info');
      return;
    }
    const headers = Object.keys(data[0]);
    const rows = data.map(obj => 
      headers.map(h => {
        let val = obj[h];
        if (typeof val === 'object') val = JSON.stringify(val);
        return `"${String(val).replace(/"/g, '""')}"`;
      }).join(',')
    );
    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast(`${filename} সফলভাবে এক্সপোর্ট হয়েছে!`, 'success');
  };

  // Filtered Orders
  const filteredOrders = orders.filter(o => {
    const matchStatus = orderStatusFilter === 'all' || o.orderStatus === orderStatusFilter;
    const matchSearch = orderSearch === '' || 
      o.id.toLowerCase().includes(orderSearch.toLowerCase()) || 
      o.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.phone.includes(orderSearch);
    return matchStatus && matchSearch;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-fadeIn">
      <div className="relative w-full max-w-6xl bg-white dark:bg-[#07162E] rounded-3xl shadow-2xl border border-slate-200 dark:border-blue-900/80 h-[95vh] flex flex-col overflow-hidden text-slate-800 dark:text-slate-100">
        {/* Admin Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-blue-900/60 bg-[#0B1E3F] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black tracking-tight">
                  জিহান স্টোর — এডমিন কন্ট্রোল প্যানেল
                </h1>
                <span className="px-2 py-0.5 rounded bg-amber-400 text-slate-950 font-black text-[10px] uppercase">
                  Verified Admin
                </span>
              </div>
              <p className="text-xs text-amber-300/80">
                “বিশ্বাসের সাথে অনলাইন শপিং” — সম্পূর্ণ ব্যাকএন্ড ও স্টোর ব্যবস্থাপনা
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={seedInitialDataToFirestore}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-900/70 hover:bg-blue-800 text-amber-300 border border-amber-500/30 text-xs font-semibold transition"
              title="Sync demo catalog to Firestore"
            >
              <Database className="w-3.5 h-3.5" />
              <span>ডাটাবেজ সিঙ্ক / রিলোড</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-blue-900/50"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Admin Body (Sidebar + Content) */}
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar */}
          <aside className="w-48 sm:w-56 bg-slate-50 dark:bg-[#0B1E3F]/50 border-r border-slate-200 dark:border-blue-900/60 p-2 sm:p-3 space-y-1 overflow-y-auto shrink-0 text-xs font-bold">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full py-2.5 px-3 rounded-xl flex items-center gap-2.5 transition text-left ${
                activeTab === 'overview'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-blue-900/40'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>ড্যাশবোর্ড (Overview)</span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full py-2.5 px-3 rounded-xl flex items-center justify-between transition text-left ${
                activeTab === 'orders'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-blue-900/40'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="w-4 h-4" />
                <span>অর্ডার সমূহ</span>
              </div>
              {pendingOrdersCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] flex items-center justify-center font-bold">
                  {pendingOrdersCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`w-full py-2.5 px-3 rounded-xl flex items-center gap-2.5 transition text-left ${
                activeTab === 'products'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-blue-900/40'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>পণ্য ব্যবস্থাপনা ({products.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('categories')}
              className={`w-full py-2.5 px-3 rounded-xl flex items-center gap-2.5 transition text-left ${
                activeTab === 'categories'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-blue-900/40'
              }`}
            >
              <FolderTree className="w-4 h-4" />
              <span>ক্যাটাগরি সমূহ</span>
            </button>

            <button
              onClick={() => setActiveTab('logos')}
              className={`w-full py-2.5 px-3 rounded-xl flex items-center gap-2.5 transition text-left ${
                activeTab === 'logos'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-blue-900/40'
              }`}
            >
              <Crown className="w-4 h-4" />
              <span>লোগো ও ব্র্যান্ডিং (3 Logos)</span>
            </button>

            <button
              onClick={() => setActiveTab('ads')}
              className={`w-full py-2.5 px-3 rounded-xl flex items-center gap-2.5 transition text-left ${
                activeTab === 'ads'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-blue-900/40'
              }`}
            >
              <Megaphone className="w-4 h-4" />
              <span>বিজ্ঞাপন সেল (Ad Manager)</span>
            </button>

            <button
              onClick={() => setActiveTab('wallet')}
              className={`w-full py-2.5 px-3 rounded-xl flex items-center justify-between transition text-left ${
                activeTab === 'wallet'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-blue-900/40'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Wallet className="w-4 h-4" />
                <span>ওয়ালেট অডিট</span>
              </div>
              {pendingWalletCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 text-[10px] flex items-center justify-center font-black">
                  {pendingWalletCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('coupons')}
              className={`w-full py-2.5 px-3 rounded-xl flex items-center gap-2.5 transition text-left ${
                activeTab === 'coupons'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-blue-900/40'
              }`}
            >
              <Tag className="w-4 h-4" />
              <span>কুপন ও ছাড়</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full py-2.5 px-3 rounded-xl flex items-center gap-2.5 transition text-left ${
                activeTab === 'settings'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-blue-900/40'
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span>কন্টেন্ট ও স্টোর সেটিংস</span>
            </button>

            <button
              onClick={() => setActiveTab('export')}
              className={`w-full py-2.5 px-3 rounded-xl flex items-center gap-2.5 transition text-left ${
                activeTab === 'export'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-blue-900/40'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>ডাটা এক্সপোর্ট (CSV)</span>
            </button>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 space-y-6">
            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Metric Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 rounded-2xl bg-white dark:bg-blue-950/40 border border-slate-200 dark:border-blue-900/60 shadow-xs space-y-1">
                    <span className="text-xs text-slate-400 font-bold block">মোট বিক্রয় (Total Sales)</span>
                    <div className="text-2xl font-black text-amber-500">৳{totalRevenue.toLocaleString()}</div>
                    <span className="text-[10px] text-slate-400">সকল সফল অর্ডার</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-white dark:bg-blue-950/40 border border-slate-200 dark:border-blue-900/60 shadow-xs space-y-1">
                    <span className="text-xs text-slate-400 font-bold block">মোট অর্ডার</span>
                    <div className="text-2xl font-black text-slate-900 dark:text-white">{orders.length} টি</div>
                    <span className="text-[10px] text-amber-500 font-bold">{pendingOrdersCount} টি অপেক্ষমান (Pending)</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-white dark:bg-blue-950/40 border border-slate-200 dark:border-blue-900/60 shadow-xs space-y-1">
                    <span className="text-xs text-slate-400 font-bold block">মোট পণ্য তালিকা</span>
                    <div className="text-2xl font-black text-slate-900 dark:text-white">{products.length} টি</div>
                    <span className="text-[10px] text-rose-400 font-bold">{lowStockProducts.length} টি লো-স্টক</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-white dark:bg-blue-950/40 border border-slate-200 dark:border-blue-900/60 shadow-xs space-y-1">
                    <span className="text-xs text-slate-400 font-bold block">পেন্ডিং ওয়ালেট রিকোয়েস্ট</span>
                    <div className="text-2xl font-black text-amber-400">{pendingWalletCount} টি</div>
                    <span className="text-[10px] text-slate-400">ডিপোজিট ও উত্তোলন অনুমোদন</span>
                  </div>
                </div>

                {/* Low Stock Warning */}
                {lowStockProducts.length > 0 && (
                  <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 space-y-2">
                    <h3 className="text-xs font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1.5 uppercase">
                      <AlertCircle className="w-4 h-4" />
                      <span>স্টক সতর্কবার্তা (Low Stock Alerts)</span>
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {lowStockProducts.map(p => (
                        <span key={p.id} className="text-xs bg-white dark:bg-rose-900/40 px-2.5 py-1 rounded-lg border border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-200">
                          {p.title.slice(0, 30)}... (বাকি: <strong>{p.stock}</strong> টি)
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recent Orders Overview */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      সাম্প্রতিক অর্ডার সমূহ
                    </h3>
                    <button
                      onClick={() => setActiveTab('orders')}
                      className="text-xs font-bold text-amber-500 hover:underline"
                    >
                      সব অর্ডার দেখুন
                    </button>
                  </div>

                  <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-blue-900/60 bg-white dark:bg-blue-950/40">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 dark:bg-blue-900/30 border-b border-slate-200 dark:border-blue-900 text-slate-500">
                        <tr>
                          <th className="p-3">অর্ডার আইডি</th>
                          <th className="p-3">গ্রাহক</th>
                          <th className="p-3">তারিখ</th>
                          <th className="p-3">পেমেন্ট</th>
                          <th className="p-3">মোট</th>
                          <th className="p-3">স্ট্যাটাস</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-blue-900/40">
                        {orders.slice(0, 5).map(o => (
                          <tr key={o.id}>
                            <td className="p-3 font-mono font-bold text-amber-500">#{o.id}</td>
                            <td className="p-3">
                              <span className="font-bold block">{o.customerName}</span>
                              <span className="text-[10px] text-slate-400">{o.phone}</span>
                            </td>
                            <td className="p-3 text-slate-400">
                              {new Date(o.createdAt).toLocaleDateString('bn-BD')}
                            </td>
                            <td className="p-3 uppercase font-medium">{o.paymentMethod}</td>
                            <td className="p-3 font-bold text-slate-900 dark:text-white">৳{o.totalAmount}</td>
                            <td className="p-3">
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-500/10 text-amber-500">
                                {o.orderStatus}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ORDERS TAB */}
            {activeTab === 'orders' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
                  <div className="flex flex-wrap gap-1.5">
                    {['all', 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map(st => (
                      <button
                        key={st}
                        onClick={() => setOrderStatusFilter(st)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase transition ${
                          orderStatusFilter === st
                            ? 'bg-amber-500 text-slate-950 shadow-sm'
                            : 'bg-slate-100 dark:bg-blue-950/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>

                  <div className="relative w-full sm:w-64">
                    <input
                      type="text"
                      placeholder="অর্ডার বা ফোন খুঁজুন..."
                      value={orderSearch}
                      onChange={(e) => setOrderSearch(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-blue-950/60 border border-slate-200 dark:border-blue-800"
                    />
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
                  </div>
                </div>

                <div className="space-y-3">
                  {filteredOrders.length === 0 ? (
                    <div className="text-center py-12 text-slate-400 text-xs">
                      কোনো অর্ডার পাওয়া যায়নি।
                    </div>
                  ) : (
                    filteredOrders.map(ord => (
                      <div
                        key={ord.id}
                        className="p-4 rounded-2xl bg-white dark:bg-blue-950/40 border border-slate-200 dark:border-blue-900/60 space-y-3 text-xs"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-100 dark:border-blue-900/50">
                          <div>
                            <span className="font-mono font-bold text-amber-500 text-sm">#{ord.id}</span>
                            <span className="text-slate-400 ml-2">
                              {new Date(ord.createdAt).toLocaleString('bn-BD')}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 dark:text-white">
                              মোট: ৳{ord.totalAmount.toLocaleString()}
                            </span>
                            <button
                              onClick={() => onViewInvoice(ord)}
                              className="px-2.5 py-1 rounded bg-slate-100 dark:bg-blue-900/50 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-200"
                            >
                              রশিদ / ইনভয়েস
                            </button>
                          </div>
                        </div>

                        {/* Customer & Address Details */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600 dark:text-slate-300">
                          <div>
                            <span className="text-slate-400 block text-[11px]">গ্রাহক:</span>
                            <strong>{ord.customerName}</strong> ({ord.phone})
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[11px]">ডেলিভারি ঠিকানা:</span>
                            {ord.address}, {ord.city}
                          </div>
                        </div>

                        {/* Status Change Buttons */}
                        <div className="pt-2 border-t border-slate-100 dark:border-blue-900/50 flex flex-wrap items-center gap-2">
                          <span className="text-slate-400 font-bold">স্ট্যাটাস পরিবর্তন:</span>
                          {(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'] as OrderStatus[]).map(st => (
                            <button
                              key={st}
                              onClick={() => updateOrderStatus(ord.id, st)}
                              className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase transition ${
                                ord.orderStatus === st
                                  ? 'bg-amber-500 text-slate-950 font-black'
                                  : 'bg-slate-100 dark:bg-blue-900/30 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                              }`}
                            >
                              {st}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* PRODUCTS TAB */}
            {activeTab === 'products' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <button
                    onClick={() => {
                      setEditingProduct({
                        title: '',
                        titleBn: '',
                        price: 1000,
                        discountPrice: 850,
                        category: categories[0]?.id || 'electronics',
                        stock: 20,
                        description: '',
                        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800',
                        isFeatured: false,
                        badge: 'NEW'
                      });
                      setShowProductModal(true);
                    }}
                    className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold hover:bg-amber-400 transition flex items-center gap-1.5 shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>নতুন পণ্য যুক্ত করুন</span>
                  </button>

                  <div className="relative w-full sm:w-64">
                    <input
                      type="text"
                      placeholder="পণ্য খুঁজুন..."
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-blue-950/60 border border-slate-200 dark:border-blue-800"
                    />
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {products
                    .filter(p => p.title.toLowerCase().includes(productSearch.toLowerCase()) || (p.titleBn && p.titleBn.includes(productSearch)))
                    .map(p => (
                      <div
                        key={p.id}
                        className="p-3.5 rounded-2xl bg-white dark:bg-blue-950/40 border border-slate-200 dark:border-blue-900/60 flex flex-col justify-between space-y-2 text-xs"
                      >
                        <div className="flex gap-3">
                          <img src={p.image} alt={p.title} className="w-14 h-14 rounded-xl object-cover bg-slate-100 shrink-0" />
                          <div className="min-w-0 flex-1">
                            <h4 className="font-bold text-slate-900 dark:text-white truncate">{p.titleBn || p.title}</h4>
                            <span className="text-amber-500 font-black block mt-0.5">৳{p.discountPrice ?? p.price}</span>
                            <span className="text-[10px] text-slate-400">স্টক: {p.stock} টি</span>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-slate-100 dark:border-blue-900/50 flex items-center justify-between">
                          <span className="text-[10px] uppercase font-bold text-slate-400">{p.category}</span>
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => {
                                setEditingProduct(p);
                                setShowProductModal(true);
                              }}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/40 rounded"
                              title="Edit"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => deleteProduct(p.id)}
                              className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* CATEGORIES TAB */}
            {activeTab === 'categories' && (
              <div className="space-y-4">
                <button
                  onClick={() => {
                    setEditingCategory({ name: '', nameBn: '', icon: 'Sparkles' });
                    setShowCategoryModal(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold hover:bg-amber-400 transition flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>নতুন ক্যাটাগরি তৈরি করুন</span>
                </button>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {categories.map(c => (
                    <div
                      key={c.id}
                      className="p-4 rounded-2xl bg-white dark:bg-blue-950/40 border border-slate-200 dark:border-blue-900/60 flex items-center justify-between text-xs"
                    >
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white">{c.nameBn || c.name}</h4>
                        <span className="text-[10px] text-slate-400 block">{c.name} ({c.id})</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            setEditingCategory(c);
                            setShowCategoryModal(true);
                          }}
                          className="p-1.5 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/40 rounded"
                          title="Edit Category"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteCategory(c.id)}
                          className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded"
                          title="Delete Category"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* WALLET AUDIT TAB */}
            {activeTab === 'wallet' && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  ওয়ালেট ডিপোজিট ও উত্তোলন অনুমোদন (Audit Requests)
                </h3>

                <div className="space-y-3">
                  {walletTransactions.length === 0 ? (
                    <div className="text-center py-10 text-xs text-slate-400">
                      কোনো ওয়ালেট রিকোয়েস্ট জমা নেই।
                    </div>
                  ) : (
                    walletTransactions.map(tx => (
                      <div
                        key={tx.id}
                        className="p-4 rounded-2xl bg-white dark:bg-blue-950/40 border border-slate-200 dark:border-blue-900/60 flex flex-wrap items-center justify-between gap-3 text-xs"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 dark:text-white uppercase">
                              {tx.type} — ৳{tx.amount.toLocaleString()}
                            </span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              tx.status === 'pending' ? 'bg-amber-500/15 text-amber-500' : 'bg-emerald-500/15 text-emerald-500'
                            }`}>
                              {tx.status}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-400 block mt-0.5">
                            গ্রাহক: {tx.userName} ({tx.userEmail}) • মেথড: {tx.method?.toUpperCase()}
                            {tx.senderNumber ? ` • প্রেরক নম্বর: ${tx.senderNumber}` : ''}
                            {tx.trxId ? ` • TrxID: ${tx.trxId}` : ''}
                          </span>
                        </div>

                        {tx.status === 'pending' && (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => approveTransaction(tx)}
                              className="px-3 py-1.5 rounded-xl bg-emerald-500 text-white font-bold text-xs hover:bg-emerald-600 transition"
                            >
                              অনুমোদন (Approve)
                            </button>
                            <button
                              onClick={() => rejectTransaction(tx.id, 'Invalid transaction ID')}
                              className="px-3 py-1.5 rounded-xl bg-rose-500 text-white font-bold text-xs hover:bg-rose-600 transition"
                            >
                              বাতিল (Reject)
                            </button>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* COUPONS TAB */}
            {activeTab === 'coupons' && (
              <div className="space-y-4">
                <button
                  onClick={() => setShowCouponModal(true)}
                  className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold hover:bg-amber-400 transition flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>নতুন কুপন যোগ করুন</span>
                </button>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {coupons.map(cp => (
                    <div
                      key={cp.code}
                      className="p-4 rounded-2xl bg-white dark:bg-blue-950/40 border border-slate-200 dark:border-blue-900/60 flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-mono font-black text-amber-500 text-sm block">{cp.code}</span>
                        <span className="text-slate-400">
                          ছাড়: {cp.discountType === 'percentage' ? `${cp.discountValue}%` : `৳${cp.discountValue}`} • সর্বনিম্ন: ৳{cp.minOrder}
                        </span>
                      </div>
                      <button
                        onClick={() => deleteCoupon(cp.code)}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 rounded"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* LOGOS & BRANDING TAB (3 LOGOS DYNAMIC MANAGER) */}
            {activeTab === 'logos' && (
              <AdminLogosManager />
            )}

            {/* ADVANCED AD MANAGER TAB */}
            {activeTab === 'ads' && (
              <AdminAdsManager />
            )}

            {/* DYNAMIC STORE SETTINGS & MULTI-CONTENT TAB */}
            {activeTab === 'settings' && (
              <AdminContentManager />
            )}

            {/* EXPORT DATA TAB */}
            {activeTab === 'export' && (
              <div className="space-y-4 max-w-xl text-xs">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  রিপোর্ট ও ডাটা ডাউনলোড (CSV Export)
                </h3>
                <p className="text-slate-400">
                  আপনার সকল অর্ডার, পণ্য ও লেনদেনের ডাটা এক্সেল বা সিএসভি ফাইলে ডাউনলোড করুন।
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <button
                    onClick={() => exportToCSV(orders, 'jihan_orders')}
                    className="p-4 rounded-2xl bg-white dark:bg-blue-950/40 border border-slate-200 dark:border-blue-900/60 hover:border-amber-500 flex flex-col items-center justify-center gap-2 font-bold transition"
                  >
                    <Download className="w-6 h-6 text-amber-500" />
                    <span>অর্ডার সমূহ (Orders)</span>
                  </button>

                  <button
                    onClick={() => exportToCSV(products, 'jihan_products')}
                    className="p-4 rounded-2xl bg-white dark:bg-blue-950/40 border border-slate-200 dark:border-blue-900/60 hover:border-amber-500 flex flex-col items-center justify-center gap-2 font-bold transition"
                  >
                    <Download className="w-6 h-6 text-amber-500" />
                    <span>পণ্য সমূহ (Products)</span>
                  </button>

                  <button
                    onClick={() => exportToCSV(walletTransactions, 'jihan_transactions')}
                    className="p-4 rounded-2xl bg-white dark:bg-blue-950/40 border border-slate-200 dark:border-blue-900/60 hover:border-amber-500 flex flex-col items-center justify-center gap-2 font-bold transition"
                  >
                    <Download className="w-6 h-6 text-amber-500" />
                    <span>লেনদেন (Wallet)</span>
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Product Add/Edit Modal */}
      {showProductModal && editingProduct && (
        <div className="fixed inset-0 z-60 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3">
          <div className="w-full max-w-lg bg-white dark:bg-[#0B1E3F] rounded-3xl p-6 border border-slate-200 dark:border-blue-900 space-y-4 max-h-[90vh] overflow-y-auto text-xs">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                {editingProduct.id ? 'পণ্য সম্পাদনা করুন' : 'নতুন পণ্য যোগ করুন'}
              </h3>
              <button onClick={() => setShowProductModal(false)}><X className="w-4 h-4" /></button>
            </div>

            <form onSubmit={handleProductSubmit} className="space-y-3">
              <div>
                <label className="font-bold block mb-1">পণ্যের নাম (English)</label>
                <input
                  type="text"
                  required
                  value={editingProduct.title || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-blue-950/60 border border-slate-200 dark:border-blue-800"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">পণ্যের নাম (বাংলা)</label>
                <input
                  type="text"
                  value={editingProduct.titleBn || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, titleBn: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-blue-950/60 border border-slate-200 dark:border-blue-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold block mb-1">মূল্য (৳)</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.price || 0}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-blue-950/60 border border-slate-200 dark:border-blue-800"
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1">ছাড়কৃত মূল্য (ঐচ্ছিক)</label>
                  <input
                    type="number"
                    value={editingProduct.discountPrice || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, discountPrice: e.target.value ? Number(e.target.value) : undefined })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-blue-950/60 border border-slate-200 dark:border-blue-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold block mb-1">ক্যাটাগরি</label>
                  <select
                    value={editingProduct.category}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-blue-950/60 border border-slate-200 dark:border-blue-800"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.nameBn || c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold block mb-1">স্টক পরিমাণ</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.stock || 0}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-blue-950/60 border border-slate-200 dark:border-blue-800"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold block mb-1">ছবির URL</label>
                <input
                  type="url"
                  required
                  value={editingProduct.image || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-blue-950/60 border border-slate-200 dark:border-blue-800"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">ব্যাজ (যেমন: HOT, NEW)</label>
                <input
                  type="text"
                  value={editingProduct.badge || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, badge: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-blue-950/60 border border-slate-200 dark:border-blue-800"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">বিবরণ</label>
                <textarea
                  rows={3}
                  value={editingProduct.description || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-blue-950/60 border border-slate-200 dark:border-blue-800"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold hover:bg-amber-400"
              >
                সংরক্ষণ করুন
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Category Modal */}
      {showCategoryModal && editingCategory && (
        <div className="fixed inset-0 z-60 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 animate-fadeIn">
          <div className="w-full max-w-sm bg-white dark:bg-[#0B1E3F] rounded-3xl p-6 border border-slate-200 dark:border-blue-900 space-y-4 text-xs">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                {editingCategory.id ? 'ক্যাটাগরি সম্পাদনা' : 'নতুন ক্যাটাগরি তৈরি'}
              </h3>
              <button onClick={() => setShowCategoryModal(false)}><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleCategorySubmit} className="space-y-3">
              <div>
                <label className="font-bold block mb-1">নাম (English)</label>
                <input
                  type="text"
                  required
                  value={editingCategory.name || ''}
                  onChange={(e) => setEditingCategory({ 
                    ...editingCategory, 
                    name: e.target.value,
                    id: editingCategory.id || e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '-')
                  })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-blue-950/60 border border-slate-200 dark:border-blue-800"
                />
              </div>
              <div>
                <label className="font-bold block mb-1">নাম (বাংলা)</label>
                <input
                  type="text"
                  placeholder="যেমন: স্মার্ট গ্যাজেট"
                  value={editingCategory.nameBn || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, nameBn: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-blue-950/60 border border-slate-200 dark:border-blue-800"
                />
              </div>
              <div>
                <label className="font-bold block mb-1">আইকন (Icon)</label>
                <select
                  value={editingCategory.icon || 'Sparkles'}
                  onChange={(e) => setEditingCategory({ ...editingCategory, icon: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-blue-950/60 border border-slate-200 dark:border-blue-800 font-bold"
                >
                  <option value="Sparkles">Sparkles (ফিচার্ড / বিশেষ)</option>
                  <option value="Smartphone">Smartphone (ইলেকট্রনিক্স ও গ্যাজেট)</option>
                  <option value="Shirt">Shirt (পোশাক ও ফ্যাশন)</option>
                  <option value="Watch">Watch (ঘড়ি ও প্রিমিয়াম এক্সেসরিজ)</option>
                  <option value="Heart">Heart (সৌন্দর্য ও লাইফস্টাইল)</option>
                  <option value="Home">Home (হোম ও লিভিং)</option>
                  <option value="Layers">Layers (অন্যান্য সকল পণ্য)</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 cursor-pointer"
              >
                সংরক্ষণ করুন
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Coupon Modal */}
      {showCouponModal && (
        <div className="fixed inset-0 z-60 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3">
          <div className="w-full max-w-sm bg-white dark:bg-[#0B1E3F] rounded-3xl p-6 border border-slate-200 dark:border-blue-900 space-y-4 text-xs">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-sm">নতুন কুপন কোড</h3>
              <button onClick={() => setShowCouponModal(false)}><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleCouponSubmit} className="space-y-3">
              <div>
                <label className="font-bold block mb-1">কুপন কোড (যেমন: JIHAN100)</label>
                <input
                  type="text"
                  required
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-blue-950/60 border border-slate-200 dark:border-blue-800 uppercase"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold block mb-1">ধরন</label>
                  <select
                    value={couponType}
                    onChange={(e: any) => setCouponType(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-blue-950/60 border border-slate-200 dark:border-blue-800"
                  >
                    <option value="fixed">নির্দিষ্ট টাকা (Fixed ৳)</option>
                    <option value="percentage">শতকরা (% Off)</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold block mb-1">ছাড় পরিমাণ</label>
                  <input
                    type="number"
                    required
                    value={couponValue}
                    onChange={(e) => setCouponValue(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-blue-950/60 border border-slate-200 dark:border-blue-800"
                  />
                </div>
              </div>
              <div>
                <label className="font-bold block mb-1">সর্বনিম্ন অর্ডার মূল্য (৳)</label>
                <input
                  type="number"
                  required
                  value={couponMin}
                  onChange={(e) => setCouponMin(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-blue-950/60 border border-slate-200 dark:border-blue-800"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold hover:bg-amber-400"
              >
                কুপন সক্রিয় করুন
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
