export default function ProblemSet() {
  return (
    <section id="problem-set" className="bg-slate-950 py-28 text-white">
      <div className="container mx-auto px-6 lg:px-16">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="inline-block text-xs font-bold tracking-widest text-emerald-400 uppercase border border-emerald-400/20 bg-emerald-400/10 px-4 py-1.5 rounded-full mb-5">
            Challenges
          </span>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-5">
            Problem Set
          </h2>
          <p className="text-slate-400 text-lg">
            The problem statement will be released to all registered teams before the event begins. Stay registered and check back here.
          </p>
        </div>

        {/* Placeholder Card */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-14 text-center">
            <div className="w-20 h-20 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-8">
              <svg className="w-10 h-10 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-black text-white mb-4">Problem Set Not Yet Released</h3>
            <p className="text-slate-400 text-base leading-relaxed mb-8">
              The hackathon problem statement will be published here and shared with registered teams prior to the event. Register now to be notified immediately.
            </p>
            <div className="flex items-center justify-center gap-3 p-4 bg-slate-800/60 border border-slate-700 rounded-xl text-sm text-slate-400">
              <svg className="w-5 h-5 text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              You can use any programming language, AI tools, and open-source resources.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
