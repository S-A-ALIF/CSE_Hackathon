export default function About() {
  return (
    <section id="about" className="bg-slate-900 py-28 text-white">
      <div className="container mx-auto px-6 lg:px-16">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-20">
          <span className="inline-block text-xs font-bold tracking-widest text-blue-400 uppercase border border-blue-400/20 bg-blue-400/10 px-4 py-1.5 rounded-full mb-5">
            About the Event
          </span>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-6">
            An Intra-Department Hackathon
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed">
            The GSTU CSE Hackathon is an annual programming competition organized by the Department of Computer Science & Engineering. It brings together students to solve real-world problems, collaborate in teams, and demonstrate their technical skills.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: (
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              ),
              title: 'Innovation',
              desc: 'Build creative software solutions for real-world or community-facing problems using any tech stack.',
              color: 'from-blue-500 to-blue-700',
            },
            {
              icon: (
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              ),
              title: 'Teamwork',
              desc: 'Collaborate with peers across different batches. Every team must include senior batch participants.',
              color: 'from-indigo-500 to-purple-700',
            },
            {
              icon: (
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              ),
              title: 'Recognition',
              desc: 'Top teams are awarded certificates, prizes, and recognition from the department faculty.',
              color: 'from-emerald-500 to-teal-700',
            },
          ].map((item) => (
            <div key={item.title} className="relative bg-slate-800/50 border border-slate-700/50 p-8 rounded-2xl hover:border-slate-600 transition-all group">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-6 text-white shadow-lg`}>
                {item.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
              <p className="text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
