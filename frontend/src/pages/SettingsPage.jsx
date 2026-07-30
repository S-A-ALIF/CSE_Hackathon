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

    </div>
  );
}
