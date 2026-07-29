import { API_URL } from '../config';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import CreateTeamModal from '../features/team/CreateTeamModal';
import JoinTeamModal from '../features/team/JoinTeamModal';
import TeamManagementModal from '../features/team/TeamManagementModal';

export default function TeamPage({ inDashboard = false }) {
  const { currentUser } = useAuth();
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);

  const fetchTeam = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await fetch(API_URL + '/api/v1/teams/my-team', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setTeam(data.data);
      } else {
        setTeam(null);
      }
    } catch (error) {
      console.error('Error fetching team:', error);
      toast.error('Failed to load team data');
    } finally {
      setLoading(false);
    }
  };

  const handleLeaveTeam = async () => {
    if (!window.confirm('Are you sure you want to leave this team?')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/v1/teams/leave`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(data.message || 'Left team successfully');
        fetchTeam();
      } else {
        toast.error(data.message || 'Failed to leave team');
      }
    } catch (error) {
      console.error('Error leaving team:', error);
      toast.error('Network error leaving team');
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className={inDashboard ? 'py-2' : 'min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8'}>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900">My Team</h1>
          <p className="mt-2 text-lg text-slate-600">Collaborate and manage your hackathon squad.</p>
        </div>

        {/* Content */}
        {!team ? (
          // Empty State
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm max-w-lg mx-auto">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">You haven't joined a team yet</h3>
            <p className="text-slate-500 mb-8">Create your own hackathon team or join an existing one using an invite code.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setIsJoinModalOpen(true)}
                className="px-8 py-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl transition-all"
              >
                Join with Code
              </button>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-all"
              >
                Create a New Team
              </button>
            </div>
          </div>
        ) : (
          // Populated State
          <div className="space-y-8">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-black text-slate-900">{team.name}</h2>
                  <p className="text-slate-500 font-medium mt-1">Created on {new Date(team.created_at).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-4 py-2 bg-blue-100 text-blue-700 font-bold rounded-full text-sm">
                    {team.members.length} Members
                  </span>
                  {team.leader_id === currentUser?.id ? (
                    <button
                      onClick={() => setIsManageModalOpen(true)}
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-sm transition-colors shadow-sm"
                    >
                      Manage Team
                    </button>
                  ) : (
                    <button
                      onClick={handleLeaveTeam}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-sm transition-colors shadow-sm"
                    >
                      Leave Team
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">Team Members</h3>
                <div className="grid gap-4">
                  {team.members.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 transition-colors hover:bg-slate-100">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                          {member.email.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{member.email}</p>
                          <p className="text-sm text-slate-500 capitalize">{member.role}</p>
                        </div>
                      </div>
                      {member.id === team.leader_id && (
                        <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full uppercase tracking-wide">
                          Leader
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* If user is leader, they might want to invite more people */}
            {team.leader_id === currentUser?.id && (
              <div className="text-center">
                <button 
                  onClick={() => setIsCreateModalOpen(true)}
                  className="px-6 py-3 bg-white text-blue-600 font-bold rounded-xl border border-blue-200 hover:bg-blue-50 transition-all shadow-sm inline-flex items-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>Add member</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <CreateTeamModal 
        isOpen={isCreateModalOpen} 
        mode={team ? 'invite' : 'create'}
        onClose={() => {
          setIsCreateModalOpen(false);
          fetchTeam(); // Refresh after invite
        }} 
      />
      <JoinTeamModal 
        isOpen={isJoinModalOpen} 
        onClose={() => {
          setIsJoinModalOpen(false);
          fetchTeam(); // Refresh after join
        }} 
      />
      <TeamManagementModal
        isOpen={isManageModalOpen}
        onClose={() => setIsManageModalOpen(false)}
        team={team}
        currentUser={currentUser}
        onTeamUpdated={fetchTeam}
      />
    </div>
  );
}
