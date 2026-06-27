import { Link, NavLink } from 'react-router-dom';
import { Menu, Moon, ShieldCheck, Sun, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

const nav = [
  { label: 'Home', to: '/' },
  { label: 'Features', to: '/#features' },
  { label: 'About', to: '/#about' },
  { label: 'Login', to: '/login' },
  { label: 'Register', to: '/register' }
];

export function Brand() {
  return (
    <Link to="/" className="flex items-center gap-3 text-xl font-extrabold text-primary dark:text-blue-300">
      <img
        src="/resqid-logo.jpeg"
        alt="ResQID logo"
        className="h-12 w-12 rounded-lg border border-slate-200 bg-slate-950 object-cover shadow-soft dark:border-slate-700"
      />
      <span className="leading-none">ResQID</span>
    </Link>
  );
}

export default function PublicLayout({ children }) {
  const [open, setOpen] = useState(false);
  const { darkMode, setDarkMode } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-white">
      <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/85">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Brand />
          <nav className="hidden items-center gap-7 md:flex">
            {nav.map((item) => (
              <NavLink
                key={item.label}
                to={item.to}
                className={item.label === 'Register'
                  ? 'rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-primaryDark'
                  : 'text-sm font-semibold text-slate-600 hover:text-primary dark:text-slate-300'}
              >
                {item.label}
              </NavLink>
            ))}
            <button
              aria-label="Toggle dark mode"
              className="grid h-10 w-10 place-items-center rounded-lg border border-slate-200 dark:border-slate-700"
              onClick={() => setDarkMode(!darkMode)}
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </nav>
          <button className="grid h-10 w-10 place-items-center rounded-lg border md:hidden" onClick={() => setOpen(!open)} aria-label="Open menu">
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        {open && (
          <div className="border-t border-slate-200 bg-white px-4 py-4 dark:border-slate-800 dark:bg-slate-950 md:hidden">
            <div className="flex flex-col gap-3">
              {nav.map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className={item.label === 'Register' ? 'rounded-lg bg-primary px-4 py-2 text-center font-bold text-white' : ''}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>
      {children}
      <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-3 lg:px-8">
          <div>
            <Brand />
            <p className="mt-3 max-w-sm text-sm text-slate-600 dark:text-slate-400">
              Privacy-protected emergency identity for families, travelers, drivers, students, and care teams.
            </p>
          </div>
          <div>
            <h3 className="font-bold">Contact</h3>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">support@resqid.health</p>
            <p className="text-sm text-slate-600 dark:text-slate-400">24/7 emergency platform assistance</p>
          </div>
          <div className="flex flex-col gap-2 text-sm">
            <Link to="/" className="hover:text-primary">Privacy Policy</Link>
            <Link to="/" className="hover:text-primary">Terms of Service</Link>
            <span className="flex items-center gap-2 text-slate-500"><ShieldCheck size={16} /> HTTPS-ready secure APIs</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
