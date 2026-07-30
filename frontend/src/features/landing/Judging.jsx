const criteria = [
  { label: 'Innovation & Creativity', weight: '25%', desc: 'How original is the idea? Does it solve a real or meaningful problem in a creative way?' },
  { label: 'Technical Complexity', weight: '25%', desc: 'How technically challenging is the implementation? Does it show strong coding skills?' },
  { label: 'Functionality & Completeness', weight: '20%', desc: 'Does the project actually work? Is the core functionality complete and stable?' },
  { label: 'Presentation & Demo', weight: '15%', desc: 'How well did the team present? Was the demo clear and the problem-solution well explained?' },
  { label: 'Code Quality', weight: '10%', desc: 'Is the code readable, organized, and well-structured? Are best practices followed?' },
  { label: 'Impact & Usefulness', weight: '5%', desc: 'How impactful is the solution in a real-world context? Can it be extended or deployed?' },
];

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
            Judging Panel
          </h2>
          <p className="text-slate-400 text-lg">
            Projects will be evaluated by faculty judges based on the following weighted criteria. All submitted projects will receive feedback after evaluation.
          </p>
        </div>

        {/* Criteria */}
        <div className="max-w-4xl mx-auto space-y-4 mb-16">
          {criteria.map((item, idx) => (
            <div key={idx} className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-start gap-4 sm:gap-6 hover:border-purple-500/30 transition-all group">
              <div className="flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                <span className="text-purple-400 font-black text-base sm:text-lg">{item.weight}</span>
              </div>
              <div>
                <h3 className="font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">{item.label}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Judging Process */}
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { step: '1', title: 'Submit Project', desc: 'Team leader submits the project through the portal before the deadline.' },
            { step: '2', title: 'Judge Review', desc: 'Assigned faculty judges review and score each project based on predefined criteria.' },
            { step: '3', title: 'Results Published', desc: 'Final scores and rankings are published after all evaluations are complete.' },
          ].map((step) => (
            <div key={step.step} className="bg-slate-800/30 border border-slate-700/30 rounded-2xl p-6 text-center">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 font-black text-xl flex items-center justify-center mx-auto mb-4">
                {step.step}
              </div>
              <h4 className="font-bold text-white mb-2">{step.title}</h4>
              <p className="text-sm text-slate-400">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
