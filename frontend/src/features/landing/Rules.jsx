const rules = [
  {
    id: '01',
    category: 'Development',
    title: 'Required Stack & Architecture',
    desc: 'Projects must be built using the MERN or PERN stack (Next.js is permitted instead of React). Your codebase must be strictly divided into a separate frontend and backend that communicate exclusively via APIs.',
  },
  {
    id: '02',
    category: 'Tools',
    title: 'AI Tools & Documentation Permitted',
    desc: 'AI tools (such as ChatGPT, GitHub Copilot) and online documentation are allowed unless explicitly stated otherwise for a specific challenge.',
  },
  {
    id: '03',
    category: 'Integrity',
    title: 'No Code Copying',
    desc: 'Copying code from another team or participant is strictly prohibited. All code must be written during the hackathon by your own team.',
  },
  {
    id: '04',
    category: 'Integrity',
    title: 'Zero Plagiarism Policy',
    desc: 'Any form of plagiarism — whether from past projects, public repositories, or other participants — will result in immediate disqualification.',
  },
  {
    id: '05',
    category: 'Submission',
    title: 'Leader Submits Only',
    desc: 'Only the team leader may submit or update the project. Resubmission is allowed until the submission deadline.',
  },
  {
    id: '06',
    category: 'Submission',
    title: 'Deadline is Final',
    desc: 'After the submission deadline passes, submissions are locked automatically. Late submissions will not be accepted under any circumstances.',
  },
  {
    id: '07',
    category: 'Conduct',
    title: 'Respect & Sportsmanship',
    desc: 'All participants must maintain respectful conduct. Harassment, cheating, or unsportsmanlike behavior will result in expulsion from the event.',
  },
  {
    id: '08',
    category: 'Presentation',
    title: 'Presence During Judging',
    desc: 'At least one team member must be physically present during the judging phase to present and demo the project.',
  },
];

const categoryColors = {
  Development: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  Tools: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  Integrity: 'bg-red-500/10 text-red-400 border-red-500/20',
  Submission: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  Conduct: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  Presentation: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
};

export default function Rules() {
  return (
    <section id="rules" className="bg-slate-900 py-28 text-white">
      <div className="container mx-auto px-6 lg:px-16">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="inline-block text-xs font-bold tracking-widest text-red-400 uppercase border border-red-400/20 bg-red-400/10 px-4 py-1.5 rounded-full mb-5">
            Guidelines
          </span>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-5">
            Hackathon Rules
          </h2>
          <p className="text-slate-400 text-lg">
            All participants are expected to read and follow these rules. Violations may result in point deductions or disqualification.
          </p>
        </div>

        {/* Rules Grid */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-5">
          {rules.map((rule) => (
            <div key={rule.id} className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5 sm:p-6 hover:border-slate-600 transition-all flex flex-col sm:flex-row gap-3 sm:gap-5 items-start">
              <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-slate-700/50 border border-slate-600/50 flex items-center justify-center text-slate-300 font-black text-sm">
                {rule.id}
              </div>
              <div>
                <div className={`inline-block text-[10px] font-bold uppercase tracking-widest border px-2 py-0.5 rounded mb-2 ${categoryColors[rule.category] || 'bg-slate-500/10 text-slate-400 border-slate-500/20'}`}>
                  {rule.category}
                </div>
                <h3 className="font-bold text-white mb-2">{rule.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{rule.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
