import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { API_URL } from '../../config';
import ConfirmModal from '../../components/ConfirmModal';
import MemberInfoModal from './MemberInfoModal';

export default function TeamManagementModal({ isOpen, onClose, team, currentUser, onTeamUpdated }) {
  const [loading, setLoading] = useState(false);
  const [teamName, setTeamName] = useState(team?.name || '');
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameLoading, setNameLoading] = useState(false);
  const [transferLoading, setTransferLoading] = useState({});
  const [selectedMember, setSelectedMember] = useState(null);
  const [statusLoading, setStatusLoading] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Confirm',
    variant: 'danger',
    onConfirm: () => {}
  });

  useEffect(() => {
    if (team?.name) {
      setTeamName(team.name);
    }
  }, [team]);

  if (!isOpen || !team) return null;

  const isLeader = team.leader_id === currentUser?.id;

  const handleUpdateName = async (e) => {
    e.preventDefault();
    if (!teamName.trim() || teamName.trim() === team.name) {
      setIsEditingName(false);
      return;
    }
    setNameLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/v1/teams/name`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: teamName.trim() })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(data.message || 'Team name updated');
        setIsEditingName(false);
        onTeamUpdated();
      } else {
        toast.error(data.message || 'Failed to update team name');
      }
    } catch (error) {
      console.error('Error updating team name:', error);
      toast.error('Network error updating team name');
    } finally {
      setNameLoading(false);
    }
  };

  const executeTransferLeadership = async (memberId) => {
    setTransferLoading(prev => ({ ...prev, [memberId]: true }));
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/v1/teams/transfer-leadership`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ newLeaderId: memberId })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(data.message || 'Leadership transferred successfully');
        setConfirmConfig(prev => ({ ...prev, isOpen: false }));
        onTeamUpdated();
      } else {
        toast.error(data.message || 'Failed to transfer leadership');
      }
    } catch (error) {
      console.error('Error transferring leadership:', error);
      toast.error('Network error transferring leadership');
    } finally {
      setTransferLoading(prev => {
        const next = { ...prev };
        delete next[memberId];
        return next;
      });
    }
  };

  const handleTransferLeadership = (memberId, memberEmail) => {
    setConfirmConfig({
      isOpen: true,
      title: "Transfer Leadership?",
      message: `Are you sure you want to transfer leadership to ${memberEmail}? You will become a regular member.`,
      confirmText: "Transfer Leadership",
      variant: "warning",
      onConfirm: () => executeTransferLeadership(memberId)
    });
  };

  const executeRemoveMember = async (memberId) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/v1/teams/members/${memberId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(data.message || 'Member removed');
        setConfirmConfig(prev => ({ ...prev, isOpen: false }));
        onTeamUpdated();
      } else {
        toast.error(data.message || 'Failed to remove member');
      }
    } catch (error) {
      console.error('Error removing member:', error);
      toast.error('Network error removing member');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMember = (memberId, memberEmail) => {
    setConfirmConfig({
      isOpen: true,
      title: "Remove Member?",
      message: `Are you sure you want to remove ${memberEmail} from the team?`,
      confirmText: "Remove",
      variant: "danger",
      onConfirm: () => executeRemoveMember(memberId)
    });
  };

  const executeLeaveTeam = async () => {
    setLoading(true);
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
        setConfirmConfig(prev => ({ ...prev, isOpen: false }));
        onClose();
        onTeamUpdated();
      } else {
        toast.error(data.message || 'Failed to leave team');
      }
    } catch (error) {
      console.error('Error leaving team:', error);
      toast.error('Network error leaving team');
    } finally {
      setLoading(false);
    }
  };

  const handleLeaveTeam = () => {
    if (currentUser?.id === team?.leader_id && team?.members?.length > 1) {
      toast.error("You cannot leave the team unless you select the next leader. Please transfer leadership first.");
      return;
    }
    setConfirmConfig({
      isOpen: true,
      title: "Leave Team?",
      message: "Are you sure you want to leave this team?",
      confirmText: "Leave Team",
      variant: "danger",
      onConfirm: () => executeLeaveTeam()
    });
  };

  const executeDisbandTeam = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/v1/teams`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(data.message || 'Team disbanded successfully');
        setConfirmConfig(prev => ({ ...prev, isOpen: false }));
        onClose();
        onTeamUpdated();
      } else {
        toast.error(data.message || 'Failed to disband team');
      }
    } catch (error) {
      console.error('Error disbanding team:', error);
      toast.error('Network error disbanding team');
    } finally {
      setLoading(false);
    }
  };

  const handleDisbandTeam = () => {
    setConfirmConfig({
      isOpen: true,
      title: "Disband Team?",
      message: "WARNING: Are you sure you want to disband the entire team? All members and invitations will be removed.",
      confirmText: "Disband Team",
      variant: "danger",
      onConfirm: () => executeDisbandTeam()
    });
  };

  const handleToggleTeamFull = async (nextIsFull) => {
    try {
      setStatusLoading(true);
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/v1/teams/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ is_full: nextIsFull })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(nextIsFull ? 'Team declared full. No more join requests allowed.' : 'Team reopened for join requests.');
        onTeamUpdated();
      } else {
        toast.error(data.message || 'Failed to update team status');
      }
    } catch (error) {
      console.error('Error updating team status:', error);
      toast.error('Network error updating team status');
    } finally {
      setStatusLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-8 relative mx-4 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>

        <div className="mb-6">
          <div className="flex items-center justify-between gap-3">
            {isEditingName ? (
              <form onSubmit={handleUpdateName} className="flex items-center gap-2 flex-1">
                <input
                  type="text"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  disabled={nameLoading}
                  className="flex-1 px-3 py-1.5 border border-slate-300 rounded-lg text-lg font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter team name"
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={nameLoading}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition-all flex items-center gap-1.5"
                >
                  {nameLoading ? (
                    <svg className="animate-spin h-3.5 w-3.5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : 'Save'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTeamName(team.name);
                    setIsEditingName(false);
                  }}
                  disabled={nameLoading}
                  className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-lg transition-all"
                >
                  Cancel
                </button>
              </form>
            ) : (
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-black text-slate-900">{team.name} - Management</h2>
                {isLeader && (
                  <button
                    type="button"
                    onClick={() => setIsEditingName(true)}
                    className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                    title="Edit Team Name"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                  </button>
                )}
              </div>
            )}
          </div>
          <p className="text-sm text-slate-500 mt-1">Manage team membership, roles, and settings.</p>
        </div>

        <div className="space-y-4 mb-8">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Members ({team.members?.length || 0})</h3>
            {isLeader && (
              <button
                type="button"
                onClick={() => handleToggleTeamFull(!team.is_full)}
                disabled={statusLoading}
                className={`px-3 py-1 font-bold rounded-lg text-xs transition-all flex items-center gap-1.5 ${
                  team.is_full
                    ? 'bg-amber-500 hover:bg-amber-600 text-white'
                    : 'bg-slate-200 hover:bg-slate-300 text-slate-800'
                }`}
              >
                {statusLoading ? 'Updating...' : team.is_full ? '🔓 Reopen Team' : '🔒 Declare Full'}
              </button>
            )}
          </div>
          <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
            {team.members?.map((member) => (
              <div key={member.id} className="p-3.5 bg-slate-50/50 flex items-center justify-between hover:bg-slate-100/70 transition-colors">
                <div 
                  onClick={() => setSelectedMember(member)}
                  className="cursor-pointer group flex-1 mr-2"
                  title="Click to view member profile"
                >
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-slate-800 text-sm group-hover:text-blue-600 transition-colors">
                      {member.name || member.email}
                    </p>
                    {member.id === team.leader_id && (
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-bold rounded uppercase">
                        Leader
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 font-semibold mt-0.5">
                    Student ID: <span className="text-slate-700">{member.student_id && member.student_id !== 'N/A' ? member.student_id : 'Not provided'}</span>
                  </p>
                </div>
                {isLeader && member.id !== team.leader_id && (
                  <div className="flex items-center gap-2">
                    <button
                      disabled={loading || !!transferLoading[member.id]}
                      onClick={() => handleTransferLeadership(member.id, member.email)}
                      className="text-amber-600 hover:text-amber-700 text-xs font-semibold px-2.5 py-1 rounded border border-amber-200 hover:bg-amber-50 transition-colors flex items-center gap-1 disabled:opacity-50"
                    >
                      {transferLoading[member.id] && (
                        <svg className="animate-spin h-3 w-3 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      )}
                      Make Leader
                    </button>
                    <button
                      disabled={loading || !!transferLoading[member.id]}
                      onClick={() => handleRemoveMember(member.id, member.email)}
                      className="text-red-500 hover:text-red-700 text-xs font-semibold px-2 py-1 rounded border border-red-200 hover:bg-red-50 transition-colors disabled:opacity-50"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-slate-100 pt-6 flex flex-col sm:flex-row justify-between gap-3">
          <button
            disabled={loading}
            onClick={handleLeaveTeam}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm rounded-xl transition-colors"
          >
            Leave Team
          </button>

          {isLeader && (
            <button
              disabled={loading}
              onClick={handleDisbandTeam}
              className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-xl transition-colors shadow-sm"
            >
              Disband Team
            </button>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={confirmConfig.isOpen}
        onClose={() => setConfirmConfig(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmConfig.onConfirm}
        title={confirmConfig.title}
        message={confirmConfig.message}
        confirmText={confirmConfig.confirmText}
        variant={confirmConfig.variant}
        loading={loading || Object.values(transferLoading).some(Boolean)}
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
