import { NavLink, useNavigate } from 'react-router-dom';
import { Bell, Home, Hospital, LogOut, Moon, QrCode, Settings, ShieldAlert, Sun, UserRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

const links = [
  { label: 'Dashboard', to: '/dashboard', icon: Home },
  { label: 'My Profile', to: '/profile', icon: UserRound },
  { label: 'Generate QR', to: '/generate-qr', icon: QrCode },
  { label: 'SOS', to: '/sos', icon: ShieldAlert },
  { label: 'Hospitals', to: '/hospitals', icon: Hospital },
  { label: 'Settings', to: '/settings', icon: Settings }
];

export default function DashboardLayout({ children, title, subtitle }) {
  const { user, logout, darkMode, setDarkMode } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-white">
      <aside className="fixed left-0 top-0 z-30 hidden h-screen w-72 border-r border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 lg:block">
        <div className="flex items-center gap-2 text-xl font-extrabold text-primary dark:text-blue-300">
          <img
            src="/resqid-logo.jpeg"
            alt="ResQID logo"
            className="h-12 w-12 rounded-lg border border-slate-200 bg-slate-950 object-cover shadow-soft dark:border-slate-700"
          />
          ResQID
        </div>
        <nav className="mt-9 space-y-2">
          {links.map(({ label, to, icon: Icon }) => (
            <NavLink
              key={label}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold transition ${
                  isActive ? 'bg-blue-50 text-primary dark:bg-blue-950/60 dark:text-blue-200' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
        <button onClick={handleLogout} className="absolute bottom-5 left-5 right-5 flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-3 text-white dark:bg-white dark:text-slate-950">
          <LogOut size={18} /> Logout
        </button>
      </aside>
      <main className="lg:pl-72">
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
          <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            <div>
              <h1 className="text-xl font-extrabold sm:text-2xl">{title}</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="grid h-10 w-10 place-items-center rounded-lg border border-slate-200 dark:border-slate-700" aria-label="Notifications">
                <Bell size={18} />
              </button>
              <button className="grid h-10 w-10 place-items-center rounded-lg border border-slate-200 dark:border-slate-700" onClick={() => setDarkMode(!darkMode)} aria-label="Toggle dark mode">
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <div className="hidden text-right sm:block">
                <p className="text-sm font-bold">{user?.name}</p>
                <p className="text-xs text-slate-500">{user?.email}</p>
              </div>
            </div>
          </div>
          <nav className="flex gap-2 overflow-x-auto border-t border-slate-200 px-4 py-2 dark:border-slate-800 lg:hidden">
            {links.map(({ label, to }) => <NavLink key={label} to={to} className="whitespace-nowrap rounded-lg px-3 py-2 text-sm font-semibold">{label}</NavLink>)}
          </nav>
        </header>
        <div className="px-4 py-6 sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  );
}
