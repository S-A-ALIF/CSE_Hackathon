const requirements = [
  {
    icon: '👥',
    title: 'Team Size',
    highlight: '3 – 4 Members',
    desc: 'Each team must have a minimum of 3 and a maximum of 4 student participants. Team sizes outside this range will not be accepted.',
  },
  {
    icon: '🎓',
    title: 'Senior Batch Requirement',
    highlight: 'Min. 25% from 2022–23 Session',
    desc: 'At least 25% of team members must be from the senior batch. Team composition is validated automatically.',
  },
  {
    icon: '🪪',
    title: 'University Enrollment',
    highlight: 'Active CSE Students Only',
    desc: 'All participants must be currently enrolled students in the CSE department at Gopalganj Science and Technology University.',
  },
  {
    icon: '💻',
    title: 'Equipment',
    highlight: 'Bring Your Own',
    desc: 'Teams must bring their own laptops, chargers, and any specialized hardware required. No equipment will be provided.',
  },
  {
    icon: '👤',
    title: 'Team Leader',
    highlight: 'One Leader Per Team',
    desc: 'Every team must designate one team leader responsible for project submissions and official communications.',
  },
  {
    icon: '📋',
    title: 'Registration',
    highlight: 'Portal-Based Only',
    desc: 'All registrations must be completed through this portal. Walk-in registrations on hackathon day will not be accepted.',
  },
];

export default function Requirements() {
  return (
    <section id="requirements" className="bg-slate-950 py-28 text-white">
      <div className="container mx-auto px-6 lg:px-16">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="inline-block text-xs font-bold tracking-widest text-amber-400 uppercase border border-amber-400/20 bg-amber-400/10 px-4 py-1.5 rounded-full mb-5">
            Eligibility
          </span>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-5">
            Team Requirements
          </h2>
          <p className="text-slate-400 text-lg">
            Before registering, make sure your team meets all requirements. Submissions that fail eligibility checks will be disqualified.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {requirements.map((req, idx) => (
            <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl p-7 hover:border-amber-500/30 hover:shadow-lg hover:shadow-amber-500/5 transition-all group">
              <div className="text-4xl mb-5">{req.icon}</div>
              <div className="text-xs font-bold tracking-widest text-amber-400 uppercase mb-2">{req.highlight}</div>
              <h3 className="text-lg font-bold text-white mb-3 group-hover:text-amber-300 transition-colors">{req.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{req.desc}</p>
            </div>
          ))}
        </div>

        {/* Info Banner */}
        <div className="mt-14 max-w-4xl mx-auto bg-amber-500/10 border border-amber-500/20 rounded-2xl p-6 flex items-start gap-5">
          <div className="text-3xl flex-shrink-0">⚠️</div>
          <div>
            <h4 className="font-bold text-amber-300 mb-2">Team Composition Validation</h4>
            <p className="text-slate-400 text-sm leading-relaxed">
              The registration system automatically validates team composition. A team must include at least 25% participants from the senior batch. If your team size falls below the minimum (3) or exceeds the maximum (4), registration will not be accepted.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
