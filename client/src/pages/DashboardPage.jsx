import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarClock, CheckCircle2, PhoneCall, QrCode } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout.jsx';
import { Button, Card } from '../components/ui.jsx';
import { api } from '../services/api.js';

export default function DashboardPage() {
  const [profile, setProfile] = useState(null);
  const [scans, setScans] = useState([]);

  useEffect(() => {
    api.get('/profile').then(({ data }) => {
      setProfile(data.profile);
      setScans(data.scans || []);
    });
  }, []);

  const cards = [
    ['Profile Status', profile?.fullName ? 'Complete' : 'Needs details', CheckCircle2],
    ['QR Status', profile?.qrUniqueId ? 'Generated' : 'Not generated', QrCode],
    ['Emergency Contacts', `${profile?.contacts?.filter((item) => item.mobile)?.length || 0} saved`, PhoneCall],
    ['Last Updated', profile?.lastUpdated ? new Date(profile.lastUpdated).toLocaleString() : 'Not updated', CalendarClock]
  ];

  return (
    <DashboardLayout title="Dashboard" subtitle="Your emergency identity at a glance">
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {cards.map(([title, value, Icon]) => (
          <Card key={title}>
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-bold text-slate-500">{title}</p>
                <h2 className="mt-2 text-2xl font-black">{value}</h2>
              </div>
              <span className="grid h-12 w-12 place-items-center rounded-lg bg-blue-50 text-primary dark:bg-blue-950">
                <Icon size={24} />
              </span>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1.1fr_.9fr]">
        <Card>
          <h2 className="text-xl font-black">Next Best Actions</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <Link to="/profile"><Button className="w-full">Update Profile</Button></Link>
            <Link to="/generate-qr"><Button className="w-full" variant="secondary">Generate QR</Button></Link>
            <Link to="/sos"><Button className="w-full" variant="emergency">SOS</Button></Link>
          </div>
        </Card>
        <Card>
          <h2 className="text-xl font-black">QR Scan History</h2>
          <div className="mt-4 space-y-3">
            {scans.length === 0 && <p className="text-sm text-slate-500">No scans yet.</p>}
            {scans.slice(0, 5).map((scan) => (
              <div key={scan._id || scan.id || scan.createdAt} className="rounded-lg bg-slate-50 p-3 text-sm dark:bg-slate-950">
                <b>{new Date(scan.createdAt).toLocaleString()}</b>
                <p className="truncate text-slate-500">{scan.userAgent || 'Unknown device'}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
