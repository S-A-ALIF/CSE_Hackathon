import { useState, useEffect } from 'react';
import { API_URL } from '../../config';
import { toast } from 'sonner';
import DetailsInfoModal from './DetailsInfoModal';
import EditModal from './EditModal';
import ConfirmModal from '../../components/ConfirmModal';

export default function AdminTeamsTab() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedTeams, setExpandedTeams] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmConfig, setConfirmConfig] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Delete',
    variant: 'danger',
    onConfirm: () => {}
  });

  // Modals state
  const [detailsModalData, setDetailsModalData] = useState(null);
  const [detailsModalType, setDetailsModalType] = useState('team');
  const [editModalData, setEditModalData] = useState(null);
  const [editModalType, setEditModalType] = useState('team');

  // Menu open state
  const [openMenuId, setOpenMenuId] = useState(null);

  const fetchTeams = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/v1/admin/teams`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setTeams(data.data);
      } else {
        toast.error(data.message || 'Failed to fetch teams');
      }
    } catch (error) {
      console.error('Error loading teams:', error);
      toast.error('Error fetching teams');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const toggleExpand = (teamId) => {
    setExpandedTeams((prev) => ({
      ...prev,
      [teamId]: !prev[teamId]
    }));
  };

  const toggleExpandAll = () => {
    const allExpanded = Object.keys(expandedTeams).length === teams.length;
    if (allExpanded) {
      setExpandedTeams({});
    } else {
      const next = {};
      teams.forEach((t) => {
        next[t.id] = true;
      });
      setExpandedTeams(next);
    }
  };

  const executeDeleteTeam = async (teamId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/v1/admin/teams/${teamId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success('Team deleted successfully');
        setConfirmConfig(prev => ({ ...prev, isOpen: false }));
        fetchTeams();
      } else {
        toast.error(data.message || 'Failed to delete team');
      }
    } catch (err) {
      console.error('Error deleting team:', err);
      toast.error('Error deleting team');
    }
  };

  const handleDeleteTeam = (teamId, teamName) => {
    setConfirmConfig({
      isOpen: true,
      title: "Delete Team?",
      message: `Are you sure you want to permanently delete team "${teamName}"? This action cannot be undone.`,
      confirmText: "Delete Team",
      variant: "danger",
      onConfirm: () => executeDeleteTeam(teamId)
    });
  };

  const handleBanToggleTeam = async (team) => {
    const nextBan = !team.is_banned;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/v1/admin/teams/${team.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          is_banned: nextBan,
          ban_reason: nextBan ? 'Banned by Admin' : null
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(nextBan ? 'Team has been banned' : 'Team is unbanned');
        fetchTeams();
      } else {
        toast.error(data.message || 'Failed to update ban status');
      }
    } catch (err) {
      console.error('Error ban toggle:', err);
      toast.error('Error updating ban status');
    }
  };

  const executeDeleteMember = async (memberId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/v1/admin/members/${memberId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success('Member deleted successfully');
        setConfirmConfig(prev => ({ ...prev, isOpen: false }));
        fetchTeams();
      } else {
        toast.error(data.message || 'Failed to delete member');
      }
    } catch (err) {
      console.error('Error deleting member:', err);
      toast.error('Error deleting member');
    }
  };

  const handleDeleteMember = (memberId, memberEmail) => {
    setConfirmConfig({
      isOpen: true,
      title: "Delete Member?",
      message: `Are you sure you want to permanently delete user "${memberEmail}"? This action cannot be undone.`,
      confirmText: "Delete Member",
      variant: "danger",
      onConfirm: () => executeDeleteMember(memberId)
    });
  };

  const filteredTeams = teams.filter(t =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (t.leader_email && t.leader_email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">All Teams ({teams.length})</h1>
          <p className="text-slate-600 mt-1">Manage hackathon teams, view members, and apply moderation rules.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={toggleExpandAll}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm transition-colors"
          >
            {Object.keys(expandedTeams).length === teams.length ? 'Collapse All' : 'Expand All'}
          </button>
          <button
            onClick={fetchTeams}
            className="px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 font-bold rounded-xl text-sm transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="max-w-md">
        <input
          type="text"
          placeholder="Search teams by name or leader email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 font-semibold text-sm"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
      ) : filteredTeams.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center">
          <p className="text-slate-500 font-semibold">No teams found matching your criteria.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTeams.map((team) => {
            const isExpanded = Boolean(expandedTeams[team.id]);
            const teamMenuKey = `team-${team.id}`;
            const isMenuOpen = openMenuId === teamMenuKey;

            return (
              <div
                key={team.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all"
              >
                {/* Team Header Row */}
                <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
                  <div className="flex items-center gap-4 flex-1 cursor-pointer" onClick={() => toggleExpand(team.id)}>
                    <span className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg shrink-0">
                      {isExpanded ? '▼' : '▶'}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-black text-slate-900 text-base sm:text-lg truncate">{team.name}</h3>
                        {team.is_banned && (
                          <span className="px-2 py-0.5 rounded bg-red-100 text-red-700 text-xs font-bold shrink-0">
                            BANNED
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 truncate">
                        Leader: <strong>{team.leader_name || team.leader_email}</strong> • Created{' '}
                        {new Date(team.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:gap-3 self-end sm:self-auto">
                    <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full font-bold text-xs shrink-0">
                      {team.members?.length || 0} Members
                    </span>

                    <button
                      onClick={() => {
                        setDetailsModalData(team);
                        setDetailsModalType('team');
                      }}
                      className="px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-xs font-bold transition-colors"
                    >
                      Details
                    </button>

                    {/* Three Dot Menu Button */}
                    <div className="relative">
                      <button
                        onClick={() => setOpenMenuId(isMenuOpen ? null : teamMenuKey)}
                        className="w-9 h-9 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-lg"
                      >
                        ⋮
                      </button>

                      {isMenuOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-200 py-1 z-20">
                          <button
                            onClick={() => {
                              setOpenMenuId(null);
                              setEditModalData(team);
                              setEditModalType('team');
                            }}
                            className="w-full text-left px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                          >
                            ✏️ Edit Team
                          </button>
                          <button
                            onClick={() => {
                              setOpenMenuId(null);
                              handleBanToggleTeam(team);
                            }}
                            className="w-full text-left px-4 py-2 text-sm font-semibold text-amber-700 hover:bg-amber-50 flex items-center gap-2"
                          >
                            {team.is_banned ? '🟢 Unban Team' : '🚫 Ban Team'}
                          </button>
                          <button
                            onClick={() => {
                              setOpenMenuId(null);
                              handleDeleteTeam(team.id, team.name);
                            }}
                            className="w-full text-left px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 flex items-center gap-2"
                          >
                            🗑️ Delete Team
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded Member List */}
                {isExpanded && (
                  <div className="border-t border-slate-100 bg-slate-50/70 p-4 space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 px-2">
                      Registered Team Members
                    </h4>

                    {team.members && team.members.length > 0 ? (
                      team.members.map((member) => {
                        const memberMenuKey = `member-${member.id}`;
                        const isMemberMenuOpen = openMenuId === memberMenuKey;

                        return (
                          <div
                            key={member.id}
                            className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between gap-4"
                          >
                            <div
                              className="flex items-center gap-3 cursor-pointer flex-1"
                              onClick={() => {
                                setDetailsModalData({ ...member, team_name: team.name });
                                setDetailsModalType('member');
                              }}
                            >
                              <span className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs">
                                👤
                              </span>
                              <div>
                                <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                                  {member.name || 'Unnamed Member'}
                                  {team.leader_id === member.id && (
                                    <span title="Team Leader" className="text-amber-500">👑</span>
                                  )}
                                </div>
                                <div className="text-xs text-slate-500">
                                  {member.email} {member.student_id ? `• ID: ${member.student_id}` : ''}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-bold uppercase">
                                {member.role || 'Member'}
                              </span>

                              <div className="relative">
                                <button
                                  onClick={() =>
                                    setOpenMenuId(isMemberMenuOpen ? null : memberMenuKey)
                                  }
                                  className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500 font-bold"
                                >
                                  ⋮
                                </button>

                                {isMemberMenuOpen && (
                                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-200 py-1 z-20">
                                    <button
                                      onClick={() => {
                                        setOpenMenuId(null);
                                        setEditModalData(member);
                                        setEditModalType('member');
                                      }}
                                      className="w-full text-left px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                                    >
                                      ✏️ Edit Member
                                    </button>
                                    <button
                                      onClick={() => {
                                        setOpenMenuId(null);
                                        handleDeleteMember(member.id, member.email);
                                      }}
                                      className="w-full text-left px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 flex items-center gap-2"
                                    >
                                      🗑️ Delete Member
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-sm text-slate-500 italic px-2">No registered members in this team.</p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Details Modal */}
      <DetailsInfoModal
        isOpen={Boolean(detailsModalData)}
        onClose={() => setDetailsModalData(null)}
        data={detailsModalData}
        type={detailsModalType}
      />

      {/* Edit Modal */}
      <EditModal
        isOpen={Boolean(editModalData)}
        onClose={() => setEditModalData(null)}
        data={editModalData}
        type={editModalType}
        onSaved={fetchTeams}
      />

      <ConfirmModal
        isOpen={confirmConfig.isOpen}
        onClose={() => setConfirmConfig(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmConfig.onConfirm}
        title={confirmConfig.title}
        message={confirmConfig.message}
        confirmText={confirmConfig.confirmText}
        variant={confirmConfig.variant}
      />
    </div>
  );
}
