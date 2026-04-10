import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase, UserRole } from '../../lib/supabaseClient';
import Ribbon from '../../components/Ribbon';
import { Users, Map, BarChart2, RefreshCw, Trash2, Plus } from 'lucide-react';

export default function AdminDashboard() {
  const [user, setUser] = useState<UserRole | null>(null);
  const [summary, setSummary] = useState({ sales: 0, donations: 0, collectors: 0 });
  const router = useRouter();

  useEffect(() => {
    const loggedInUser = localStorage.getItem('ff_user');
    if (!loggedInUser) return;
    const u = JSON.parse(loggedInUser);
    if (!u.is_admin) { router.push('/'); return; }
    setUser(u);
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const { data: visits } = await supabase.from('visits').select('sale_euro, donation_euro');
    const { count: collectorCount } = await supabase.from('users_roles').select('*', { count: 'exact', head: true });
    
    if (visits) {
      const sales = visits.reduce((a, b) => a + (b.sale_euro || 0), 0);
      const donations = visits.reduce((a, b) => a + (b.donation_euro || 0), 0);
      setSummary({ sales, donations, collectors: collectorCount || 0 });
    }
  };

  const handleReset = async () => {
    if (confirm("Möchten Sie wirklich alle Besuche zurücksetzen? Die finanziellen Daten werden gelöscht, um eine neue Aktion zu starten!")) {
      const { error } = await supabase.from('visits').delete().neq('id', 0); // Clear table
      if (!error) {
        alert("Aktion erfolgreich zurückgesetzt.");
        fetchStats();
      }
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-100">
      <Ribbon user={user} stats={{ total: 0, completed: 0, sales: summary.sales, donations: summary.donations }} />
      <div className="max-w-7xl mx-auto p-8">
        <h2 className="text-3xl font-bold text-fire-900 mb-8">Admin Dashboard</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-fire-600">
            <div className="text-gray-500 text-sm font-bold uppercase">Gesamt Verkauf</div>
            <div className="text-3xl font-black text-gray-800">€{summary.sales.toFixed(2)}</div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-blue-600">
            <div className="text-gray-500 text-sm font-bold uppercase">Gesamt Spenden</div>
            <div className="text-3xl font-black text-gray-800">€{summary.donations.toFixed(2)}</div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-green-600">
            <div className="text-gray-500 text-sm font-bold uppercase">Sammler Aktiv</div>
            <div className="text-3xl font-black text-gray-800">{summary.collectors}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl shadow-sm border hover:border-fire-500 cursor-pointer transition-all flex items-center gap-4" onClick={() => router.push('/admin/users')}>
            <div className="bg-fire-100 p-3 rounded-lg text-fire-700"><Users /></div>
            <span className="font-bold">Sammler verwalten</span>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border hover:border-fire-500 cursor-pointer transition-all flex items-center gap-4" onClick={() => router.push('/admin/districts')}>
            <div className="bg-fire-100 p-3 rounded-lg text-fire-700"><Map /></div>
            <span className="font-bold">Gebiete definieren</span>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border hover:border-fire-500 cursor-pointer transition-all flex items-center gap-4" onClick={() => router.push('/admin/stats')}>
            <div className="bg-fire-100 p-3 rounded-lg text-fire-700"><BarChart2 /></div>
            <span className="font-bold">Auswertung</span>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border hover:border-yellow-600 cursor-pointer transition-all flex items-center gap-4" onClick={handleReset}>
            <div className="bg-yellow-100 p-3 rounded-lg text-yellow-700"><RefreshCw /></div>
            <span className="font-bold">Aktion zurücksetzen</span>
          </div>
        </div>
      </div>
    </div>
  );
}
