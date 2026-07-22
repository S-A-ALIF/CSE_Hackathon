import { API_URL } from '../../config';
import { useState } from 'react';
import { toast } from 'sonner';

export default function JoinTeamModal({ isOpen, onClose }) {
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!pin || pin.length !== 6) {
      toast.error('Please enter a valid 6-digit PIN');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(API_URL + '/api/v1/teams/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ pinCode: pin })
      });
      const data = await res.json();
      
      if (res.ok) {
        toast.success(data.message || 'Successfully joined the team!');
        setPin('');
        onClose();
        // Here you might want to refresh user context or dashboard state
      } else {
        toast.error(data.message || 'Failed to join team');
      }
    } catch (error) {
      console.error('Error joining team:', error);
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
          <p className="text-slate-500 mb-8">Enter the 6-digit PIN provided by your team leader.</p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">6-Digit PIN</label>
              <input 
                type="text" 
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                maxLength={6}
                required
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all text-center text-2xl tracking-widest font-bold uppercase" 
                placeholder="------" 
              />
            </div>
            
            <button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/30 transition-all text-lg"
            >
              Join Team
            </button>
            <button 
              type="button"
              onClick={onClose}
              className="w-full text-slate-500 hover:text-slate-700 font-semibold py-2 transition-colors"
            >
              Cancel
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
