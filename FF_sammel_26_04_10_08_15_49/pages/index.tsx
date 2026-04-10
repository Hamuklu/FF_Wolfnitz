import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { supabase, Address, Visit, UserRole } from '../lib/supabaseClient';
import Ribbon from '../components/Ribbon';

// Dynamic import for Leaflet (client-side only)
const MapComponent = dynamic(() => import('../components/MapComponent'), { 
  ssr: false,
  loading: () => <div className="h-full w-full bg-gray-100 flex items-center justify-center text-gray-400">Karte wird geladen...</div>
});

export default function Home() {
  const [user, setUser] = useState<UserRole | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [visits, setVisits] = useState<Record<number, Visit>>({});
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loggedInUser = localStorage.getItem('ff_user');
    if (!loggedInUser) {
      router.push('/login');
      return;
    }
    setUser(JSON.parse(loggedInUser));
    fetchData(JSON.parse(loggedInUser));
  }, []);

  const fetchData = async (currentUser: UserRole) => {
    setLoading(true);
    
    // 1. Get districts assigned to this user
    let addrQuery = supabase.from('adress').select('*');
    
    if (!currentUser.is_admin && currentUser.district_id) {
      // Get the street names for this district
      const { data: distData } = await supabase
        .from('districts')
        .select('street_name')
        .eq('id', currentUser.district_id);
      
      const streets = distData?.map(d => d.street_name) || [];
      addrQuery = addrQuery.in('addr_street', streets);
    }

    const { data: addrData } = await addrQuery;
    const { data: visitData } = await supabase.from('visits').select('*');

    if (addrData) setAddresses(addrData);
    
    const visitMap: Record<number, Visit> = {};
    visitData?.forEach(v => {
      visitMap[v.osm_id] = v;
    });
    setVisits(visitMap);
    setLoading(false);
  };

  if (!user || loading) return <div className="p-8 text-center">Laden...</div>;

  const stats = {
    total: addresses.length,
    completed: addresses.filter(a => visits[a.osm_id]?.status && visits[a.osm_id].status !== 'not_visited').length,
    sales: Object.values(visits).reduce((acc, v) => acc + (v.sale_euro || 0), 0),
    donations: Object.values(visits).reduce((acc, v) => acc + (v.donation_euro || 0), 0)
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Ribbon user={user} stats={stats} />
      <main className="flex-1 relative">
        <MapComponent 
          addresses={addresses} 
          visits={visits} 
          collectorId={user.email} 
          onVisitUpdate={() => fetchData(user)} 
        />
      </main>
    </div>
  );
}
