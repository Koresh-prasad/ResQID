import { useState } from 'react';
import { Bell, Globe2, Image, Moon } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout.jsx';
import { Alert, Button, Card, Field, Select } from '../components/ui.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function SettingsPage() {
  const { darkMode, setDarkMode, user } = useAuth();
  const [language, setLanguage] = useState(user?.settings?.language || 'en');
  const [notifications, setNotifications] = useState(user?.settings?.notifications ?? true);
  const [profilePicture, setProfilePicture] = useState('');
  const [message, setMessage] = useState('');

  return (
    <DashboardLayout title="Settings" subtitle="Personalize your ResQID experience">
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <div className="flex items-center gap-3">
            <Moon className="text-primary" />
            <h2 className="text-xl font-black">Appearance</h2>
          </div>
          <label className="mt-5 flex items-center justify-between rounded-lg bg-slate-50 p-4 font-bold dark:bg-slate-950">
            Dark Mode
            <input type="checkbox" checked={darkMode} onChange={(event) => setDarkMode(event.target.checked)} className="h-5 w-5" />
          </label>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <Globe2 className="text-primary" />
            <h2 className="text-xl font-black">Multilingual Support</h2>
          </div>
          <Select className="mt-5" label="Language" value={language} onChange={(event) => setLanguage(event.target.value)}>
            <option value="en">English</option>
            <option value="hi">Hindi</option>
            <option value="bn">Bengali</option>
            <option value="ta">Tamil</option>
          </Select>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <Bell className="text-primary" />
            <h2 className="text-xl font-black">Notifications</h2>
          </div>
          <label className="mt-5 flex items-center justify-between rounded-lg bg-slate-50 p-4 font-bold dark:bg-slate-950">
            Emergency notifications
            <input type="checkbox" checked={notifications} onChange={(event) => setNotifications(event.target.checked)} className="h-5 w-5" />
          </label>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <Image className="text-primary" />
            <h2 className="text-xl font-black">Profile Picture</h2>
          </div>
          <Field className="mt-5" label="Image URL" value={profilePicture} onChange={(event) => setProfilePicture(event.target.value)} />
        </Card>
      </div>
      {message && <div className="mt-5"><Alert>{message}</Alert></div>}
      <Button className="mt-5" onClick={() => setMessage('Settings saved locally for this demo. Backend persistence hook is ready to extend.')}>Save Settings</Button>
    </DashboardLayout>
  );
}
