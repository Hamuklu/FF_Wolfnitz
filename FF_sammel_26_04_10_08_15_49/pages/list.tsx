import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase, Address, Visit, UserRole } from '../lib/supabaseClient';
import Ribbon from '../components/Ribbon';
import { Search } from 'lucide-react';

export default function ListView() {
  const [user, setUser] = useState<UserRole | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [visits, setVisits] = useState<Record<number, Visit>>({});
  const [search, setSearch] = useState('');
  const router = useRouter();

  useEffect(() => {
    const loggedInUser = localStorage.getItem('ff_user');
    if (!loggedInUser) { router.push('/login'); return; }
    const u = JSON.parse(loggedInUser);
    setUser(u);
    fetchData(u);
  }, []);

  const fetchData = async (currentUser: UserRole) => {
    let addrQuery = supabase.from('adress').select('*');
    if (!currentUser.is_admin && currentUser.district_id) {
       const { data: distData } = await supabase.from('districts').select('street_name').eq('id', currentUser.district_id);
       const streets = distData?.map(d => d.street_name) || [];
       addrQuery = addrQuery.in('addr_street', streets);
    }
    const { data: addrData } = await addrQuery;
    const { data: visitData } = await supabase.from('visits').select('*');
    if (addrData) setAddresses(addrData);
    const visitMap: Record<number, Visit> = {};
    visitData?.forEach(v => { visitMap[v.osm_id] = v; });
    setVisits(visitMap);
  };

  const filtered = addresses.filter(a => 
    a.addr_street.toLowerCase().includes(search.toLowerCase()) || 
    a.addr_housenumber.includes(search)
  );

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Ribbon user={user} stats={{ total: 0, completed: 0, sales: 0, donations: 0 }} />
      <div className="max-w-7xl mx-auto p-4">
        <div className="mb-6 relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Nach Straße oder Hausnummer suchen..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border outline-none focus:ring-2 focus:ring-fire-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
          <table className="w-full text-left">
            <thead className="bg-gray-100 text-gray-600 text-sm uppercase">
              <tr>
                <th className="px-6 py-4">Adresse</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Verkauf (€)</th>
                <th className="px-6 py-4">Spende (€)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(addr => {
                const v = visits[addr.osm_id];
                return (
                  <tr key={addr.osm_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">{addr.addr_street} {addr.addr_housenumber}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        v?.status === 'visited_sale' ? 'bg-green-100 text-green-700' :
                        v?.status === 'no_interest' ? 'bg-red-100 text-red-700' :
                        v?.status === 'not_home' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-500'
                      }`}>
                        {v?.status || 'Offen'}
                      </span>
                    </td>
                    <td className="px-6 py-4">€{v?.sale_euro?.toFixed(2) || '0.00'}</td>
                    <td className="px-6 py-4">€{v?.donation_euro?.toFixed(2) || '0.00'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
