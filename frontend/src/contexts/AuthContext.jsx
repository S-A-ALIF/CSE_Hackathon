import { API_URL } from '../config';
import { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Check for existing token and verify with server on load
    const verifyUser = async () => {
      try {
        const storedUser = localStorage.getItem('currentUser');
        const token = localStorage.getItem('token');
        if (storedUser && token) {
          // Immediately set stored user for optimistic render
          setCurrentUser(JSON.parse(storedUser));
          
          // Verify token validity with server
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
            localStorage.setItem('currentUser', JSON.stringify(freshUser));
          } else if (res.status === 401) {
            // Token invalid or expired
            localStorage.removeItem('currentUser');
            localStorage.removeItem('token');
            setCurrentUser(null);
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

  // Fetch detailed profile data whenever the current user changes
  useEffect(() => {
    if (currentUser) {
      const fetchProfile = async () => {
        try {
          const token = localStorage.getItem('token');
          const res = await fetch(API_URL + '/api/v1/users/profile', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          const data = await res.json();
          if (res.ok && data.data) {
             setUserProfile({
               name: data.data.name || '',
               student_id: data.data.studentId || '',
               batch_session: data.data.batchSession || '',
               phone_number: data.data.phoneNumber || ''
             });
          } else {
             setUserProfile({ name: '', student_id: '', batch_session: '', phone_number: '' });
          }
        } catch (err) {
          console.error("Failed to fetch profile:", err);
          setUserProfile({ name: '', student_id: '', batch_session: '', phone_number: '' });
        }
      };
      fetchProfile();
    } else {
      setUserProfile(null);
    }
  }, [currentUser]);

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
      return { success: true };
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
    setCurrentUser(null);
    setUserProfile(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
  };

  if (loading) {
    return null; // Or a loading spinner
  }

  return (
    <AuthContext.Provider value={{ currentUser, userProfile, setUserProfile, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
