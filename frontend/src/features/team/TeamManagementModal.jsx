import { useState } from 'react';
import { toast } from 'sonner';
import { API_URL } from '../../config';

export default function TeamManagementModal({ isOpen, onClose, team, currentUser, onTeamUpdated }) {
  const [loading, setLoading] = useState(false);

  if (!isOpen || !team) return null;

  const isLeader = team.leader_id === currentUser?.id;

  const handleRemoveMember = async (memberId, memberEmail) => {
    if (!window.confirm(`Are you sure you want to remove ${memberEmail} from the team?`)) return;
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

  const handleLeaveTeam = async () => {
    if (!window.confirm('Are you sure you want to leave this team?')) return;
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

  const handleDisbandTeam = async () => {
    if (!window.confirm('WARNING: Are you sure you want to disband the entire team? All members and invitations will be removed.')) return;
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
          <h2 className="text-2xl font-black text-slate-900">{team.name} - Management</h2>
          <p className="text-sm text-slate-500 mt-1">Manage team membership, roles, and settings.</p>
        </div>

        <div className="space-y-4 mb-8">
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Members ({team.members?.length || 0})</h3>
          <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
            {team.members?.map((member) => (
              <div key={member.id} className="p-3.5 bg-slate-50/50 flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-800 text-sm">{member.email}</p>
                  <span className="text-xs text-slate-500 capitalize">{member.role}</span>
                  {member.id === team.leader_id && (
                    <span className="ml-2 px-2 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-bold rounded uppercase">
                      Leader
                    </span>
                  )}
                </div>
                {isLeader && member.id !== team.leader_id && (
                  <button
                    disabled={loading}
                    onClick={() => handleRemoveMember(member.id, member.email)}
                    className="text-red-500 hover:text-red-700 text-xs font-semibold px-2 py-1 rounded border border-red-200 hover:bg-red-50 transition-colors"
                  >
                    Remove
                  </button>
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
    </div>
  );
}
