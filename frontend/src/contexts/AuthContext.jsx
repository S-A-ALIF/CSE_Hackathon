import { API_URL } from '../config';
import { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { adminCache } from '../features/admin/adminCache';
import { userCache } from '../utils/userCache';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registrationOpen, setRegistrationOpen] = useState(true);
  const [workspaceOpen, setWorkspaceOpen] = useState(false);
  const [problemsOpen, setProblemsOpen] = useState(false);
  const [regStartTime, setRegStartTime] = useState('');
  const [regEndTime, setRegEndTime] = useState('');

  const fetchPlatformSettings = async () => {
    try {
      const res = await fetch(`${API_URL}/api/v1/settings`);
      const data = await res.json();
      if (res.ok && data.success && data.data) {
        let isRegOpen = data.data.registration_open !== 'false' && data.data.registration_open !== false;
        
        const startTime = data.data.reg_start_time;
        const endTime = data.data.reg_end_time;
        const now = new Date();
        
        if (startTime && endTime) {
          isRegOpen = now >= new Date(startTime) && now <= new Date(endTime);
        } else if (startTime) {
          isRegOpen = now >= new Date(startTime);
        } else if (endTime) {
          // If only end time is set, it's open until that time
          // (or false if it was manually closed? Usually timeline overrides, but if manually closed, maybe keep it closed. Let's make it open until end time to be consistent).
          isRegOpen = now <= new Date(endTime);
        }

        const isWorkOpen = data.data.workspace_open === 'true' || data.data.workspace_open === true;
        const isProbOpen = data.data.problems_open === 'true' || data.data.problems_open === true;
        
        setRegistrationOpen(isRegOpen);
        setWorkspaceOpen(isWorkOpen);
        setProblemsOpen(isProbOpen);
        setRegStartTime(startTime || '');
        setRegEndTime(endTime || '');
      }
    } catch (err) {
      console.error('Error fetching platform settings:', err);
    }
  };

  useEffect(() => {
    fetchPlatformSettings();
  }, []);

  useEffect(() => {
    // Check for existing token and verify with server on load
    const verifyUser = async () => {
      try {
        const storedUser = localStorage.getItem('currentUser');
        const token = localStorage.getItem('token');
        if (storedUser && token) {
          // Immediately set stored user for optimistic render
          setCurrentUser(JSON.parse(storedUser));
          
          // Verify token validity with server and get user profile
          const res = await fetch(API_URL + '/api/v1/auth/me', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          const data = await res.json();
          if (res.ok && data.data) {
            const freshUser = {
              id: data.data.id,
              email: data.data.email,
              role: data.data.role
            };
            setCurrentUser(freshUser);
            setUserProfile({
              name: data.data.name || '',
              student_id: data.data.student_id || '',
              batch_session: data.data.batch_session || '',
              phone_number: data.data.phone_number || ''
            });
            localStorage.setItem('currentUser', JSON.stringify(freshUser));
          } else if (res.status === 401) {
            // Token invalid or expired
            localStorage.removeItem('currentUser');
            localStorage.removeItem('token');
            setCurrentUser(null);
            setUserProfile(null);
          }
        }
      } catch (err) {
        console.error('Error verifying user:', err);
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await fetch(API_URL + '/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, message: data.message || 'Invalid email or password' };
      }

      // Save token and user
      localStorage.setItem('token', data.token);
      localStorage.setItem('currentUser', JSON.stringify(data.data));
      setCurrentUser(data.data);
      if (data.data.profile) {
        setUserProfile(data.data.profile);
      }
      return { success: true, user: data.data };
    } catch (err) {
      console.error("Login error:", err);
      return { success: false, message: 'Network error. Please try again later.' };
    }
  };

  const register = async (userData) => {
    try {
      const response = await fetch(API_URL + '/api/v1/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, message: data.message || 'Registration failed' };
      }

      // Automatically log them in after registration
      const loginResult = await login(userData.email, userData.password);
      if (loginResult.success) {
         return { success: true };
      } else {
         return { success: false, message: 'Registered successfully, but failed to log in automatically.' };
      }

    } catch (err) {
      console.error("Registration error:", err);
      return { success: false, message: 'Network error. Please try again later.' };
    }
  };

  const logout = () => {
    adminCache.clear();
    userCache.clear();
    setCurrentUser(null);
    setUserProfile(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
  };

  if (loading) {
    return null; // Or a loading spinner
  }

  const userEmail = (currentUser?.email || userProfile?.email || '').toLowerCase().trim();
  const isSpecialUser = userEmail === 'soroarazmir56@gmail.com';
  const effectiveWorkspaceOpen = workspaceOpen || isSpecialUser;

  return (
    <AuthContext.Provider value={{ currentUser, userProfile, setUserProfile, login, register, logout, registrationOpen, workspaceOpen: effectiveWorkspaceOpen, problemsOpen, regStartTime, regEndTime, fetchPlatformSettings }}>
      {children}
    </AuthContext.Provider>
  );
}
