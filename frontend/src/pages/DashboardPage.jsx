import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function DashboardPage() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate('/');
    }
  }, [currentUser, navigate]);

  if (!currentUser) return null;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Simple Dashboard Navbar */}
      <nav className="bg-slate-900 text-white py-4 px-6 lg:px-20 flex justify-between items-center shadow-md">
        <Link to="/" className="text-2xl font-black tracking-tighter hover:opacity-80 transition-opacity">
          GSTU<span className="text-blue-500">Hackathon</span>
        </Link>
        <div className="flex items-center space-x-6">
          <Link to="/" className="text-slate-300 font-semibold hover:text-white transition-colors">
            Back to Landing Page
          </Link>
          <button 
            onClick={handleLogout}
            className="bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 font-semibold py-2 px-4 rounded-lg transition-all"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Dashboard Content */}
      <main className="container mx-auto px-6 lg:px-20 py-12 max-w-5xl">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 md:p-12">
          <div className="flex items-center justify-between mb-8 pb-8 border-b border-slate-100">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 mb-2">
                Welcome back, {currentUser.name}!
              </h1>
              <p className="text-lg text-slate-500">
                You are managing the team: <span className="font-bold text-slate-800">{currentUser.teamName}</span>
              </p>
            </div>
            <div className="text-6xl hidden sm:block">👋</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl">
              <h3 className="text-xl font-bold text-blue-900 mb-2">Submission Portal</h3>
              <p className="text-blue-700 mb-4">
                The project submission portal will open during the hackathon. Check back later to submit your code!
              </p>
              <button disabled className="bg-blue-200 text-blue-500 font-bold py-2 px-6 rounded-lg cursor-not-allowed">
                Submit Project
              </button>
            </div>

            <div className="bg-slate-50 border border-slate-100 p-6 rounded-2xl">
              <h3 className="text-xl font-bold text-slate-800 mb-2">Team Management</h3>
              <p className="text-slate-600 mb-4">
                Currently, team edits are locked. If you need to make urgent changes to your team roster, please contact the organizers.
              </p>
              <button disabled className="bg-slate-200 text-slate-400 font-bold py-2 px-6 rounded-lg cursor-not-allowed">
                Edit Team
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
