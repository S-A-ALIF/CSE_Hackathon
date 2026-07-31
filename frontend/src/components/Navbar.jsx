import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LoginModal from '../features/authentication/LoginModal';
import { useAuth } from '../contexts/AuthContext';

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Overview', href: '#about' },
  { label: 'Team Requirements', href: '#requirements' },
  { label: 'Timeline', href: '#timeline' },
  { label: 'Rules', href: '#rules' },
];

export default function Navbar() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { currentUser, logout, registrationOpen } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-slate-900/95 backdrop-blur-md shadow-lg shadow-black/20 border-b border-white/5'
          : 'bg-transparent'
      }`}>
        <div className="container mx-auto px-6 lg:px-16 py-4 flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <span className="text-white font-black text-sm">G</span>
            </div>
            <div className="text-white font-black text-lg tracking-tight leading-none">
              GSTU<br />
              <span className="text-blue-400 text-xs font-bold tracking-widest">CSE HACKATHON</span>
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-slate-300 hover:text-white px-3 py-2 rounded-lg hover:bg-white/5 transition-all"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Auth */}
          <div className="hidden lg:flex space-x-3 items-center">
            {currentUser ? (
              currentUser.role === 'admin' ? (
                  <Link
                    to="/admin"
                    className="bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 font-bold py-2 px-4 rounded-lg transition-all flex items-center gap-1.5 text-sm"
                  >
                    <span>🛡️</span> Admin Panel
                  </Link>
                ) : currentUser.role === 'mentor' ? (
                  <Link
                    to="/mentor"
                    className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-500/20 font-bold py-2 px-4 rounded-lg transition-all flex items-center gap-1.5 text-sm"
                  >
                    <span>🎓</span> Mentor Dashboard
                  </Link>
                ) : (
                <Link
                  to="/dashboard"
                  className="bg-blue-600/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 font-semibold py-2 px-4 rounded-lg transition-all text-sm"
                >
                  Dashboard
                </Link>
              )
            ) : (
              <div className="flex items-center gap-3 ml-6">
                <button
                  onClick={() => setIsLoginOpen(true)}
                  className="text-slate-300 hover:text-white font-semibold py-2 px-3 transition-colors text-sm"
                >
                  Sign In
                </button>
                {registrationOpen && (
                  <Link
                    to="/register"
                    className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-5 rounded-lg shadow-lg shadow-blue-500/30 transition-all text-sm"
                  >
                    Register
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            className="lg:hidden text-slate-300 hover:text-white p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="lg:hidden bg-slate-900/98 border-t border-white/5 px-6 py-4 space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block text-slate-300 hover:text-white font-medium py-2 px-3 rounded-lg hover:bg-white/5 transition-all"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-3 border-t border-white/5 flex gap-3">
              {currentUser ? (
                <div className="flex flex-col gap-2 w-full">
                  {currentUser.role === 'admin' ? (
                    <Link to="/admin" className="w-full text-center bg-red-600 text-white font-semibold py-2 rounded-lg text-sm">
                      Admin Panel
                    </Link>
                  ) : currentUser.role === 'mentor' ? (
                    <Link to="/mentor" className="w-full text-center bg-indigo-600 text-white font-semibold py-2 rounded-lg text-sm">
                      Mentor Dashboard
                    </Link>
                  ) : (
                    <Link to="/dashboard" className="w-full text-center bg-blue-600 text-white font-semibold py-2 rounded-lg text-sm">
                      Dashboard
                    </Link>
                  )}
                </div>
              ) : (
                <div className="flex flex-col gap-2 w-full">
                  <button 
                    onClick={() => { setIsLoginOpen(true); setMobileOpen(false); }} 
                    className="w-full text-center border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 font-semibold py-2 rounded-lg text-sm transition-all"
                  >
                    Sign In
                  </button>
                  {registrationOpen && (
                    <Link 
                      to="/register"
                      onClick={() => setMobileOpen(false)}
                      className="w-full text-center bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 rounded-lg text-sm shadow-lg shadow-blue-500/30 transition-all"
                    >
                      Register
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  );
}
