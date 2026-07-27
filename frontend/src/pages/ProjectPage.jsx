import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

export default function ProjectPage() {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [repoUrl, setRepoUrl] = useState('https://github.com/gstu-hackathon/team-project-demo');
  const [isEditingRepo, setIsEditingRepo] = useState(false);

  const handleSaveRepo = (e) => {
    e.preventDefault();
    setIsEditingRepo(false);
    toast.success('Repository URL updated!');
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-blue-600 mb-1">
              <Link to="/dashboard" className="hover:underline">Dashboard</Link>
              <span>/</span>
              <span>Project Workspace</span>
            </div>
            <h1 className="text-4xl font-black tracking-tight text-slate-900">Project Workspace</h1>
            <p className="mt-2 text-lg text-slate-600">Track repository milestones, code quality, and team collaboration.</p>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-4 py-2 bg-emerald-100 text-emerald-700 font-bold rounded-full text-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Submission Open
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 gap-6">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'repository', label: 'Repository & Git' },
            { id: 'teamwork', label: 'Team Work' },
            { id: 'quality', label: 'Code Quality' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 font-bold text-sm transition-colors border-b-2 ${
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
              <h2 className="text-2xl font-black text-slate-900">Project Description</h2>
              <p className="text-slate-600 leading-relaxed">
                Your team is building an innovative solution for the GSTU Hackathon. Ensure your solution addresses the problem statement requirements, includes clear documentation, and demonstrates technical excellence.
              </p>

              <div className="border-t border-slate-100 pt-6">
                <h3 className="text-lg font-bold text-slate-900 mb-3">Key Milestones</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200">
                    <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">✓</span>
                    <span className="font-semibold text-slate-800 text-sm">Team Formation & Track Selection</span>
                  </div>
                  <div className="flex items-center gap-3 p-3.5 rounded-xl bg-blue-50 border border-blue-200">
                    <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">2</span>
                    <span className="font-semibold text-slate-800 text-sm">MVP Development & API Integration</span>
                  </div>
                  <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="w-6 h-6 rounded-full bg-slate-300 text-slate-700 flex items-center justify-center text-xs font-bold">3</span>
                    <span className="font-semibold text-slate-500 text-sm">Final Pitch Deck & Submission Upload</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6 flex flex-col justify-between">
              <div>
                <h2 className="text-xl font-black text-slate-900 mb-2">Submission Status</h2>
                <p className="text-sm text-slate-500 mb-6">Deadline: Sunday at 11:59 PM</p>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Repository</span>
                    <span className="font-bold text-emerald-600">Connected</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Demo Video</span>
                    <span className="font-bold text-amber-600">Pending</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Readme.md</span>
                    <span className="font-bold text-emerald-600">Ready</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => toast.info('Submission portal will open 4 hours before deadline.')}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-all text-sm"
              >
                Submit Project
              </button>
            </div>
          </div>
        )}

        {activeTab === 'repository' && (
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
            <h2 className="text-2xl font-black text-slate-900">GitHub Repository</h2>
            <p className="text-slate-600">Connect your team's Git repository so judges and mentors can inspect your code.</p>

            {isEditingRepo ? (
              <form onSubmit={handleSaveRepo} className="flex gap-3">
                <input
                  type="url"
                  required
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingRepo(false)}
                  className="px-6 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
              </form>
            ) : (
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-3 overflow-hidden">
                  <svg className="w-6 h-6 text-slate-700 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                  <a href={repoUrl} target="_blank" rel="noreferrer" className="font-mono text-sm text-blue-600 hover:underline truncate">
                    {repoUrl}
                  </a>
                </div>
                <button
                  onClick={() => setIsEditingRepo(true)}
                  className="px-4 py-2 text-sm font-bold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50"
                >
                  Edit URL
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'teamwork' && (
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
            <h2 className="text-2xl font-black text-slate-900">Team Work & Commit Activity</h2>
            <p className="text-slate-600">Recent commits and task distribution among team members.</p>
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 text-center text-slate-500">
              Commit statistics and GitHub webhook feeds will appear once commits are pushed to the repository.
            </div>
          </div>
        )}

        {activeTab === 'quality' && (
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
            <h2 className="text-2xl font-black text-slate-900">Code Quality Scorecard</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200">
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">Test Coverage</p>
                <p className="text-3xl font-black text-emerald-900 mt-1">92%</p>
              </div>
              <div className="p-5 rounded-2xl bg-blue-50 border border-blue-200">
                <p className="text-xs font-bold uppercase tracking-wider text-blue-700">Lint Errors</p>
                <p className="text-3xl font-black text-blue-900 mt-1">0</p>
              </div>
              <div className="p-5 rounded-2xl bg-purple-50 border border-purple-200">
                <p className="text-xs font-bold uppercase tracking-wider text-purple-700">Security Scan</p>
                <p className="text-3xl font-black text-purple-900 mt-1">Passed</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
