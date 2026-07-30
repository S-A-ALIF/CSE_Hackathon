import ThemeSelector from '../../components/ThemeSelector';

export default function AdminSettingsTab() {
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
    </div>
  );
}
