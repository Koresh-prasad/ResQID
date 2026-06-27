import { useEffect, useState } from 'react';
import { Download, Printer, RefreshCw } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout.jsx';
import { Alert, Button, Card } from '../components/ui.jsx';
import { api } from '../services/api.js';

export default function QRPage() {
  const [qr, setQr] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/profile').then(({ data }) => {
      if (data.profile?.qrUniqueId) {
        setQr({ qrUniqueId: data.profile.qrUniqueId, emergencyUrl: `${window.location.origin}/emergency/${data.profile.qrUniqueId}` });
      }
    });
  }, []);

  const generate = async () => {
    setError('');
    try {
      const { data } = await api.post('/qr/generate');
      setQr(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const download = () => {
    if (!qr?.qrDataUrl) return;
    const anchor = document.createElement('a');
    anchor.href = qr.qrDataUrl;
    anchor.download = `resqid-${qr.qrUniqueId}.png`;
    anchor.click();
  };

  return (
    <DashboardLayout title="Generate QR" subtitle="Create, download, print, or regenerate your secure emergency QR">
      <div className="grid gap-6 lg:grid-cols-[.85fr_1.15fr]">
        <Card>
          <h2 className="text-xl font-black">QR Controls</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">The QR contains only your secure emergency URL.</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button onClick={generate}><RefreshCw size={18} /> {qr ? 'Regenerate QR' : 'Generate QR'}</Button>
            <Button variant="secondary" onClick={download} disabled={!qr?.qrDataUrl}><Download size={18} /> Download PNG</Button>
            <Button variant="secondary" onClick={() => window.print()} disabled={!qr}><Printer size={18} /> Print</Button>
          </div>
          {error && <div className="mt-4"><Alert type="error">{error}</Alert></div>}
          {qr?.emergencyUrl && <p className="mt-5 break-all rounded-lg bg-blue-50 p-3 text-sm font-semibold text-primary dark:bg-blue-950 dark:text-blue-200">{qr.emergencyUrl}</p>}
        </Card>
        <Card className="text-center">
          <div id="qr-print" className="mx-auto max-w-sm rounded-lg border-4 border-primary bg-white p-5 text-slate-950">
            <p className="text-sm font-black uppercase tracking-wide text-primary">ResQID Emergency QR</p>
            {qr?.qrDataUrl ? <img src={qr.qrDataUrl} alt="ResQID QR code" className="mx-auto mt-4 w-full" /> : <div className="mt-4 grid aspect-square place-items-center rounded-lg bg-slate-100 text-slate-500">QR preview</div>}
            <p className="mt-3 break-all text-xs font-semibold">{qr?.emergencyUrl || 'Generate a QR to activate your emergency identity.'}</p>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
