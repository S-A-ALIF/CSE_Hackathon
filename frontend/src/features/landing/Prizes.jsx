import React from 'react';

export default function Prizes() {
  return (
    <section id="prizes" className="bg-slate-950 py-28 text-white relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="container mx-auto px-6 lg:px-16 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="inline-block text-xs font-bold tracking-widest text-amber-400 uppercase border border-amber-400/20 bg-amber-400/10 px-4 py-1.5 rounded-full mb-5">
            The Rewards
          </span>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-5">
            What You Can Win
          </h2>
          <p className="text-slate-400 text-lg">
            Compete for the ultimate prize and the prestige of your platform being deployed for the department.
          </p>
        </div>

        <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-6">
          {/* 1st Place */}
          <div className="flex-[3] bg-gradient-to-b from-amber-500/20 to-slate-900 border border-amber-500/30 rounded-3xl p-8 text-center relative overflow-hidden shadow-2xl shadow-amber-500/10 group hover:border-amber-400/50 transition-all">
            <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:scale-110 transition-transform">
              <svg className="w-32 h-32 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l2.4 7.4h7.6l-6.2 4.5 2.4 7.4-6.2-4.5-6.2 4.5 2.4-7.4-6.2-4.5h7.6z" />
              </svg>
            </div>
            <div className="w-20 h-20 mx-auto bg-amber-500/20 rounded-full flex items-center justify-center text-4xl mb-6 relative z-10 border border-amber-500/30 shadow-[0_0_30px_rgba(245,158,11,0.2)]">
              🏆
            </div>
            <h3 className="text-2xl font-black text-amber-400 mb-2 relative z-10">1st Place</h3>
            <p className="text-slate-300 mb-6 font-medium relative z-10">The Ultimate Champions</p>
            
            <ul className="text-left space-y-4 text-slate-300 relative z-10 bg-slate-900/50 p-6 rounded-2xl border border-slate-700/50">
              <li className="flex gap-3">
                <span className="text-amber-500 shrink-0 text-lg">💰</span>
                <span className="font-semibold text-white">Prize money + Medals</span>
              </li>
              <li className="flex gap-3">
                <span className="text-amber-500 shrink-0 text-lg">📜</span>
                <span className="font-semibold text-white">Exclusive certificates</span>
              </li>
              <li className="flex gap-3">
                <span className="text-amber-500 shrink-0 text-lg">🚀</span>
                <span className="font-semibold text-white leading-tight">Prestige of platform being officially deployed for the department's tournament</span>
              </li>
            </ul>
          </div>

          {/* All Participants */}
          <div className="flex-[2] bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center hover:border-slate-700 transition-all flex flex-col justify-center">
            <div className="w-16 h-16 mx-auto bg-slate-800 rounded-full flex items-center justify-center text-3xl mb-6 border border-slate-700">
              🤝
            </div>
            <h3 className="text-xl font-bold text-white mb-2">All Participants</h3>
            <p className="text-slate-400 mb-6 text-sm">Everyone walks away a winner</p>
            
            <ul className="text-left space-y-4 text-slate-300 bg-slate-800/30 p-6 rounded-2xl border border-slate-700/30 h-full flex flex-col justify-center">
              <li className="flex gap-3 items-center">
                <span className="text-blue-400 text-xl shrink-0">📜</span>
                <span className="font-medium text-slate-200">Certificates of Participation</span>
              </li>
              <li className="flex gap-3 items-center">
                <span className="text-orange-400 text-xl shrink-0">🍕</span>
                <span className="font-medium text-slate-200">Snacks & Refreshments</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
