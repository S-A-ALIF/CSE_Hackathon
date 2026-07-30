import { useState, useEffect } from 'react';
import { API_URL } from '../../config';

export default function Requirements() {
  const [teamSizeInfo, setTeamSizeInfo] = useState({
    highlight: '3 – 5 Members',
    desc: 'Each team must have a minimum of 3 and a maximum of 5 student participants. Team sizes outside this range will not be accepted.',
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch(`${API_URL}/api/v1/settings`);
        const data = await res.json();
        if (res.ok && data.success && data.data) {
          const minVal = data.data.min_team_members;
          const maxVal = data.data.max_team_members;

          const minNum = minVal && minVal !== 'none' && !isNaN(parseInt(minVal, 10)) ? parseInt(minVal, 10) : null;
          const maxNum = maxVal && maxVal !== 'none' && !isNaN(parseInt(maxVal, 10)) ? parseInt(maxVal, 10) : null;

          if (minNum !== null && maxNum !== null) {
            setTeamSizeInfo({
              highlight: `${minNum} – ${maxNum} Members`,
              desc: `Each team must have a minimum of ${minNum} and a maximum of ${maxNum} student participants. Team sizes outside this range will not be accepted.`,
            });
          } else if (minNum !== null && maxNum === null) {
            setTeamSizeInfo({
              highlight: `At least ${minNum} Members`,
              desc: `Each team must have at least ${minNum} student participants. There is no maximum team size restriction.`,
            });
          } else if (minNum === null && maxNum !== null) {
            setTeamSizeInfo({
              highlight: `Up to ${maxNum} Members`,
              desc: `Each team can have up to ${maxNum} student participants. There is no minimum team size restriction.`,
            });
          } else {
            setTeamSizeInfo({
              highlight: `No Size Restriction`,
              desc: `There are no minimum or maximum team size restrictions for participating teams.`,
            });
          }
        }
      } catch (err) {
        console.error('Failed to load team size requirements:', err);
      }
    };

    fetchSettings();
  }, []);

  const requirementsList = [
    {
      icon: '👥',
      title: 'Team Size',
      highlight: teamSizeInfo.highlight,
      desc: teamSizeInfo.desc,
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
          {requirementsList.map((req, idx) => (
            <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl p-7 hover:border-amber-500/30 hover:shadow-lg hover:shadow-amber-500/5 transition-all group">
              <div className="text-4xl mb-5">{req.icon}</div>
              <div className="text-xs font-bold tracking-widest text-amber-400 uppercase mb-2">{req.highlight}</div>
              <h3 className="text-lg font-bold text-white mb-3 group-hover:text-amber-300 transition-colors">{req.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{req.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
