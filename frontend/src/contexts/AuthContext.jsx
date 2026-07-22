import { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Check for existing token and user on load
    try {
      const storedUser = localStorage.getItem('currentUser');
      const token = localStorage.getItem('token');
      if (storedUser && token) {
        setCurrentUser(JSON.parse(storedUser));
      }
    } catch (err) {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await fetch('http://localhost:5000/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        return false;
      }

      // Save token and user
      localStorage.setItem('token', data.token);
      localStorage.setItem('currentUser', JSON.stringify(data.data));
      setCurrentUser(data.data);
      return true;
    } catch (err) {
      console.error("Login error:", err);
      return false;
    }
  };

  const register = async (userData) => {
    try {
      const response = await fetch('http://localhost:5000/api/v1/auth/register', {
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
      const loginSuccess = await login(userData.email, userData.password);
      if (loginSuccess) {
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
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
  };

  if (loading) {
    return null; // Or a loading spinner
  }

  return (
    <AuthContext.Provider value={{ currentUser, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
