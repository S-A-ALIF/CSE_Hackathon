import { useState } from 'react';
import { API_URL } from '../config';
import { toast } from 'sonner';

export default function FeedbackModal({ isOpen, onClose }) {
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    type: 'bug',
    subject: '',
    description: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.subject.trim() || !formData.description.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/v1/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        const data = await res.json();
        if (res.ok && data.success) {
          if (formData.type === 'question') {
            toast.success('The admin will try to respond as soon as possible by him');
          } else {
            toast.success('Thank you for your feedback, the admin will see to it soon');
          }
          onClose();
          setFormData({ type: 'bug', subject: '', description: '' });
        } else {
          toast.error(data.message || 'Failed to submit feedback');
        }
      } else {
        toast.error(`Server Error: ${res.status} ${res.statusText}`);
      }
    } catch (err) {
      console.error(err);
      toast.error('Network error submitting feedback');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 w-full max-w-md shadow-2xl relative border border-slate-200 dark:border-slate-800">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
        >
          ✕
        </button>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Feedback & Questions</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Let us know if you found a bug or have any questions.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all"
            >
              <option value="bug">Bug Report</option>
              <option value="ui">UI/Design Issue</option>
              <option value="latency">Latency/Performance</option>
              <option value="question">Question</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Subject</label>
            <input
              type="text"
              placeholder="Brief summary..."
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Description</label>
            <textarea
              placeholder="Please describe in detail..."
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all resize-none"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              {submitting ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              ) : (
                'Submit Feedback'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
