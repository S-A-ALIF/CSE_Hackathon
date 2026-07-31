import { useState, useEffect } from 'react';
import { API_URL } from '../../config';

export default function Timeline() {
  const [minSize, setMinSize] = useState(3);
  const [maxSize, setMaxSize] = useState(5);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch(`${API_URL}/api/v1/settings`);
        const data = await res.json();
        if (res.ok && data.success && data.data) {
          const minVal = data.data.min_team_members;
          const maxVal = data.data.max_team_members;
          
          const minNum = minVal && minVal !== 'none' && !isNaN(parseInt(minVal, 10)) ? parseInt(minVal, 10) : 3;
          const maxNum = maxVal && maxVal !== 'none' && !isNaN(parseInt(maxVal, 10)) ? parseInt(maxVal, 10) : 5;
          
          setMinSize(minNum);
          setMaxSize(maxNum);
        }
      } catch (err) {
        console.error('Error fetching settings:', err);
      }
    };
    fetchSettings();
  }, []);

  const timeline = [
    { 
      title: 'Registration Window', 
      date: 'July 31 - August 1',
      desc: <><span className="text-indigo-400 font-bold">Opens July 31st at 6:00 PM</span>. Late registration remains open until <span className="text-rose-400 font-bold">August 1st at 11:59 PM</span>. Teams must have {minSize}–{maxSize} members. Registration is free. Note: Late registrations receive no time extensions.</>
    },
    { 
      title: 'Phase 1: The Core MVP',
      date: 'July 31 - August 2',
      desc: <><span className="text-amber-400 font-bold">July 31, 10:00 PM to August 2, 10:00 PM (48 Hours)</span>. The absolute deadline for the core MVP build.</> 
    },
    { 
      title: 'Phase 2: The "Steal the Meta" Sprint', 
      date: 'August 3 - August 4',
      desc: <><span className="text-cyan-400 font-bold">August 3, 11:00 AM to August 4, 11:00 AM (24 Hours)</span>.</> 
    },
    { 
      title: 'Demo Day (Physical Mandatory)', 
      date: 'August 4',
      desc: <>August 4th. Teams must arrive at the venue by <span className="text-emerald-400 font-bold">10:00 AM</span> for environment setup. Final presentations begin at <span className="text-emerald-400 font-bold">11:00 AM</span>.</> 
    },
    { 
      title: 'Results, Prizes & Awards', 
      date: 'August 4 (Evening)',
      desc: <><span className="text-yellow-400 font-bold text-lg block mb-2 mt-1">🏆 1st Place Wins Prize Money!</span>Medals, exclusive certificates, and platform deployment for the department's tournament. All participants receive certificates and snacks!</> 
    },
  ];

  return (
    <section id="timeline" className="bg-slate-950 py-28 text-white">
      <div className="container mx-auto px-6 lg:px-16">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-20">
          <span className="inline-block text-xs font-bold tracking-widest text-indigo-400 uppercase border border-indigo-400/20 bg-indigo-400/10 px-4 py-1.5 rounded-full mb-5">
            Timeline
          </span>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-5">
            Important Dates
          </h2>
          <p className="text-slate-400 text-lg">
            Stay on track with the official schedule of events for the hackathon.
          </p>
        </div>

        <div className="max-w-3xl mx-auto relative">
          {/* Vertical line */}
          <div className="absolute left-6 top-0 bottom-0 w-px bg-slate-800" />

          <div className="space-y-8">
            {timeline.map((item, idx) => (
              <div key={idx} className="relative flex gap-4 sm:gap-8 items-start pl-14 sm:pl-16">
                {/* Dot */}
                <div className="absolute left-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-slate-900 border-2 border-slate-700 flex items-center justify-center text-slate-300 text-xs font-black shadow-lg">
                  {String(idx + 1).padStart(2, '0')}
                </div>
                <div className="flex-1 bg-slate-900/60 border border-slate-800 p-4 sm:p-6 rounded-2xl hover:border-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/5 transition-all group">
                  {item.date && (
                    <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">{item.date}</div>
                  )}
                  <h4 className="text-lg font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors">{item.title}</h4>
                  <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
