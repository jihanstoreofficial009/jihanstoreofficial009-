import { Order, WalletTransaction, StoreSettings } from '../types/store';

export const DEFAULT_TELEGRAM_BOT_TOKEN = '8714872675:AAGsB9U_eCOIG5Os75KisW_ieJaEkKTdS6U';
export const DEFAULT_TELEGRAM_CHAT_ID = '6607631932';

function escapeHtml(text: string): string {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

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
      // Fallback without parse_mode if entity parsing failed
      if (data.description && data.description.includes('parse entities')) {
        const plainText = messageHtml.replace(/<[^>]*>/g, '');
        const retryRes = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: chat, text: plainText }),
        });
        const retryData = await retryRes.json();
        if (retryRes.ok && retryData.ok) {
          return { success: true };
        }
      }
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
    .map((item, idx) => `  ${idx + 1}. <b>${escapeHtml(item.title)}</b> × ${item.quantity} = ৳${(item.price * item.quantity).toLocaleString()}`)
    .join('\n');

  const paymentMethodLabel = 
    order.paymentMethod === 'cod' ? '💵 ক্যাশ অন ডেলিভারি (Cash on Delivery)' :
    order.paymentMethod === 'wallet' ? '💳 জিহান ওয়ালেট (Wallet Paid)' :
    order.paymentMethod === 'bkash' ? '📱 বিকাশ (bKash)' : '📱 নগদ (Nagad)';

  const text = `
🛍️ <b>[জিহান স্টোর] নতুন অর্ডার রিপোর্ট!</b>
━━━━━━━━━━━━━━━━━━━━━━
🆔 <b>অর্ডার আইডি:</b> <code>#${order.id}</code>
📅 <b>তারিখ:</b> ${new Date(order.createdAt).toLocaleString('bn-BD', { dateStyle: 'medium', timeStyle: 'short' })}

👤 <b>গ্রাহকের বিস্তারিত তথ্য:</b>
• নাম: <b>${escapeHtml(order.customerName)}</b>
• ফোন নম্বর: <code>${order.phone}</code>
• ডেলিভারি ঠিকানা: ${escapeHtml(order.address)}, ${escapeHtml(order.city)}
${order.note ? `• বিশেষ নির্দেশনা/নোট: <i>${escapeHtml(order.note)}</i>\n` : ''}
📦 <b>অর্ডারকৃত পণ্যের তালিকা:</b>
${itemsText}

💰 <b>বিলিং হিসাব:</b>
• পণ্যের মোট দাম: ৳${order.subtotal.toLocaleString()}
${order.discount > 0 ? `• ডিসকাউন্ট ছাড়: -৳${order.discount.toLocaleString()}\n` : ''}• ডেলিভারি চার্জ: ${order.deliveryFee === 0 ? 'ফ্রি (Free Delivery)' : `৳${order.deliveryFee}`}
• <b>সর্বমোট প্রদেয় বিল: ৳${order.totalAmount.toLocaleString()}</b>

💳 <b>পেমেন্ট মাধ্যম:</b> ${paymentMethodLabel}
📊 <b>পেমেন্ট স্ট্যাটাস:</b> ${order.paymentStatus.toUpperCase()}
${order.trxId ? `🔑 <b>TrxID (ট্রানজেকশন আইডি):</b> <code>${escapeHtml(order.trxId)}</code>\n` : ''}
━━━━━━━━━━━━━━━━━━━━━━
<i>অ্যাডমিন প্যানেল থেকে দ্রুত পার্সেল প্রসেসিং শুরু করুন।</i>
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
    shipped: '🚚 শিপড / ডেলিভারিতে আছে (Shipped)',
    delivered: '📦 ডেলিভারি সম্পন্ন (Delivered)',
    cancelled: '❌ বাতিল (Cancelled)',
  };

  const text = `
🔄 <b>[জিহান স্টোর] অর্ডারের স্ট্যাটাস আপডেট</b>
━━━━━━━━━━━━━━━━━━━━━━
🆔 <b>অর্ডার আইডি:</b> <code>#${orderId}</code>
👤 <b>গ্রাহকের নাম:</b> ${escapeHtml(customerName)} (<code>${phone}</code>)
💰 <b>টাকার পরিমাণ:</b> ৳${totalAmount.toLocaleString()}
📌 <b>বর্তমান স্ট্যাটাস:</b> <b>${statusLabels[newStatus] || newStatus.toUpperCase()}</b>
⏰ <b>আপডেট সময়:</b> ${new Date().toLocaleTimeString('bn-BD')}
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
━━━━━━━━━━━━━━━━━━━━━━
🆔 <b>ট্রানজেকশন আইডি:</b> <code>#${tx.id}</code>
👤 <b>ব্যবহারকারী:</b> ${escapeHtml(tx.userName || 'গ্রাহক')}
📧 <b>ইমেইল:</b> ${escapeHtml(tx.userEmail)}

💵 <b>জমার পরিমাণ:</b> <b>৳${tx.amount.toLocaleString()}</b>
📱 <b>পেমেন্ট মাধ্যম:</b> ${tx.method.toUpperCase()}
📞 <b>প্রেরক ফোন নম্বর:</b> <code>${tx.senderNumber || 'N/A'}</code>
🔑 <b>TrxID (ট্রানজেকশন আইডি):</b> <code>${escapeHtml(tx.trxId || 'N/A')}</code>
⏰ <b>সময়:</b> ${new Date(tx.createdAt).toLocaleTimeString('bn-BD')}

<i>দয়া করে অ্যাডমিন প্যানেল থেকে টাকা যাচাই করে অনুমোদন (Approve) করুন।</i>
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
💸 <b>[জিহান স্টোর] নতুন টাকা উত্তোলন (Withdraw) রিকোয়েস্ট!</b>
━━━━━━━━━━━━━━━━━━━━━━
🆔 <b>রিকোয়েস্ট আইডি:</b> <code>#${tx.id}</code>
👤 <b>ব্যবহারকারী:</b> ${escapeHtml(tx.userName || 'গ্রাহক')}
📧 <b>ইমেইল:</b> ${escapeHtml(tx.userEmail)}

💵 <b>উত্তোলন পরিমাণ:</b> <b>৳${tx.amount.toLocaleString()}</b>
📱 <b>পেমেন্ট মাধ্যম:</b> ${tx.method.toUpperCase()}
📞 <b>টাকা পাঠানোর অ্যাকাউন্ট/নম্বর:</b> <code>${tx.senderNumber || 'N/A'}</code>
⏰ <b>সময়:</b> ${new Date(tx.createdAt).toLocaleTimeString('bn-BD')}

<i>দয়া করে গ্রাহকের নম্বরে টাকা পাঠিয়ে অ্যাডমিন প্যানেলে অ্যাপ্রুভ করুন।</i>
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
━━━━━━━━━━━━━━━━━━━━━━
👤 <b>গ্রাহক:</b> ${escapeHtml(rev.userName)}
⭐ <b>রেটিং:</b> ${stars} (${rev.rating}/5)
${rev.productTitle ? `📦 <b>পণ্য:</b> ${escapeHtml(rev.productTitle)}\n` : ''}
📝 <b>মন্তব্য:</b>
<i>"${escapeHtml(rev.comment)}"</i>
`;

  return sendTelegramMessage(text.trim(), token, chatId);
}

/**
 * Test telegram bot message to verify API token and Chat ID.
 */
export async function testTelegramConnection(token?: string, chatId?: string) {
  const text = `
🤖 <b>[জিহান স্টোর] টেলিগ্রাম বট সফলভাবে কানেক্ট হয়েছে!</b>
━━━━━━━━━━━━━━━━━━━━━━
✅ <b>টেলিগ্রাম বট ও ইউজার আইডি ১০০% সক্রিয়:</b>
• <b>বট টোকেন:</b> <code>${(token || DEFAULT_TELEGRAM_BOT_TOKEN).slice(0, 10)}...</code>
• <b>ইউজার আইডি:</b> <code>${chatId || DEFAULT_TELEGRAM_CHAT_ID}</code>

🚀 এখন থেকে স্টোরের প্রতিটি নোটিফিকেশন সরাসরি এখানে পাবেন:
1. 🛍️ সকল নতুন অর্ডার রিপোর্ট ও কাস্টমার ডিটেইলস
2. 🔄 অর্ডারের স্ট্যাটাস পরিবর্তন অ্যালার্ট
3. 💰 ওয়ালেট ডিপোজিট রিকোয়েস্ট (TrxID সহ)
4. 💸 ওয়ালেট উইথড্র রিকোয়েস্ট
5. ⭐ নতুন গ্রাহক রিভিউ

🛒 <b>জিহান স্টোর</b> — <i>বিশ্বাসের সাথে অনলাইন শপিং</i>
`;

  return sendTelegramMessage(text.trim(), token, chatId);
}
