import { Order, WalletTransaction, StoreSettings } from '../types/store';

export const DEFAULT_TELEGRAM_BOT_TOKEN = '8627436875:AAGxH3Q4LQFkG1WrSTOKiF3Z9zyP4Fkd60k';
export const DEFAULT_TELEGRAM_CHAT_ID = '6607631932';

/**
 * Sends a notification message to the configured Telegram chat via the Telegram Bot API.
 */
export async function sendTelegramMessage(
  messageHtml: string,
  botToken?: string,
  chatId?: string
): Promise<{ success: boolean; error?: string }> {
  const token = botToken || DEFAULT_TELEGRAM_BOT_TOKEN;
  const chat = chatId || DEFAULT_TELEGRAM_CHAT_ID;

  if (!token || !chat) {
    console.warn('Telegram Bot Token or Chat ID not configured');
    return { success: false, error: 'Telegram Bot Token or Chat ID not configured' };
  }

  const url = `https://api.telegram.org/bot${token}/sendMessage`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chat,
        text: messageHtml,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
    });

    const data = await response.json();
    if (!response.ok || !data.ok) {
      console.error('Telegram API error:', data);
      return { success: false, error: data.description || 'Failed to send Telegram message' };
    }

    return { success: true };
  } catch (error) {
    console.error('Failed to dispatch Telegram message:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Network error sending to Telegram' 
    };
  }
}

/**
 * Formats and sends a Telegram notification for a new purchase order.
 */
export async function notifyNewOrder(order: Order, token?: string, chatId?: string) {
  const itemsText = order.items
    .map((item, idx) => `  ${idx + 1}. <b>${item.title}</b> × ${item.quantity} = ৳${(item.price * item.quantity).toLocaleString()}`)
    .join('\n');

  const paymentMethodLabel = 
    order.paymentMethod === 'cod' ? '💵 ক্যাশ অন ডেলিভারি (COD)' :
    order.paymentMethod === 'wallet' ? '💳 জিহান ওয়ালেট (Wallet Paid)' :
    order.paymentMethod === 'bkash' ? '📱 বিকাশ (bKash)' : '📱 নগদ (Nagad)';

  const text = `
🛍️ <b>[জিহান স্টোর] নতুন অর্ডার গৃহীত হয়েছে!</b>
━━━━━━━━━━━━━━━━━━
🆔 <b>অর্ডার আইডি:</b> #${order.id}
📅 <b>তারিখ:</b> ${new Date(order.createdAt).toLocaleString('bn-BD', { dateStyle: 'medium', timeStyle: 'short' })}

👤 <b>গ্রাহকের তথ্য:</b>
• নাম: <b>${order.customerName}</b>
• ফোন: <code>${order.phone}</code>
• ঠিকানা: ${order.address}, ${order.city}
${order.note ? `• নোট: <i>${order.note}</i>\n` : ''}
📦 <b>অর্ডারকৃত পণ্যসমূহ:</b>
${itemsText}

💰 <b>বিলিং তথ্য:</b>
• সাবটোটাল: ৳${order.subtotal.toLocaleString()}
${order.discount > 0 ? `• কুপন ছাড়: -৳${order.discount.toLocaleString()}\n` : ''}• ডেলিভারি ফি: ${order.deliveryFee === 0 ? 'ফ্রি' : `৳${order.deliveryFee}`}
• <b>সর্বমোট বিল:</b> ৳${order.totalAmount.toLocaleString()}

💳 <b>পেমেন্ট মেথড:</b> ${paymentMethodLabel}
📊 <b>পেমেন্ট স্ট্যাটাস:</b> ${order.paymentStatus.toUpperCase()}
${order.trxId ? `🔑 <b>TrxID:</b> <code>${order.trxId}</code>\n` : ''}
━━━━━━━━━━━━━━━━━━
<i>অ্যাডমিন প্যানেল থেকে দ্রুত প্রসেসিং শুরু করুন।</i>
`;

  return sendTelegramMessage(text.trim(), token, chatId);
}

/**
 * Formats and sends a Telegram alert when order status changes.
 */
export async function notifyOrderStatusChanged(
  orderId: string,
  customerName: string,
  phone: string,
  newStatus: string,
  totalAmount: number,
  token?: string,
  chatId?: string
) {
  const statusLabels: Record<string, string> = {
    pending: '⏳ পেন্ডিং (Pending)',
    confirmed: '✅ নিশ্চিত (Confirmed)',
    processing: '⚙️ প্রসেসিং (Processing)',
    shipped: '🚚 শিপড (Shipped)',
    delivered: '📦 ডেলিভারি সম্পন্ন (Delivered)',
    cancelled: '❌ বাতিল (Cancelled)',
  };

  const text = `
🔄 <b>[জিহান স্টোর] অর্ডারের স্ট্যাটাস আপডেট</b>
━━━━━━━━━━━━━━━━━━
🆔 <b>অর্ডার আইডি:</b> #${orderId}
👤 <b>গ্রাহক:</b> ${customerName} (<code>${phone}</code>)
💰 <b>টাকার পরিমাণ:</b> ৳${totalAmount.toLocaleString()}
📌 <b>নতুন স্ট্যাটাস:</b> ${statusLabels[newStatus] || newStatus.toUpperCase()}
⏰ <b>সময়:</b> ${new Date().toLocaleTimeString('bn-BD')}
`;

  return sendTelegramMessage(text.trim(), token, chatId);
}

/**
 * Formats and sends a Telegram alert for a wallet deposit request.
 */
export async function notifyWalletDepositRequest(
  tx: WalletTransaction,
  token?: string,
  chatId?: string
) {
  const text = `
💰 <b>[জিহান স্টোর] নতুন ওয়ালেট ডিপোজিট রিকোয়েস্ট!</b>
━━━━━━━━━━━━━━━━━━
🆔 <b>ট্রানজেকশন আইডি:</b> #${tx.id}
👤 <b>ব্যবহারকারী:</b> ${tx.userName || 'গ্রাহক'}
📧 <b>ইমেইল:</b> ${tx.userEmail}

💵 <b>পরিমাণ:</b> ৳${tx.amount.toLocaleString()}
📱 <b>মেথড:</b> ${tx.method.toUpperCase()}
📞 <b>প্রেরক নম্বর:</b> <code>${tx.senderNumber || 'N/A'}</code>
🔑 <b>TrxID:</b> <code>${tx.trxId || 'N/A'}</code>
⏰ <b>সময়:</b> ${new Date(tx.createdAt).toLocaleTimeString('bn-BD')}

<i>দয়া করে অ্যাডমিন প্যানেল থেকে যাচাই করে অনুমোদন (Approve) করুন।</i>
`;

  return sendTelegramMessage(text.trim(), token, chatId);
}

/**
 * Formats and sends a Telegram alert for a wallet withdraw request.
 */
export async function notifyWalletWithdrawRequest(
  tx: WalletTransaction,
  token?: string,
  chatId?: string
) {
  const text = `
💸 <b>[জিহান স্টোর] নতুন টাকা উত্তোলন রিকোয়েস্ট!</b>
━━━━━━━━━━━━━━━━━━
🆔 <b>রিকোয়েস্ট আইডি:</b> #${tx.id}
👤 <b>ব্যবহারকারী:</b> ${tx.userName || 'গ্রাহক'}
📧 <b>ইমেইল:</b> ${tx.userEmail}

💵 <b>উত্তোলন পরিমাণ:</b> ৳${tx.amount.toLocaleString()}
📱 <b>মেথড:</b> ${tx.method.toUpperCase()}
📞 <b>প্রাপক নম্বর/অ্যাকাউন্ট:</b> <code>${tx.senderNumber || 'N/A'}</code>
⏰ <b>সময়:</b> ${new Date(tx.createdAt).toLocaleTimeString('bn-BD')}

<i>দয়া করে গ্রাহকের অ্যাকাউন্টে টাকা পাঠিয়ে অ্যাডমিন প্যানেলে অ্যাপ্রুভ করুন।</i>
`;

  return sendTelegramMessage(text.trim(), token, chatId);
}

/**
 * Formats and sends a Telegram alert when a new customer review is posted.
 */
export async function notifyNewReview(
  rev: { userName: string; rating: number; comment: string; productTitle?: string },
  token?: string,
  chatId?: string
) {
  const stars = '⭐'.repeat(rev.rating);
  const text = `
💬 <b>[জিহান স্টোর] নতুন গ্রাহক রিভিউ জমা হয়েছে!</b>
━━━━━━━━━━━━━━━━━━
👤 <b>গ্রাহক:</b> ${rev.userName}
⭐ <b>রেটিং:</b> ${stars} (${rev.rating}/5)
${rev.productTitle ? `📦 <b>পণ্য:</b> ${rev.productTitle}\n` : ''}
📝 <b>মন্তব্য:</b>
<i>"${rev.comment}"</i>
`;

  return sendTelegramMessage(text.trim(), token, chatId);
}

/**
 * Test telegram bot message to verify API token and Chat ID.
 */
export async function testTelegramConnection(token?: string, chatId?: string) {
  const text = `
🤖 <b>[জিহান স্টোর] টেলিগ্রাম বট সফলভাবে কানেক্ট হয়েছে!</b>
━━━━━━━━━━━━━━━━━━
✅ আপনার টেলিগ্রাম বট ও ইউজার আইডি সঠিকভাবে সংযুক্ত হয়েছে।
এখন থেকে যেকোনো নতুন অর্ডার, ওয়ালেট ডিপোজিট/উত্তোলন এবং স্টোর নোটিফিকেশন সরাসরি এই চ্যাটে পেয়ে যাবেন।

🛒 <b>জিহান স্টোর</b> — <i>বিশ্বাসের সাথে অনলাইন শপিং</i>
`;

  return sendTelegramMessage(text.trim(), token, chatId);
}
