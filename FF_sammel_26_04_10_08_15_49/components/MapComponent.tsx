import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-defaulticon-compatibility';
import { Address, Visit, supabase } from '../lib/supabaseClient';

// Helper component to center map
function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  map.setView(center);
  return null;
}

interface MapProps {
  addresses: Address[];
  visits: Record<number, Visit>;
  collectorId: string;
  onVisitUpdate: () => void;
}

export default function MapComponent({ addresses, visits, collectorId, onVisitUpdate }: MapProps) {
  const center: [number, number] = addresses.length > 0 
    ? [addresses[0].latitude, addresses[0].longitude] 
    : [46.65, 14.3];

  const getMarkerIcon = (status?: string) => {
    let color = '#9ca3af'; // Grey
    if (status === 'visited_sale') color = '#22c55e'; // Green
    if (status === 'not_home') color = '#eab308'; // Yellow
    if (status === 'no_interest') color = '#dc2626'; // Red

    const html = `
      <div style="
        background-color: ${color};
        width: 16px;
        height: 16px;
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 0 5px rgba(0,0,0,0.3);
      "></div>
    `;

    return L.divIcon({
      className: 'custom-div-icon',
      html: html,
      iconSize: [16, 16],
      iconAnchor: [8, 8]
    });
  };

  const updateVisit = async (osm_id: number, status: string, sale: number, donation: number) => {
    const { error } = await supabase
      .from('visits')
      .upsert({
        osm_id,
        status,
        sale_euro: sale,
        donation_euro: donation,
        collector_id: collectorId
      }, { onConflict: 'osm_id' });

    if (!error) onVisitUpdate();
  };

  return (
    <MapContainer center={center} zoom={16} scrollWheelZoom={true} className="h-full w-full">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {addresses.map((addr) => {
        const visit = visits[addr.osm_id];
        return (
          <Marker 
            key={addr.osm_id} 
            position={[addr.latitude, addr.longitude]} 
            icon={getMarkerIcon(visit?.status)}
          >
            <Popup className="fire-popup">
              <div className="p-2 min-w-[200px]">
                <h3 className="font-bold text-fire-800 border-b pb-1 mb-2">
                  {addr.addr_street} {addr.addr_housenumber}
                </h3>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Status</label>
                    <select 
                      defaultValue={visit?.status || 'not_visited'}
                      onChange={(e) => updateVisit(addr.osm_id, e.target.value, visit?.sale_euro || 0, visit?.donation_euro || 0)}
                      className="w-full text-sm p-1 border rounded"
                    >
                      <option value="not_visited">Nicht besucht (Grau)</option>
                      <option value="visited_sale">Gekauft (Grün)</option>
                      <option value="not_home">Nicht angetroffen (Gelb)</option>
                      <option value="no_interest">Kein Interesse (Rot)</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Verkauf (€)</label>
                      <input 
                        type="number" 
                        step="0.01"
                        defaultValue={visit?.sale_euro || 0}
                        onBlur={(e) => updateVisit(addr.osm_id, visit?.status || 'not_visited', parseFloat(e.target.value) || 0, visit?.donation_euro || 0)}
                        className="w-full text-sm p-1 border rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Spende (€)</label>
                      <input 
                        type="number" 
                        step="0.01"
                        defaultValue={visit?.donation_euro || 0}
                        onBlur={(e) => updateVisit(addr.osm_id, visit?.status || 'not_visited', visit?.sale_euro || 0, parseFloat(e.target.value) || 0)}
                        className="w-full text-sm p-1 border rounded"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
