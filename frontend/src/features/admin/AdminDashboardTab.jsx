import { useState, useEffect } from 'react';
import { API_URL } from '../../config';
import { toast } from 'sonner';
import { adminCache } from './adminCache';

export default function AdminDashboardTab({ setActiveTab }) {
  const [stats, setStats] = useState(adminCache.stats || { totalUsers: 0, totalTeams: 0, settings: {} });
  const [loading, setLoading] = useState(!adminCache.stats);

  const fetchStats = async (force = false) => {
    if (!force && adminCache.isFresh('stats')) {
      setStats(adminCache.stats);
      setLoading(false);
      return;
    }
    if (!adminCache.stats || force) {
      setLoading(true);
    }
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/v1/admin/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        adminCache.set('stats', data.data);
        setStats(data.data);
      } else {
        toast.error(data.message || 'Failed to load dashboard statistics');
      }
    } catch (error) {
      console.error('Error fetching admin stats:', error);
      toast.error('Error loading admin statistics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats(false);
  }, []);

  const isRegOpen = stats.settings?.registration_open !== 'false';

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Admin Command Center</h1>
          <p className="text-slate-600 mt-1">Live platform statistics and system status for GSTU CSE Hackathon.</p>
        </div>
        <button
          onClick={() => fetchStats(true)}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl font-semibold text-sm text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
          Refresh Stats
        </button>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-bold uppercase tracking-wider text-slate-400">Total Teams</span>
              <span className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                👥
              </span>
            </div>
            <div className="text-4xl font-black text-slate-900">{stats.totalTeams}</div>
          </div>
          <button
            onClick={() => setActiveTab('teams')}
            className="mt-4 text-sm font-semibold text-blue-600 hover:underline self-start"
          >
            Manage All Teams &rarr;
          </button>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-bold uppercase tracking-wider text-slate-400">Registered Members</span>
              <span className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                👤
              </span>
            </div>
            <div className="text-4xl font-black text-slate-900">{stats.totalUsers || 0}</div>
            <div className="mt-4 grid grid-cols-3 gap-2">
              <div className="bg-slate-50 rounded-xl p-2 text-center border border-slate-100">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Admins</div>
                <div className="text-lg font-black text-slate-800 leading-none">{stats.totalAdmins || 0}</div>
              </div>
              <div className="bg-slate-50 rounded-xl p-2 text-center border border-slate-100">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Mentors</div>
                <div className="text-lg font-black text-slate-800 leading-none">{stats.totalMentors || 0}</div>
              </div>
              <div className="bg-slate-50 rounded-xl p-2 text-center border border-slate-100">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Students</div>
                <div className="text-lg font-black text-slate-800 leading-none">{stats.totalStudents || 0}</div>
              </div>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('members')}
            className="mt-4 text-sm font-semibold text-emerald-600 hover:underline self-start"
          >
            View All Members &rarr;
          </button>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-bold uppercase tracking-wider text-slate-400">Registration Status</span>
              <span className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                isRegOpen ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
              }`}>
                {isRegOpen ? '🟢' : '🔴'}
              </span>
            </div>
            <div className="text-2xl font-black text-slate-900">
              {isRegOpen ? 'OPEN' : 'CLOSED'}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {isRegOpen ? 'Participants can register new accounts' : 'New account registration is paused'}
            </p>
          </div>
          <button
            onClick={() => setActiveTab('control')}
            className="mt-4 text-sm font-semibold text-slate-700 hover:underline self-start"
          >
            Platform Control Center &rarr;
          </button>
        </div>
      </div>

      {/* Quick Tips */}
      <div className="bg-blue-600/5 border border-blue-500/20 rounded-2xl p-6">
        <h3 className="font-bold text-slate-900 mb-2">📌 Admin Tips & Controls</h3>
        <ul className="text-sm text-slate-600 space-y-2 list-disc list-inside">
          <li>Use the <strong>All Teams</strong> tab to expand any team and view all of its registered members.</li>
          <li>Click on any team or member row to open the <strong>Details Information Modal</strong>.</li>
          <li>Use the <strong>Three-Dot Menu (⋮)</strong> on any row to Edit details, Ban/Unban, or Delete a team/member.</li>
          <li>Toggle registration open or closed globally from the <strong>Control</strong> tab.</li>
        </ul>
      </div>
    </div>
  );
}
