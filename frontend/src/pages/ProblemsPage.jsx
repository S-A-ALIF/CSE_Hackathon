import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import jsPDF from 'jspdf';
import { API_URL } from '../config';
import { useAuth } from '../contexts/AuthContext';
import FormattedContent from '../components/FormattedContent';

export default function ProblemsPage({ inDashboard = false }) {
  const { workspaceOpen } = useAuth();
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
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
        console.error('Failed to load problems', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProblems();
  }, []);

  const stripHtml = (htmlString) => {
    if (!htmlString) return '';
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlString;
    return tempDiv.textContent || tempDiv.innerText || '';
  };

  const downloadPDF = (problem) => {
    const doc = new jsPDF();
    let y = 20;

    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    const titleLines = doc.splitTextToSize(problem.title, 170);
    doc.text(titleLines, 20, y);
    y += (titleLines.length * 10) + 10;

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    const plainTextDesc = stripHtml(problem.description);
    const descLines = doc.splitTextToSize(plainTextDesc, 170);
    doc.text(descLines, 20, y);

    doc.save(`Problem_${problem.id}_${problem.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`);
  };

  return (
    <div className={inDashboard ? 'py-2' : 'min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8'}>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div>
          {!inDashboard && (
            <div className="flex items-center gap-2 text-sm font-semibold text-blue-600 mb-1">
              <Link to="/dashboard" className="hover:underline">Dashboard</Link>
              <span>/</span>
              <span>Problem Statement</span>
            </div>
          )}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white">Hackathon Problem Statement</h1>
          <p className="mt-2 text-base sm:text-lg text-slate-600 dark:text-slate-400">Select a problem statement for your team and build a winning solution.</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
          </div>
        ) : (
          <>
            {/* Single Problem Display */}
            <div className="w-full max-w-4xl mx-auto">
              {problems.length > 0 ? (
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-12 border border-slate-200 dark:border-slate-800 shadow-sm transition-all flex flex-col overflow-hidden w-full max-w-full">
                  <div className="w-full max-w-full overflow-hidden">
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-6 break-words">{problems[0].title}</h2>
                    <FormattedContent content={problems[0].description} className="mb-10" />
                  </div>

                  <div className="border-t border-slate-100 dark:border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-end gap-4">
                    <button
                      onClick={() => downloadPDF(problems[0])}
                      className="w-full sm:w-auto px-6 py-3 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                      <span>📄</span> Download PDF
                    </button>
                    {workspaceOpen ? (
                      <Link
                        to="/project"
                        className="w-full sm:w-auto px-8 py-3 bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-500 text-white font-bold text-sm rounded-xl transition-colors text-center"
                      >
                        Select & Start Hacking
                      </Link>
                    ) : (
                      <button
                        disabled
                        className="w-full sm:w-auto px-8 py-3 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 font-bold text-sm rounded-xl cursor-not-allowed flex items-center justify-center gap-1.5"
                        title="Workspace is currently locked by admin"
                      >
                        <span>🔒</span> Workspace Locked
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white">No problem statement found</h3>
                  <p className="text-slate-500 dark:text-slate-400 mt-2">The administrators haven't published the problem yet.</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
