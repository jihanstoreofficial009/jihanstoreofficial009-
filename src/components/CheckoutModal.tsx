import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import confetti from 'canvas-confetti';
import { 
  X, 
  CheckCircle2, 
  Truck, 
  Wallet, 
  CreditCard, 
  Smartphone, 
  MapPin, 
  Phone, 
  User, 
  FileText,
  AlertTriangle,
  ArrowRight,
  Printer
} from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onViewOrderDetails: (orderId: string) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  onViewOrderDetails
}) => {
  const {
    user,
    userProfile,
    cart,
    cartSubtotal,
    deliveryFee,
    discountAmount,
    cartTotal,
    selectedDeliveryArea,
    setSelectedDeliveryArea,
    placeOrder,
    settings,
    addToast
  } = useStore();

  const [customerName, setCustomerName] = useState(userProfile?.displayName || user?.displayName || '');
  const [phone, setPhone] = useState(userProfile?.phone || '');
  const [address, setAddress] = useState(userProfile?.address || '');
  const [city, setCity] = useState(userProfile?.city || 'Dhaka');
  const [note, setNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'wallet' | 'bkash' | 'nagad'>('cod');
  const [senderNumber, setSenderNumber] = useState('');
  const [trxId, setTrxId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [completedOrderId, setCompletedOrderId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCompleteOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!customerName.trim()) {
      setErrorMessage('আপনার পূর্ণ নাম লিখুন');
      return;
    }
    if (!phone.trim() || phone.length < 11) {
      setErrorMessage('সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন (যেমন: 01700000000)');
      return;
    }
    if (!address.trim()) {
      setErrorMessage('বিস্তারিত ডেলিভারি ঠিকানা লিখুন');
      return;
    }

    if ((paymentMethod === 'bkash' || paymentMethod === 'nagad') && !trxId.trim()) {
      setErrorMessage('পেমেন্ট ট্রানজেকশন আইডি (TrxID) লিখুন');
      return;
    }

    if (paymentMethod === 'wallet') {
      const balance = userProfile?.walletBalance || 0;
      if (balance < cartTotal) {
        setErrorMessage(`ওয়ালেট ব্যালেন্স অপর্যাপ্ত! আপনার ব্যালেন্স ৳${balance}, প্রয়োজন ৳${cartTotal}।`);
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const orderId = await placeOrder({
        customerName: customerName.trim(),
        phone: phone.trim(),
        address: address.trim(),
        city: city.trim(),
        note: note.trim(),
        paymentMethod,
        trxId: (paymentMethod === 'bkash' || paymentMethod === 'nagad') ? `${paymentMethod.toUpperCase()}-${senderNumber}-${trxId.trim()}` : undefined
      });

      // Confetti joy explosion!
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // Safe fallback
      }

      setCompletedOrderId(orderId);
    } catch (err: any) {
      setErrorMessage(err?.message || 'অর্ডার করতে সমস্যা হয়েছে। দয়া করে আবার চেষ্টা করুন।');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#0B1E3F] rounded-3xl shadow-2xl border border-slate-200 dark:border-blue-900 overflow-hidden my-auto max-h-[94vh] flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-blue-900/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold">
              ✓
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 dark:text-white">
                {completedOrderId ? 'অর্ডার সফলভাবে সম্পন্ন হয়েছে!' : 'চেকআউট ও ডেলিভারি বিবরণ'}
              </h2>
              <span className="text-xs text-slate-400">
                জিহান স্টোর — বিশ্বাসের সাথে অনলাইন শপিং
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-6">
          {completedOrderId ? (
            /* Order Success State */
            <div className="text-center py-6 space-y-5">
              <div className="w-20 h-20 bg-emerald-500/15 border-2 border-emerald-500 text-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                  ধন্যবাদ! আপনার অর্ডারটি গৃহীত হয়েছে।
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                  অর্ডার আইডি: <strong className="text-amber-500 font-mono text-base">#{completedOrderId}</strong>
                  <br />
                  আমাদের প্রতিনিধি শীঘ্রই আপনার সাথে ফোনে যোগাযোগ করে অর্ডার কনফার্ম করবেন।
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-blue-950/40 border border-slate-200 dark:border-blue-900/50 max-w-md mx-auto text-left text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">গ্রাহকের নাম:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">মোবাইল নম্বর:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">ডেলিভারি ঠিকানা:</span>
                  <span className="font-bold text-slate-900 dark:text-white text-right">{address}, {city}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">পেমেন্ট মেথড:</span>
                  <span className="font-bold uppercase text-amber-500">{paymentMethod}</span>
                </div>
                <div className="pt-2 border-t border-slate-200 dark:border-blue-900 flex justify-between font-bold text-sm">
                  <span>সর্বমোট বিল:</span>
                  <span className="text-amber-500">৳{cartTotal.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2 max-w-md mx-auto">
                <button
                  onClick={() => {
                    onClose();
                    onViewOrderDetails(completedOrderId);
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition flex items-center justify-center gap-1.5"
                >
                  <FileText className="w-4 h-4" />
                  <span>অর্ডার ট্র্যাক / ইনভয়েস দেখুন</span>
                </button>
                <button
                  onClick={onClose}
                  className="w-full py-3 px-4 rounded-xl bg-slate-100 dark:bg-blue-900/50 text-slate-700 dark:text-slate-200 font-bold text-xs hover:bg-slate-200 dark:hover:bg-blue-900 transition"
                >
                  আরো কেনাকাটা করুন
                </button>
              </div>
            </div>
          ) : (
            /* Checkout Form */
            <form onSubmit={handleCompleteOrder} className="space-y-6">
              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* 1. Customer & Delivery Address */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-amber-500" />
                  <span>১. গ্রাহক ও ডেলিভারির তথ্য</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      আপনার পূর্ণ নাম *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="যেমন: তানভীর আহমেদ"
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-blue-950/60 border border-slate-200 dark:border-blue-800 text-slate-900 dark:text-white"
                      />
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      মোবাইল নম্বর * (১১ ডিজিট)
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="01XXXXXXXXX"
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-blue-950/60 border border-slate-200 dark:border-blue-800 text-slate-900 dark:text-white"
                      />
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      জেলা / শহর *
                    </label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="যেমন: ঢাকা, চট্টগ্রাম, সিলেট..."
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-blue-950/60 border border-slate-200 dark:border-blue-800 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      ডেলিভারি এরিয়া
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedDeliveryArea('inside')}
                        className={`p-2 rounded-xl border text-[11px] font-semibold text-center transition ${
                          selectedDeliveryArea === 'inside'
                            ? 'border-amber-500 bg-amber-500/10 text-amber-500 font-bold'
                            : 'border-slate-200 dark:border-blue-900 text-slate-500'
                        }`}
                      >
                        ঢাকা (৳{settings.insideDhakaDelivery})
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedDeliveryArea('outside')}
                        className={`p-2 rounded-xl border text-[11px] font-semibold text-center transition ${
                          selectedDeliveryArea === 'outside'
                            ? 'border-amber-500 bg-amber-500/10 text-amber-500 font-bold'
                            : 'border-slate-200 dark:border-blue-900 text-slate-500'
                        }`}
                      >
                        ঢাকার বাইরে (৳{settings.outsideDhakaDelivery})
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    সম্পূর্ণ ডেলিভারি ঠিকানা (বাসা/রোড/এলাকা) *
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="যেমন: বাড়ি #১২, রোড #০৫, ধানমন্ডি, ঢাকা"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-blue-950/60 border border-slate-200 dark:border-blue-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1">
                    অর্ডার নোট (ঐচ্ছিক)
                  </label>
                  <input
                    type="text"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="ডেলিভারির বিশেষ কোনো নির্দেশনা থাকলে লিখুন..."
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-blue-950/60 border border-slate-200 dark:border-blue-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* 2. Payment Method */}
              <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-blue-900/60">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-amber-500" />
                  <span>২. পেমেন্ট পদ্ধতি বেছে নিন</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {/* COD */}
                  <label className={`p-3 rounded-2xl border cursor-pointer transition flex flex-col justify-between ${
                    paymentMethod === 'cod'
                      ? 'border-amber-500 bg-amber-500/10'
                      : 'border-slate-200 dark:border-blue-900/60 hover:border-amber-400/40'
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">ক্যাশ অন ডেলিভারি</span>
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'cod'}
                        onChange={() => setPaymentMethod('cod')}
                        className="accent-amber-500"
                      />
                    </div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-2">
                      পণ্য হাতে পেয়ে মূল্য পরিশোধ করুন
                    </span>
                  </label>

                  {/* Wallet */}
                  <label className={`p-3 rounded-2xl border cursor-pointer transition flex flex-col justify-between ${
                    paymentMethod === 'wallet'
                      ? 'border-amber-500 bg-amber-500/10'
                      : 'border-slate-200 dark:border-blue-900/60 hover:border-amber-400/40'
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1">
                        <Wallet className="w-3.5 h-3.5 text-amber-500" />
                        জিহান ওয়ালেট
                      </span>
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'wallet'}
                        onChange={() => setPaymentMethod('wallet')}
                        className="accent-amber-500"
                      />
                    </div>
                    <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 mt-2">
                      ব্যালেন্স: ৳{userProfile?.walletBalance ?? 0}
                    </span>
                  </label>

                  {/* bKash / Nagad */}
                  <label className={`p-3 rounded-2xl border cursor-pointer transition flex flex-col justify-between ${
                    paymentMethod === 'bkash'
                      ? 'border-amber-500 bg-amber-500/10'
                      : 'border-slate-200 dark:border-blue-900/60 hover:border-amber-400/40'
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1">
                        <Smartphone className="w-3.5 h-3.5 text-pink-500" />
                        বিকাশ / নগদ
                      </span>
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'bkash'}
                        onChange={() => setPaymentMethod('bkash')}
                        className="accent-amber-500"
                      />
                    </div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-2">
                      Send Money করে TrxID দিন
                    </span>
                  </label>
                </div>

                {/* Manual Mobile Banking / Bank inputs */}
                {paymentMethod === 'bkash' && (
                  <div className="p-4 rounded-2xl bg-amber-50 dark:bg-blue-950/60 border border-amber-300 dark:border-blue-800 space-y-3 text-xs">
                    <div className="space-y-2">
                      <p className="text-slate-700 dark:text-slate-200 font-bold">
                        নিচের যেকোনো নম্বরে বা অ্যাকাউন্টে <strong>Send Money / ডিপোজিট</strong> করুন:
                      </p>
                      
                      {/* Active Accounts list */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {((settings.paymentAccounts && settings.paymentAccounts.length > 0) 
                          ? settings.paymentAccounts.filter(a => a.isEnabled && a.provider !== 'wallet')
                          : [
                              { id: '1', provider: 'bkash', accountName: 'বিকাশ পার্সোনাল', accountNumber: settings.bkashNumber, accountType: 'Personal', instructions: 'Send Money' },
                              { id: '2', provider: 'nagad', accountName: 'নগদ পার্সোনাল', accountNumber: settings.nagadNumber, accountType: 'Personal', instructions: 'Send Money' }
                            ]
                        ).map((acc) => (
                          <div key={acc.id} className="p-2.5 rounded-xl bg-white dark:bg-blue-900/40 border border-slate-200 dark:border-blue-800 space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-amber-500 uppercase text-[10px]">{acc.provider} ({acc.accountType})</span>
                              <span className="text-[10px] text-slate-400">{acc.accountName}</span>
                            </div>
                            <div className="flex items-center justify-between gap-1">
                              <strong className="text-slate-900 dark:text-white font-mono text-xs select-all">
                                {acc.accountNumber}
                              </strong>
                              <button
                                type="button"
                                onClick={() => {
                                  navigator.clipboard.writeText(acc.accountNumber);
                                  addToast(`${acc.accountNumber} কপি করা হয়েছে!`, 'success');
                                }}
                                className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 hover:bg-amber-500 hover:text-slate-950 font-bold transition"
                              >
                                কপি
                              </button>
                            </div>
                            {acc.instructions && (
                              <p className="text-[10px] text-slate-400 italic">{acc.instructions}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-amber-300/40 dark:border-blue-800">
                      <div>
                        <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                          যে নম্বর থেকে পাঠিয়েছেন
                        </label>
                        <input
                          type="tel"
                          required
                          value={senderNumber}
                          onChange={(e) => setSenderNumber(e.target.value)}
                          placeholder="01XXXXXXXXX"
                          className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-blue-900/60 border border-slate-300 dark:border-blue-700"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                          ট্রানজেকশন আইডি (TrxID)
                        </label>
                        <input
                          type="text"
                          required
                          value={trxId}
                          onChange={(e) => setTrxId(e.target.value)}
                          placeholder="যেমন: 9J38DX7Q"
                          className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-blue-900/60 border border-slate-300 dark:border-blue-700 uppercase font-mono"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Order Items & Total Summary */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-blue-950/40 border border-slate-200 dark:border-blue-900/50 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">আইটেম সংখ্যা:</span>
                  <span className="font-bold">{cart.length} টি পণ্য ({cart.reduce((t, i) => t + i.quantity, 0)} পিস)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">পণ্য মূল্য:</span>
                  <span>৳{cartSubtotal.toLocaleString()}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                    <span>কুপন ছাড়:</span>
                    <span>-৳{discountAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-slate-500">ডেলিভারি চার্জ:</span>
                  <span>{deliveryFee === 0 ? 'ফ্রি' : `৳${deliveryFee}`}</span>
                </div>
                <div className="pt-2 border-t border-slate-200 dark:border-blue-900 flex justify-between text-sm font-black">
                  <span>পরিশোধযোগ্য সর্বমোট:</span>
                  <span className="text-amber-500 text-base">৳{cartTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/25 hover:from-amber-300 hover:to-amber-500 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <span>{isSubmitting ? 'অর্ডার প্রসেস হচ্ছে...' : `অর্ডার নিশ্চিত করুন (৳${cartTotal.toLocaleString()})`}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
