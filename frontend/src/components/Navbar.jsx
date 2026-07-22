import { useState } from 'react';
import { Link } from 'react-router-dom';
import LoginModal from '../features/authentication/LoginModal';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const { currentUser, logout } = useAuth();

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
            <a href="#requirements" className="hover:text-white transition-colors">Requirements</a>
            <a href="#rules" className="hover:text-white transition-colors">Rules</a>
            <a href="#schedule" className="hover:text-white transition-colors">Schedule</a>
          </div>
          <div className="flex space-x-4 items-center">
            {currentUser ? (
              <>
                <Link 
                  to="/dashboard"
                  className="bg-blue-600/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 font-semibold py-2 px-4 rounded-lg transition-all"
                >
                  Dashboard
                </Link>
              </>
            ) : (
              <>
                <button 
                  onClick={() => setIsLoginOpen(true)}
                  className="text-white font-semibold py-2 px-4 hover:text-blue-400 transition-colors"
                >
                  Sign In
                </button>
                <Link 
                  to="/register"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow-lg shadow-blue-500/30 transition-all"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  );
}
