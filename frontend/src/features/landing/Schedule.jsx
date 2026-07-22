export default function Schedule() {
  return (
    <section id="schedule" className="bg-slate-50 py-24 text-slate-800">
      <div className="container mx-auto px-6 lg:px-20 max-w-5xl">
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold tracking-widest text-blue-600 uppercase mb-3">Roadmap</h2>
          <h3 className="text-4xl font-bold tracking-tight text-slate-900">Event Schedule</h3>
        </div>

        <div className="bg-white p-12 rounded-3xl shadow-sm border border-slate-100 text-center">
          <div className="text-6xl mb-6">📅</div>
          <h4 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
            The schedule for hackathon will be published soon.
          </h4>
          <p className="text-slate-500 text-lg">
            Check back later or register to get notified via email when the timeline drops!
          </p>
        </div>
      </div>
    </section>
  );
}
