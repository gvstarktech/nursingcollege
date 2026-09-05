import { useState, useEffect } from 'react';
import { supabase, type Admission, type Contact } from '../lib/supabase';
import { MessageSquare, BookOpen, FileText, TrendingUp, Clock, Settings, ToggleLeft, ToggleRight } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ admissions: 0, pendingAdmissions: 0, contacts: 0, unreadContacts: 0, blogs: 0, publishedBlogs: 0 });
  const [recentAdmissions, setRecentAdmissions] = useState<Admission[]>([]);
  const [recentContacts, setRecentContacts] = useState<Contact[]>([]);
  const [splashEnabled, setSplashEnabled] = useState(true);
  const [savingSplash, setSavingSplash] = useState(false);

  useEffect(() => {
    loadStats();
    loadSettings();
  }, []);

  async function loadSettings() {
    const { data } = await supabase.from('page_content').select('extra_data').eq('page', 'site').eq('section', 'settings').single();
    if (data && data.extra_data?.show_splash === false) {
      setSplashEnabled(false);
    }
  }

  async function toggleSplash() {
    setSavingSplash(true);
    const newValue = !splashEnabled;
    await supabase.from('page_content').upsert({
      page: 'site',
      section: 'settings',
      title: 'Site Settings',
      extra_data: { show_splash: newValue },
      updated_at: new Date().toISOString()
    });
    setSplashEnabled(newValue);
    setSavingSplash(false);
  }

  async function loadStats() {
    const [adm, cnt, blg, pendAdm, unreadCnt, pubBlg, recentAdm, recentCnt] = await Promise.all([
      supabase.from('admissions').select('id', { count: 'exact', head: true }),
      supabase.from('contacts').select('id', { count: 'exact', head: true }),
      supabase.from('blogs').select('id', { count: 'exact', head: true }),
      supabase.from('admissions').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('contacts').select('id', { count: 'exact', head: true }).eq('is_read', false),
      supabase.from('blogs').select('id', { count: 'exact', head: true }).eq('is_published', true),
      supabase.from('admissions').select('*').order('created_at', { ascending: false }).limit(5),
      supabase.from('contacts').select('*').order('created_at', { ascending: false }).limit(5),
    ]);
    setStats({
      admissions: adm.count ?? 0,
      pendingAdmissions: pendAdm.count ?? 0,
      contacts: cnt.count ?? 0,
      unreadContacts: unreadCnt.count ?? 0,
      blogs: blg.count ?? 0,
      publishedBlogs: pubBlg.count ?? 0,
    });
    if (recentAdm.data) setRecentAdmissions(recentAdm.data);
    if (recentCnt.data) setRecentContacts(recentCnt.data);
  }

  const statCards = [
    { label: 'Total Applications', value: stats.admissions, sub: `${stats.pendingAdmissions} pending`, icon: FileText, color: 'bg-blue-500', light: 'bg-blue-50 text-blue-600' },
    { label: 'Contact Messages', value: stats.contacts, sub: `${stats.unreadContacts} unread`, icon: MessageSquare, color: 'bg-green-500', light: 'bg-green-50 text-green-600' },
    { label: 'Blog Posts', value: stats.blogs, sub: `${stats.publishedBlogs} published`, icon: BookOpen, color: 'bg-purple-500', light: 'bg-purple-50 text-purple-600' },
    { label: 'Action Needed', value: stats.pendingAdmissions + stats.unreadContacts, sub: 'Requires attention', icon: TrendingUp, color: 'bg-orange-500', light: 'bg-orange-50 text-orange-600' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-heading font-bold text-gray-900">Dashboard Overview</h2>
        <p className="text-gray-500 text-sm mt-1">Welcome back! Here's what's happening at the college portal.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl ${s.light} flex items-center justify-center`}>
                <s.icon size={22} />
              </div>
            </div>
            <div className="text-3xl font-heading font-bold text-gray-900 mb-1">{s.value}</div>
            <div className="font-medium text-gray-700 text-sm">{s.label}</div>
            <div className="text-xs text-gray-400 mt-1">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Applications */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-50">
            <h3 className="font-heading font-bold text-base text-gray-900 flex items-center gap-2">
              <FileText size={16} className="text-primary-700" /> Recent Applications
            </h3>
            <span className="text-xs text-gray-400">Last 5</span>
          </div>
          <div className="divide-y divide-gray-50">
            {recentAdmissions.length === 0 ? (
              <div className="p-8 text-center text-gray-400 text-sm">No applications yet.</div>
            ) : recentAdmissions.map((a) => (
              <div key={a.id} className="flex items-center justify-between px-6 py-4">
                <div>
                  <div className="text-sm font-medium text-gray-800">{a.full_name}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{a.course_applied}</div>
                </div>
                <div className="text-right">
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${
                    a.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    a.status === 'accepted' ? 'bg-green-100 text-green-700' :
                    a.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                  }`}>{a.status}</span>
                  <div className="text-xs text-gray-400 mt-1 flex items-center justify-end gap-1">
                    <Clock size={10} /> {new Date(a.created_at).toLocaleDateString('en-IN')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Messages */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-50">
            <h3 className="font-heading font-bold text-base text-gray-900 flex items-center gap-2">
              <MessageSquare size={16} className="text-green-600" /> Recent Messages
            </h3>
            <span className="text-xs text-gray-400">Last 5</span>
          </div>
          <div className="divide-y divide-gray-50">
            {recentContacts.length === 0 ? (
              <div className="p-8 text-center text-gray-400 text-sm">No messages yet.</div>
            ) : recentContacts.map((c) => (
              <div key={c.id} className={`flex items-start gap-4 px-6 py-4 ${!c.is_read ? 'bg-blue-50/30' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${!c.is_read ? 'bg-primary-700 text-white' : 'bg-gray-100 text-gray-500'}`}>
                  {c.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-sm font-medium ${!c.is_read ? 'text-gray-900' : 'text-gray-600'}`}>{c.name}</span>
                    <span className="text-xs text-gray-400 flex-shrink-0">{new Date(c.created_at).toLocaleDateString('en-IN')}</span>
                  </div>
                  <p className="text-xs text-gray-500 truncate mt-0.5">{c.subject || c.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Settings */}
      <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="font-heading font-bold text-base text-gray-900 flex items-center gap-2 mb-4 border-b border-gray-50 pb-4">
          <Settings size={16} className="text-primary-700" /> Quick Settings
        </h3>
        <div className="flex items-center justify-between max-w-md bg-gray-50 p-4 rounded-xl border border-gray-100">
          <div>
            <div className="text-sm font-bold text-gray-900">Admissions Popup Loader</div>
            <div className="text-xs text-gray-500 mt-0.5">Show the admission ad screen when visitors land.</div>
          </div>
          <button 
            onClick={toggleSplash} 
            disabled={savingSplash}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${splashEnabled ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}
          >
            {splashEnabled ? <><ToggleRight size={20} /> On</> : <><ToggleLeft size={20} /> Off</>}
          </button>
        </div>
      </div>
    </div>
  );
}
