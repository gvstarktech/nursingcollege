import { createClient } from '@supabase/supabase-js';

export interface Admission {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  dob: string | null;
  gender: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
  course_applied: string;
  qualification: string | null;
  percentage: string | null;
  board: string | null;
  aadhar: string | null;
  category: string | null;
  message: string | null;
  status: string;
  created_at: string;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  image_url: string | null;
  category: string | null;
  author: string;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface PageContent {
  id: string;
  page: string;
  section: string;
  title: string | null;
  subtitle: string | null;
  content: string | null;
  extra_data: Record<string, unknown> | null;
  updated_at: string;
}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
