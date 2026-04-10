import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase, UserRole } from '../../lib/supabaseClient';
import Ribbon from '../../components/Ribbon';
import { UserPlus, Trash2 } from 'lucide-react';

export default function AdminUsers() {
  const [users, setUsers] = useState<UserRole[]>([]);
  const [districts, setDistricts] = useState<{id: number, street_name: string}[]>([]);
  const [newUser, setNewUser] = useState({ email: '', display_name: '', is_admin: false, district_id: '' });
  const router = useRouter();

  useEffect(() => {
    const fetchAll = async () => {
      const { data: u } = await supabase.from('users_roles').select('*');
      const { data: d } = await supabase.from('districts').select('*');
      if (u) setUsers(u);
      if (d) setDistricts(d);
    };
    fetchAll();
  }, []);

  const addUser = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('users_roles').insert([
      { ...newUser, district_id: newUser.district_id ? parseInt(newUser.district_id) : null }
    ]);
    if (!error) window.location.reload();
  };

  const deleteUser = async (id: number) => {
    if (confirm("Sammler löschen?")) {
      await supabase.from('users_roles').delete().eq('id', id);
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Ribbon user={{is_admin: true} as any} stats={{total:0, completed:0, sales:0, donations:0}} />
      <div className="max-w-4xl mx-auto p-4">
        <h2 className="text-2xl font-bold my-6">Sammler verwalten</h2>
        
        <form onSubmit={addUser} className="bg-white p-6 rounded-xl shadow-sm border mb-8 flex gap-4 flex-wrap items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-bold mb-1">E-Mail</label>
            <input type="email" required className="w-full border p-2 rounded" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} />
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-bold mb-1">Name</label>
            <input type="text" required className="w-full border p-2 rounded" value={newUser.display_name} onChange={e => setNewUser({...newUser, display_name: e.target.value})} />
          </div>
          <div>
            <label className="block text-xs font-bold mb-1">Gebiet</label>
            <select className="border p-2 rounded" value={newUser.district_id} onChange={e => setNewUser({...newUser, district_id: e.target.value})}>
              <option value="">Keines</option>
              {districts.map(d => <option key={d.id} value={d.id}>{d.street_name}</option>)}
            </select>
          </div>
          <button type="submit" className="bg-fire-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2">
            <UserPlus size={18} /> Anlegen
          </button>
        </form>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden border">
          <table className="w-full text-left">
            <thead className="bg-gray-100 uppercase text-xs">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">E-Mail</th>
                <th className="p-4">Typ</th>
                <th className="p-4">Aktion</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {users.map((u: any) => (
                <tr key={u.id}>
                  <td className="p-4">{u.display_name}</td>
                  <td className="p-4 text-gray-500">{u.email}</td>
                  <td className="p-4">{u.is_admin ? 'Admin' : 'Sammler'}</td>
                  <td className="p-4">
                    <button onClick={() => deleteUser(u.id)} className="text-red-500"><Trash2 size={18} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
