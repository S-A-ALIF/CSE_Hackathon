export default function Requirements() {
  const requirements = [
    {
      title: "Team Size",
      desc: "Teams must consist of exactly 3 student participants.",
      icon: "👥"
    },
    {
      title: "Faculty Supervisor",
      desc: "Every team must have one faculty supervisor registered with them.",
      icon: "👨‍🏫"
    },
    {
      title: "University Enrollment",
      desc: "All participants must be currently enrolled students at the university.",
      icon: "🎓"
    },
    {
      title: "Hardware",
      desc: "Bring your own laptops, chargers, and any specialized hardware you plan to use.",
      icon: "💻"
    }
  ];

  return (
    <section id="requirements" className="bg-slate-900 text-white py-24">
      <div className="container mx-auto px-6 lg:px-20">
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold tracking-widest text-blue-500 uppercase mb-3">What You Need</h2>
          <h3 className="text-4xl font-bold tracking-tight text-white">Participation Requirements</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {requirements.map((req, idx) => (
            <div key={idx} className="bg-slate-800 p-8 rounded-2xl border border-slate-700 hover:border-blue-500 transition-colors">
              <div className="text-4xl mb-6">{req.icon}</div>
              <h4 className="text-xl font-bold mb-3">{req.title}</h4>
              <p className="text-slate-400">{req.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
