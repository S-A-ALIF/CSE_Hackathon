import ThemeSelector from '../../components/ThemeSelector';
import { useAuth } from '../../contexts/AuthContext';

export default function AdminSettingsTab() {
  const { logout } = useAuth();

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Platform Settings</h1>
        <p className="text-slate-600 mt-1">Configure appearance and view event information.</p>
      </div>

      {/* Theme & Display Settings */}
      <ThemeSelector />

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

      {/* Log Out / Session Card */}
      <div className="bg-white rounded-2xl border border-red-200 p-6 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-xl font-black text-red-600">Sign Out of Admin Portal</h3>
          <p className="text-slate-600 text-sm mt-1">
            End your current admin session and return to the login screen.
          </p>
        </div>
        <button
          onClick={logout}
          className="px-6 py-3 rounded-xl font-bold text-sm text-white bg-red-600 hover:bg-red-700 shadow-lg shadow-red-600/30 transition-all flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
          </svg>
          Log Out
        </button>
      </div>
    </div>
  );
}
