import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AdminSidebar from '../features/admin/AdminSidebar';
import AdminDashboardTab from '../features/admin/AdminDashboardTab';
import AdminTeamsTab from '../features/admin/AdminTeamsTab';
import AdminMembersTab from '../features/admin/AdminMembersTab';
import AdminSettingsTab from '../features/admin/AdminSettingsTab';

export default function AdminPage() {
  const { currentUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (!currentUser) {
    return <Navigate to="/" replace />;
  }

  if (currentUser.role !== 'admin') {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-red-500/20 text-red-500 flex items-center justify-center text-3xl font-bold mx-auto">
            🚫
          </div>
          <h1 className="text-3xl font-black">Admin Access Required</h1>
          <p className="text-slate-400">
            You do not have permission to access the GSTU CSE Hackathon Command Center. Only accounts with admin privileges can view this portal.
          </p>
          <div className="pt-2">
            <Link
              to="/dashboard"
              className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg transition-colors"
            >
              Return to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={logout}
      />

      <main className="flex-1 p-6 sm:p-10 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {activeTab === 'dashboard' && <AdminDashboardTab setActiveTab={setActiveTab} />}
          {activeTab === 'teams' && <AdminTeamsTab />}
          {activeTab === 'members' && <AdminMembersTab />}
          {activeTab === 'settings' && <AdminSettingsTab />}
        </div>
      </main>
    </div>
  );
}
