export default function About() {
  return (
    <section id="about" className="bg-slate-900 py-28 text-white">
      <div className="container mx-auto px-6 lg:px-16">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="inline-block text-xs font-bold tracking-widest text-blue-400 uppercase border border-blue-400/20 bg-blue-400/10 px-4 py-1.5 rounded-full mb-5">
            Overview of the Event
          </span>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-6">
            Intra-Department Hackathon July, 2026
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed">
            The GSTU CSE Hackathon is an annual programming competition organized by the Department of Computer Science & Engineering. It brings together students to solve real-world problems, collaborate in teams, and demonstrate their technical skills.
          </p>
        </div>

        {/* Hackathon Goal */}
        <div className="max-w-4xl mx-auto bg-slate-800/50 border border-slate-700/50 p-8 md:p-12 rounded-3xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <svg className="w-32 h-32 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          
          <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">🎯</span>
            Contestant Goal
          </h3>
          <p className="text-slate-300 text-lg leading-relaxed mb-6">
            The primary objective of this hackathon is to build a full-stack <strong>Auction Web Application</strong>. The exact problem set and specific feature requirements will be revealed only after the hackathon officially starts. Contestants must develop a complete solution featuring a distinct frontend and backend connected via APIs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 bg-slate-900/50 rounded-2xl p-5 border border-slate-700/50">
              <div className="text-blue-400 font-bold mb-1">Tech Stack</div>
              <div className="text-sm text-slate-400">Strictly MERN or PERN stack. Next.js is permitted as an alternative to React.</div>
            </div>
            <div className="flex-1 bg-slate-900/50 rounded-2xl p-5 border border-slate-700/50">
              <div className="text-emerald-400 font-bold mb-1">Architecture</div>
              <div className="text-sm text-slate-400">The frontend and backend must be separated codebases communicating exclusively via APIs.</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
