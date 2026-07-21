export default function Sponsors() {
  const sponsors = [
    { name: "TechCorp", tier: "Platinum" },
    { name: "DevBuilders", tier: "Gold" },
    { name: "CloudSync", tier: "Gold" },
    { name: "NextGen AI", tier: "Silver" },
    { name: "FinSecure", tier: "Silver" },
    { name: "EduPlatform", tier: "Silver" }
  ];

  return (
    <section id="sponsors" className="bg-white py-24 border-t border-slate-100">
      <div className="container mx-auto px-6 lg:px-20 text-center">
        <h2 className="text-sm font-bold tracking-widest text-blue-600 uppercase mb-3">Partners</h2>
        <h3 className="text-4xl font-bold tracking-tight text-slate-900 mb-16">Backed by Industry Leaders</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {sponsors.map((sponsor, idx) => (
            <div key={idx} className="aspect-square bg-slate-50 rounded-2xl flex flex-col items-center justify-center border border-slate-100 p-4 hover:border-blue-200 hover:bg-blue-50 transition-colors cursor-pointer group">
              <div className="w-12 h-12 bg-slate-200 rounded-full mb-3 group-hover:bg-blue-200 transition-colors"></div>
              <h4 className="font-bold text-slate-700 text-sm">{sponsor.name}</h4>
              <span className="text-xs text-slate-400 font-medium">{sponsor.tier}</span>
            </div>
          ))}
        </div>

        <div className="mt-16">
          <button className="bg-slate-900 hover:bg-slate-800 text-white font-semibold py-4 px-8 rounded-lg shadow-lg transition-all">
            Become a Sponsor
          </button>
        </div>
      </div>
    </section>
  );
}
