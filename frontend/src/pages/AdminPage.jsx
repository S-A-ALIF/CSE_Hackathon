import { useState, useEffect, useRef } from 'react';
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuRef]);

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

          <div className="relative flex items-center space-x-4" ref={menuRef}>
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

            {/* Hamburger Menu */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg text-slate-300 hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {isMenuOpen && (
              <div className="absolute top-full right-0 mt-2 w-56 bg-white text-slate-900 rounded-xl shadow-xl py-2 border border-slate-200 animate-in fade-in slide-in-from-top-2 z-50">
                <div className="px-4 py-2 border-b border-slate-100 mb-1">
                  <p className="text-xs text-slate-400 font-semibold">Signed in as Admin</p>
                  <p className="text-sm font-bold text-slate-800 truncate">{currentUser.email}</p>
                </div>

                <button 
                  onClick={() => { setActiveTab('settings'); setIsMenuOpen(false); }}
                  className="w-full text-left px-4 py-2 text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2 font-medium"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-slate-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                  Settings
                </button>
                
                <div className="h-px bg-slate-100 my-2"></div>
                
                <button 
                  onClick={logout}
                  className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2 font-medium"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-red-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
                  </svg>
                  Log Out
                </button>
              </div>
            )}
          </div>
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
