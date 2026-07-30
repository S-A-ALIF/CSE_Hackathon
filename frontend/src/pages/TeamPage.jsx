import { API_URL } from '../config';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import CreateTeamModal from '../features/team/CreateTeamModal';
import JoinTeamModal from '../features/team/JoinTeamModal';
import TeamManagementModal from '../features/team/TeamManagementModal';
import ConfirmModal from '../components/ConfirmModal';
import MemberInfoModal from '../features/team/MemberInfoModal';

export default function TeamPage({ inDashboard = false }) {
  const { currentUser } = useAuth();
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [isConfirmLeaveOpen, setIsConfirmLeaveOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

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

  const executeLeaveTeam = async () => {
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
        setIsConfirmLeaveOpen(false);
        fetchTeam();
      } else {
        toast.error(data.message || 'Failed to leave team');
      }
    } catch (error) {
      console.error('Error leaving team:', error);
      toast.error('Network error leaving team');
    }
  };

  const handleLeaveTeam = () => {
    setIsConfirmLeaveOpen(true);
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
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-4 sm:p-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 flex-wrap gap-4">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900">{team.name}</h2>
                  <p className="text-slate-500 font-medium mt-1 text-sm sm:text-base">Created on {new Date(team.created_at).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 flex-wrap w-full sm:w-auto">
                  {team.team_code && (
                    <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-xl font-mono text-xs sm:text-sm font-bold text-slate-800">
                      <span>Code:</span>
                      <span className="text-blue-600">{team.team_code}</span>
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(team.team_code);
                          toast.success('Team Code copied to clipboard!');
                        }}
                        className="text-slate-400 hover:text-slate-600 ml-1"
                        title="Copy Code"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                      </button>
                    </div>
                  )}
                  <div className="relative group cursor-pointer inline-flex items-center">
                    {team.minMembers !== null && team.minMembers !== undefined && (
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block px-3 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-lg shadow-lg whitespace-nowrap z-30 pointer-events-none border border-slate-700">
                        min team size {team.minMembers ?? 3}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900" />
                      </div>
                    )}
                    <span className={`px-4 py-2 font-bold rounded-full text-xs sm:text-sm flex items-center gap-1.5 transition-colors ${
                      team.is_full
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : team.members.length < (team.minMembers ?? 3)
                        ? 'bg-red-100 text-red-700 border border-red-300 shadow-sm'
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {team.is_full && <span>🔒 Declared Full</span>}
                      <span>({team.members.length} / {team.maxMembers || 5} Members)</span>
                    </span>
                  </div>
                  {team.leader_id === currentUser?.id ? (
                    <button
                      onClick={() => setIsManageModalOpen(true)}
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs sm:text-sm transition-colors shadow-sm"
                    >
                      Manage Team
                    </button>
                  ) : (
                    <button
                      onClick={handleLeaveTeam}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs sm:text-sm transition-colors shadow-sm"
                    >
                      Leave Team
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-2 gap-1">
                  <h3 className="text-lg font-bold text-slate-900">Team Members</h3>
                  <span className="text-xs font-semibold text-slate-400">Click any member to view full details</span>
                </div>
                <div className="grid gap-4">
                  {team.members.map((member) => (
                    <div 
                      key={member.id} 
                      onClick={() => setSelectedMember(member)}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 p-4 bg-slate-50 rounded-2xl border border-slate-100 transition-all hover:bg-white hover:border-blue-300 hover:shadow-md cursor-pointer group"
                    >
                      <div className="flex items-center space-x-3 sm:space-x-4 min-w-0">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center font-bold text-base sm:text-lg shadow-sm shrink-0">
                          {(member.name || member.email).charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                            {member.name || member.email}
                          </p>
                          <p className="text-xs sm:text-sm font-semibold text-slate-500 truncate">
                            Student ID: <span className="text-slate-700 font-bold">{member.student_id && member.student_id !== 'N/A' ? member.student_id : 'Not provided'}</span>
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 sm:gap-3 self-end sm:self-auto">
                        {member.id === team.leader_id && (
                          <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full uppercase tracking-wide">
                            Leader
                          </span>
                        )}
                        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-all flex items-center gap-1">
                          <span>View Info</span>
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* If user is leader, they might want to invite more people */}
            {team.leader_id === currentUser?.id && (
              <div className="text-center">
                {(team.maxMembers === null || team.members.length < (team.maxMembers || 5)) && !team.is_full ? (
                  <button 
                    onClick={() => setIsCreateModalOpen(true)}
                    className="px-6 py-3 bg-white text-blue-600 font-bold rounded-xl border border-blue-200 hover:bg-blue-50 transition-all shadow-sm inline-flex items-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span>Add member ({team.maxMembers ? `${team.members.length}/${team.maxMembers}` : team.members.length})</span>
                  </button>
                ) : (
                  <div className="inline-flex items-center space-x-2 px-6 py-3 bg-slate-100 text-slate-500 font-bold rounded-xl border border-slate-200">
                    <span>{team.is_full ? 'Team Declared Full' : 'Team Maximum Limit Reached'} ({team.maxMembers ? `${team.members.length}/${team.maxMembers}` : team.members.length})</span>
                  </div>
                )}
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
      <ConfirmModal
        isOpen={isConfirmLeaveOpen}
        onClose={() => setIsConfirmLeaveOpen(false)}
        onConfirm={executeLeaveTeam}
        title="Leave Team?"
        message="Are you sure you want to leave this team? You will lose access to the team and its resources."
        confirmText="Leave Team"
        variant="danger"
      />
      <MemberInfoModal
        isOpen={!!selectedMember}
        onClose={() => setSelectedMember(null)}
        member={selectedMember}
        isLeader={team?.leader_id === selectedMember?.id}
      />
    </div>
  );
}
