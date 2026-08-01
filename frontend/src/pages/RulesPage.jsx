import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import jsPDF from 'jspdf';
import { API_URL } from '../config';
import FormattedContent from '../components/FormattedContent';

export default function RulesPage({ inDashboard = false }) {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRules = async () => {
      try {
        const res = await fetch(`${API_URL}/api/v1/rules`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await res.json();
        if (data.success) {
          setRules(data.data || []);
        }
      } catch (error) {
        console.error('Failed to load rules', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRules();
  }, []);

  const stripHtml = (htmlString) => {
    if (!htmlString) return '';
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlString;
    return tempDiv.textContent || tempDiv.innerText || '';
  };

  const downloadPDF = (rule) => {
    const doc = new jsPDF();
    let y = 20;

    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    const titleLines = doc.splitTextToSize(rule.title || 'Hackathon Rules & Regulations', 170);
    doc.text(titleLines, 20, y);
    y += (titleLines.length * 10) + 10;

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    const plainTextContent = stripHtml(rule.content);
    const descLines = doc.splitTextToSize(plainTextContent, 170);
    doc.text(descLines, 20, y);

    doc.save(`Hackathon_Rules_${(rule.title || 'Rules').replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`);
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
              <span>Rules & Regulations</span>
            </div>
          )}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white">Rules & Regulations</h1>
          <p className="mt-2 text-base sm:text-lg text-slate-600 dark:text-slate-400">Please review the official guidelines and regulations for the hackathon.</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
          </div>
        ) : (
          <>
            <div className="w-full max-w-4xl mx-auto overflow-hidden">
              {rules.length > 0 ? (
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-12 border border-slate-200 dark:border-slate-800 shadow-sm transition-all flex flex-col overflow-hidden w-full max-w-full">
                  <div className="w-full max-w-full overflow-hidden">
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-6 break-words">{rules[0].title}</h2>
                    <FormattedContent content={rules[0].content} className="mb-10" />
                  </div>

                  <div className="border-t border-slate-100 dark:border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-end gap-4">
                    <button
                      onClick={() => downloadPDF(rules[0])}
                      className="w-full sm:w-auto px-6 py-3 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                      <span>📄</span> Download PDF
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800 shadow-sm">
                  <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                    📜
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No Custom Rules Published Yet</h3>
                  <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                    The administrators have not published custom rules and regulations yet. Please check back soon or view the general guidelines on the landing page.
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
