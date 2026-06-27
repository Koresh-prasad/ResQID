import { useEffect, useState } from 'react';
import DashboardLayout from '../components/DashboardLayout.jsx';
import { Alert, Button, Card, Field, Select, TextArea } from '../components/ui.jsx';
import { api } from '../services/api.js';

const emptyProfile = {
  contacts: [{ name: '', relationship: '', mobile: '' }, { name: '', relationship: '', mobile: '' }],
  organDonor: false
};

export default function ProfilePage() {
  const [profile, setProfile] = useState(emptyProfile);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/profile').then(({ data }) => {
      setProfile({ ...emptyProfile, ...(data.profile || {}), contacts: data.profile?.contacts?.length ? data.profile.contacts : emptyProfile.contacts });
    });
  }, []);

  const update = (key) => (event) => setProfile((current) => ({ ...current, [key]: event.target.type === 'checkbox' ? event.target.checked : event.target.value }));
  const updateContact = (index, key) => (event) => {
    setProfile((current) => {
      const contacts = [...(current.contacts || emptyProfile.contacts)];
      contacts[index] = { ...contacts[index], [key]: event.target.value };
      return { ...current, contacts };
    });
  };

  const save = async (event) => {
    event.preventDefault();
    setMessage('');
    setError('');
    try {
      const { data } = await api.put('/profile', profile);
      setProfile({ ...emptyProfile, ...data.profile });
      setMessage('Emergency profile saved successfully.');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <DashboardLayout title="My Profile" subtitle="Add the information responders may need">
      <form onSubmit={save} className="space-y-5">
        {message && <Alert>{message}</Alert>}
        {error && <Alert type="error">{error}</Alert>}
        <Card>
          <h2 className="text-xl font-black">Personal Information</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <Field label="Full Name" value={profile.fullName || ''} onChange={update('fullName')} />
            <Field label="Date of Birth" type="date" value={profile.dateOfBirth || ''} onChange={update('dateOfBirth')} />
            <Select label="Gender" value={profile.gender || ''} onChange={update('gender')}>
              <option value="">Select</option><option>Female</option><option>Male</option><option>Non-binary</option><option>Prefer not to say</option>
            </Select>
            <Field label="Blood Group" placeholder="A+, O-, AB+" value={profile.bloodGroup || ''} onChange={update('bloodGroup')} />
            <TextArea className="md:col-span-2" label="Address" value={profile.address || ''} onChange={update('address')} />
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-black">Medical Information</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <TextArea label="Allergies" value={profile.allergies || ''} onChange={update('allergies')} />
            <TextArea label="Existing Diseases" value={profile.diseases || ''} onChange={update('diseases')} />
            <TextArea label="Current Medications" value={profile.medications || ''} onChange={update('medications')} />
            <label className="flex min-h-28 items-center gap-3 rounded-lg border border-slate-200 p-4 font-bold dark:border-slate-700">
              <input type="checkbox" checked={Boolean(profile.organDonor)} onChange={update('organDonor')} className="h-5 w-5" />
              Organ Donor Status
            </label>
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-black">Emergency Contacts</h2>
          <div className="mt-5 grid gap-5 lg:grid-cols-2">
            {[0, 1].map((index) => (
              <div key={index} className="rounded-lg bg-slate-50 p-4 dark:bg-slate-950">
                <h3 className="font-black">Contact Person {index + 1}</h3>
                <div className="mt-4 grid gap-4">
                  <Field label="Name" value={profile.contacts?.[index]?.name || ''} onChange={updateContact(index, 'name')} />
                  <Field label="Relationship" value={profile.contacts?.[index]?.relationship || ''} onChange={updateContact(index, 'relationship')} />
                  <Field label="Mobile Number" value={profile.contacts?.[index]?.mobile || ''} onChange={updateContact(index, 'mobile')} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-black">Optional Details</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <Field label="Insurance Details" value={profile.insuranceDetails || ''} onChange={update('insuranceDetails')} />
            <Field label="Vehicle Number" value={profile.vehicleNumber || ''} onChange={update('vehicleNumber')} />
          </div>
        </Card>

        <Button type="submit" className="w-full sm:w-auto">Save Emergency Profile</Button>
      </form>
    </DashboardLayout>
  );
}
