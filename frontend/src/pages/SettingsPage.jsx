import ThemeSelector from '../components/ThemeSelector';
import { useAuth } from '../contexts/AuthContext';

export default function SettingsPage() {
  const { currentUser } = useAuth();

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
      <div>
        <h1 className="text-3xl font-black text-slate-900">Account Settings</h1>
        <p className="text-slate-500 mt-1">
          Manage your interface preferences, display theme, and general account settings.
        </p>
      </div>

      {/* Theme & Appearance Selector */}
      <ThemeSelector />

      {/* Account Info Summary Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-xl font-bold text-slate-900">Account Information</h3>
        <p className="text-sm text-slate-500">
          Your active login credentials and account permissions.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Email Address</p>
            <p className="text-sm font-semibold text-slate-800 mt-1 truncate">{currentUser?.email || 'N/A'}</p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Account Role</p>
            <p className="text-sm font-semibold text-slate-800 mt-1 capitalize">{currentUser?.role || 'Hacker'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
