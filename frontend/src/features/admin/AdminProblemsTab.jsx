import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { API_URL } from '../../config';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function AdminProblemsTab() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingProblemId, setDeletingProblemId] = useState(null);

  const [formData, setFormData] = useState({
    title: 'Main Hackathon Problem',
    track: 'General',
    difficulty: 'All Levels',
    description: '',
    criteria: 'General Evaluation',
    prize: 'Grand Prize'
  });

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/v1/problems`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await res.json();
      if (data.success) {
        setProblems(data.data);
      }
    } catch (error) {
      toast.error('Failed to load problem statement');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    const problem = problems[0];
    if (problem) {
      setFormData({
        title: problem.title,
        track: problem.track,
        difficulty: problem.difficulty,
        description: problem.description,
        criteria: Array.isArray(problem.criteria) ? problem.criteria.join(', ') : problem.criteria,
        prize: problem.prize
      });
    }
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        title: formData.title || "Main Hackathon Problem",
        track: "General",
        difficulty: "All Levels",
        description: formData.description,
        criteria: ["General Evaluation"],
        prize: "Grand Prize"
      };

      const problem = problems.length > 0 ? problems[0] : null;

      if (problem) {
        const res = await fetch(`${API_URL}/api/v1/problems/admin/${problem.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to update');
        toast.success('Problem statement updated successfully');
      } else {
        const res = await fetch(`${API_URL}/api/v1/problems/admin`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to create');
        toast.success('Problem statement published successfully');
      }
      
      setIsEditing(false);
      fetchProblems();
    } catch (error) {
      toast.error(error.message || 'Failed to save problem');
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = (id) => {
    setDeletingProblemId(id);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingProblemId) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`${API_URL}/api/v1/problems/admin/${deletingProblemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!res.ok) throw new Error('Failed to delete');
      toast.success('Problem statement cleared successfully');
      setIsDeleteModalOpen(false);
      setDeletingProblemId(null);
      fetchProblems();
    } catch (error) {
      toast.error('Failed to clear problem');
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  const hasProblem = problems.length > 0;
  const problem = hasProblem ? problems[0] : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-6 rounded-3xl shadow-sm border border-slate-100 gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Problem Statement</h2>
          <p className="text-slate-500 mt-1">Manage the single hackathon problem statement for all users.</p>
        </div>
      </div>

      {(!hasProblem || isEditing) ? (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-8">
          <h3 className="text-xl font-bold text-slate-900 mb-6">
            {hasProblem ? 'Edit Problem Statement' : 'Publish Problem Statement'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Problem Statement Description</label>
              <textarea 
                value={formData.description || ''}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-900 min-h-[400px] focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                placeholder="Enter problem statement using Markdown format..."
              />
              <p className="text-xs text-slate-500 mt-2 font-medium">Supports Markdown for formatting (e.g. **bold**, *italic*, - lists)</p>
            </div>

            <div className="pt-4 flex gap-3">
              {hasProblem && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition-colors flex items-center justify-center gap-2"
              >
                {isSubmitting && (
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                {hasProblem ? 'Save Changes' : 'Publish Problem Statement'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
          <div className="p-6 sm:p-8 flex-1">
            <h3 className="text-2xl font-black text-slate-900 mb-6">{problem.title}</h3>
            <div className="prose prose-slate max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {problem.description}
              </ReactMarkdown>
            </div>
          </div>
          <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              onClick={handleEdit}
              className="px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-xl shadow-sm transition-colors"
            >
              Edit
            </button>
            <button
              onClick={() => confirmDelete(problem.id)}
              className="px-5 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-xl transition-colors"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-sm p-6 text-center">
            <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Clear Problem Statement?</h3>
            <p className="text-slate-500 mb-6 text-sm">
              Are you sure you want to clear the entire problem statement? This action cannot be undone. Users will not see a problem statement until a new one is published.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setDeletingProblemId(null);
                }}
                className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-bold rounded-xl shadow-lg shadow-red-200 transition-colors flex items-center justify-center gap-2"
              >
                {isDeleting && (
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                Clear
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
