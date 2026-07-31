import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import jsPDF from 'jspdf';
import { API_URL } from '../config';
import { useAuth } from '../contexts/AuthContext';

export default function ProblemsPage({ inDashboard = false }) {
  const { workspaceOpen } = useAuth();
  const [selectedTrack, setSelectedTrack] = useState('All');
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
    doc.text(`Track: ${problem.track}`, 20, y);
    y += 8;
    doc.text(`Difficulty: ${problem.difficulty}`, 20, y);
    y += 15;

    doc.setFont("helvetica", "bold");
    doc.text("Description:", 20, y);
    y += 8;
    doc.setFont("helvetica", "normal");
    const descLines = doc.splitTextToSize(problem.description, 170);
    doc.text(descLines, 20, y);
    y += (descLines.length * 7) + 10;

    doc.setFont("helvetica", "bold");
    doc.text("Evaluation Criteria:", 20, y);
    y += 8;
    doc.setFont("helvetica", "normal");
    problem.criteria.forEach((item) => {
      const criteriaLines = doc.splitTextToSize(`• ${item}`, 170);
      doc.text(criteriaLines, 25, y);
      y += (criteriaLines.length * 7);
    });
    
    y += 10;
    doc.setFont("helvetica", "bold");
    doc.text(`Prize: ${problem.prize}`, 20, y);

    doc.save(`Problem_${problem.id}_${problem.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`);
  };

  const filteredProblems = selectedTrack === 'All'
    ? problems
    : problems.filter(p => p.track === selectedTrack);

  const uniqueTracks = ['All', ...new Set(problems.map(p => p.track))];

  return (
    <div className={inDashboard ? 'py-2' : 'min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8'}>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div>
          {!inDashboard && (
            <div className="flex items-center gap-2 text-sm font-semibold text-blue-600 mb-1">
              <Link to="/dashboard" className="hover:underline">Dashboard</Link>
              <span>/</span>
              <span>Problem Statements</span>
            </div>
          )}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-slate-900">Hackathon Problem Statements</h1>
          <p className="mt-2 text-base sm:text-lg text-slate-600">Select a problem statement for your team and build a winning solution.</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
          </div>
        ) : (
          <>
            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              {uniqueTracks.map((track) => (
                <button
                  key={track}
                  onClick={() => setSelectedTrack(track)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                    selectedTrack === track
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {track}
                </button>
              ))}
            </div>

            {/* Problems Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredProblems.map((problem) => (
                <div key={problem.id} className="bg-white rounded-3xl p-5 sm:p-8 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 font-bold text-xs rounded-full uppercase tracking-wider">
                    {problem.track}
                  </span>
                  <span className="px-3 py-1 bg-slate-100 text-slate-700 font-bold text-xs rounded-full">
                    {problem.difficulty}
                  </span>
                </div>

                <h2 className="text-2xl font-black text-slate-900 mb-3">{problem.title}</h2>
                <p className="text-slate-600 mb-6 leading-relaxed text-sm">{problem.description}</p>

                <div className="space-y-2 mb-6">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Evaluation Criteria</h3>
                  <ul className="space-y-1.5">
                    {problem.criteria.map((item, idx) => (
                      <li key={idx} className="text-sm text-slate-700 flex items-center gap-2 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-6 flex items-center justify-between">
                <span className="text-sm font-bold text-amber-600 flex items-center gap-1">
                  <span>🏆</span> {problem.prize}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => downloadPDF(problem)}
                    className="px-4 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-sm rounded-xl transition-colors flex items-center gap-2"
                  >
                    <span>📄</span> PDF
                  </button>
                  {workspaceOpen ? (
                    <Link
                      to="/project"
                      className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl transition-colors"
                    >
                      Select
                    </Link>
                  ) : (
                    <button
                      disabled
                      className="px-5 py-2.5 bg-slate-100 border border-slate-200 text-slate-400 font-bold text-sm rounded-xl cursor-not-allowed flex items-center gap-1.5"
                      title="Workspace is currently locked by admin"
                    >
                      <span>🔒</span> Locked
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
          {filteredProblems.length === 0 && (
            <div className="col-span-full text-center py-20 bg-white rounded-3xl border border-slate-200">
              <h3 className="text-xl font-bold text-slate-800">No problem statements found</h3>
              <p className="text-slate-500 mt-2">The administrators haven't published any problems for this track yet.</p>
            </div>
          )}
        </div>
        </>
        )}
      </div>
    </div>
  );
}
