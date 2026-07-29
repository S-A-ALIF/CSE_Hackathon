import { useState, useEffect } from 'react';
import { API_URL } from '../../config';
import { toast } from 'sonner';

export default function AdminSettingsTab() {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/v1/admin/settings`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSettings(data.data);
      } else {
        toast.error(data.message || 'Failed to load settings');
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Error loading settings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleToggleRegistration = async () => {
    setToggling(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/v1/admin/settings/toggle-registration`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(data.message);
        setSettings((prev) => ({
          ...prev,
          registration_open: data.data.registration_open
        }));
      } else {
        toast.error(data.message || 'Failed to toggle registration');
      }
    } catch (error) {
      console.error('Error toggling reg:', error);
      toast.error('Error updating registration status');
    } finally {
      setToggling(false);
    }
  };

  const isRegOpen = settings.registration_open !== 'false';

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Platform Settings</h1>
        <p className="text-slate-600 mt-1">Configure global platform rules and event availability.</p>
      </div>

      {/* Registration Open/Close Toggle Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-black text-slate-900">Account Registration</h3>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                isRegOpen
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {isRegOpen ? 'OPEN' : 'CLOSED'}
            </span>
          </div>
          <p className="text-slate-600 text-sm mt-1">
            When closed, new users will be blocked from signing up for the hackathon.
          </p>
        </div>

        <button
          onClick={handleToggleRegistration}
          disabled={toggling}
          className={`px-6 py-3 rounded-xl font-bold text-sm text-white transition-all shadow-lg ${
            isRegOpen
              ? 'bg-red-600 hover:bg-red-700 shadow-red-600/30'
              : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/30'
          }`}
        >
          {toggling
            ? 'Updating...'
            : isRegOpen
            ? '🔴 Close Registration'
            : '🟢 Open Registration'}
        </button>
      </div>

      {/* Other Platform Details Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <h3 className="text-xl font-black text-slate-900">Event Configuration</h3>
        <p className="text-slate-500 text-sm">
          More platform settings (such as submission deadline date and judging criteria) will appear here as tournament phases progress.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
          <div className="p-4 bg-slate-50 rounded-xl">
            <span className="text-xs font-bold text-slate-400 uppercase">Event Title</span>
            <p className="text-sm font-bold text-slate-800 mt-0.5">GSTU CSE Hackathon</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl">
            <span className="text-xs font-bold text-slate-400 uppercase">Current Phase</span>
            <p className="text-sm font-bold text-emerald-600 mt-0.5">🟢 Registration & Team Formation</p>
          </div>
        </div>
      </div>
    </div>
  );
}
