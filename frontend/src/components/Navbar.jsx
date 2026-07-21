import { useState } from 'react';
import LoginModal from '../features/authentication/LoginModal';

export default function Navbar() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 w-full z-50 backdrop-blur-md bg-slate-900/80 border-b border-white/10">
        <div className="container mx-auto px-6 lg:px-20 py-4 flex justify-between items-center">
          <div className="text-2xl font-black text-white tracking-tighter">
            GSTU<span className="text-blue-500">Hackathon</span>
          </div>
          <div className="hidden md:flex space-x-6 lg:space-x-8 text-sm font-semibold text-slate-300">
            <a href="#home" className="hover:text-white transition-colors">Home</a>
            <a href="#about" className="hover:text-white transition-colors">About</a>
            <a href="#tracks" className="hover:text-white transition-colors">Tracks</a>
            <a href="#requirements" className="hover:text-white transition-colors">Requirements</a>
            <a href="#rules" className="hover:text-white transition-colors">Rules</a>
            <a href="#schedule" className="hover:text-white transition-colors">Schedule</a>
            <a href="#sponsors" className="hover:text-white transition-colors">Sponsors</a>
          </div>
          <div>
            <button 
              onClick={() => setIsLoginOpen(true)}
              className="bg-white/10 hover:bg-white/20 text-white font-semibold py-2 px-6 rounded-lg backdrop-blur-md transition-all"
            >
              Login
            </button>
          </div>
        </div>
      </nav>

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  );
}
