import { API_URL } from '../config';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import CreateTeamModal from '../features/team/CreateTeamModal';
import JoinTeamModal from '../features/team/JoinTeamModal';

export default function TeamPage() {
  const { currentUser } = useAuth();
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);

  const fetchTeam = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(API_URL + '/api/v1/teams/my-team', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setTeam(data.data);
      }
    } catch (error) {
      console.error('Error fetching team:', error);
      toast.error('Failed to load team data');
    } finally {
      setLoading(false);
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
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900">My Team</h1>
          <p className="mt-2 text-lg text-slate-600">Collaborate and manage your hackathon squad.</p>
        </div>

        {/* Content */}
        {!team ? (
          // Empty State
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-12 text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">You are not part of any team yet</h2>
            <p className="text-slate-500 mb-8 max-w-md mx-auto">Join an existing team using a PIN code or create a new team to start inviting members.</p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button 
                onClick={() => setIsJoinModalOpen(true)}
                className="px-8 py-4 bg-white text-slate-900 font-bold rounded-xl border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all shadow-sm"
              >
                Join an Existing Team
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
                <span className="px-4 py-2 bg-blue-100 text-blue-700 font-bold rounded-full text-sm">
                  {team.members.length} Members
                </span>
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
    </div>
  );
}
