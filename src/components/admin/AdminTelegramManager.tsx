import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { TelegramBotConfig } from '../../types/store';
import { 
  Bot, 
  Send, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  AlertCircle, 
  RefreshCw, 
  CheckCircle2, 
  XCircle, 
  Eye, 
  EyeOff, 
  Zap, 
  Info, 
  Radio, 
  ShieldCheck, 
  Clock, 
  MessageSquare,
  Activity
} from 'lucide-react';

export const AdminTelegramManager: React.FC = () => {
  const { 
    settings, 
    saveTelegramBot, 
    deleteTelegramBot, 
    toggleTelegramBot, 
    testTelegramBot, 
    addToast 
  } = useStore();

  const bots = settings.telegramBots && settings.telegramBots.length > 0 
    ? settings.telegramBots 
    : [];

  const lastBotIndex = settings.telegramLastBotIndex ?? -1;
  const activeBots = bots.filter(b => b.isEnabled !== false);

  // Next bot for round-robin calculation
  const nextBotIndex = activeBots.length > 0 ? (lastBotIndex + 1) % activeBots.length : -1;
  const nextBot = nextBotIndex >= 0 ? activeBots[nextBotIndex] : null;

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingBot, setEditingBot] = useState<Partial<TelegramBotConfig> | null>(null);
  const [showTokenInput, setShowTokenInput] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Token visibility mask state per bot card
  const [visibleTokenIds, setVisibleTokenIds] = useState<Record<string, boolean>>({});

  // Testing State per bot
  const [testingBotId, setTestingBotId] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<{ botId: string; success: boolean; message: string } | null>(null);

  // Custom Test Broadcast State
  const [customMessage, setCustomMessage] = useState('');
  const [isSendingCustom, setIsSendingCustom] = useState(false);

  const toggleTokenVisibility = (id: string) => {
    setVisibleTokenIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleOpenAdd = () => {
    setEditingBot({
      id: '',
      botName: `Jihan Dispatcher #${bots.length + 1}`,
      botUsername: '',
      botToken: '',
      chatId: settings.telegramChatId || '6607631932',
      isEnabled: true,
      isConnected: true,
      totalDispatches: 0
    });
    setShowTokenInput(false);
    setShowModal(true);
  };

  const handleOpenEdit = (bot: TelegramBotConfig) => {
    setEditingBot({ ...bot });
    setShowTokenInput(false);
    setShowModal(true);
  };

  const handleSaveBot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBot?.botName?.trim() || !editingBot?.botToken?.trim() || !editingBot?.chatId?.trim()) {
      addToast('অনুগ্রহ করে বটের নাম, টোকেন এবং চ্যাট আইডি পূরণ করুন', 'error');
      return;
    }

    setIsSaving(true);
    try {
      const botId = editingBot.id || `bot-${Date.now()}`;
      const payload: TelegramBotConfig = {
        id: botId,
        botName: editingBot.botName.trim(),
        botUsername: editingBot.botUsername?.trim() || undefined,
        botToken: editingBot.botToken.trim(),
        chatId: editingBot.chatId.trim(),
        isEnabled: editingBot.isEnabled ?? true,
        isConnected: editingBot.isConnected ?? true,
        totalDispatches: editingBot.totalDispatches ?? 0,
        createdAt: editingBot.createdAt || new Date().toISOString()
      };

      await saveTelegramBot(payload);
      setShowModal(false);
      setEditingBot(null);
    } catch {
      // toast handled in context
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteBot = async (botId: string, botName: string) => {
    if (bots.length <= 1) {
      addToast('কমপক্ষে ১টি সক্রিয় টেলিগ্রাম বট থাকা আবশ্যক!', 'error');
      return;
    }
    if (window.confirm(`আপনি কি সত্যিই "${botName}" বটটি স্থায়ীভাবে মুছে ফেলতে চান?`)) {
      await deleteTelegramBot(botId);
    }
  };

  const handleRunTest = async (bot: TelegramBotConfig) => {
    setTestingBotId(bot.id);
    setTestResult(null);

    const res = await testTelegramBot(bot.id);
    setTestingBotId(null);
    if (res.success) {
      setTestResult({
        botId: bot.id,
        success: true,
        message: 'টেস্ট মেসেজ সফলভাবে পাঠানো হয়েছে! আপনার টেলিগ্রাম চেক করুন।'
      });
    } else {
      setTestResult({
        botId: bot.id,
        success: false,
        message: res.error || 'বট কানেকশন ব্যর্থ হয়েছে। টোকেন ও চ্যাট আইডি যাচাই করুন।'
      });
    }
  };

  const handleSendCustomBroadcast = async () => {
    if (!customMessage.trim()) {
      addToast('মেসেজ টেক্সট লিখুন', 'error');
      return;
    }
    if (activeBots.length === 0) {
      addToast('কোনো সক্রিয় টেলিগ্রাম বট নেই', 'error');
      return;
    }

    setIsSendingCustom(true);
    try {
      // Dispatches custom message to the next round-robin bot
      if (nextBot) {
        await testTelegramBot(nextBot.id, `📢 <b>[অ্যাডমিন টেস্ট বার্তা]</b>\n\n${customMessage.trim()}`);
        addToast(`রাউন্ড-রবিন অনুযায়ী "${nextBot.botName}"-এ বার্তা পাঠানো হয়েছে!`, 'success');
        setCustomMessage('');
      }
    } finally {
      setIsSendingCustom(false);
    }
  };

  const maskToken = (token: string) => {
    if (!token) return '••••••••••••••••••••';
    if (token.length < 12) return '••••••••••••';
    return `${token.slice(0, 5)}••••••••••••••••${token.slice(-4)}`;
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Info */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-blue-900/60 via-slate-900 to-[#0B1E3F] border border-blue-800/60 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-48 h-48 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5 max-w-xl">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-400/30 flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white">
                টেলিগ্রাম ইন্টিগ্রেশন ম্যানেজার (Telegram Bot API)
              </h2>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              একাধিক টেলিগ্রাম বট কানেক্ট করুন এবং প্রতিটি অর্ডারের ইনস্ট্যান্ট নোটিফিকেশন পান। 
              সিস্টেমটি <b>রাউন্ড-রবিন (Round-Robin)</b> পদ্ধতিতে ক্রমানুসারে একটির পর একটি বটে নির্ভুলভাবে অর্ডার রাউট করে।
            </p>
          </div>

          <button
            onClick={handleOpenAdd}
            className="self-start md:self-center px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-sky-500/20 transition shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>নতুন বট যুক্ত করুন</span>
          </button>
        </div>

        {/* Round-Robin Visual Status */}
        <div className="mt-5 pt-4 border-t border-blue-800/40 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] text-slate-400 font-semibold block uppercase">সক্রিয় বট সংখ্যা</span>
              <span className="text-sm font-black text-white">
                {activeBots.length} / {bots.length} টি সক্রিয়
              </span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] text-slate-400 font-semibold block uppercase">পরবর্তী অর্ডার রাউটিং</span>
              <span className="text-sm font-black text-amber-300 truncate block">
                {nextBot ? nextBot.botName : 'কোনো সক্রিয় বট নেই'}
              </span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0">
              <Activity className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] text-slate-400 font-semibold block uppercase">রাউটিং মোড</span>
              <span className="text-sm font-black text-sky-300">
                রাউন্ড-রবিন (1st Bot1 → 2nd Bot2)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bots Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <span>সংযুক্ত টেলিগ্রাম বট সমূহ ({bots.length})</span>
          </h3>
          <span className="text-[11px] text-slate-400">
            নিরাপত্তা: ফ্রন্টএন্ডে বট টোকেন গোপন (Masked) রাখা হয়
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {bots.map((bot, index) => {
            const isVisible = !!visibleTokenIds[bot.id];
            const isNext = nextBot?.id === bot.id;
            const isTesting = testingBotId === bot.id;

            return (
              <div 
                key={bot.id}
                className={`relative p-5 rounded-3xl bg-white dark:bg-[#0B1E3F] border transition-all duration-200 flex flex-col justify-between space-y-4 shadow-sm ${
                  isNext 
                    ? 'border-amber-400/80 dark:border-amber-500/60 ring-2 ring-amber-500/20 shadow-amber-500/5' 
                    : bot.isEnabled 
                      ? 'border-slate-200 dark:border-blue-900/60' 
                      : 'border-slate-200 dark:border-blue-950 opacity-70 bg-slate-50 dark:bg-blue-950/20'
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm shrink-0 shadow-xs ${
                      bot.isEnabled 
                        ? 'bg-sky-500/10 text-sky-400 border border-sky-400/30' 
                        : 'bg-slate-200 dark:bg-blue-950 text-slate-400'
                    }`}>
                      #{index + 1}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                          {bot.botName}
                        </h4>
                        {isNext && (
                          <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 text-[10px] font-bold flex items-center gap-1">
                            <Zap className="w-3 h-3 fill-amber-400" />
                            Next Queue
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-sky-500 dark:text-sky-400 font-mono">
                        {bot.botUsername || '@bot'}
                      </span>
                    </div>
                  </div>

                  {/* Connect / Disconnect Toggle */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => toggleTelegramBot(bot.id, !bot.isEnabled)}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition flex items-center gap-1.5 border ${
                        bot.isEnabled
                          ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30 hover:bg-emerald-500/20'
                          : 'bg-rose-500/10 text-rose-500 border-rose-500/30 hover:bg-rose-500/20'
                      }`}
                      title={bot.isEnabled ? 'বট নিষ্ক্রিয় করুন' : 'বট সক্রিয় করুন'}
                    >
                      <span className={`w-2 h-2 rounded-full ${bot.isEnabled ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></span>
                      <span>{bot.isEnabled ? 'কানেক্টেড' : 'বন্ধ'}</span>
                    </button>
                  </div>
                </div>

                {/* Details list */}
                <div className="space-y-2 p-3 rounded-2xl bg-slate-50 dark:bg-blue-950/60 border border-slate-200/60 dark:border-blue-900/40 text-xs font-mono">
                  {/* Chat ID */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-slate-400 font-sans text-[11px]">Chat / User ID:</span>
                    <span className="text-slate-800 dark:text-slate-200 font-bold">
                      {bot.chatId}
                    </span>
                  </div>

                  {/* Bot Token with Mask Toggle */}
                  <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-200 dark:border-blue-900/40">
                    <span className="text-slate-400 font-sans text-[11px]">Bot Token:</span>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-700 dark:text-slate-300 font-mono text-[11px]">
                        {isVisible ? bot.botToken : maskToken(bot.botToken)}
                      </span>
                      <button
                        type="button"
                        onClick={() => toggleTokenVisibility(bot.id)}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
                        title={isVisible ? 'টোকেন লুকান' : 'টোকেন দেখুন'}
                      >
                        {isVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-200 dark:border-blue-900/40 text-[11px] font-sans">
                    <span className="text-slate-400">মোট ডেলিভারি নোটিফিকেশন:</span>
                    <span className="font-bold text-amber-500 dark:text-amber-400">
                      {bot.totalDispatches || 0} টি
                    </span>
                  </div>
                </div>

                {/* Test Feedback Notice */}
                {testResult && testResult.botId === bot.id && (
                  <div className={`p-2.5 rounded-xl text-xs flex items-center gap-2 ${
                    testResult.success 
                      ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-500' 
                      : 'bg-rose-500/10 border border-rose-500/30 text-rose-500'
                  }`}>
                    {testResult.success ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                    <span>{testResult.message}</span>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-blue-900/50">
                  <button
                    onClick={() => handleRunTest(bot)}
                    disabled={isTesting}
                    className="px-3 py-1.5 rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-300 dark:border-sky-800 text-sky-700 dark:text-sky-300 text-xs font-bold hover:bg-sky-100 dark:hover:bg-sky-900/50 disabled:opacity-50 transition flex items-center gap-1.5"
                  >
                    {isTesting ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Send className="w-3.5 h-3.5" />
                    )}
                    <span>{isTesting ? 'টেস্টিং...' : 'টেস্ট মেসেজ পাঠান'}</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenEdit(bot)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-amber-500 hover:bg-amber-500/10 transition"
                      title="সম্পাদনা করুন"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteBot(bot.id, bot.botName)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 transition"
                      title="মুছে ফেলুন"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Manual Test Dispatch Console */}
      <div className="p-5 rounded-3xl bg-white dark:bg-[#0B1E3F] border border-slate-200 dark:border-blue-900/60 space-y-3">
        <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-sky-400" />
          <span>লাইভ রাউন্ড-রবিন টেস্ট ডিসপ্যাচার (Live Dispatch Console)</span>
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          এখানে যেকোনো কাস্টম মেসেজ লিখে টেস্ট করুন। মেসেজটি রাউন্ড-রবিন নিয়মে সরাসরি পরবর্তী বটের কাছে চলে যাবে।
        </p>

        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            placeholder="যেমন: [টেস্ট] সিস্টেম ১০০% সচল আছে..."
            className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-blue-950/60 border border-slate-200 dark:border-blue-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500/40"
          />
          <button
            onClick={handleSendCustomBroadcast}
            disabled={isSendingCustom || !customMessage.trim()}
            className="px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-slate-950 font-bold text-xs transition flex items-center justify-center gap-2 shrink-0"
          >
            {isSendingCustom ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
            <span>রাউন্ড-রবিন টেস্ট পাঠান</span>
          </button>
        </div>
      </div>

      {/* Bot Setup Instructions */}
      <div className="p-4 rounded-2xl bg-blue-950/40 border border-blue-900/50 space-y-2 text-xs text-slate-300">
        <div className="flex items-center gap-2 text-amber-400 font-bold">
          <Info className="w-4 h-4 shrink-0" />
          <span>টেলিগ্রাম বট কিভাবে তৈরি ও সেটআপ করবেন?</span>
        </div>
        <ol className="list-decimal list-inside space-y-1 text-slate-400 pl-1 leading-relaxed">
          <li>টেলিগ্রামে <b>@BotFather</b> লিখে সার্চ করুন এবং <code>/newbot</code> কমান্ড দিন।</li>
          <li>বটের নাম ও ইউজারনেম দিলে একটি <b>API Token</b> প্রদান করবে (যেমন: <code>8714872675:AAGsB...</code>)।</li>
          <li>আপনার টেলিগ্রাম আইডি পেতে <b>@userinfobot</b> এ স্টার্ট করুন এবং <b>Id</b> কপি করুন (যেমন: <code>6607631932</code>)।</li>
          <li>উপরে <b>"নতুন বট যুক্ত করুন"</b> বাটনে ক্লিক করে টোকেন এবং চ্যাট আইডি সেভ করুন।</li>
        </ol>
      </div>

      {/* Add / Edit Bot Modal */}
      {showModal && editingBot && (
        <div className="fixed inset-0 z-60 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 animate-fadeIn">
          <div className="w-full max-w-md bg-white dark:bg-[#0B1E3F] rounded-3xl p-6 border border-slate-200 dark:border-blue-900 space-y-4 max-h-[90vh] overflow-y-auto text-xs">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Bot className="w-4 h-4 text-sky-400" />
                <span>{editingBot.id ? 'বট কনফিগারেশন সম্পাদনা' : 'নতুন টেলিগ্রাম বট যুক্ত করুন'}</span>
              </h3>
              <button 
                onClick={() => setShowModal(false)}
                className="w-7 h-7 rounded-full bg-slate-100 dark:bg-blue-950 text-slate-400 hover:text-white flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveBot} className="space-y-3.5">
              <div>
                <label className="font-bold block mb-1 text-slate-700 dark:text-slate-300">
                  বটের নাম (Bot Name) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: Jihan Dispatcher #1"
                  value={editingBot.botName || ''}
                  onChange={(e) => setEditingBot({ ...editingBot, botName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-blue-950/60 border border-slate-200 dark:border-blue-800 text-xs"
                />
              </div>

              <div>
                <label className="font-bold block mb-1 text-slate-700 dark:text-slate-300">
                  বট ইউজারনেম (Bot Username)
                </label>
                <input
                  type="text"
                  placeholder="যেমন: @jihanstore_bot"
                  value={editingBot.botUsername || ''}
                  onChange={(e) => setEditingBot({ ...editingBot, botUsername: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-blue-950/60 border border-slate-200 dark:border-blue-800 text-xs font-mono"
                />
              </div>

              <div>
                <label className="font-bold block mb-1 text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span>বট এপিআই টোকেন (Bot Token) *</span>
                  <button
                    type="button"
                    onClick={() => setShowTokenInput(!showTokenInput)}
                    className="text-[11px] text-sky-400 hover:underline flex items-center gap-1"
                  >
                    {showTokenInput ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    <span>{showTokenInput ? 'লুকান' : 'প্রদর্শন'}</span>
                  </button>
                </label>
                <input
                  type={showTokenInput ? 'text' : 'password'}
                  required
                  placeholder="8714872675:AAGsB9U_eCOIG5Os75KisW_ieJaEkKTdS6U"
                  value={editingBot.botToken || ''}
                  onChange={(e) => setEditingBot({ ...editingBot, botToken: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-blue-950/60 border border-slate-200 dark:border-blue-800 text-xs font-mono"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  টোকেন সুরক্ষিত থাকবে এবং কখনো পাবলিকলি উন্মুক্ত করা হবে না।
                </p>
              </div>

              <div>
                <label className="font-bold block mb-1 text-slate-700 dark:text-slate-300">
                  চ্যাট আইডি বা ইউজার আইডি (Chat ID) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: 6607631932"
                  value={editingBot.chatId || ''}
                  onChange={(e) => setEditingBot({ ...editingBot, chatId: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-blue-950/60 border border-slate-200 dark:border-blue-800 text-xs font-mono"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="botEnabled"
                  checked={editingBot.isEnabled ?? true}
                  onChange={(e) => setEditingBot({ ...editingBot, isEnabled: e.target.checked })}
                  className="rounded text-sky-500 focus:ring-sky-500"
                />
                <label htmlFor="botEnabled" className="text-xs font-bold cursor-pointer">
                  এই বটটিকে সক্রিয় (Active & Connected) রাখুন
                </label>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-blue-900 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-blue-950 text-slate-700 dark:text-slate-300 font-bold text-xs"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs shadow-md transition flex items-center gap-2"
                >
                  {isSaving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                  <span>{isSaving ? 'সংরক্ষণ হচ্ছে...' : 'বট সংরক্ষণ করুন'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
