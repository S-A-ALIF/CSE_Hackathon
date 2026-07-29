import { API_URL } from '../config';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';
import NotificationDropdown from '../components/NotificationDropdown';

export default function ProfilePage({ inDashboard = false }) {
  const { currentUser, userProfile, setUserProfile } = useAuth();
  const navigate = useNavigate();
  
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Data for View Mode
  const [profileData, setProfileData] = useState({
    name: '',
    student_id: '',
    batch_session: '',
    phone_number: ''
  });

  // Data for Edit Mode
  const [formData, setFormData] = useState({
    name: '',
    student_id: '',
    batch_session: '',
    phone_number: ''
  });

  useEffect(() => {
    if (!currentUser) {
      navigate('/');
      return;
    }
  }, [currentUser, navigate]);

  // Sync with context profile data
  useEffect(() => {
    if (userProfile) {
      setProfileData(userProfile);
      setFormData(userProfile);
    }
  }, [userProfile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCancel = () => {
    // Revert form data to the saved profile data
    setFormData(profileData);
    setIsEditing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (saving) return;
    setSaving(true);
    
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(API_URL + '/api/v1/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: formData.name,
          student_id: formData.student_id,
          batch_session: formData.batch_session,
          phone_number: formData.phone_number
        })
      });
      
      const data = await res.json();
      
      if (res.ok && (data.status === 'success' || data.success)) {
        toast.success('Profile updated successfully!');
        setUserProfile(formData); // Update context
        setProfileData(formData); // Update view mode data
        setIsEditing(false); // Switch back to view mode
      } else {
        toast.error(data.message || 'Failed to update profile');
      }
    } catch (err) {
      toast.error('Network error occurred.');
    } finally {
      setSaving(false);
    }
  };

  // Get initials for avatar
  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <div className={inDashboard ? '' : 'min-h-screen bg-slate-50'}>
      {/* Navbar */}
      {!inDashboard && (
        <nav className="bg-slate-900 text-white py-4 px-6 lg:px-20 flex justify-between items-center shadow-md relative z-50">
          <Link to="/dashboard" className="text-2xl font-black tracking-tighter hover:opacity-80 transition-opacity">
            GSTU<span className="text-blue-500">Hackathon</span>
          </Link>
          <div className="flex items-center space-x-4">
            <NotificationDropdown />
            <Link to="/dashboard" className="w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 border-2 border-slate-700 flex items-center justify-center transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-slate-300">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
              </svg>
            </Link>
          </div>
        </nav>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12 max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Profile Header Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden mb-8">
          <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
          <div className="px-8 pb-8 flex flex-col sm:flex-row items-center sm:items-end justify-between -mt-16 gap-6">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="w-32 h-32 rounded-full border-4 border-white bg-slate-100 flex items-center justify-center text-4xl font-bold text-slate-400 shadow-md">
                {profileData.name ? getInitials(profileData.name) : '👤'}
              </div>
              <div className="text-center sm:text-left mb-2">
                <h1 className="text-3xl font-extrabold text-slate-900">{profileData.name || 'Hacker'}</h1>
                <p className="text-slate-500 font-medium">{profileData.student_id ? `ID: ${profileData.student_id}` : 'Update your profile to add details'}</p>
              </div>
            </div>
            
            {!isEditing && (
              <button 
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-lg"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                </svg>
                Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* Details Section */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
          {isEditing ? (
            /* Edit Mode Form */
            <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in duration-300">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 border-b border-slate-100 pb-4">Edit Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                    placeholder="John Doe" 
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Student ID</label>
                  <input 
                    type="text" 
                    name="student_id"
                    value={formData.student_id}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                    placeholder="e.g. 1902043" 
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Batch / Session</label>
                  <input 
                    type="text" 
                    name="batch_session"
                    value={formData.batch_session}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                    placeholder="e.g. 19th Batch, 2019-20" 
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Phone Number</label>
                  <input 
                    type="tel" 
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                    placeholder="+8801..." 
                  />
                </div>
              </div>

              <div className="pt-6 flex gap-4 justify-end border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={handleCancel}
                  className="px-6 py-3 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={saving}
                  className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-2 ${
                    saving ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {saving ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Saving...</span>
                    </>
                  ) : 'Save Changes'}
                </button>
              </div>
            </form>
          ) : (
            /* View Mode */
            <div className="animate-in fade-in duration-300">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 border-b border-slate-100 pb-4">Personal Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-slate-400 mb-1 uppercase tracking-wider">Full Name</span>
                  <span className="text-lg font-medium text-slate-800">{profileData.name || <span className="text-slate-300 italic">Not set</span>}</span>
                </div>
                
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-slate-400 mb-1 uppercase tracking-wider">Student ID</span>
                  <span className="text-lg font-medium text-slate-800">{profileData.student_id || <span className="text-slate-300 italic">Not set</span>}</span>
                </div>

                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-slate-400 mb-1 uppercase tracking-wider">Batch / Session</span>
                  <span className="text-lg font-medium text-slate-800">
                    <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full font-semibold border border-indigo-100">
                      {profileData.batch_session || <span className="text-indigo-300 italic">Not set</span>}
                    </span>
                  </span>
                </div>

                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-slate-400 mb-1 uppercase tracking-wider">Phone Number</span>
                  <span className="text-lg font-medium text-slate-800">{profileData.phone_number || <span className="text-slate-300 italic">Not set</span>}</span>
                </div>

              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
