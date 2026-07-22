import { API_URL } from '../../config';
import { useState } from 'react';
import { toast } from 'sonner';

export default function CreateTeamModal({ isOpen, onClose, mode = 'create' }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter an email address');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(API_URL + '/api/v1/teams/invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ emailToInvite: email })
      });
      const data = await res.json();
      
      if (res.ok) {
        toast.success(`Invitation sent to ${email}!`);
        setEmail('');
        onClose();
      } else {
        toast.error(data.message || 'Failed to send invitation');
      }
    } catch (error) {
      console.error('Error sending invite:', error);
      toast.error('A network error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const title = mode === 'invite' ? 'Add Member' : 'Create a Team';
  const subtitle = mode === 'invite' 
    ? 'Send an invitation to add someone to your existing team.' 
    : 'Send an invitation to your teammate via email.';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-8">
          <h2 className="text-3xl font-black text-slate-900 mb-2">{title}</h2>
          <p className="text-slate-500 mb-8">{subtitle}</p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Teammate's Email</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                placeholder="teammate@example.com" 
              />
            </div>
            
            <button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/30 transition-all text-lg"
            >
              Send Invitation
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
