import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function Home() {
  const { registrationOpen, regStartTime, regEndTime } = useAuth();

  const [now, setNow] = useState(new Date().getTime());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date().getTime());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const getCountdown = (targetTime) => {
    const distance = new Date(targetTime).getTime() - now;
    if (distance <= 0) return null;

    const d = Math.floor(distance / (1000 * 60 * 60 * 24));
    const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((distance % (1000 * 60)) / 1000);

    const pad = (num) => String(num).padStart(2, '0');
    
    if (d > 0) {
      return `${d}d ${pad(h)}h ${pad(m)}m ${pad(s)}s`;
    }
    return `${pad(h)}h ${pad(m)}m ${pad(s)}s`;
  };

  const getTimelineMessage = () => {
    const startTimeTime = regStartTime ? new Date(regStartTime).getTime() : 0;
    const endTimeTime = regEndTime ? new Date(regEndTime).getTime() : 0;

    if (regStartTime && startTimeTime > now) {
      return `Registration opens in: ${getCountdown(regStartTime)}`;
    }
    
    if (regEndTime && endTimeTime > now) {
      return `Registration closes in: ${getCountdown(regEndTime)}`;
    }

    if (!registrationOpen) {
      return "Registration closed for now";
    }
    
    return null;
  };

  const timelineMessage = getTimelineMessage();

  return (
    <section id="home" className="relative min-h-screen flex flex-col justify-center bg-slate-950 text-white overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:60px_60px] opacity-40" />
      
      {/* Glow blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative container mx-auto px-6 lg:px-16 z-10 text-center pt-24 pb-16">
        {/* Timeline Banner */}
        {timelineMessage && (
          <div className="flex justify-center mb-4">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500/10 via-fuchsia-500/10 to-pink-500/10 border border-fuchsia-500/20 text-fuchsia-300 text-sm font-bold tracking-wide px-6 py-2.5 rounded-full shadow-lg shadow-fuchsia-500/5 backdrop-blur-sm animate-pulse-slow">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              {timelineMessage}
            </div>
          </div>
        )}

        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-full mb-8">
          <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
          Department of Computer Science & Engineering
        </div>


        {/* Main Heading */}
        <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-6 leading-tight md:leading-none">
          <span className="text-white">GSTU</span>{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
            CSE
          </span>
          <br />
          <span className="text-white text-3xl sm:text-4xl md:text-6xl lg:text-7xl">Hackathon</span>{' '}
          <span className="text-slate-500 text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold">2026</span>
        </h1>

        <p className="text-base sm:text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed px-2">
          An intra-department programming competition where teams of students build, compete, and innovate under one roof.
          Show what you can build.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 w-full max-w-xs sm:max-w-none mx-auto">
          {registrationOpen && (
            <Link
              to="/register"
              className="group w-full sm:w-auto inline-flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-10 text-base rounded-xl shadow-2xl shadow-blue-500/30 transition-all hover:scale-105"
            >
              Register Now
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          )}
          <a
            href="#about"
            className="w-full sm:w-auto inline-flex justify-center items-center gap-2 text-slate-300 hover:text-white font-semibold py-4 px-8 border border-white/10 hover:border-white/25 rounded-xl transition-all"
          >
            Learn More
          </a>
        </div>


      </div>

      {/* Scroll indicator */}
      <a
        href="#about"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-500 hover:text-blue-400 transition-colors group"
      >
        <span className="text-xs font-semibold tracking-widest uppercase">Scroll</span>
        <svg className="w-5 h-5 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </a>
    </section>
  );
}
