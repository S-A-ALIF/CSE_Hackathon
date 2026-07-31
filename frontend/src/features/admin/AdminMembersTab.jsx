import { useState, useEffect } from 'react';
import { API_URL } from '../../config';
import { toast } from 'sonner';
import DetailsInfoModal from './DetailsInfoModal';
import EditModal from './EditModal';
import ConfirmModal from '../../components/ConfirmModal';
import { adminCache } from './adminCache';

export default function AdminMembersTab() {
  const [members, setMembers] = useState(adminCache.members || []);
  const [loading, setLoading] = useState(!adminCache.members);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
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
  const [editModalData, setEditModalData] = useState(null);

  // Menu open state
  const [openMenuId, setOpenMenuId] = useState(null);

  // Selection mode state
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);

  const fetchMembers = async (force = false) => {
    if (!force && adminCache.isFresh('members')) {
      setMembers(adminCache.members);
      setLoading(false);
      return;
    }
    if (!adminCache.members || force) {
      setLoading(true);
    }
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/v1/admin/members`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        adminCache.set('members', data.data);
        setMembers(data.data);
      } else {
        toast.error(data.message || 'Failed to fetch members');
      }
    } catch (error) {
      console.error('Error loading members:', error);
      toast.error('Error fetching members');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers(false);
  }, []);

  const executeBanToggleMember = async (member) => {
    const nextBan = !member.is_banned;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/v1/admin/members/${member.id}`, {
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
        toast.success(nextBan ? 'Member has been banned' : 'Member is unbanned');
        setConfirmConfig(prev => ({ ...prev, isOpen: false }));
        adminCache.invalidate();
        fetchMembers(true);
      } else {
        toast.error(data.message || 'Failed to update ban status');
      }
    } catch (err) {
      console.error('Error ban toggle:', err);
      toast.error('Error updating ban status');
    }
  };

  const handleBanToggleMember = (member) => {
    const nextBan = !member.is_banned;
    setConfirmConfig({
      isOpen: true,
      title: nextBan ? "Ban Member?" : "Unban Member?",
      message: nextBan
        ? `Are you sure you want to ban user "${member.email}"? They will be restricted from participating.`
        : `Are you sure you want to unban user "${member.email}"? They will be allowed to participate again.`,
      confirmText: nextBan ? "Ban Member" : "Unban Member",
      variant: nextBan ? "warning" : "info",
      requireInput: false,
      onConfirm: () => executeBanToggleMember(member)
    });
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
        adminCache.invalidate();
        fetchMembers(true);
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
      requireInput: true,
      requireInputText: "delete",
      onConfirm: () => executeDeleteMember(memberId)
    });
  };

  const executeBulkDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/v1/admin/members/bulk-delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ids: selectedIds })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(data.message || 'Members deleted successfully');
        setConfirmConfig(prev => ({ ...prev, isOpen: false }));
        setIsSelectionMode(false);
        setSelectedIds([]);
        adminCache.invalidate();
        fetchMembers(true);
      } else {
        toast.error(data.message || 'Failed to delete members');
      }
    } catch (err) {
      console.error('Error in bulk delete:', err);
      toast.error('Error deleting members');
    }
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
    setConfirmConfig({
      isOpen: true,
      title: "Delete Selected Members?",
      message: `Are you sure you want to permanently delete ${selectedIds.length} members? This action cannot be undone.`,
      confirmText: `Delete ${selectedIds.length} Members`,
      variant: "danger",
      requireInput: true,
      requireInputText: "delete",
      onConfirm: () => executeBulkDelete()
    });
  };

  const [sortOption, setSortOption] = useState('ascending');

  const filteredMembers = members.filter((m) => {
    const matchesSearch =
      m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.name && m.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (m.student_id && m.student_id.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesSearch;
  });

  const sortedMembers = [...filteredMembers].sort((a, b) => {
    switch (sortOption) {
      case 'ascending':
        return (a.name || a.email).localeCompare(b.name || b.email);
      case 'descending':
        return (b.name || b.email).localeCompare(a.name || a.email);
      case 'team':
        const teamA = a.team_name || '';
        const teamB = b.team_name || '';
        if (teamA && !teamB) return -1;
        if (!teamA && teamB) return 1;
        return teamA.localeCompare(teamB);
      case 'status':
        if (a.is_banned && !b.is_banned) return -1;
        if (!a.is_banned && b.is_banned) return 1;
        return 0;
      default:
        return 0;
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Registered Members ({members.length})
          </h1>
          <p className="text-slate-600 mt-1">
            Browse all user accounts, view profiles, and manage permissions.
          </p>
        </div>
        <div className="flex gap-2">
          {isSelectionMode ? (
            <>
              <button
                onClick={() => {
                  setIsSelectionMode(false);
                  setSelectedIds([]);
                }}
                className="px-4 py-2 bg-slate-100 text-slate-600 hover:bg-slate-200 font-bold rounded-xl text-sm transition-colors"
              >
                Cancel Selection
              </button>
              <button
                onClick={handleBulkDelete}
                disabled={selectedIds.length === 0}
                className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed font-bold rounded-xl text-sm transition-colors"
              >
                Confirm Delete ({selectedIds.length})
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsSelectionMode(true)}
                className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 font-bold rounded-xl text-sm transition-colors"
              >
                Delete Multiple
              </button>
              <button
                onClick={() => fetchMembers(true)}
                className="px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 font-bold rounded-xl text-sm transition-colors"
              >
                Refresh Members
              </button>
            </>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          placeholder="Search by name, email, or student ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 font-semibold text-sm"
        />
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 font-semibold text-sm bg-white"
        >
          <option value="ascending">Sort A-Z</option>
          <option value="descending">Sort Z-A</option>
          <option value="team">Sort by Team</option>
          <option value="status">Sort by Status (Banned)</option>
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
      ) : sortedMembers.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center">
          <p className="text-slate-500 font-semibold">No members found matching your search.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 uppercase text-[11px] font-bold tracking-wider">
                  {isSelectionMode && (
                    <th className="py-3 px-4 w-12 text-center">
                      <input
                        type="checkbox"
                        checked={selectedIds.length === sortedMembers.length && sortedMembers.length > 0}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedIds(sortedMembers.map(m => m.id));
                          } else {
                            setSelectedIds([]);
                          }
                        }}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                      />
                    </th>
                  )}
                  <th className="py-3 px-4">Member Name & Email</th>
                  <th className="py-3 px-4">Student ID</th>
                  <th className="py-3 px-4">Session</th>
                  <th className="py-3 px-4">Team</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {sortedMembers.map((m) => {
                  const menuKey = `member-row-${m.id}`;
                  const isMenuOpen = openMenuId === menuKey;

                  return (
                    <tr
                      key={m.id}
                      className="hover:bg-slate-50/70 transition-colors"
                    >
                      {isSelectionMode && (
                        <td className="py-3 px-4 w-12 text-center" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(m.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedIds(prev => [...prev, m.id]);
                              } else {
                                setSelectedIds(prev => prev.filter(id => id !== m.id));
                              }
                            }}
                            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                          />
                        </td>
                      )}
                      <td
                        className="py-3 px-4 cursor-pointer"
                        onClick={() => setDetailsModalData(m)}
                      >
                        <div className="font-bold text-slate-900">{m.name || 'Unnamed Member'}</div>
                        <div className="text-xs text-slate-500">{m.email}</div>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-700">{m.student_id || '—'}</td>
                      <td className="py-3 px-4 text-slate-700">{m.batch_session || '—'}</td>
                      <td className="py-3 px-4">
                        {m.team_name ? (
                          <span className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 font-bold text-xs">
                            {m.team_name}
                          </span>
                        ) : (
                          <span className="text-slate-400 text-xs italic">No Team</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {m.is_banned ? (
                          <span className="text-red-600 font-bold text-xs">🚫 Banned</span>
                        ) : (
                          <span className="text-emerald-600 font-bold text-xs">✅ Active</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right relative">
                        <button
                          onClick={() => setOpenMenuId(isMenuOpen ? null : menuKey)}
                          className="w-8 h-8 rounded-lg hover:bg-slate-100 inline-flex items-center justify-center text-slate-500 font-bold text-lg"
                        >
                          ⋮
                        </button>

                        {isMenuOpen && (
                          <div className="absolute right-4 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-200 py-1 z-20 text-left">
                            <button
                              onClick={() => {
                                setOpenMenuId(null);
                                setEditModalData(m);
                              }}
                              className="w-full text-left px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                            >
                              ✏️ Edit Member
                            </button>
                            <button
                              onClick={() => {
                                setOpenMenuId(null);
                                handleBanToggleMember(m);
                              }}
                              className="w-full text-left px-4 py-2 text-sm font-semibold text-amber-700 hover:bg-amber-50 flex items-center gap-2"
                            >
                              {m.is_banned ? '🟢 Unban User' : '🚫 Ban User'}
                            </button>
                            <button
                              onClick={() => {
                                setOpenMenuId(null);
                                handleDeleteMember(m.id, m.email);
                              }}
                              className="w-full text-left px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 flex items-center gap-2"
                            >
                              🗑️ Delete User
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Details Modal */}
      <DetailsInfoModal
        isOpen={Boolean(detailsModalData)}
        onClose={() => setDetailsModalData(null)}
        data={detailsModalData}
        type="member"
      />

      {/* Edit Modal */}
      <EditModal
        isOpen={Boolean(editModalData)}
        onClose={() => setEditModalData(null)}
        data={editModalData}
        type="member"
        onSaved={fetchMembers}
      />

      <ConfirmModal
        isOpen={confirmConfig.isOpen}
        onClose={() => setConfirmConfig(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmConfig.onConfirm}
        title={confirmConfig.title}
        message={confirmConfig.message}
        confirmText={confirmConfig.confirmText}
        variant={confirmConfig.variant}
        requireInput={confirmConfig.requireInput}
        requireInputText={confirmConfig.requireInputText}
      />
    </div>
  );
}
