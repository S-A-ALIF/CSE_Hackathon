import { API_URL } from '../../config';
import { useState } from 'react';
import { toast } from 'sonner';

export default function JoinTeamModal({ isOpen, onClose }) {
  const [teamCode, setTeamCode] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    if (!teamCode || !teamCode.trim()) {
      toast.error('Please enter a valid Team Code (e.g., TM-ABC123)');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(API_URL + '/api/v1/teams/join-by-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ teamCode: teamCode.trim().toUpperCase() })
      });
      const data = await res.json();
      
      if (res.ok && (data.success || res.status === 200)) {
        toast.success(data.message || 'Join request sent successfully!');
        setTeamCode('');
        onClose();
      } else {
        toast.error(data.message || 'Failed to send join request');
      }
    } catch (error) {
      console.error('Error sending join request:', error);
      toast.error('A network error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-8">
          <h2 className="text-3xl font-black text-slate-900 mb-2">Join a Team</h2>
          <p className="text-slate-500 mb-8">Enter the Team Code (e.g. <span className="font-mono font-bold text-slate-800">TM-XXXXXX</span>) to send a join request to the team leader.</p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Team Code</label>
              <input 
                type="text" 
                value={teamCode}
                onChange={(e) => setTeamCode(e.target.value)}
                maxLength={15}
                required
                disabled={loading}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all text-center text-2xl tracking-widest font-bold uppercase disabled:opacity-50" 
                placeholder="TM-XXXXXX" 
              />
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/30 transition-all text-lg flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Sending Request...</span>
                </>
              ) : (
                <span>Send Join Request</span>
              )}
            </button>
            <button 
              type="button"
              disabled={loading}
              onClick={onClose}
              className="w-full text-slate-500 hover:text-slate-700 font-semibold py-2 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
