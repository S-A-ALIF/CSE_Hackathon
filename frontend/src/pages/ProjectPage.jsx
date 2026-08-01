import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { API_URL } from '../config';
import { toast } from 'sonner';
import ConfirmModal from '../components/ConfirmModal';

export default function ProjectPage({ inDashboard = false }) {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('hackathon_project_tab') || 'overview';
  });

  useEffect(() => {
    localStorage.setItem('hackathon_project_tab', activeTab);
  }, [activeTab]);

  const [team, setTeam] = useState(null);
  const [repoUrl, setRepoUrl] = useState('');
  const [isEditingRepo, setIsEditingRepo] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [readmeStatus, setReadmeStatus] = useState('not_connected');
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    if (!team?.repo_url) {
      setReadmeStatus('not_connected');
      return;
    }
    let isMounted = true;
    setReadmeStatus('checking');
    const verifyReadme = async () => {
      try {
        const res = await fetch(`${API_URL}/api/v1/teams/check-readme?repo_url=${encodeURIComponent(team.repo_url)}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        const data = await res.json();
        if (isMounted && data.success) {
          setReadmeStatus(data.status || 'unknown');
        }
      } catch (e) {
        if (isMounted) setReadmeStatus('unknown');
      }
    };
    verifyReadme();
    return () => { isMounted = false; };
  }, [team?.repo_url]);

  useEffect(() => {
    const fetchMyTeam = async () => {
      try {
        const res = await fetch(`${API_URL}/api/v1/teams/my-team`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        const data = await res.json();
        if (data.success && data.data) {
          setTeam(data.data);
          if (data.data.repo_url) {
            setRepoUrl(data.data.repo_url);
          } else {
            setRepoUrl('');
          }
        }
      } catch (err) {
        console.error('Failed to fetch team details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyTeam();
  }, []);

  const isLeader = Boolean(currentUser && team && currentUser.id === team.leader_id);

  const memberCount = Array.isArray(team?.members) ? team.members.length : (team?.member_count || 1);
  const minRequired = team?.minMembers || 3;
  const isTeamFormed = memberCount >= minRequired;
  const isSubmitted = Boolean(team?.is_submitted);
  const isDeadlineEnded = Boolean(team?.deadline_ended || (team?.submission_deadline && new Date() > new Date(team.submission_deadline)));

  const isM1Red = !isTeamFormed;
  const isM2Red = !isSubmitted && isDeadlineEnded;
  const isM3Red = !isSubmitted && (!team?.repo_url || isDeadlineEnded);
  const isAnyMilestoneRed = !isSubmitted && (isM1Red || isM2Red || isM3Red);

  const handleSaveRepo = async (e) => {
    e.preventDefault();
    if (!isLeader) {
      toast.error('Only the team leader can update the repository URL.');
      return;
    }
    if (!repoUrl || !repoUrl.trim()) {
      toast.error('Please enter a valid GitHub repository URL.');
      return;
    }
    try {
      const res = await fetch(`${API_URL}/api/v1/teams/repo`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ repo_url: repoUrl.trim() })
      });
      const data = await res.json();
      if (data.success) {
        setTeam(prev => ({ ...prev, repo_url: repoUrl.trim() }));
        setIsEditingRepo(false);
        toast.success('Repository URL saved permanently!');
      } else {
        toast.error(data.message || 'Failed to update repository URL');
      }
    } catch (err) {
      toast.error('Error connecting to server.');
    }
  };

  const handleSubmitProject = () => {
    if (!isLeader) {
      const err = 'Only the team leader can submit the project.';
      setSubmitError(err);
      toast.error(err);
      return;
    }
    if (isM1Red) {
      const err = `Submission Failed: Your team must have at least ${minRequired} members to submit.`;
      setSubmitError(err);
      toast.error(err);
      return;
    }
    if (isM3Red) {
      const err = 'Submission Failed: Please link your GitHub repository in the "Repository & Git" tab.';
      setSubmitError(err);
      toast.error(err);
      return;
    }
    if (isAnyMilestoneRed) {
      const err = 'Submission Failed: Please complete all milestones before submitting.';
      setSubmitError(err);
      toast.error(err);
      return;
    }
    setSubmitError('');
    setShowSubmitModal(true);
  };

  const executeSubmitProject = async () => {
    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/api/v1/teams/submit`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await res.json();
      if (data.success) {
        setTeam(prev => ({ ...prev, is_submitted: true, submitted_at: new Date().toISOString() }));
        toast.success('Project repository permanently submitted & locked!');
        setShowSubmitModal(false);
      } else {
        toast.error(data.message || 'Failed to submit project');
      }
    } catch (err) {
      toast.error('Error connecting to server.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className={inDashboard ? 'py-2' : 'min-h-screen bg-slate-50 py-8 sm:py-12 px-3 sm:px-6 lg:px-8'}>
      <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8 w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="min-w-0">
            {!inDashboard && (
              <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-blue-600 mb-1">
                <Link to="/dashboard" className="hover:underline">Dashboard</Link>
                <span>/</span>
                <span>Project Workspace</span>
              </div>
            )}
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 break-words">Project Workspace</h1>
            <p className="mt-1.5 sm:mt-2 text-sm sm:text-lg text-slate-600">Submit and manage your team's hackathon project repository.</p>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-center">
            {team?.is_submitted ? (
              <span className="px-3.5 sm:px-4 py-1.5 sm:py-2 bg-emerald-100 text-emerald-800 font-bold rounded-full text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2">
                <span>🔒</span>
                <span>Submitted & Locked</span>
              </span>
            ) : (
              <span className="px-3.5 sm:px-4 py-1.5 sm:py-2 bg-blue-100 text-blue-700 font-bold rounded-full text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                <span>Submission Open</span>
              </span>
            )}
          </div>
        </div>

        {/* Tabs - Keep only Overview and Repository & Git */}
        <div className="flex border-b border-slate-200 gap-4 sm:gap-6 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'repository', label: 'Repository & Git' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 sm:pb-4 font-bold text-xs sm:text-sm transition-colors border-b-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            {/* 1. Key Milestones Card */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">Key Milestones</h2>
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    Roadmap
                  </span>
                </div>

                <div className="space-y-3">
                  {/* Milestone 1: Team Formation & Track */}
                  {isTeamFormed ? (
                    <div className="p-3.5 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-900/50 flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 shadow-sm">✓</span>
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-slate-100 text-xs sm:text-sm">1. Team Formation & Track</h4>
                        <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold mt-0.5">Team formed ({memberCount}/{minRequired} min members met) ✓</p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3.5 rounded-2xl bg-rose-50/90 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 shadow-sm">!</span>
                      <div>
                        <h4 className="font-bold text-rose-700 dark:text-rose-300 text-xs sm:text-sm">1. Team Formation & Track (Incomplete)</h4>
                        <p className="text-[11px] text-rose-600 dark:text-rose-400 font-bold mt-0.5">Needs minimum {minRequired} members ({memberCount}/{minRequired} currently)</p>
                      </div>
                    </div>
                  )}

                  {/* Milestone 2: MVP Development & APIs */}
                  {isSubmitted ? (
                    <div className="p-3.5 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-900/50 flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 shadow-sm">✓</span>
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-slate-100 text-xs sm:text-sm">2. MVP Development & APIs</h4>
                        <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold mt-0.5">MVP Development completed & submitted ✓</p>
                      </div>
                    </div>
                  ) : isDeadlineEnded ? (
                    <div className="p-3.5 rounded-2xl bg-rose-50/90 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 shadow-sm">✕</span>
                      <div>
                        <h4 className="font-bold text-rose-700 dark:text-rose-300 text-xs sm:text-sm">2. MVP Development & APIs (Overdue)</h4>
                        <p className="text-[11px] text-rose-600 dark:text-rose-400 font-bold mt-0.5">Submission deadline passed without official submission ❌</p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3.5 rounded-2xl bg-blue-50/80 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-900/50 flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 shadow-sm">2</span>
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-slate-100 text-xs sm:text-sm">2. MVP Development & APIs</h4>
                        <p className="text-[11px] text-blue-700 dark:text-blue-400 font-semibold mt-0.5">Building real-time auction bidding & server endpoints (Active ⚡)</p>
                      </div>
                    </div>
                  )}

                  {/* Milestone 3: Pitch Deck & Submission */}
                  {isSubmitted ? (
                    <div className="p-3.5 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-900/50 flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 shadow-sm">✓</span>
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-slate-100 text-xs sm:text-sm">3. Pitch Deck & Submission</h4>
                        <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold mt-0.5">Project officially submitted & locked ✓</p>
                      </div>
                    </div>
                  ) : isDeadlineEnded ? (
                    <div className="p-3.5 rounded-2xl bg-rose-50/90 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 shadow-sm">✕</span>
                      <div>
                        <h4 className="font-bold text-rose-700 dark:text-rose-300 text-xs sm:text-sm">3. Pitch Deck & Submission (Missed)</h4>
                        <p className="text-[11px] text-rose-600 dark:text-rose-400 font-bold mt-0.5">Project unsubmitted — Deadline Ended ❌</p>
                      </div>
                    </div>
                  ) : team?.repo_url ? (
                    <div className="p-3.5 rounded-2xl bg-blue-50/80 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-900/50 flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 shadow-sm">3</span>
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-slate-100 text-xs sm:text-sm">3. Pitch Deck & Submission</h4>
                        <p className="text-[11px] text-blue-700 dark:text-blue-400 font-semibold mt-0.5">GitHub repository linked — Ready to submit! (Active ⚡)</p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3.5 rounded-2xl bg-rose-50/90 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 shadow-sm">!</span>
                      <div>
                        <h4 className="font-bold text-rose-700 dark:text-rose-300 text-xs sm:text-sm">3. Pitch Deck & Submission (Incomplete)</h4>
                        <p className="text-[11px] text-rose-600 dark:text-rose-400 font-bold mt-0.5">Please link your GitHub repository in the "Repository & Git" tab ❌</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 mt-auto border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
                <span>Overall Progress</span>
                {isSubmitted ? (
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">Stage 3 of 3 (Completed 🎉)</span>
                ) : isDeadlineEnded ? (
                  <span className="font-bold text-rose-600 dark:text-rose-400">Deadline Ended (Unsubmitted)</span>
                ) : team?.repo_url ? (
                  <span className="font-bold text-blue-600 dark:text-blue-400">Stage 3 of 3 (Ready to Submit ⚡)</span>
                ) : (
                  <span className="font-bold text-blue-600 dark:text-blue-400">Stage 2 of 3 (Active)</span>
                )}
              </div>
            </div>

            {/* 2. Submission Status Card */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">Submission Status</h2>
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                    {team?.is_submitted ? 'Locked' : 'Active'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Deadline: Sunday at 11:59 PM</p>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3">
                  <div className="flex justify-between items-center text-xs sm:text-sm">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">Repository</span>
                    {team?.repo_url ? (
                      <a href={team.repo_url} target="_blank" rel="noreferrer" className="font-bold text-blue-600 dark:text-blue-400 hover:underline truncate max-w-[140px]">
                        Linked
                      </a>
                    ) : (
                      <span className="font-bold text-slate-400">Not Connected</span>
                    )}
                  </div>
                  <div className="flex justify-between items-center text-xs sm:text-sm">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">Status</span>
                    {team?.is_submitted ? (
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">✅ Submitted</span>
                    ) : (
                      <span className="font-bold text-amber-600 dark:text-amber-400">Pending</span>
                    )}
                  </div>
                  <div className="flex justify-between items-center text-xs sm:text-sm">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">Readme.md</span>
                    {readmeStatus === 'checking' && (
                      <span className="font-bold text-slate-400 flex items-center gap-1">
                        <span className="w-3 h-3 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></span>
                        <span>Checking</span>
                      </span>
                    )}
                    {readmeStatus === 'ready' && (
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">✅ Ready</span>
                    )}
                    {readmeStatus === 'missing' && (
                      <span className="font-bold text-rose-600 dark:text-rose-400">❌ Missing</span>
                    )}
                    {readmeStatus === 'invalid' && (
                      <span className="font-bold text-amber-600 dark:text-amber-400">⚠️ Invalid URL</span>
                    )}
                    {readmeStatus === 'not_connected' && (
                      <span className="font-bold text-slate-400">Not Connected</span>
                    )}
                    {readmeStatus === 'unknown' && (
                      <span className="font-bold text-amber-600 dark:text-amber-400">Private / Unknown</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-auto">
                {team?.is_submitted ? (
                  <button
                    disabled
                    className="w-full py-3 sm:py-3.5 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold rounded-xl shadow-sm flex items-center justify-center gap-2 cursor-not-allowed text-xs sm:text-sm"
                  >
                    <span>✓</span>
                    <span>Project Officially Submitted & Locked</span>
                  </button>
                ) : !isLeader ? (
                  <button
                    onClick={() => toast.info('Only the team leader can officially submit the project.')}
                    className="w-full py-3 sm:py-3.5 bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-bold rounded-xl cursor-not-allowed text-xs sm:text-sm"
                  >
                    Only Team Leader Can Submit
                  </button>
                ) : (
                  <button
                    onClick={handleSubmitProject}
                    disabled={submitting}
                    className="w-full py-3 sm:py-3.5 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 disabled:opacity-50 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-all text-xs sm:text-sm flex items-center justify-center gap-2"
                  >
                    {submitting ? 'Submitting...' : 'Submit Project Repository'}
                  </button>
                )}

                {submitError && (
                  <div className="mt-3 p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/80 rounded-xl text-rose-600 dark:text-rose-400 text-xs font-bold flex items-start gap-2 animate-in fade-in slide-in-from-top-1 duration-200">
                    <span className="shrink-0">❌</span>
                    <span className="leading-relaxed">{submitError}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'repository' && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">GitHub Repository</h2>
                <p className="text-xs sm:text-base text-slate-600 dark:text-slate-400 mt-1">Connect your team's Git repository so judges and mentors can inspect your code.</p>
              </div>
              {team?.is_submitted && (
                <span className="px-3.5 sm:px-4 py-1.5 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold rounded-full text-xs flex items-center gap-1.5 self-start">
                  <span>🔒</span>
                  <span>Submitted & Locked</span>
                </span>
              )}
            </div>

            {team?.is_submitted ? (
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 sm:p-5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 overflow-hidden w-full">
                <div className="flex items-center gap-3 min-w-0 w-full overflow-hidden">
                  <svg className="w-5 sm:w-6 h-5 sm:h-6 text-emerald-700 dark:text-emerald-400 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                  <a href={team.repo_url} target="_blank" rel="noreferrer" className="font-mono text-xs sm:text-sm text-blue-600 dark:text-blue-400 hover:underline truncate block min-w-0">
                    {team.repo_url}
                  </a>
                </div>
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 shrink-0">Cannot Edit</span>
              </div>
            ) : isEditingRepo ? (
              <form onSubmit={handleSaveRepo} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="url"
                  required
                  placeholder="https://github.com/username/repository-name"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  className="w-full sm:flex-1 px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none text-xs sm:text-sm"
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 sm:flex-initial px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-bold rounded-xl transition-colors text-xs sm:text-sm"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditingRepo(false)}
                    className="flex-1 sm:flex-initial px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-xs sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 overflow-hidden w-full">
                <div className="flex items-center gap-3 min-w-0 w-full sm:w-auto overflow-hidden">
                  <svg className="w-5 sm:w-6 h-5 sm:h-6 text-slate-700 dark:text-slate-300 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                  {team?.repo_url ? (
                    <a href={team.repo_url} target="_blank" rel="noreferrer" className="font-mono text-xs sm:text-sm text-blue-600 dark:text-blue-400 hover:underline truncate block min-w-0">
                      {team.repo_url}
                    </a>
                  ) : (
                    <span className="font-mono text-xs sm:text-sm text-slate-400 italic">No GitHub repository URL connected yet.</span>
                  )}
                </div>
                {isLeader ? (
                  <button
                    onClick={() => setIsEditingRepo(true)}
                    className="px-4 py-2 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 shrink-0"
                  >
                    {team?.repo_url ? 'Edit URL' : 'Connect Repo'}
                  </button>
                ) : (
                  <span className="text-xs font-semibold text-slate-400 shrink-0">Leader Only</span>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Custom Confirmation Modal for Project Submission */}
      <ConfirmModal
        isOpen={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
        onConfirm={executeSubmitProject}
        title="Confirm Official Submission"
        message="Are you sure you want to permanently submit your project repository? You can only submit once — after submitting, your GitHub repository link and project status will be permanently locked for judging."
        confirmText="Yes, Submit Project"
        cancelText="Keep Editing"
        variant="warning"
        loading={submitting}
      />
    </div>
  );
}
