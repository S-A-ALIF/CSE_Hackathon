export default function Judging() {
  return (
    <section id="judging" className="bg-slate-900 py-28 text-white">
      <div className="container mx-auto px-6 lg:px-16">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="inline-block text-xs font-bold tracking-widest text-purple-400 uppercase border border-purple-400/20 bg-purple-400/10 px-4 py-1.5 rounded-full mb-5">
            Evaluation
          </span>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-5">
            400-Mark System
          </h2>
          <p className="text-slate-400 text-lg">
            Projects will be evaluated out of a maximum of 400 marks, distributed across two rigorous phases of evaluation.
          </p>
        </div>

        {/* Phase 1 */}
        <div className="max-w-4xl mx-auto mb-16">
          <h3 className="text-2xl font-black text-white mb-6 border-b border-slate-700 pb-4">
            Phase 1: The Core MVP <span className="text-purple-400 font-bold ml-2">(200 Marks)</span>
          </h3>
          <p className="text-slate-400 mb-6">Judged by Senior Students & Club Members. The raw score will be mathematically scaled to exactly 200 points before moving to Phase 2.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 hover:border-purple-500/30 transition-all">
              <h4 className="font-bold text-white mb-2 text-lg">A. Disclosed Criteria</h4>
              <p className="text-slate-400 text-sm leading-relaxed">Specific requirements will be disclosed along with the problem set. Completing these explicitly stated objectives forms the baseline of your Phase 1 score.</p>
            </div>
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 hover:border-red-500/30 transition-all group">
              <h4 className="font-bold text-red-400 mb-2 text-lg">B. Undisclosed "Chaos Tests"</h4>
              <p className="text-slate-400 text-sm leading-relaxed">Dynamic Marks. Judges will attempt to break the system (e.g., The Disconnect Test, The Concurrency/Spam Click Test). Teams are scored based on how gracefully their apps handle exceptions.</p>
            </div>
          </div>
        </div>

        {/* Phase 2 */}
        <div className="max-w-4xl mx-auto mb-16">
          <h3 className="text-2xl font-black text-white mb-6 border-b border-slate-700 pb-4">
            Phase 2: The Final Defense <span className="text-purple-400 font-bold ml-2">(200 Marks)</span>
          </h3>
          <p className="text-slate-400 mb-6">Judged on Demo Day. Tests how well teams refined their application and integrated the "Gold Standard" features revealed at the end of Phase 1.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 hover:border-purple-500/30 transition-all">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-bold text-white text-lg">A. The Main Jury</h4>
                <span className="text-purple-400 font-black">100 Marks</span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">Evaluated by Teachers/Faculty and Lead Organizers. Focuses on production readiness, architectural trade-offs, flawless live demonstration, and high-level technical Q&A.</p>
            </div>
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 hover:border-purple-500/30 transition-all">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-bold text-white text-lg">B. Peer Evaluation</h4>
                <span className="text-purple-400 font-black">100 Marks</span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed mb-3">Teams will objectively grade rival teams based on their final presentation and feature completeness. All peer scores will be averaged.</p>
              <div className="inline-block text-[10px] font-bold uppercase tracking-widest border border-amber-500/20 bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded">
                Audit Clause Active
              </div>
              <p className="text-xs text-slate-500 mt-2">Organizers possess veto power over anomalous peer marks to prevent tactical review bombing.</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

