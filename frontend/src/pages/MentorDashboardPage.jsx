import { useState, useEffect } from 'react';
import { API_URL } from '../config';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import Navbar from '../components/Navbar';

export default function MentorDashboardPage() {
  const { currentUser } = useAuth();
  const [invitations, setInvitations] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const [invRes, teamsRes] = await Promise.all([
        fetch(`${API_URL}/api/v1/mentors/invitations`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${API_URL}/api/v1/mentors/teams`, { headers: { 'Authorization': `Bearer ${token}` } })
      ]);
      const invData = await invRes.json();
      const teamsData = await teamsRes.json();

      if (invData.success) setInvitations(invData.data);
      if (teamsData.success) setTeams(teamsData.data);
    } catch (error) {
      console.error('Error fetching mentor data:', error);
      toast.error('Network error loading mentor dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleRespond = async (id, accept) => {
    setProcessingId(id);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/v1/mentors/invitations/${id}/respond`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ accept })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(data.message || (accept ? 'Invitation accepted' : 'Invitation rejected'));
        fetchData(); // Refresh to update teams list and remove invite
      } else {
        toast.error(data.message || 'Failed to respond to invitation');
      }
    } catch (error) {
      console.error('Error responding:', error);
      toast.error('Network error');
    } finally {
      setProcessingId(null);
    }
  };

  const handleLeaveTeam = async (teamId) => {
    // Optional: Let mentor leave team (implemented if backend supports it, for now we will just show a toast or leave it out as the backend doesn't have an endpoint for mentors leaving teams yet)
    toast.info("Leaving teams as a mentor must be requested through admin currently.");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <div className="flex flex-1 items-center justify-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900">Mentor Dashboard</h1>
          <p className="mt-2 text-lg text-slate-600">Manage your mentorship invitations and view your assigned teams.</p>
        </div>

        {/* Pending Invitations Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Pending Invitations</h2>
            <span className="bg-blue-100 text-blue-700 font-bold px-3 py-1 rounded-full text-sm">
              {invitations.length} Pending
            </span>
          </div>

          {invitations.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center text-slate-500 shadow-sm">
              You have no pending invitations.
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {invitations.map((inv) => (
                <div key={inv.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900 mb-2 truncate" title={inv.team_name}>{inv.team_name}</h3>
                    <p className="text-sm text-slate-600 mb-1">Invited by: <span className="font-semibold text-slate-800">{inv.leader_name}</span></p>
                    <p className="text-xs text-slate-400 mb-6">{new Date(inv.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      disabled={processingId === inv.id}
                      onClick={() => handleRespond(inv.id, true)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-2 rounded-xl transition-colors"
                    >
                      Accept
                    </button>
                    <button
                      disabled={processingId === inv.id}
                      onClick={() => handleRespond(inv.id, false)}
                      className="flex-1 bg-slate-100 hover:bg-slate-200 disabled:bg-slate-50 text-slate-700 font-bold py-2 rounded-xl border border-slate-200 transition-colors"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Mentored Teams Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900">My Mentored Teams</h2>
            <span className={`font-bold px-3 py-1 rounded-full text-sm ${teams.length >= 3 ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
              {teams.length} / 3 Teams
            </span>
          </div>

          {teams.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center shadow-sm">
              <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              </div>
              <h3 className="text-lg font-bold text-slate-900">No active teams</h3>
              <p className="text-slate-500">You are not mentoring any teams currently. Accept invitations to start mentoring.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {teams.map(team => (
                <div key={team.id} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b border-slate-100 pb-4">
                    <div>
                      <h3 className="text-2xl font-black text-slate-900">{team.name}</h3>
                      <p className="text-sm text-slate-500 mt-1">Created on {new Date(team.created_at).toLocaleDateString()}</p>
                    </div>
                    <button onClick={() => handleLeaveTeam(team.id)} className="mt-4 sm:mt-0 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 font-bold rounded-xl text-sm transition-colors border border-red-100">
                      Resign Mentorship
                    </button>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Team Members ({team.members?.length || 0})</h4>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {team.members?.map(member => (
                        <div key={member.id} className="flex items-center space-x-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                            {member.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-slate-900 truncate">
                              {member.name} {member.id === team.leader_id && <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full ml-1 uppercase">Leader</span>}
                            </p>
                            <p className="text-xs text-slate-500 truncate">ID: {member.student_id !== 'N/A' ? member.student_id : member.email}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
