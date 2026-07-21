export default function Tracks() {
  const tracks = [
    { title: "Artificial Intelligence", desc: "Build intelligent agents, LLM wrappers, or computer vision solutions.", status: "Active" },
    { title: "FinTech & Web3", desc: "Decentralized finance, smart contracts, or modern payment gateways.", status: "Active" },
    { title: "Open Innovation", desc: "Solve a pressing local problem in education, healthcare, or logistics.", status: "Exploring" }
  ];

  return (
    <section id="tracks" className="bg-white py-24 border-t border-slate-100">
      <div className="container mx-auto px-6 lg:px-20">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div className="max-w-2xl">
            <h2 className="text-sm font-bold tracking-widest text-blue-600 uppercase mb-3">Initiatives</h2>
            <h3 className="text-4xl font-bold tracking-tight text-slate-900">Hackathon Tracks</h3>
          </div>
          <button className="hidden md:block text-blue-600 font-semibold hover:text-blue-700">View Guidelines &rarr;</button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tracks.map((track, idx) => (
            <div key={idx} className="group border border-slate-200 rounded-2xl p-8 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/10 transition-all cursor-pointer">
              <div className="flex justify-between items-start mb-6">
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${track.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                  {track.status}
                </span>
                <svg className="w-5 h-5 text-slate-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              </div>
              <h4 className="text-2xl font-bold text-slate-900 mb-3">{track.title}</h4>
              <p className="text-slate-600 leading-relaxed">{track.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
