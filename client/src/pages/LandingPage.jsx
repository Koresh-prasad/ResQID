import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Ambulance, Fingerprint, HeartPulse, LockKeyhole, MapPinned, QrCode, ShieldCheck, Smartphone } from 'lucide-react';
import PublicLayout from '../components/PublicLayout.jsx';
import { Button, Card } from '../components/ui.jsx';

const features = [
  ['Privacy-first QR', 'QR codes store only a secure emergency URL, never raw personal data.', QrCode],
  ['Protected medical profile', 'JWT access, password hashing, validation, rate limits, and encrypted sensitive fields.', LockKeyhole],
  ['SOS location alerts', 'Share timestamped GPS location with saved contacts during an emergency.', MapPinned],
  ['OTP full access', 'Public viewers see essentials only; complete details require OTP verification.', Fingerprint]
];

const benefits = ['Fast responder access', 'Masked contact numbers', 'Cloud-linked updates', 'Dark mode and multilingual-ready settings'];
const testimonials = [
  ['Aarav M.', 'ResQID made our family emergency cards actually useful without exposing everything.'],
  ['Dr. Nisha K.', 'The public view has exactly the essentials a responder needs first.'],
  ['Priya S.', 'The QR and SOS flow feels simple enough to use under pressure.']
];

export default function LandingPage() {
  return (
    <PublicLayout>
      <section className="medical-visual relative overflow-hidden">
        <div className="mx-auto grid min-h-[calc(100vh-78px)] max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_.95fr] lg:px-8">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-3xl text-white">
            <span className="inline-flex rounded-lg bg-white/15 px-3 py-2 text-sm font-bold ring-1 ring-white/25">SafeLife QR technology, built as ResQID</span>
            <h1 className="mt-6 text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
              Your Emergency Identity, Always Accessible, Always Secure.
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-blue-50">
              Create a secure medical profile, generate a smart QR, and let responders see only the information needed to help quickly.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/register"><Button variant="light">Register</Button></Link>
              <Link to="/login"><Button variant="secondary">Login</Button></Link>
              <Link to="/register"><Button variant="emergency">Create QR Profile</Button></Link>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.15 }} className="glass rounded-lg p-5 shadow-soft">
            <div className="rounded-lg bg-white p-5 text-slate-950 dark:bg-slate-900 dark:text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-500">Emergency Card</p>
                  <h2 className="text-2xl font-black">ResQID Verified</h2>
                </div>
                <HeartPulse className="text-emergency" size={38} />
              </div>
              <div className="mt-6 grid grid-cols-3 gap-3">
                {['Blood A+', 'Allergy', 'Donor'].map((item) => <div key={item} className="rounded-lg bg-blue-50 p-3 text-center text-sm font-bold text-primary dark:bg-blue-950 dark:text-blue-200">{item}</div>)}
              </div>
              <div className="mt-6 rounded-lg border border-dashed border-blue-200 p-5 text-center dark:border-blue-800">
                <QrCode className="mx-auto text-primary" size={96} />
                <p className="mt-3 text-sm font-semibold text-slate-500">https://domain.com/emergency/rq-secure-id</p>
              </div>
              <Button variant="emergency" className="mt-5 w-full"><Ambulance size={18} /> Call Emergency Contact</Button>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-black">Built For Critical Moments</h2>
          <p className="mt-3 text-slate-600 dark:text-slate-400">A modern healthcare workflow with privacy controls from QR generation to emergency access.</p>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {features.map(([title, text, Icon]) => (
            <Card key={title}>
              <Icon className="text-primary" size={28} />
              <h3 className="mt-4 font-black">{title}</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{text}</p>
            </Card>
          ))}
        </div>
      </section>

      <section id="about" className="bg-white py-16 dark:bg-slate-900">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
          <Card className="lg:col-span-1">
            <h2 className="text-3xl font-black">How It Works</h2>
            <ol className="mt-5 space-y-4 text-sm text-slate-600 dark:text-slate-300">
              <li><b>1.</b> Register and build your medical profile.</li>
              <li><b>2.</b> Generate a QR linked to your secure emergency ID.</li>
              <li><b>3.</b> Responders scan it and see only essential information.</li>
              <li><b>4.</b> OTP verification reveals complete information when needed.</li>
            </ol>
          </Card>
          <Card className="lg:col-span-2">
            <h2 className="text-3xl font-black">Benefits</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {benefits.map((benefit) => (
                <div key={benefit} className="flex items-center gap-3 rounded-lg bg-slate-50 p-4 dark:bg-slate-950">
                  <ShieldCheck className="text-primary" size={22} />
                  <span className="font-bold">{benefit}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-black">Trusted By Families And Care Teams</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {testimonials.map(([name, text]) => (
            <Card key={name}>
              <p className="text-slate-600 dark:text-slate-300">"{text}"</p>
              <p className="mt-4 font-black">{name}</p>
            </Card>
          ))}
        </div>
        <div className="mt-10 rounded-lg bg-primary p-8 text-center text-white shadow-soft">
          <Smartphone className="mx-auto" size={40} />
          <h2 className="mt-3 text-3xl font-black">Create Your ResQID Emergency Profile</h2>
          <Link to="/register" className="mt-6 inline-flex"><Button variant="light">Get Started</Button></Link>
        </div>
      </section>
    </PublicLayout>
  );
}
