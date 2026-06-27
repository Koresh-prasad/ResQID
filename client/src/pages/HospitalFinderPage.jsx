import { useState } from 'react';
import { ExternalLink, Hospital, MapPinned, Navigation } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout.jsx';
import { Alert, Button, Card } from '../components/ui.jsx';

export default function HospitalFinderPage() {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState('');

  const detect = () => {
    setError('');
    navigator.geolocation.getCurrentPosition((position) => {
      setLocation({ latitude: position.coords.latitude, longitude: position.coords.longitude });
    }, () => setError('Location permission is required to find nearby hospitals.'));
  };

  const mapsUrl = location ? `https://www.google.com/maps/search/nearby+hospitals/@${location.latitude},${location.longitude},14z` : '';

  return (
    <DashboardLayout title="Hospital Finder" subtitle="Detect your location and open nearby hospitals with directions">
      <div className="grid gap-6 lg:grid-cols-[.85fr_1.15fr]">
        <Card>
          {error && <Alert type="error">{error}</Alert>}
          <Hospital className="text-primary" size={44} />
          <h2 className="mt-4 text-2xl font-black">Nearby Hospitals</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Uses browser geolocation and Google Maps search to show hospital names, addresses, and directions.</p>
          <Button onClick={detect} className="mt-5"><Navigation size={18} /> Detect Current Location</Button>
        </Card>
        <Card>
          {location ? (
            <>
              <div className="rounded-lg bg-blue-50 p-4 font-bold text-primary dark:bg-blue-950 dark:text-blue-200">
                <MapPinned className="mb-2" /> {location.latitude}, {location.longitude}
              </div>
              <iframe title="Nearby hospitals map" className="mt-5 h-96 w-full rounded-lg border-0" src={`https://maps.google.com/maps?q=hospitals%20near%20${location.latitude},${location.longitude}&z=14&output=embed`} />
              <a href={mapsUrl} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 font-bold text-primary">
                Open directions in Google Maps <ExternalLink size={16} />
              </a>
            </>
          ) : <p className="text-slate-500">Detect your location to load the hospital map.</p>}
        </Card>
      </div>
    </DashboardLayout>
  );
}
