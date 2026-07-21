export default function Schedule() {
  const days = [
    {
      day: "Day 1 - Kickoff",
      events: [
        { time: "09:00 AM", title: "Check-in & Breakfast", desc: "Get your swag and meet your team." },
        { time: "11:00 AM", title: "Opening Ceremony", desc: "Rules, tracks, and keynote speakers." },
        { time: "12:00 PM", title: "Hacking Begins!", desc: "Start building your solutions." }
      ]
    },
    {
      day: "Day 2 - Execution",
      events: [
        { time: "10:00 AM", title: "Mentorship Sessions", desc: "Expert feedback on your ideas." },
        { time: "06:00 PM", title: "Pitch Workshop", desc: "Learn how to present to the judges." }
      ]
    },
    {
      day: "Day 3 - Judgement",
      events: [
        { time: "10:00 AM", title: "Hacking Ends", desc: "Submit your final projects." },
        { time: "12:00 PM", title: "Project Demos", desc: "Live demonstrations in front of judges." },
        { time: "04:00 PM", title: "Awards Ceremony", desc: "Winners announced!" }
      ]
    }
  ];

  return (
    <section id="schedule" className="bg-slate-50 py-24 text-slate-800">
      <div className="container mx-auto px-6 lg:px-20 max-w-5xl">
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold tracking-widest text-blue-600 uppercase mb-3">Roadmap</h2>
          <h3 className="text-4xl font-bold tracking-tight text-slate-900">Event Schedule</h3>
        </div>

        <div className="space-y-12">
          {days.map((d, idx) => (
            <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
              <h4 className="text-2xl font-bold text-slate-900 mb-6 border-b pb-4">{d.day}</h4>
              <div className="space-y-6">
                {d.events.map((event, eIdx) => (
                  <div key={eIdx} className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
                    <div className="sm:w-32 flex-shrink-0 text-blue-600 font-bold bg-blue-50 py-2 px-4 rounded-lg text-center">
                      {event.time}
                    </div>
                    <div>
                      <h5 className="text-lg font-bold text-slate-900">{event.title}</h5>
                      <p className="text-slate-500">{event.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
