import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AdminSidebar from '../features/admin/AdminSidebar';
import AdminDashboardTab from '../features/admin/AdminDashboardTab';
import AdminTeamsTab from '../features/admin/AdminTeamsTab';
import AdminMembersTab from '../features/admin/AdminMembersTab';
import AdminSettingsTab from '../features/admin/AdminSettingsTab';
import NotificationDropdown from '../components/NotificationDropdown';
import ProfilePage from './ProfilePage';

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
    <div className="min-h-screen bg-slate-50 flex flex-col h-screen overflow-hidden">
      {/* Topbar: Only Notification and Profile */}
      <nav className="bg-slate-900 text-white py-4 px-6 lg:px-12 flex justify-between items-center shadow-md relative z-50 shrink-0">
        <Link to="/" className="text-2xl font-black tracking-tighter hover:opacity-80 transition-opacity">
          GSTU<span className="text-blue-500">Admin</span>
        </Link>
        
        <div className="flex items-center space-x-4">
          {/* Notification Bell */}
          <NotificationDropdown />

          {/* Profile Icon */}
          <button 
            onClick={() => setActiveTab('profile')}
            className={`w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 border-2 transition-colors flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              activeTab === 'profile' ? 'border-blue-500 bg-slate-700' : 'border-slate-700'
            }`}
            title="Profile"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-slate-300">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Main Body: Sidebar + Content */}
      <div className="flex-grow flex flex-col md:flex-row h-[calc(100vh-73px)] overflow-hidden">
        <AdminSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onLogout={logout}
        />

        <main className="flex-1 p-6 sm:p-10 overflow-y-auto w-full h-full">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'dashboard' && <AdminDashboardTab setActiveTab={setActiveTab} />}
            {activeTab === 'teams' && <AdminTeamsTab />}
            {activeTab === 'members' && <AdminMembersTab />}
            {activeTab === 'settings' && <AdminSettingsTab />}
            {activeTab === 'profile' && <ProfilePage inDashboard={true} />}
          </div>
        </main>
      </div>
    </div>
  );
}
