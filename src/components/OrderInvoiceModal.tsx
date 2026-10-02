import React from 'react';
import { Order } from '../types/store';
import { X, Printer, CheckCircle2, Crown, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface OrderInvoiceModalProps {
  order: Order | null;
  onClose: () => void;
}

export const OrderInvoiceModal: React.FC<OrderInvoiceModalProps> = ({ order, onClose }) => {
  const { settings } = useStore();

  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white text-slate-900 rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[94vh] flex flex-col">
        {/* Top Control Bar */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50 print:hidden">
          <span className="text-xs font-bold text-slate-500">
            অফিশিয়াল ইনভয়েস / ক্যাশ মেমো
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition flex items-center gap-1.5 shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>প্রিন্ট করুন</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Document */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-6 text-xs print:p-8 print:text-sm">
          {/* Brand Header */}
          <div className="flex justify-between items-start border-b border-slate-200 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#0B1E3F] text-amber-400 flex items-center justify-center">
                  <Crown className="w-4 h-4" />
                </div>
                <span className="text-xl font-black text-[#0B1E3F] tracking-tight">
                  JIHAN STORE
                </span>
              </div>
              <p className="text-[11px] text-amber-600 font-semibold mt-1">
                {settings.storeSlogan}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                {settings.address}
                <br />
                হটলাইন: {settings.phone} | ইমেইল: {settings.email}
              </p>
            </div>

            <div className="text-right">
              <span className="px-2.5 py-1 rounded bg-amber-100 text-amber-900 font-black text-xs uppercase block">
                INVOICE #{order.id}
              </span>
              <span className="text-[11px] text-slate-500 block mt-1">
                তারিখ:{' '}
                {new Date(order.createdAt).toLocaleDateString('bn-BD', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </span>
              <span className="text-[11px] font-bold text-emerald-600 uppercase block mt-1">
                স্ট্যাটাস: {order.orderStatus}
              </span>
            </div>
          </div>

          {/* Customer Details */}
          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <span className="font-bold text-slate-400 uppercase text-[10px] block mb-1">
                বিলিং ও ডেলিভারি প্রাপক:
              </span>
              <h4 className="font-bold text-sm text-slate-900">{order.customerName}</h4>
              <p className="text-slate-600 mt-0.5">মোবাইল: {order.phone}</p>
              <p className="text-slate-600">ঠিকানা: {order.address}, {order.city}</p>
            </div>
            <div>
              <span className="font-bold text-slate-400 uppercase text-[10px] block mb-1">
                পেমেন্ট বিবরণ:
              </span>
              <p className="text-slate-700">
                মেথড: <strong className="uppercase">{order.paymentMethod}</strong>
              </p>
              <p className="text-slate-700">
                অবস্থা: <strong className="uppercase text-amber-600">{order.paymentStatus}</strong>
              </p>
              {order.trxId && (
                <p className="text-slate-500 font-mono text-[10px]">
                  TrxID: {order.trxId}
                </p>
              )}
            </div>
          </div>

          {/* Itemized Table */}
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                <th className="py-2">পণ্য</th>
                <th className="py-2 text-right">একক মূল্য</th>
                <th className="py-2 text-center">পরিমাণ</th>
                <th className="py-2 text-right">মোট</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {order.items.map((item, idx) => (
                <tr key={idx}>
                  <td className="py-2.5 font-medium text-slate-800">
                    {item.title}
                  </td>
                  <td className="py-2.5 text-right text-slate-600">
                    ৳{item.price.toLocaleString()}
                  </td>
                  <td className="py-2.5 text-center font-bold text-slate-700">
                    {item.quantity}
                  </td>
                  <td className="py-2.5 text-right font-bold text-slate-900">
                    ৳{(item.price * item.quantity).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Calculations */}
          <div className="pt-3 border-t-2 border-slate-200 flex justify-end">
            <div className="w-64 space-y-1.5">
              <div className="flex justify-between text-slate-600">
                <span>সাবটোটাল:</span>
                <span>৳{order.subtotal.toLocaleString()}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>কুপন ছাড়:</span>
                  <span>-৳{order.discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>ডেলিভারি ফি:</span>
                <span>{order.deliveryFee === 0 ? 'ফ্রি' : `৳${order.deliveryFee}`}</span>
              </div>
              <div className="pt-2 border-t border-slate-300 flex justify-between font-black text-sm text-[#0B1E3F]">
                <span>পরিশোধিত/বকেয়া মোট:</span>
                <span className="text-base text-amber-600">৳{order.totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="pt-6 border-t border-slate-200 text-center text-[11px] text-slate-400 space-y-1">
            <p>জিহান স্টোরে কেনাকাটা করার জন্য ধন্যবাদ।</p>
            <p className="font-semibold text-slate-600">“বিশ্বাসের সাথে অনলাইন শপিং”</p>
          </div>
        </div>
      </div>
    </div>
  );
};
