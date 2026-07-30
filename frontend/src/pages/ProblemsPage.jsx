import { useState } from 'react';
import { Link } from 'react-router-dom';

const PROBLEMS = [
  {
    id: 1,
    track: 'AI & Data Analytics',
    title: 'Smart Campus AI Assistant & Analytics Platform',
    difficulty: 'Advanced',
    description: 'Design and develop an intelligent AI agent system that helps university students navigate coursework, campus facilities, and academic counseling while providing real-time analytics to administration.',
    criteria: ['Real-time LLM integration', 'Data visualization dashboard', 'Role-based access control (Student, Tutor, Admin)'],
    prize: 'Gold Award'
  },
  {
    id: 2,
    track: 'Healthcare Tech',
    title: 'Telemedicine & Rural Healthcare Accessibility App',
    difficulty: 'Intermediate',
    description: 'Create an offline-first telemedicine web application that enables rural patients to schedule consultations, track prescriptions, and receive automated diagnostic follow-ups.',
    criteria: ['Offline caching capability', 'HIPAA-compliant data handling', 'Low-bandwidth video/voice consultation fallback'],
    prize: 'Silver Award'
  },
  {
    id: 3,
    track: 'EdTech',
    title: 'Adaptive Learning & Mentorship Portal',
    difficulty: 'Intermediate',
    description: 'Build a personalized mentorship platform that connects students with tutors based on learning styles, schedule availability, and mastery of specific course topics.',
    criteria: ['Algorithmic mentor-student matching', 'Interactive collaborative whiteboard', 'Gamified progress tracking'],
    prize: 'Silver Award'
  },
  {
    id: 4,
    track: 'Sustainable Energy',
    title: 'IoT Energy Efficiency & Carbon Footprint Monitor',
    difficulty: 'Advanced',
    description: 'Develop an IoT sensor telemetry dashboard that monitors campus electricity consumption in real time and suggests automated power-saving interventions.',
    criteria: ['Time-series telemetry ingestion', 'Anomaly detection alerts', 'Predictive carbon savings reports'],
    prize: 'Gold Award'
  }
];

export default function ProblemsPage({ inDashboard = false }) {
  const [selectedTrack, setSelectedTrack] = useState('All');

  const filteredProblems = selectedTrack === 'All'
    ? PROBLEMS
    : PROBLEMS.filter(p => p.track === selectedTrack);

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

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          {['All', 'AI & Data Analytics', 'Healthcare Tech', 'EdTech', 'Sustainable Energy'].map((track) => (
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
                <Link
                  to="/project"
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl transition-colors"
                >
                  Select Problem
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
