import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Ambulance, Eye, HeartPulse, LockKeyhole, PhoneCall } from 'lucide-react';
import PublicLayout from '../components/PublicLayout.jsx';
import { Alert, Button, Card, Field } from '../components/ui.jsx';
import { api, API_BASE_URL } from '../services/api.js';

export default function PublicEmergencyPage() {
  const { qrUniqueId } = useParams();
  const [profile, setProfile] = useState(null);
  const [full, setFull] = useState(false);
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [requestingOtp, setRequestingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);

  useEffect(() => {
    api.get(`/emergency/${qrUniqueId}`).then(({ data }) => setProfile(data.profile)).catch((err) => setError(err.message));
  }, [qrUniqueId]);

  const requestOtp = async () => {
    setError('');
    setMessage('');
    setRequestingOtp(true);
    try {
      const { data } = await api.post(`/emergency/${qrUniqueId}/request-full`);
      if (data.demoOtp) {
        setOtp(data.demoOtp);
        setMessage(`${data.message} Demo OTP auto-filled: ${data.demoOtp}`);
      } else {
        setMessage(data.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setRequestingOtp(false);
    }
  };

  const verifyOtp = async () => {
    setError('');
    setMessage('');
    if (!/^\d{6}$/.test(otp.trim())) {
      setError('Enter the latest 6 digit OTP first.');
      return;
    }
    setVerifyingOtp(true);
    try {
      const { data } = await api.post(`/emergency/${qrUniqueId}/verify-otp`, { otp: otp.trim() });
      setProfile(data.profile);
      setFull(true);
      setMessage('Full emergency profile unlocked.');
    } catch (err) {
      setError(err.message);
    } finally {
      setVerifyingOtp(false);
    }
  };

  const callContact = async () => {
    setError('');
    setMessage('Opening phone dialer. The full number stays hidden on this page.');
    window.location.href = `${API_BASE_URL}/emergency/${qrUniqueId}/call`;
  };

  return (
    <PublicLayout>
      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-lg bg-emergency p-6 text-white shadow-soft">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="font-bold">Emergency Information</p>
              <h1 className="text-3xl font-black">ResQID Public View</h1>
            </div>
            <Ambulance size={44} />
          </div>
        </div>

        <div className="mt-6 space-y-5">
          {error && <Alert type="error">{error}</Alert>}
          {message && <Alert>{message}</Alert>}
          <Card>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-slate-500">Patient Name</p>
                <h2 className="text-3xl font-black">{profile?.fullName || 'Unknown'}</h2>
              </div>
              <HeartPulse className="text-emergency" size={40} />
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Info label="Blood Group" value={profile?.bloodGroup} />
              <Info label="Organ Donor" value={profile?.organDonor ? 'Yes' : 'No'} />
              <Info label="Allergies" value={profile?.allergies} />
              <Info label="Medical Conditions" value={profile?.diseases} />
            </div>
            <Button variant="emergency" className="mt-6 w-full text-base" onClick={callContact}>
              <PhoneCall size={20} /> Call Emergency Contact
            </Button>
          </Card>

          <Card>
            <h2 className="text-xl font-black">Emergency Contacts</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {(profile?.contacts || []).map((contact, index) => (
                <div key={index} className="rounded-lg bg-slate-50 p-4 dark:bg-slate-950">
                  <p className="font-black">{contact.name || `Contact ${index + 1}`}</p>
                  <p className="text-sm text-slate-500">{contact.relationship}</p>
                  <p className="mt-2 font-mono font-bold">{full ? contact.mobile : contact.mobileMasked}</p>
                </div>
              ))}
            </div>
          </Card>

          {!full && (
            <Card>
              <div className="flex items-center gap-3">
                <LockKeyhole className="text-primary" />
                <h2 className="text-xl font-black">Request Full Medical Information</h2>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-[auto_1fr_auto]">
                <Button variant="secondary" onClick={requestOtp} disabled={requestingOtp}>
                  <Eye size={18} /> {requestingOtp ? 'Sending...' : 'Send OTP'}
                </Button>
                <Field label="Latest OTP" inputMode="numeric" maxLength="6" value={otp} onChange={(event) => setOtp(event.target.value.replace(/\D/g, '').slice(0, 6))} />
                <Button onClick={verifyOtp} className="self-end" disabled={verifyingOtp}>
                  {verifyingOtp ? 'Verifying...' : 'Verify'}
                </Button>
              </div>
              <p className="mt-3 text-sm font-semibold text-slate-500 dark:text-slate-400">
                Press Send OTP once, then verify the latest 6 digit code. Sending again replaces the old OTP.
              </p>
            </Card>
          )}

          {full && (
            <Card>
              <h2 className="text-xl font-black">Complete Profile</h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <Info label="Date of Birth" value={profile?.dateOfBirth} />
                <Info label="Gender" value={profile?.gender} />
                <Info label="Address" value={profile?.address} />
                <Info label="Medications" value={profile?.medications} />
                <Info label="Insurance Details" value={profile?.insuranceDetails} />
                <Info label="Vehicle Number" value={profile?.vehicleNumber} />
              </div>
            </Card>
          )}
        </div>
      </main>
    </PublicLayout>
  );
}

function Info({ label, value }) {
  return (
    <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-950">
      <p className="text-xs font-black uppercase text-slate-500">{label}</p>
      <p className="mt-1 font-bold">{value || 'Not provided'}</p>
    </div>
  );
}
