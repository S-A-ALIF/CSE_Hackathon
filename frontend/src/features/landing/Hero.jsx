import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section id="home" className="bg-slate-900 text-white min-h-screen flex flex-col justify-center relative overflow-hidden">
      {/* Decorative gradient blob */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-blue-600/20 rounded-full blur-3xl -z-10 pointer-events-none"></div>

      <div className="container mx-auto px-6 lg:px-20 z-10 text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
          Building a Million <span className="text-blue-500">10x Minds</span><br />
          For The Future.
        </h1>
        <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto mb-10">
          An independent initiative connecting education, innovation, and governance to shape our university's technical journey. Join the Ultimate Hackathon.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg shadow-lg shadow-blue-500/30 transition-all text-center">
            Register Now
          </Link>
          <button className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-semibold py-4 px-8 rounded-lg transition-all">
            Explore Tracks
          </button>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <a href="#about" className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-slate-400 hover:text-blue-500 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </a>
    </section>
  );
}
