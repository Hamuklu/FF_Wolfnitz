import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabaseClient';
import { Shield } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // In a real app, use Supabase Auth. 
    // For this prototype, we simulate logic or check the table.
    const { data, error } = await supabase
      .from('users_roles')
      .select('*')
      .eq('email', email)
      .single();

    if (data) {
      localStorage.setItem('ff_user', JSON.stringify(data));
      router.push('/');
    } else {
      alert('Benutzer nicht gefunden. Bitte Admin kontaktieren.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-fire-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-md w-full">
        <div className="bg-fire-700 p-8 text-white text-center">
          <div className="bg-white text-fire-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield size={32} />
          </div>
          <h1 className="text-2xl font-bold">FF Wölfnitz</h1>
          <p className="text-fire-200">Tür-zu-Tür Sammelaktion</p>
        </div>
        <form onSubmit={handleLogin} className="p-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">E-Mail Adresse</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="name@ff-woelfnitz.at"
              className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-fire-500 outline-none"
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-fire-700 text-white font-bold py-3 rounded-lg hover:bg-fire-800 transition-colors disabled:opacity-50"
          >
            {loading ? 'Laden...' : 'Anmelden'}
          </button>
          <div className="text-center text-xs text-gray-400">
            Nur für autorisierte Mitglieder der FF Wölfnitz.
          </div>
        </form>
      </div>
    </div>
  );
}
