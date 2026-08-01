import { useState, useEffect } from 'react';
import { API_URL } from '../../config';
import { toast } from 'sonner';
import { adminCache } from './adminCache';

export default function AdminMessagesTab() {
  const [targetType, setTargetType] = useState('all'); // 'all', 'team_leaders', 'mentors', 'teams', 'selected'
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('info'); // 'info', 'warning', 'urgent'
  const [sending, setSending] = useState(false);

  // Data for selector lists
  const [teamsList, setTeamsList] = useState([]);
  const [membersList, setMembersList] = useState([]);
  const [loadingData, setLoadingData] = useState(false);

  // Selected items
  const [selectedTeamIds, setSelectedTeamIds] = useState([]);
  const [selectedEmails, setSelectedEmails] = useState([]);

  // Search filter inside picker
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Load teams or members when specific target types are chosen
    if (targetType === 'teams' && teamsList.length === 0) {
      loadTeams();
    } else if (targetType === 'selected' && membersList.length === 0) {
      loadMembers();
    }
  }, [targetType]);

  const loadTeams = async () => {
    try {
      setLoadingData(true);
      if (adminCache.isFresh('teams') && adminCache.teams) {
        setTeamsList(adminCache.teams);
        setLoadingData(false);
        return;
      }
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/v1/admin/teams`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        adminCache.set('teams', data.data || []);
        setTeamsList(data.data || []);
      }
    } catch (err) {
      console.error('Error loading teams:', err);
      toast.error('Failed to load teams list');
    } finally {
      setLoadingData(false);
    }
  };

  const loadMembers = async () => {
    try {
      setLoadingData(true);
      if (adminCache.isFresh('members') && adminCache.members) {
        setMembersList(adminCache.members);
        setLoadingData(false);
        return;
      }
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/v1/admin/members`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        adminCache.set('members', data.data || []);
        setMembersList(data.data || []);
      }
    } catch (err) {
      console.error('Error loading members:', err);
      toast.error('Failed to load members list');
    } finally {
      setLoadingData(false);
    }
  };

  const handleToggleTeam = (teamId) => {
    setSelectedTeamIds((prev) =>
      prev.includes(teamId)
        ? prev.filter((id) => id !== teamId)
        : [...prev, teamId]
    );
  };

  const handleToggleEmail = (email) => {
    setSelectedEmails((prev) =>
      prev.includes(email)
        ? prev.filter((e) => e !== email)
        : [...prev, email]
    );
  };

  const filteredTeams = teamsList.filter((t) => {
    const query = searchQuery.toLowerCase();
    return (
      (t.name && t.name.toLowerCase().includes(query)) ||
      (t.leader_name && t.leader_name.toLowerCase().includes(query)) ||
      (t.leader_email && t.leader_email.toLowerCase().includes(query))
    );
  });

  const filteredMembers = membersList.filter((m) => {
    const query = searchQuery.toLowerCase();
    return (
      (m.name && m.name.toLowerCase().includes(query)) ||
      (m.email && m.email.toLowerCase().includes(query)) ||
      (m.role && m.role.toLowerCase().includes(query))
    );
  });

  const handleSelectAllFilteredTeams = () => {
    const ids = filteredTeams.map((t) => t.id);
    setSelectedTeamIds((prev) => Array.from(new Set([...prev, ...ids])));
  };

  const handleSelectAllFilteredMembers = () => {
    const emails = filteredMembers.map((m) => m.email).filter(Boolean);
    setSelectedEmails((prev) => Array.from(new Set([...prev, ...emails])));
  };

  const handleClearSelected = () => {
    if (targetType === 'teams') setSelectedTeamIds([]);
    if (targetType === 'selected') setSelectedEmails([]);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!message.trim()) {
      toast.error('Please enter a message content');
      return;
    }

    if (targetType === 'teams' && selectedTeamIds.length === 0) {
      toast.error('Please select at least one team');
      return;
    }

    if (targetType === 'selected' && selectedEmails.length === 0) {
      toast.error('Please select at least one user');
      return;
    }

    try {
      setSending(true);
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/v1/admin/messages/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          targetType,
          selectedTeamIds: targetType === 'teams' ? selectedTeamIds : undefined,
          selectedEmails: targetType === 'selected' ? selectedEmails : undefined,
          title: title.trim(),
          message: message.trim(),
          severity
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(`Notification broadcast successfully to ${data.recipientsCount} recipient(s)!`);
        setTitle('');
        setMessage('');
        setSelectedTeamIds([]);
        setSelectedEmails([]);
      } else {
        toast.error(data.message || 'Failed to send broadcast message');
      }
    } catch (err) {
      console.error('Error sending message:', err);
      toast.error('Error connecting to server');
    } finally {
      setSending(false);
    }
  };

  // Preview helper
  const getSeverityBadge = () => {
    if (severity === 'urgent') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-500 border border-rose-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
          URGENT
        </span>
      );
    }
    if (severity === 'warning') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
          WARNING
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-500 border border-blue-500/20">
        <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
        INFO
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
              <span>📢</span>
              <span>Send Message (In-App Notification)</span>
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm sm:text-base">
              Broadcast announcements and instant notifications directly to members' in-app notification menu.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSendMessage} className="space-y-6">
        {/* Step 1: Target Audience Selection */}
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xs font-black">
              1
            </span>
            Choose Target Audience
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              {
                id: 'all',
                label: 'All Registered Members',
                desc: 'Broadcast to everyone registered on the platform',
                icon: '🌐'
              },
              {
                id: 'team_leaders',
                label: 'All Team Leaders',
                desc: 'Only send to users who are leading a team',
                icon: '👑'
              },
              {
                id: 'mentors',
                label: 'All Mentors',
                desc: 'Send to all mentors on the platform',
                icon: '🎓'
              },
              {
                id: 'teams',
                label: 'Specific Teams',
                desc: 'Choose one or more teams (sends to members, leader & mentor)',
                icon: '👥'
              },
              {
                id: 'selected',
                label: 'Specific Users',
                desc: 'Select individual users by name or email',
                icon: '👤'
              }
            ].map((option) => (
              <div
                key={option.id}
                onClick={() => setTargetType(option.id)}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  targetType === option.id
                    ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/30 dark:border-blue-500'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="text-2xl mt-0.5">{option.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-white text-sm">
                        {option.label}
                      </span>
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          targetType === option.id
                            ? 'border-blue-600 bg-blue-600'
                            : 'border-slate-300 dark:border-slate-600'
                        }`}
                      >
                        {targetType === option.id && (
                          <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {option.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Conditional Multi-Select Box for Teams */}
          {targetType === 'teams' && (
            <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 space-y-4 animate-in fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  Select Teams ({selectedTeamIds.length} selected)
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSelectAllFilteredTeams}
                    className="text-xs px-3 py-1.5 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-600 dark:text-blue-400 font-bold rounded-lg transition-colors"
                  >
                    Select Filtered
                  </button>
                  <button
                    type="button"
                    onClick={handleClearSelected}
                    disabled={selectedTeamIds.length === 0}
                    className="text-xs px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold rounded-lg transition-colors disabled:opacity-50"
                  >
                    Clear All
                  </button>
                </div>
              </div>

              {/* Search filter */}
              <input
                type="text"
                placeholder="Search team name or leader email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              {loadingData ? (
                <div className="py-8 text-center text-slate-500 dark:text-slate-400 text-sm">
                  Loading teams list...
                </div>
              ) : filteredTeams.length === 0 ? (
                <div className="py-8 text-center text-slate-500 dark:text-slate-400 text-sm">
                  No matching teams found.
                </div>
              ) : (
                <div className="max-h-60 overflow-y-auto border border-slate-200 dark:border-slate-800 rounded-2xl divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredTeams.map((t) => {
                    const isSelected = selectedTeamIds.includes(t.id);
                    return (
                      <div
                        key={t.id}
                        onClick={() => handleToggleTeam(t.id)}
                        className={`p-3.5 flex items-center justify-between cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-blue-50/70 dark:bg-blue-950/40'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-800/60'
                        }`}
                      >
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white text-sm">
                            {t.name}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            Leader: {t.leader_name || 'N/A'} ({t.leader_email || 'No email'}) • Members: {Array.isArray(t.members) ? t.members.length : 0}
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}}
                          className="w-4 h-4 text-blue-600 rounded border-slate-300 dark:border-slate-600 focus:ring-blue-500"
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Conditional Multi-Select Box for Users */}
          {targetType === 'selected' && (
            <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 space-y-4 animate-in fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  Select Users ({selectedEmails.length} selected)
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSelectAllFilteredMembers}
                    className="text-xs px-3 py-1.5 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-600 dark:text-blue-400 font-bold rounded-lg transition-colors"
                  >
                    Select Filtered
                  </button>
                  <button
                    type="button"
                    onClick={handleClearSelected}
                    disabled={selectedEmails.length === 0}
                    className="text-xs px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold rounded-lg transition-colors disabled:opacity-50"
                  >
                    Clear All
                  </button>
                </div>
              </div>

              {/* Search filter */}
              <input
                type="text"
                placeholder="Search user by name, email, or role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              {loadingData ? (
                <div className="py-8 text-center text-slate-500 dark:text-slate-400 text-sm">
                  Loading users list...
                </div>
              ) : filteredMembers.length === 0 ? (
                <div className="py-8 text-center text-slate-500 dark:text-slate-400 text-sm">
                  No matching users found.
                </div>
              ) : (
                <div className="max-h-60 overflow-y-auto border border-slate-200 dark:border-slate-800 rounded-2xl divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredMembers.map((m) => {
                    const isSelected = selectedEmails.includes(m.email);
                    return (
                      <div
                        key={m.id || m.email}
                        onClick={() => handleToggleEmail(m.email)}
                        className={`p-3.5 flex items-center justify-between cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-blue-50/70 dark:bg-blue-950/40'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-800/60'
                        }`}
                      >
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                            <span>{m.name || 'Unnamed User'}</span>
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                m.role === 'mentor'
                                  ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300'
                                  : 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300'
                              }`}
                            >
                              {m.role || 'student'}
                            </span>
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            {m.email} {m.student_id ? `• ${m.student_id}` : ''}
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}}
                          className="w-4 h-4 text-blue-600 rounded border-slate-300 dark:border-slate-600 focus:ring-blue-500"
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Step 2: Message Compose Card */}
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xs font-black">
              2
            </span>
            Compose Notification Message
          </h3>

          <div className="space-y-6">
            {/* Severity Selection */}
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">
                Notification Importance Level
              </label>
              <div className="flex flex-wrap gap-3">
                {[
                  { id: 'info', label: '📢 Info (Standard)', color: 'blue' },
                  { id: 'warning', label: '⚠️ Warning (Notice)', color: 'amber' },
                  { id: 'urgent', label: '🚨 Urgent (Priority)', color: 'rose' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSeverity(item.id)}
                    className={`px-4 py-2.5 rounded-xl border text-sm font-bold transition-all ${
                      severity === item.id
                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white shadow-sm'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Title (Optional) */}
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">
                Title / Subject (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Registration Deadline Reminder"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
              />
            </div>

            {/* Message Content */}
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">
                Message Content <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={4}
                required
                placeholder="Write your announcement or notification text here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
              />
              <div className="flex justify-between items-center mt-1 text-xs text-slate-500 dark:text-slate-400">
                <span>The message will appear in real-time in recipient notification menus.</span>
                <span>{message.length} characters</span>
              </div>
            </div>

            {/* Live Notification Card Preview */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                Live Notification Card Preview (How users will see it)
              </label>
              <div className="bg-slate-900 text-white rounded-2xl p-4 border border-slate-800 shadow-md max-w-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                    {getSeverityBadge()}
                  </div>
                  <span className="text-xs text-slate-400">Just now</span>
                </div>
                <p className="text-sm text-slate-200 font-medium">
                  {severity === 'urgent' && '🚨 [URGENT Broadcast] '}
                  {severity === 'warning' && '⚠️ [Important Notice] '}
                  {severity === 'info' && '📢 [Admin Message] '}
                  {title && title.trim() ? (
                    <span className="font-bold text-white">{title.trim()} — </span>
                  ) : null}
                  <span>{message.trim() || 'Your message preview will appear here...'}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action button bar */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => {
              setTitle('');
              setMessage('');
              setSelectedTeamIds([]);
              setSelectedEmails([]);
            }}
            className="px-6 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-xl transition-colors text-sm"
          >
            Reset
          </button>
          <button
            type="submit"
            disabled={sending || !message.trim()}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 dark:shadow-none transition-all flex items-center justify-center gap-2 text-sm"
          >
            {sending && (
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            <span>Send Notification Broadcast</span>
          </button>
        </div>
      </form>
    </div>
  );
}
