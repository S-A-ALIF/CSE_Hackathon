import { API_URL } from '../config';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import JoinTeamModal from '../features/team/JoinTeamModal';
import { createPortal } from 'react-dom';

// Utility to format timestamp in GMT+6:00 directly without offset text
const formatGMT6 = (dateString) => {
  if (!dateString) return '';
  try {
    const baseDate = new Date(dateString);
    // Add 6 hours (in ms) to adjust database timestamp directly to Bangladesh Standard Time (9:24 PM)
    const date = new Date(baseDate.getTime() + 6 * 60 * 60 * 1000);
    const dateFormatted = date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
    const timeFormatted = date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
    return `${dateFormatted} at ${timeFormatted}`;
  } catch (err) {
    return new Date(dateString).toLocaleString();
  }
};

export default function NotificationDropdown() {
  const { currentUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  // Fetch notifications
  const fetchNotifications = async (showLoading = true) => {
    const token = localStorage.getItem('token');
    if (!currentUser || !token) return;
    try {
      if (showLoading) setLoading(true);
      const res = await fetch(`${API_URL}/api/v1/notifications?email=${encodeURIComponent(currentUser.email)}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (res.ok) {
        setNotifications(data.data || []);
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications(true);
    // In a real app, you might want to set up an interval to poll, or use WebSockets.
  }, [currentUser]);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const handleMarkAsRead = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/api/v1/notifications/${id}/read`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        // Update local state smoothly
        setNotifications(prev => 
          prev.map(n => String(n.id) === String(id) ? { ...n, is_read: true } : n)
        );
        await fetchNotifications(false);
      } else {
        toast.error("Failed to mark notification as read");
      }
    } catch (err) {
      console.error("Error marking as read:", err);
    }
  };

  const handleMarkAllAsRead = async () => {
    const token = localStorage.getItem('token');
    if (!token || !currentUser) return;
    try {
      const res = await fetch(`${API_URL}/api/v1/notifications/read-all?email=${encodeURIComponent(currentUser.email)}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
        toast.success("All notifications marked as read");
        await fetchNotifications(false);
      } else {
        const errData = await res.json().catch(() => ({}));
        toast.error(errData.message || "Failed to mark all as read");
      }
    } catch (err) {
      console.error("Error marking all as read:", err);
    }
  };

  const handleDeleteNotification = async (e, id) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/api/v1/notifications/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        setNotifications(prev => prev.filter(n => String(n.id) !== String(id)));
        toast.success("Notification deleted");
        fetchNotifications(false);
      } else {
        const errData = await res.json().catch(() => ({}));
        toast.error(errData.message || "Failed to delete notification");
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast.error('Network error deleting notification');
    }
  };

  const handleAcceptInvite = (notification) => {
    setIsOpen(false);
    setShowJoinModal(true);
  };

  const handleRejectInvite = async (notification) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/api/v1/notifications/${notification.id}/reject-invite?email=${encodeURIComponent(currentUser.email)}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || 'Invitation rejected');
        fetchNotifications(false);
      } else {
        toast.error(data.message || 'Failed to reject invitation');
      }
    } catch (error) {
      console.error('Error rejecting invite:', error);
      toast.error('Network error rejecting invitation');
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="relative p-2.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all"
        aria-label="Notifications"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
        </svg>

        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-[60]">
          <div className="bg-slate-50 border-b border-slate-100 px-4 py-3 flex justify-between items-center">
            <h3 className="font-bold text-slate-800">Notifications</h3>
            <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
              {unreadCount} New
            </span>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {loading && notifications.length === 0 ? (
              <div className="p-4 text-center text-sm text-slate-500">Loading...</div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center flex flex-col items-center">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-slate-300 mb-2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
                </svg>
                <p className="text-sm font-semibold text-slate-700">No Notifications</p>
                <p className="text-xs text-slate-400 mt-1">You're all caught up!</p>
              </div>
            ) : (
              <div className="flex flex-col">
                {notifications.map((notification) => (
                  <div 
                    key={notification.id} 
                    onClick={() => {
                        if (!notification.is_read) handleMarkAsRead(notification.id);
                    }}
                    className={`p-4 border-b border-slate-100 cursor-pointer transition-all duration-200 hover:bg-slate-50 flex items-center justify-between group ${
                      notification.is_read ? 'opacity-60' : 'bg-blue-50/30'
                    }`}
                  >
                    <div className="flex gap-3 pr-2">
                      {!notification.is_read && (
                        <div className="mt-1.5 flex-shrink-0">
                          <div className="h-2 w-2 rounded-full bg-blue-600"></div>
                        </div>
                      )}
                      <div>
                        <p className={`text-sm ${notification.is_read ? 'text-slate-600' : 'text-slate-800 font-medium'}`}>
                          {notification.message}
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                          {formatGMT6(notification.created_at)}
                        </p>
                        {notification.message.includes('You received a team invitation') && (
                          <div className="mt-2.5" onClick={(e) => e.stopPropagation()}>
                            {!notification.action_status ? (
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleAcceptInvite(notification)}
                                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm transition-all"
                                >
                                  Accept
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleRejectInvite(notification)}
                                  className="px-3 py-1 bg-slate-200 hover:bg-rose-500 hover:text-white text-slate-700 text-xs font-bold rounded-lg transition-all"
                                >
                                  Reject
                                </button>
                              </div>
                            ) : notification.action_status === 'accepted' ? (
                              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-100/80 px-2.5 py-1 rounded-md w-fit border border-emerald-300">
                                ✓ Accepted
                              </div>
                            ) : notification.action_status === 'rejected' ? (
                              <div className="flex items-center gap-1.5 text-xs font-bold text-rose-700 bg-rose-100/80 px-2.5 py-1 rounded-md w-fit border border-rose-300">
                                ✕ Rejected
                              </div>
                            ) : notification.action_status === 'expired' ? (
                              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-100/80 px-2.5 py-1 rounded-md w-fit border border-amber-300">
                                ⌛ Expired
                              </div>
                            ) : null}
                          </div>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={(e) => handleDeleteNotification(e, notification.id)}
                      className="text-slate-300 hover:text-red-500 p-1.5 rounded-lg transition-colors flex-shrink-0 hover:bg-red-50"
                      title="Delete notification"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="bg-slate-50 border-t border-slate-100 px-4 py-3 flex justify-between items-center">
            {unreadCount > 0 ? (
              <button
                onClick={handleMarkAllAsRead}
                className="text-xs font-semibold text-slate-600 hover:text-slate-800 transition-colors"
              >
                Mark all as read
              </button>
            ) : (
              <div></div>
            )}
            <button 
              onClick={() => {
                fetchNotifications(false);
              }}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
            >
              Refresh
            </button>
          </div>
        </div>
      )}

      {/* Join Team PIN Modal triggered from Accept button, rendered via Portal so it is identical to TeamPage -> Join with code */}
      {showJoinModal && createPortal(
        <JoinTeamModal 
          isOpen={showJoinModal} 
          onClose={() => {
            setShowJoinModal(false);
            fetchNotifications(false);
          }} 
        />,
        document.body
      )}
    </div>
  );
}
