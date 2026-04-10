import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://orarhdbyavikmmxflesi.supabase.co";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_Zq3rXnzygrFM17VW3qF_Cg_uX6cTm-0";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export type Address = {
  osm_id: number;
  addr_housenumber: string;
  addr_street: string;
  longitude: number;
  latitude: number;
};

export type Visit = {
  id?: number;
  osm_id: number;
  status: 'not_visited' | 'visited_sale' | 'no_interest' | 'not_home';
  sale_euro: number;
  donation_euro: number;
  collector_id: string;
  created_at?: string;
};

export type UserRole = {
  email: string;
  is_admin: boolean;
  display_name: string;
  district_id: number | null;
};
