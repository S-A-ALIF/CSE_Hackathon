export default function Rules() {
  const rules = [
    {
      id: "01",
      title: "Original Work Only",
      desc: "All code must be written during the hackathon. Pre-existing code or projects submitted elsewhere will lead to immediate disqualification."
    },
    {
      id: "02",
      title: "Code of Conduct",
      desc: "Treat everyone with respect. Harassment of any form will not be tolerated and will result in expulsion from the event."
    },
    {
      id: "03",
      title: "Open Source Libraries",
      desc: "You may use open-source libraries, frameworks, and public APIs, provided you disclose them during your final submission."
    },
    {
      id: "04",
      title: "Presence",
      desc: "At least one team member must be present during the judging phase to demonstrate the project."
    }
  ];

  return (
    <section id="rules" className="bg-white py-24 border-t border-slate-100">
      <div className="container mx-auto px-6 lg:px-20 max-w-5xl">
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold tracking-widest text-blue-600 uppercase mb-3">Guidelines</h2>
          <h3 className="text-4xl font-bold tracking-tight text-slate-900">Hackathon Rules</h3>
        </div>

        <div className="space-y-6">
          {rules.map((rule, idx) => (
            <div key={idx} className="flex gap-6 items-start bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <div className="text-2xl font-black text-blue-200">{rule.id}</div>
              <div>
                <h4 className="text-xl font-bold text-slate-900 mb-2">{rule.title}</h4>
                <p className="text-slate-600">{rule.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
