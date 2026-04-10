import React from 'react';
import { UserRole } from '../lib/supabaseClient';
import { LogOut, Home, Users, BarChart3, Map as MapIcon, Database } from 'lucide-react';
import Link from 'next/link';

interface RibbonProps {
  user: UserRole;
  stats: {
    total: number;
    completed: number;
    sales: number;
    donations: number;
  };
}

export default function Ribbon({ user, stats }: RibbonProps) {
  const progress = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;

  return (
    <div className="bg-fire-800 text-white shadow-xl">
      <div className="max-w-7xl mx-auto px-4 py-2 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-white p-1 rounded">
             <img src="https://upload.wikimedia.org/wikipedia/commons/3/30/Flag_of_Austria.svg" alt="Logo" className="h-8" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">FF Wölfnitz</h1>
            <p className="text-xs text-fire-200">Spendensammel-Aktion</p>
          </div>
        </div>

        <div className="flex-1 max-w-md w-full px-4">
          <div className="flex justify-between text-xs mb-1">
            <span>Fortschritt: {stats.completed} / {stats.total} Adressen</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-fire-900 rounded-full h-3 border border-fire-700">
            <div className="bg-green-500 h-full rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden lg:flex gap-4 text-sm bg-fire-900/50 p-2 rounded-lg border border-fire-700">
            <div className="flex flex-col">
              <span className="text-fire-300 text-[10px] uppercase font-bold text-center">Verkauf</span>
              <span className="font-mono text-green-400">€{stats.sales.toFixed(2)}</span>
            </div>
            <div className="w-px bg-fire-700"></div>
            <div className="flex flex-col">
              <span className="text-fire-300 text-[10px] uppercase font-bold text-center">Spenden</span>
              <span className="font-mono text-blue-400">€{stats.donations.toFixed(2)}</span>
            </div>
          </div>

          <nav className="flex gap-4">
            <Link href="/" className="hover:text-fire-300 transition-colors" title="Karte"><MapIcon size={20} /></Link>
            <Link href="/list" className="hover:text-fire-300 transition-colors" title="Liste"><Database size={20} /></Link>
            {user.is_admin && (
              <Link href="/admin" className="hover:text-fire-300 transition-colors" title="Admin"><Users size={20} /></Link>
            )}
            <button onClick={() => window.location.href = '/login'} className="text-fire-300 hover:text-white"><LogOut size={20} /></button>
          </nav>
        </div>
      </div>
      
      <div className="bg-fire-900/50 border-t border-fire-700 py-1 hidden sm:block">
        <div className="max-w-7xl mx-auto px-4 flex justify-center gap-8 text-[11px] font-bold tracking-wider uppercase">
          <div className="flex items-center gap-2"><span className="w-3 h-3 bg-gray-400 rounded-full"></span> Offen</div>
          <div className="flex items-center gap-2"><span className="w-3 h-3 bg-green-500 rounded-full"></span> Gekauft</div>
          <div className="flex items-center gap-2"><span className="w-3 h-3 bg-yellow-500 rounded-full"></span> Nicht angetroffen</div>
          <div className="flex items-center gap-2"><span className="w-3 h-3 bg-red-600 rounded-full"></span> Kein Interesse</div>
        </div>
      </div>
    </div>
  );
}
