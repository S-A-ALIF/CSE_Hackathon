import { useState, useEffect } from 'react';
import { API_URL } from '../config';
import { useAuth } from '../contexts/AuthContext';

export default function AdminMessagePopup() {
  const { currentUser } = useAuth();
  const [activePopup, setActivePopup] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!currentUser || !currentUser.email) return;

    // Check immediately on mount/login
    checkAdminNotifications();

    // Poll every 15 seconds for real-time detection while browsing
    const interval = setInterval(() => {
      checkAdminNotifications();
    }, 15000);

    return () => clearInterval(interval);
  }, [currentUser]);

  const checkAdminNotifications = async () => {
    if (!currentUser || !currentUser.email) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/v1/notifications?email=${encodeURIComponent(currentUser.email)}`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      const data = await res.json();
      if (res.ok && data.success && Array.isArray(data.data)) {
        const notifs = data.data;

        // Filter unread admin broadcast messages
        const adminNotifs = notifs.filter(n => {
          if (n.is_read) return false;
          const msg = String(n.message || '');
          return (
            msg.includes('📢') ||
            msg.includes('⚠️') ||
            msg.includes('🚨') ||
            msg.includes('[Admin Message]') ||
            msg.includes('[Important Notice]') ||
            msg.includes('[URGENT Broadcast]')
          );
        });

        // Check local storage for already dismissed popup notifications
        const dismissedIds = JSON.parse(localStorage.getItem('dismissedAdminNotifs') || '[]');
        const unreadUndismissed = adminNotifs.filter(n => !dismissedIds.includes(n.id));

        if (unreadUndismissed.length > 0) {
          setActivePopup(unreadUndismissed[0]);
          setIsOpen(true);
        }
      }
    } catch (err) {
      console.error('Error checking admin notifications for popup:', err);
    }
  };

  const handleDismiss = () => {
    if (!activePopup) return;
    const dismissedIds = JSON.parse(localStorage.getItem('dismissedAdminNotifs') || '[]');
    localStorage.setItem(
      'dismissedAdminNotifs',
      JSON.stringify([...new Set([...dismissedIds, activePopup.id])])
    );
    setIsOpen(false);
    setActivePopup(null);
  };

  if (!isOpen || !activePopup) return null;

  // Extract badge / severity info
  const rawMsg = String(activePopup.message || '');
  let badgeColor = 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
  let badgeText = 'ADMIN MESSAGE';
  let dotColor = 'bg-blue-500';

  if (rawMsg.includes('🚨') || rawMsg.includes('URGENT')) {
    badgeColor = 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20';
    badgeText = 'URGENT BROADCAST';
    dotColor = 'bg-rose-500';
  } else if (rawMsg.includes('⚠️') || rawMsg.includes('Important Notice')) {
    badgeColor = 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
    badgeText = 'IMPORTANT NOTICE';
    dotColor = 'bg-amber-500';
  }

  // Clean raw message slightly for nice preview
  const cleanMsg = rawMsg
    .replace('📢 [Admin Message]', '')
    .replace('🚨 [URGENT Broadcast]', '')
    .replace('⚠️ [Important Notice]', '')
    .trim();

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-md w-full overflow-hidden transform transition-all scale-100">
        {/* Top Header Bar with Close text button at Top Right instead of Cross */}
        <div className="p-6 pb-4 flex items-start justify-between gap-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xl shrink-0 shadow-sm">
              📢
            </div>
            <div>
              <h3 className="font-black text-slate-900 dark:text-white text-base leading-tight">
                You received a message from the admin
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                New platform announcement
              </p>
            </div>
          </div>

          {/* Top Right "Close" Button (instead of cross) */}
          <button
            type="button"
            onClick={handleDismiss}
            className="px-3.5 py-1.5 bg-slate-200/80 hover:bg-slate-300/80 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl transition-all shadow-sm shrink-0"
          >
            Close
          </button>
        </div>

        {/* Message Content Body */}
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${badgeColor}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`}></span>
              {badgeText}
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-500">
              Check Notification Bell for details
            </span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-4 border border-slate-200/60 dark:border-slate-700/60">
            <p className="text-sm text-slate-700 dark:text-slate-200 font-medium whitespace-pre-line leading-relaxed">
              {cleanMsg || rawMsg}
            </p>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
            You can view this message anytime in your Notifications menu (bell icon at top right).
          </p>
        </div>
      </div>
    </div>
  );
}
