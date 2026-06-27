import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../services/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('resqid_user');
    return raw ? JSON.parse(raw) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('resqid_token'));
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('resqid_theme') === 'dark');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('resqid_theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  useEffect(() => {
    if (!token) return;
    api.get('/auth/me').then(({ data }) => setUser(data.user)).catch(() => logout());
  }, []);

  const persist = (payload) => {
    setUser(payload.user);
    setToken(payload.token);
    localStorage.setItem('resqid_user', JSON.stringify(payload.user));
    localStorage.setItem('resqid_token', payload.token);
  };

  const login = async (values) => {
    const { data } = await api.post('/auth/login', values);
    persist(data);
  };

  const register = async (values) => {
    const { data } = await api.post('/auth/register', values);
    persist(data);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('resqid_user');
    localStorage.removeItem('resqid_token');
  };

  const value = useMemo(
    () => ({ user, token, darkMode, setDarkMode, login, register, logout, isAuthed: Boolean(token) }),
    [user, token, darkMode]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
