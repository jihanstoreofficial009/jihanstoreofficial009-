import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  X, 
  Package, 
  Wallet, 
  User as UserIcon, 
  LogOut, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  Truck, 
  AlertCircle,
  PlusCircle,
  ArrowUpRight,
  ArrowDownLeft,
  Smartphone,
  FileText,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { Order, OrderStatus } from '../types/store';

interface CustomerAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'orders' | 'wallet' | 'profile';
  onViewInvoice: (order: Order) => void;
}

export const CustomerAccountModal: React.FC<CustomerAccountModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'orders',
  onViewInvoice
}) => {
  const {
    user,
    userProfile,
    orders,
    walletTransactions,
    cancelOrder,
    requestDeposit,
    requestWithdraw,
    updateUserProfile,
    logout,
    settings
  } = useStore();

  const [activeTab, setActiveTab] = useState<'orders' | 'wallet' | 'profile'>(initialTab);

  // Profile Edit State
  const [displayName, setDisplayName] = useState(userProfile?.displayName || user?.displayName || '');
  const [phone, setPhone] = useState(userProfile?.phone || '');
  const [address, setAddress] = useState(userProfile?.address || '');
  const [city, setCity] = useState(userProfile?.city || '');
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Wallet Modal States
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState<number>(500);
  const [depositMethod, setDepositMethod] = useState<'bkash' | 'nagad' | 'rocket' | 'bank'>('bkash');
  const [depositSender, setDepositSender] = useState('');
  const [depositTrxId, setDepositTrxId] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState<number>(500);
  const [withdrawMethod, setWithdrawMethod] = useState<'bkash' | 'nagad' | 'rocket' | 'bank'>('bkash');
  const [withdrawAccount, setWithdrawAccount] = useState('');
  const [isSubmittingTx, setIsSubmittingTx] = useState(false);
  const [txError, setTxError] = useState('');

  if (!isOpen) return null;

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    await updateUserProfile({
      displayName,
      phone,
      address,
      city
    });
    setIsSavingProfile(false);
  };

  const handleDepositSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTxError('');
    if (depositAmount <= 0) {
      setTxError('সঠিক টাকার পরিমাণ দিন');
      return;
    }
    if (!depositSender.trim() || !depositTrxId.trim()) {
      setTxError('প্রেরক নম্বর এবং TrxID দেওয়া বাধ্যতামূলক');
      return;
    }

    setIsSubmittingTx(true);
    try {
      await requestDeposit(depositAmount, depositMethod, depositSender.trim(), depositTrxId.trim());
      setShowDepositModal(false);
      setDepositSender('');
      setDepositTrxId('');
    } catch (err: any) {
      setTxError(err?.message || 'ডিপোজিট রিকোয়েস্ট পাঠাতে সমস্যা হয়েছে');
    } finally {
      setIsSubmittingTx(false);
    }
  };

  const handleWithdrawSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTxError('');
    if (withdrawAmount <= 0) {
      setTxError('সঠিক টাকার পরিমাণ দিন');
      return;
    }
    if (!withdrawAccount.trim()) {
      setTxError('হিসাব/মোবাইল নম্বর দেওয়া বাধ্যতামূলক');
      return;
    }

    setIsSubmittingTx(true);
    try {
      await requestWithdraw(withdrawAmount, withdrawMethod, withdrawAccount.trim());
      setShowWithdrawModal(false);
      setWithdrawAccount('');
    } catch (err: any) {
      setTxError(err?.message || 'উত্তোলন রিকোয়েস্ট পাঠাতে সমস্যা হয়েছে');
    } finally {
      setIsSubmittingTx(false);
    }
  };

  // Helper for Order Status Stepper
  const renderStatusStepper = (status: OrderStatus) => {
    const steps: { key: OrderStatus; label: string }[] = [
      { key: 'pending', label: 'পেন্ডিং' },
      { key: 'confirmed', label: 'কনফার্ম' },
      { key: 'processing', label: 'প্রসেসিং' },
      { key: 'shipped', label: 'শিপড' },
      { key: 'delivered', label: 'ডেলিভার্ড' },
    ];

    if (status === 'cancelled') {
      return (
        <div className="py-2 px-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center gap-1.5">
          <AlertCircle className="w-4 h-4" />
          <span>এই অর্ডারটি বাতিল করা হয়েছে (Cancelled)</span>
        </div>
      );
    }

    const currentIndex = steps.findIndex(s => s.key === status);

    return (
      <div className="py-3">
        <div className="flex items-center justify-between relative">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 dark:bg-blue-900 -translate-y-1/2 z-0"></div>
          {steps.map((step, index) => {
            const isCompleted = index <= currentIndex;
            const isCurrent = index === currentIndex;

            return (
              <div key={step.key} className="relative z-10 flex flex-col items-center">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold transition-all ${
                    isCurrent
                      ? 'bg-amber-500 text-slate-950 ring-4 ring-amber-500/20 scale-110'
                      : isCompleted
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-200 dark:bg-blue-950 text-slate-500'
                  }`}
                >
                  {isCompleted ? '✓' : index + 1}
                </div>
                <span className={`text-[10px] mt-1 font-semibold ${isCurrent ? 'text-amber-500 font-bold' : 'text-slate-500'}`}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-white dark:bg-[#0B1E3F] rounded-3xl shadow-2xl border border-slate-200 dark:border-blue-900 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-blue-900/60 flex items-center justify-between bg-slate-50/50 dark:bg-blue-950/30">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-700 via-blue-800 to-amber-500 text-white flex items-center justify-center font-black text-lg uppercase shadow-md">
              {userProfile?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  {userProfile?.displayName || user?.email?.split('@')[0]}
                </h2>
                <span className="px-2 py-0.5 rounded-md bg-amber-500/15 border border-amber-500/30 text-amber-500 text-[10px] font-bold uppercase">
                  {userProfile?.role === 'admin' ? 'Admin' : 'Customer'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {user?.email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                logout();
                onClose();
              }}
              className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition flex items-center gap-1.5 text-xs font-semibold"
              title="লগআউট"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">লগআউট</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 dark:border-blue-900/60 bg-white dark:bg-[#0B1E3F] px-4 sm:px-6">
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition ${
              activeTab === 'orders'
                ? 'border-amber-500 text-amber-500'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>আমার অর্ডার ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('wallet')}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition ${
              activeTab === 'wallet'
                ? 'border-amber-500 text-amber-500'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Wallet className="w-4 h-4" />
            <span>জিহান ওয়ালেট (৳{userProfile?.walletBalance ?? 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition ${
              activeTab === 'profile'
                ? 'border-amber-500 text-amber-500'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <UserIcon className="w-4 h-4" />
            <span>প্রোফাইল ও ঠিকানা</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 space-y-6">
          {/* TAB 1: ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              {orders.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-blue-950/60 flex items-center justify-center text-slate-400 mx-auto">
                    <Package className="w-8 h-8" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    এখনও কোনো অর্ডার করেননি
                  </h3>
                  <p className="text-xs text-slate-400">
                    পছন্দের পণ্য অর্ডার করুন এবং এখানে রিয়েল-টাইম ট্র্যাকিং দেখুন।
                  </p>
                </div>
              ) : (
                orders.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-blue-950/40 border border-slate-200 dark:border-blue-900/60 shadow-xs space-y-4"
                  >
                    {/* Order Header */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-blue-900/50">
                      <div>
                        <span className="text-xs text-slate-400 block">অর্ডার আইডি</span>
                        <span className="font-mono font-bold text-sm text-slate-900 dark:text-white">
                          #{ord.id}
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="text-xs text-slate-400 block">তারিখ</span>
                        <span className="text-xs text-slate-600 dark:text-slate-300">
                          {new Date(ord.createdAt).toLocaleDateString('bn-BD', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </span>
                      </div>

                      <div>
                        <span className="text-xs text-slate-400 block">সর্বমোট বিল</span>
                        <span className="font-black text-sm text-amber-500">
                          ৳{ord.totalAmount.toLocaleString()}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onViewInvoice(ord)}
                          className="px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/40 text-blue-950 dark:text-blue-300 text-xs font-semibold hover:bg-blue-100 flex items-center gap-1"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>রশিদ</span>
                        </button>

                        {ord.orderStatus === 'pending' && (
                          <button
                            onClick={() => cancelOrder(ord.id)}
                            className="px-3 py-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs font-semibold hover:bg-rose-100"
                          >
                            বাতিল করুন
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Stepper */}
                    {renderStatusStepper(ord.orderStatus)}

                    {/* Items List */}
                    <div className="space-y-2 pt-2">
                      {ord.items.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs py-1">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-10 h-10 rounded-lg object-cover bg-slate-100"
                            />
                            <div>
                              <span className="font-bold text-slate-900 dark:text-white block">
                                {item.title}
                              </span>
                              <span className="text-slate-400">
                                পরিমাণ: {item.quantity} পিস × ৳{item.price}
                              </span>
                            </div>
                          </div>
                          <span className="font-bold text-slate-900 dark:text-white">
                            ৳{(item.price * item.quantity).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Delivery & Payment details */}
                    <div className="pt-3 border-t border-slate-100 dark:border-blue-900/50 flex flex-wrap justify-between text-[11px] text-slate-500 dark:text-slate-400">
                      <div>
                        <span>ঠিকানা: </span>
                        <strong className="text-slate-700 dark:text-slate-300">{ord.address}, {ord.city}</strong>
                      </div>
                      <div>
                        <span>পেমেন্ট: </span>
                        <strong className="text-amber-500 uppercase">{ord.paymentMethod} ({ord.paymentStatus})</strong>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 2: WALLET */}
          {activeTab === 'wallet' && (
            <div className="space-y-6">
              {/* Luxury Gold Card */}
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-tr from-[#0F2449] via-[#0B1E3F] to-[#1E3A8A] text-white p-6 sm:p-8 shadow-xl border border-amber-500/30">
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>

                <div className="relative z-10 flex flex-col justify-between h-full space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-amber-400" />
                      <span className="text-xs font-bold tracking-widest uppercase text-amber-300">
                        Jihan Digital Wallet
                      </span>
                    </div>
                    <span className="text-xs text-slate-300 font-mono">
                      {userProfile?.uid ? userProfile.uid.slice(0, 10) + '...' : ''}
                    </span>
                  </div>

                  <div>
                    <span className="text-xs text-slate-400 block mb-1">মোট ওয়ালেট ব্যালেন্স</span>
                    <div className="text-3xl sm:text-4xl font-black text-amber-400 tracking-tight">
                      ৳{(userProfile?.walletBalance ?? 0).toLocaleString()}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      onClick={() => setShowDepositModal(true)}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 hover:from-amber-300 hover:to-amber-500 transition flex items-center gap-1.5"
                    >
                      <PlusCircle className="w-4 h-4" />
                      <span>টাকা জমা দিন (Deposit)</span>
                    </button>

                    <button
                      onClick={() => setShowWithdrawModal(true)}
                      className="px-5 py-2.5 rounded-xl bg-blue-900/60 border border-amber-400/30 text-white font-semibold text-xs hover:bg-blue-800 transition flex items-center gap-1.5"
                    >
                      <ArrowUpRight className="w-4 h-4 text-amber-400" />
                      <span>উত্তোলন রিকোয়েস্ট (Withdraw)</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Transactions List */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center justify-between">
                  <span>লেনদেনের ইতিহাস (Transactions)</span>
                  <span className="text-xs text-slate-400 font-normal">
                    {walletTransactions.length} টি রেকর্ড
                  </span>
                </h3>

                {walletTransactions.length === 0 ? (
                  <div className="text-center py-8 text-xs text-slate-400">
                    কোনো লেনদেনের তথ্য পাওয়া যায়নি।
                  </div>
                ) : (
                  <div className="space-y-2">
                    {walletTransactions.map((tx) => {
                      const isCredit = tx.type === 'deposit' || tx.type === 'refund';
                      const isPending = tx.status === 'pending';
                      const isRejected = tx.status === 'rejected';

                      return (
                        <div
                          key={tx.id}
                          className="flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-blue-950/40 border border-slate-200 dark:border-blue-900/50 text-xs"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold shrink-0 ${
                                isCredit
                                  ? 'bg-emerald-500/15 text-emerald-500'
                                  : 'bg-rose-500/15 text-rose-500'
                              }`}
                            >
                              {isCredit ? (
                                <ArrowDownLeft className="w-4 h-4" />
                              ) : (
                                <ArrowUpRight className="w-4 h-4" />
                              )}
                            </div>

                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-slate-900 dark:text-white capitalize">
                                  {tx.type === 'deposit'
                                    ? 'টাকা জমা (Deposit)'
                                    : tx.type === 'withdraw'
                                    ? 'উত্তোলন (Withdraw)'
                                    : tx.type === 'payment'
                                    ? 'অর্ডার পেমেন্ট'
                                    : 'রিফান্ড'}
                                </span>
                                <span
                                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                    isPending
                                      ? 'bg-amber-500/15 text-amber-500'
                                      : isRejected
                                      ? 'bg-rose-500/15 text-rose-500'
                                      : 'bg-emerald-500/15 text-emerald-500'
                                  }`}
                                >
                                  {tx.status}
                                </span>
                              </div>

                              <span className="text-[11px] text-slate-400 block mt-0.5">
                                {tx.method?.toUpperCase()} • {tx.trxId ? `TrxID: ${tx.trxId} • ` : ''}
                                {new Date(tx.createdAt).toLocaleDateString('bn-BD', {
                                  day: 'numeric',
                                  month: 'short',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            </div>
                          </div>

                          <div className="text-right">
                            <span
                              className={`font-black text-sm ${
                                isCredit ? 'text-emerald-500' : 'text-slate-900 dark:text-white'
                              }`}
                            >
                              {isCredit ? '+' : '-'}৳{tx.amount.toLocaleString()}
                            </span>
                            {tx.adminNote && (
                              <span className="text-[10px] text-slate-400 block">
                                {tx.adminNote}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: PROFILE */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-4 max-w-lg">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  আপনার নাম
                </label>
                <input
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-blue-950/60 border border-slate-200 dark:border-blue-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  মোবাইল নম্বর
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="01XXXXXXXXX"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-blue-950/60 border border-slate-200 dark:border-blue-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  ডিফল্ট ডেলিভারি ঠিকানা
                </label>
                <textarea
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="বাড়ি/ফ্ল্যাট, রোড, এলাকা..."
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-blue-950/60 border border-slate-200 dark:border-blue-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  শহর / জেলা
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="যেমন: ঢাকা"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-blue-950/60 border border-slate-200 dark:border-blue-800 text-slate-900 dark:text-white"
                />
              </div>

              <button
                type="submit"
                disabled={isSavingProfile}
                className="px-6 py-2.5 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold hover:bg-amber-400 disabled:opacity-50 transition"
              >
                {isSavingProfile ? 'সংরক্ষণ হচ্ছে...' : 'প্রোফাইল সংরক্ষণ করুন'}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Deposit Modal */}
      {showDepositModal && (
        <div className="fixed inset-0 z-60 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-[#0B1E3F] rounded-3xl p-6 border border-slate-200 dark:border-blue-900 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-amber-500" />
                <span>ওয়ালেটে টাকা জমা (Deposit)</span>
              </h3>
              <button onClick={() => setShowDepositModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {txError && (
              <div className="p-2.5 rounded-lg bg-rose-500/10 text-rose-500 text-xs">{txError}</div>
            )}

            <div className="p-3 rounded-xl bg-amber-50 dark:bg-blue-950/60 border border-amber-300 dark:border-blue-800 text-xs text-slate-700 dark:text-slate-300 space-y-1">
              <p>দয়া করে নিচের বিকাশ/নগদ নম্বরে <strong>Send Money</strong> করুন:</p>
              <strong className="text-amber-600 dark:text-amber-400 font-mono block text-sm">
                {settings.bkashNumber}
              </strong>
            </div>

            <form onSubmit={handleDepositSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold block mb-1">পেমেন্ট মেথড</label>
                <select
                  value={depositMethod}
                  onChange={(e: any) => setDepositMethod(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-blue-950/60 border border-slate-200 dark:border-blue-800"
                >
                  <option value="bkash">বিকাশ (bKash)</option>
                  <option value="nagad">নগদ (Nagad)</option>
                  <option value="rocket">রকেট (Rocket)</option>
                  <option value="bank">ব্যাংক ট্রান্সফার</option>
                </select>
              </div>

              <div>
                <label className="font-bold block mb-1">টাকার পরিমাণ (৳)</label>
                <input
                  type="number"
                  min={100}
                  required
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-blue-950/60 border border-slate-200 dark:border-blue-800 font-bold"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">যে নম্বর থেকে টাকা পাঠিয়েছেন</label>
                <input
                  type="tel"
                  required
                  placeholder="01XXXXXXXXX"
                  value={depositSender}
                  onChange={(e) => setDepositSender(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-blue-950/60 border border-slate-200 dark:border-blue-800"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">ট্রানজেকশন আইডি (TrxID)</label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: 9J48DX7Q"
                  value={depositTrxId}
                  onChange={(e) => setDepositTrxId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-blue-950/60 border border-slate-200 dark:border-blue-800 uppercase font-mono"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingTx}
                className="w-full py-3 rounded-xl bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 transition"
              >
                {isSubmittingTx ? 'সাবমিট হচ্ছে...' : 'রিকোয়েস্ট পাঠান'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-60 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-[#0B1E3F] rounded-3xl p-6 border border-slate-200 dark:border-blue-900 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ArrowUpRight className="w-5 h-5 text-amber-500" />
                <span>টাকা উত্তোলন (Withdraw)</span>
              </h3>
              <button onClick={() => setShowWithdrawModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {txError && (
              <div className="p-2.5 rounded-lg bg-rose-500/10 text-rose-500 text-xs">{txError}</div>
            )}

            <div className="text-xs text-slate-400">
              বর্তমান ব্যালেন্স: <strong className="text-amber-500">৳{userProfile?.walletBalance ?? 0}</strong>
            </div>

            <form onSubmit={handleWithdrawSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold block mb-1">উত্তোলন মেথড</label>
                <select
                  value={withdrawMethod}
                  onChange={(e: any) => setWithdrawMethod(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-blue-950/60 border border-slate-200 dark:border-blue-800"
                >
                  <option value="bkash">বিকাশ (bKash)</option>
                  <option value="nagad">নগদ (Nagad)</option>
                  <option value="rocket">রকেট (Rocket)</option>
                  <option value="bank">ব্যাংক একাউন্ট</option>
                </select>
              </div>

              <div>
                <label className="font-bold block mb-1">টাকার পরিমাণ (৳)</label>
                <input
                  type="number"
                  min={100}
                  max={userProfile?.walletBalance || 0}
                  required
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-blue-950/60 border border-slate-200 dark:border-blue-800 font-bold"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">যে নম্বরে/অ্যাকাউন্টে টাকা গ্রহণ করবেন</label>
                <input
                  type="text"
                  required
                  placeholder="01XXXXXXXXX বা ব্যাংক একাউন্ট নম্বর"
                  value={withdrawAccount}
                  onChange={(e) => setWithdrawAccount(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-blue-950/60 border border-slate-200 dark:border-blue-800"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingTx}
                className="w-full py-3 rounded-xl bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 transition"
              >
                {isSubmittingTx ? 'সাবমিট হচ্ছে...' : 'উত্তোলন রিকোয়েস্ট পাঠান'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
