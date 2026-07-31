import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { API_URL } from '../../config';

export default function AdminProblemsTab() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProblem, setEditingProblem] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingProblemId, setDeletingProblemId] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    track: '',
    difficulty: '',
    description: '',
    criteria: '', // comma separated string
    prize: ''
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
      toast.error('Failed to load problem statements');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (problem = null) => {
    if (problem) {
      setEditingProblem(problem);
      setFormData({
        title: problem.title,
        track: problem.track,
        difficulty: problem.difficulty,
        description: problem.description,
        criteria: Array.isArray(problem.criteria) ? problem.criteria.join(', ') : problem.criteria,
        prize: problem.prize
      });
    } else {
      setEditingProblem(null);
      setFormData({
        title: '',
        track: '',
        difficulty: '',
        description: '',
        criteria: '',
        prize: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProblem(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const criteriaArray = formData.criteria.split(',').map(s => s.trim()).filter(s => s !== '');
      
      const payload = {
        ...formData,
        criteria: criteriaArray
      };

      if (editingProblem) {
        const res = await fetch(`${API_URL}/api/v1/problems/admin/${editingProblem.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to update');
        toast.success('Problem updated successfully');
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
        toast.success('Problem published successfully');
      }
      
      handleCloseModal();
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
      toast.success('Problem deleted successfully');
      setIsDeleteModalOpen(false);
      setDeletingProblemId(null);
      fetchProblems();
    } catch (error) {
      toast.error('Failed to delete problem');
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Problemsets</h2>
          <p className="text-slate-500 mt-1">Manage hackathon problem statements for users.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition-colors flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Publish Problemset
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {problems.map((problem) => (
          <div key={problem.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 font-bold text-xs rounded-full uppercase tracking-wider truncate max-w-[60%]">
                  {problem.track}
                </span>
                <span className="px-3 py-1 bg-slate-100 text-slate-700 font-bold text-xs rounded-full">
                  {problem.difficulty}
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-2">{problem.title}</h3>
              <p className="text-slate-600 text-sm line-clamp-3 mb-4">{problem.description}</p>
            </div>
            
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
              <span className="text-sm font-bold text-amber-600 flex items-center gap-1 truncate max-w-[50%]">
                <span>🏆</span> {problem.prize}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleOpenModal(problem)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => confirmDelete(problem.id)}
                  className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs rounded-lg transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
        {problems.length === 0 && (
          <div className="col-span-full py-16 text-center border-2 border-dashed border-slate-200 rounded-3xl">
            <h3 className="text-xl font-bold text-slate-400">No problems published yet</h3>
            <p className="text-slate-500 mt-2">Click the button above to publish your first problemset.</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 sm:p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-black text-slate-900">
                  {editingProblem ? 'Edit Problemset' : 'Publish Problemset'}
                </h3>
                <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-600 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Problem Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block p-3 transition-colors"
                    placeholder="e.g. Smart Campus AI Assistant"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Track / Category</label>
                    <input
                      type="text"
                      name="track"
                      value={formData.track}
                      onChange={handleChange}
                      required
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block p-3 transition-colors"
                      placeholder="e.g. AI & Data Analytics"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Difficulty Level</label>
                    <input
                      type="text"
                      name="difficulty"
                      value={formData.difficulty}
                      onChange={handleChange}
                      required
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block p-3 transition-colors"
                      placeholder="e.g. Intermediate"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows="4"
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block p-3 transition-colors resize-none"
                    placeholder="Provide a detailed description of the problem..."
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Evaluation Criteria (Comma Separated)</label>
                  <textarea
                    name="criteria"
                    value={formData.criteria}
                    onChange={handleChange}
                    required
                    rows="3"
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block p-3 transition-colors resize-none"
                    placeholder="e.g. Real-time LLM integration, Data visualization, Role-based access control"
                  ></textarea>
                  <p className="text-xs text-slate-500 mt-1">Separate each criterion with a comma.</p>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Prize / Award</label>
                  <input
                    type="text"
                    name="prize"
                    value={formData.prize}
                    onChange={handleChange}
                    required
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block p-3 transition-colors"
                    placeholder="e.g. Gold Award, $1000, etc."
                  />
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-5 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition-colors flex items-center justify-center gap-2"
                  >
                    {isSubmitting && (
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    )}
                    {editingProblem ? 'Save Changes' : 'Publish Problem'}
                  </button>
                </div>
              </form>
            </div>
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
            <h3 className="text-xl font-bold text-slate-900 mb-2">Delete Problemset?</h3>
            <p className="text-slate-500 mb-6 text-sm">
              Are you sure you want to delete this problem statement? This action cannot be undone.
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
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
