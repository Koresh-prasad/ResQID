import { useState } from 'react';
import { MapPinned, Siren } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout.jsx';
import { Alert, Button, Card, TextArea } from '../components/ui.jsx';
import { api } from '../services/api.js';

export default function SOSPage() {
  const [message, setMessage] = useState('I need emergency assistance. Please check my live location.');
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [alert, setAlert] = useState(null);

  const trigger = () => {
    setError('');
    setStatus('Detecting location...');
    navigator.geolocation.getCurrentPosition(async (position) => {
      try {
        const { data } = await api.post('/sos', {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          message
        });
        setAlert(data.alert);
        setStatus('SOS alerts prepared for emergency contacts.');
      } catch (err) {
        setError(err.message);
        setStatus('');
      }
    }, () => {
      setError('Location permission is required for SOS alerts.');
      setStatus('');
    });
  };

  return (
    <DashboardLayout title="SOS" subtitle="Send a live GPS emergency alert to your registered contacts">
      <div className="grid gap-6 lg:grid-cols-[.9fr_1.1fr]">
        <Card>
          {status && <Alert>{status}</Alert>}
          {error && <Alert type="error">{error}</Alert>}
          <TextArea className="mt-4" label="Emergency Message" value={message} onChange={(event) => setMessage(event.target.value)} />
          <Button variant="emergency" className="mt-5 h-16 w-full text-lg" onClick={trigger}>
            <Siren size={24} /> Trigger SOS
          </Button>
        </Card>
        <Card>
          <h2 className="text-xl font-black">Latest SOS Alert</h2>
          {alert ? (
            <div className="mt-5 space-y-4">
              <Info label="Timestamp" value={new Date(alert.timestamp).toLocaleString()} />
              <Info label="Location" value={`${alert.location.latitude}, ${alert.location.longitude}`} />
              <a className="inline-flex items-center gap-2 font-bold text-primary" href={alert.location.mapsUrl} target="_blank" rel="noreferrer"><MapPinned size={18} /> Open live location</a>
            </div>
          ) : <p className="mt-4 text-slate-500">No SOS alert sent in this session.</p>}
        </Card>
      </div>
    </DashboardLayout>
  );
}

function Info({ label, value }) {
  return <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-950"><p className="text-xs font-black uppercase text-slate-500">{label}</p><p className="font-bold">{value}</p></div>;
}
