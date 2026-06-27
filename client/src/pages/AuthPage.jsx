import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { KeyRound, LogIn, Mail, UserPlus } from 'lucide-react';
import PublicLayout from '../components/PublicLayout.jsx';
import { Alert, Button, Card, Field } from '../components/ui.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../services/api.js';
import { useState } from 'react';

export default function AuthPage({ mode }) {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [values, setValues] = useState({});
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const title = { login: 'Welcome Back', register: 'Create Your Account', forgot: 'Forgot Password', reset: 'Reset Password' }[mode];

  const update = (key) => (event) => setValues((current) => ({ ...current, [key]: event.target.value }));

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      if (mode === 'login') {
        await login(values);
        navigate('/dashboard');
      } else if (mode === 'register') {
        await register(values);
        navigate('/dashboard');
      } else if (mode === 'forgot') {
        const { data } = await api.post('/auth/forgot-password', { email: values.email });
        setMessage(data.resetToken ? `${data.message} Demo token: ${data.resetToken}` : data.message);
      } else {
        const { data } = await api.post('/auth/reset-password', values);
        setMessage(data.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PublicLayout>
      <main className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:px-8">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <p className="font-bold text-primary">Secure emergency identity</p>
          <h1 className="mt-3 text-4xl font-black">{title}</h1>
          <p className="mt-4 text-slate-600 dark:text-slate-400">
            Manage your ResQID profile, QR code, emergency contacts, SOS alerts, and privacy preferences from one protected account.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {['JWT Auth', 'bcrypt', 'OTP Reveal'].map((item) => <div key={item} className="rounded-lg bg-blue-50 p-4 text-center font-bold text-primary dark:bg-blue-950 dark:text-blue-200">{item}</div>)}
          </div>
        </motion.div>
        <Card>
          <form onSubmit={submit} className="space-y-4">
            {error && <Alert type="error">{error}</Alert>}
            {message && <Alert>{message}</Alert>}
            {mode === 'register' && (
              <>
                <Field label="Full Name" required value={values.name || ''} onChange={update('name')} />
                <Field label="Mobile Number" required value={values.mobile || ''} onChange={update('mobile')} />
              </>
            )}
            {(mode === 'login' || mode === 'register' || mode === 'forgot') && <Field label="Email" type="email" required value={values.email || ''} onChange={update('email')} />}
            {(mode === 'login' || mode === 'register' || mode === 'reset') && <Field label="Password" type="password" required value={values.password || ''} onChange={update('password')} />}
            {mode === 'register' && <Field label="Confirm Password" type="password" required value={values.confirmPassword || ''} onChange={update('confirmPassword')} />}
            {mode === 'reset' && <Field label="Reset Token" required value={values.token || ''} onChange={update('token')} />}
            <Button disabled={loading} className="w-full" type="submit">
              {mode === 'login' && <LogIn size={18} />}
              {mode === 'register' && <UserPlus size={18} />}
              {(mode === 'forgot' || mode === 'reset') && <KeyRound size={18} />}
              {loading ? 'Please wait...' : title}
            </Button>
            <div className="flex flex-wrap justify-between gap-3 text-sm font-semibold text-slate-600 dark:text-slate-300">
              <Link to="/login"><Mail size={15} className="mr-1 inline" /> Login</Link>
              <Link to="/register">Register</Link>
              <Link to="/forgot-password">Forgot Password</Link>
            </div>
          </form>
        </Card>
      </main>
    </PublicLayout>
  );
}
