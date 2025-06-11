import React, { createContext, useState, useEffect } from 'react';
import API, { setAuthToken } from '../utils/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');

    const initializeUser = async () => {
      if (storedToken) {
        setAuthToken(storedToken); // Attach token to headers

        try {
          // Revalidate user session from backend
          const res = await API.get('/auth');
          setUser(res.data); // Set validated user
          localStorage.setItem('user', JSON.stringify(res.data)); // Optional: Update stored user
        } catch (err) {
          console.error('Token invalid or expired. Logging out.', err);
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          setAuthToken(null);
          setUser(null);
        }
      }

      setLoading(false); // Finished checking
    };

    initializeUser();
  }, []);

  const login = async (email, password, role) => {
  try {
    const res = await API.post('/auth/login', { email, password, role }); // 👈 include role in request body
    const { token, ...userData } = res.data;

    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
    setAuthToken(token);

    return { success: true, user: userData };
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || 'Login failed',
    };
  }
};

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setAuthToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
