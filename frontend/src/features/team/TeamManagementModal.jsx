import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { API_URL } from '../../config';
import ConfirmModal from '../../components/ConfirmModal';
import MemberInfoModal from './MemberInfoModal';

export default function TeamManagementModal({ isOpen, onClose, team, currentUser, onTeamUpdated, invitations = [], invLoading = false, onFetchInvitations, onInvitationCancelled }) {
  const [loading, setLoading] = useState(false);
  const [teamName, setTeamName] = useState(team?.name || '');
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameLoading, setNameLoading] = useState(false);
  const [transferLoading, setTransferLoading] = useState({});
  const [selectedMember, setSelectedMember] = useState(null);
  const [statusLoading, setStatusLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState({});
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
  const pendingInvitations = invitations;

  const executeCancelInvitation = async (invitationId) => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      setCancelLoading(prev => ({ ...prev, [invitationId]: true }));
      const res = await fetch(`${API_URL}/api/v1/teams/invitations/${invitationId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success('Invitation cancelled.');
        setConfirmConfig(prev => ({ ...prev, isOpen: false }));
        onInvitationCancelled?.(invitationId);
      } else {
        toast.error(data.message || 'Failed to cancel invitation');
      }
    } catch (err) {
      console.error('Error cancelling invitation:', err);
      toast.error('Network error cancelling invitation');
    } finally {
      setCancelLoading(prev => { const n = { ...prev }; delete n[invitationId]; return n; });
    }
  };

  const handleCancelInvitation = (inv) => {
    setConfirmConfig({
      isOpen: true,
      title: 'Cancel Invitation?',
      message: `Are you sure you want to cancel the invitation sent to ${inv.invitee_name || inv.email}? Their pending notification will also be removed.`,
      confirmText: 'Cancel Invitation',
      variant: 'danger',
      onConfirm: () => executeCancelInvitation(inv.id)
    });
  };

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
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl p-8 relative mx-4 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-800">
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
                  className="flex-1 px-3 py-1.5 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg text-lg font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              <>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">{team.name} - Management</h2>
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
              </>
            )}
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage team membership, roles, and settings.</p>
        </div>

        <div className="space-y-4 mb-8">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Team Status</h3>
            {isLeader && (
              <button
                disabled={statusLoading}
                onClick={() => handleToggleTeamFull(!team.is_full)}
                className={`px-4 py-2 font-bold text-xs rounded-xl transition-all shadow-sm flex items-center justify-center sm:justify-start gap-2 ${
                  team.is_full 
                    ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/50 dark:text-emerald-400 dark:hover:bg-emerald-900/70 border border-emerald-200 dark:border-emerald-800' 
                    : 'bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-900/50 dark:text-amber-400 dark:hover:bg-amber-900/70 border border-amber-200 dark:border-amber-800'
                }`}
              >
                {statusLoading ? 'Updating...' : team.is_full ? '🔓 Reopen Team' : '🔒 Declare Full'}
              </button>
            )}
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {team.is_full 
                ? "Your team is currently marked as FULL. No one else can join your team, even if they have the invite code." 
                : "Your team is OPEN. Anyone with the invite code can join until you reach the maximum member limit."}
            </p>
          </div>
        </div>

        {/* Pending Invitations — leader only */}
        {isLeader && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
                Pending Invitations
                {pendingInvitations.length > 0 && (
                  <span className="ml-2 inline-flex items-center justify-center w-5 h-5 bg-blue-100 text-blue-700 text-[10px] font-black rounded-full">
                    {pendingInvitations.length}
                  </span>
                )}
              </h3>
              <button
                type="button"
                onClick={onFetchInvitations}
                disabled={invLoading}
                className="text-xs text-slate-400 hover:text-blue-600 transition-colors flex items-center gap-1"
                title="Refresh"
              >
                <svg className={`w-3.5 h-3.5 ${invLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
            </div>
            {invLoading ? (
              <div className="text-center py-4 text-slate-400 dark:text-slate-500 text-sm">Loading...</div>
            ) : pendingInvitations.length === 0 ? (
              <div className="text-center py-4 text-slate-400 dark:text-slate-500 text-xs border border-dashed border-slate-200 dark:border-slate-700 rounded-xl">
                No active pending invitations.
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                {pendingInvitations.map((inv) => (
                  <div key={inv.id} className="p-3 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-between gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm truncate">
                        {inv.invitee_name !== inv.email ? inv.invitee_name : inv.email}
                      </p>
                      {inv.invitee_name !== inv.email && (
                        <p className="text-xs text-slate-400 dark:text-slate-500 truncate">{inv.email}</p>
                      )}
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                        Expires: {new Date(new Date(inv.expires_at).getTime() + 6 * 60 * 60 * 1000).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hour12: true })}
                      </p>
                    </div>
                    <button
                      disabled={!!cancelLoading[inv.id]}
                      onClick={() => handleCancelInvitation(inv)}
                      className={`flex-shrink-0 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-xs font-semibold px-2.5 py-1 rounded border border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors flex items-center gap-1.5 ${cancelLoading[inv.id] ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                      {cancelLoading[inv.id] ? (
                        <>
                          <svg className="animate-spin h-3 w-3 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>Cancelling...</span>
                        </>
                      ) : (
                        <span>Cancel</span>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="border-t border-slate-100 dark:border-slate-800 pt-6 flex flex-col sm:flex-row justify-between gap-3">
          <button
            disabled={loading}
            onClick={handleLeaveTeam}
            className="px-5 py-2.5 bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40 font-bold rounded-xl text-sm transition-colors border border-red-100 dark:border-red-900/50 flex items-center justify-center gap-2"
          >
            Leave Team
          </button>

          {isLeader && (
            <button
              disabled={loading}
              onClick={handleDisbandTeam}
              className="px-5 py-2.5 bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 font-bold rounded-xl text-sm transition-colors shadow-md shadow-slate-900/20 dark:shadow-white/10 flex items-center justify-center gap-2"
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
        loading={loading || Object.values(cancelLoading).some(Boolean)}
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
