const timeline = [
  { title: 'Registration Opens', desc: 'Teams register via the portal. Each team must have 3–4 members.' },
  { title: 'Registration Closes', desc: 'All registrations must be completed before this deadline.' },
  { title: 'Problem Statement Released', desc: 'The hackathon problem set is published to all registered teams.' },
  { title: 'Hackathon Day', desc: '24-hour coding begins. Teams build, present, and compete.' },
  { title: 'Final Presentations', desc: 'Teams present their projects to the judging panel.' },
  { title: 'Results & Awards', desc: 'Winners announced and prizes distributed.' },
];

export default function Timeline() {
  return (
    <section id="timeline" className="bg-slate-950 py-28 text-white">
      <div className="container mx-auto px-6 lg:px-16">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-20">
          <span className="inline-block text-xs font-bold tracking-widest text-indigo-400 uppercase border border-indigo-400/20 bg-indigo-400/10 px-4 py-1.5 rounded-full mb-5">
            Timeline
          </span>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-5">
            Important Dates
          </h2>
          <p className="text-slate-400 text-lg">
            Stay on track with the official schedule of events for the hackathon.
          </p>
        </div>

        <div className="max-w-3xl mx-auto relative">
          {/* Vertical line */}
          <div className="absolute left-6 top-0 bottom-0 w-px bg-slate-800" />

          <div className="space-y-8">
            {timeline.map((item, idx) => (
              <div key={idx} className="relative flex gap-8 items-start pl-16">
                {/* Dot */}
                <div className="absolute left-0 w-12 h-12 rounded-xl bg-slate-900 border-2 border-slate-700 flex items-center justify-center text-slate-300 text-xs font-black shadow-lg">
                  {String(idx + 1).padStart(2, '0')}
                </div>
                <div className="flex-1 bg-slate-900/60 border border-slate-800 p-6 rounded-2xl hover:border-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/5 transition-all group">
                  {item.date && (
                    <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">{item.date}</div>
                  )}
                  <h4 className="text-lg font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors">{item.title}</h4>
                  <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
