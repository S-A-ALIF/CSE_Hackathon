import { API_URL } from '../../config';
import { useState } from 'react';
import { toast } from 'sonner';

export default function CreateTeamModal({ isOpen, onClose, mode = 'create', onSuccess }) {
  const [teamName, setTeamName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [successInfo, setSuccessInfo] = useState(null);

  if (!isOpen) return null;

  const handleClose = () => {
    setTeamName('');
    setEmail('');
    setSuccessInfo(null);
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('token');

      if (mode === 'create') {
        if (!teamName.trim()) {
          toast.error('Please enter a team name');
          setLoading(false);
          return;
        }

        const res = await fetch(API_URL + '/api/v1/teams/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ name: teamName.trim() })
        });
        const data = await res.json();

        if (res.ok && (data.success || res.status === 201)) {
          toast.success('Team created successfully!');
          onSuccess?.();
          handleClose();
        } else {
          toast.error(data.message || 'Failed to create team');
        }
      } else {
        if (!email.trim()) {
          toast.error('Please enter an email address');
          setLoading(false);
          return;
        }

        const res = await fetch(API_URL + '/api/v1/teams/invite', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ emailToInvite: email.trim() })
        });
        const data = await res.json();

        if (res.ok && (data.success || res.status === 200)) {
          toast.success(`Invitation sent to ${email}!`);
          setSuccessInfo({
            email: email.trim(),
            message: data.message
          });
          onSuccess?.();
        } else {
          toast.error(data.message || 'Failed to send invitation');
        }
      }
    } catch (error) {
      console.error('Error in modal submit:', error);
      toast.error('A network error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const title = mode === 'invite' ? 'Invite Member' : 'Create a Team';
  const subtitle = mode === 'invite' 
    ? 'Send an in-app invitation to add someone to your team.' 
    : 'Enter a name for your team. You will be the team leader.';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={handleClose}
      ></div>
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-8">
          {successInfo ? (
            <div className="text-center space-y-6 animate-in fade-in zoom-in duration-200">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>

              <div>
                <h3 className="text-2xl font-black text-slate-900">Invitation Sent!</h3>
                <p className="text-sm text-slate-500 mt-1">
                  We sent an in-app invitation to <span className="font-bold text-slate-800">{successInfo.email}</span>.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl text-left">
                <p className="text-sm font-semibold text-slate-800">
                  How they can join:
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  The user will receive an invitation in their <b>in-app notification dropdown</b>. They can click <b>Accept</b> or <b>Reject</b> directly from their notifications without needing any email PIN code!
                </p>
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <button 
                  type="button"
                  onClick={handleClose}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-md transition-all"
                >
                  Done
                </button>
                <button 
                  type="button"
                  onClick={() => {
                    setEmail('');
                    setSuccessInfo(null);
                  }}
                  className="w-full text-slate-500 hover:text-slate-800 font-semibold py-2 transition-colors text-sm"
                >
                  Invite Another Teammate
                </button>
              </div>
            </div>
          ) : (
            <>
              <h2 className="text-3xl font-black text-slate-900 mb-2">{title}</h2>
              <p className="text-slate-500 mb-8">{subtitle}</p>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {mode === 'create' ? (
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Team Name</label>
                    <input 
                      type="text" 
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                      required
                      disabled={loading}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all disabled:opacity-50" 
                      placeholder="e.g. Code Wizards" 
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Teammate's Email</label>
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={loading}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all disabled:opacity-50" 
                      placeholder="teammate@example.com" 
                    />
                  </div>
                )}
                
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/30 transition-all text-lg flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>{mode === 'create' ? 'Creating...' : 'Sending...'}</span>
                    </>
                  ) : (
                    <span>{mode === 'create' ? 'Create Team' : 'Send Invitation'}</span>
                  )}
                </button>
                <button 
                  type="button"
                  disabled={loading}
                  onClick={handleClose}
                  className="w-full text-slate-500 hover:text-slate-700 font-semibold py-2 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
