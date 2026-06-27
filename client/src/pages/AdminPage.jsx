import { useEffect, useState } from 'react';
import { ShieldCheck, Users } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout.jsx';
import { Alert, Card } from '../components/ui.jsx';
import { api } from '../services/api.js';

export default function AdminPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/admin/stats').then(({ data }) => setData(data)).catch((err) => setError(err.message));
  }, []);

  return (
    <DashboardLayout title="Admin Dashboard" subtitle="Platform overview for administrator accounts">
      {error && <Alert type="error">{error}</Alert>}
      {data && (
        <>
          <div className="grid gap-5 md:grid-cols-4">
            {Object.entries(data.stats).map(([label, value]) => (
              <Card key={label}>
                <p className="text-sm font-bold capitalize text-slate-500">{label}</p>
                <p className="mt-2 text-3xl font-black">{value}</p>
              </Card>
            ))}
          </div>
          <Card className="mt-6">
            <div className="flex items-center gap-3">
              <Users className="text-primary" />
              <h2 className="text-xl font-black">Users</h2>
            </div>
            <div className="mt-5 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-slate-500">
                  <tr><th className="py-3">Name</th><th>Email</th><th>Mobile</th><th>Role</th></tr>
                </thead>
                <tbody>
                  {data.users.map((user) => (
                    <tr key={user.id} className="border-t border-slate-200 dark:border-slate-800">
                      <td className="py-3 font-bold">{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.mobile}</td>
                      <td><span className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-2 py-1 font-bold text-primary dark:bg-blue-950"><ShieldCheck size={14} /> {user.role}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}
    </DashboardLayout>
  );
}
