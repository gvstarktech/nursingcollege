import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import AdminLogin, { type UserRole, type AdminUserSession } from './AdminLogin';
import AdminDashboard from './AdminDashboard';
import AdminAdmissions from './AdminAdmissions';
import AdminContacts from './AdminContacts';
import AdminBlog from './AdminBlog';
import AdminPageContent from './AdminPageContent';
import AdminGalleryEvents from './AdminGalleryEvents';
import AdminAnnouncements from './AdminAnnouncements';
import AdminSEO from './AdminSEO';
import {
  LayoutDashboard, FileText, MessageSquare, BookOpen, Globe,
  LogOut, Menu, X, ChevronRight, Image, Megaphone, Search,
  ShieldCheck, UserCheck, Shield
} from 'lucide-react';
import type { Session } from '@supabase/supabase-js';

type AdminPage = 'dashboard' | 'admissions' | 'announcements' | 'contacts' | 'blog' | 'pages' | 'events' | 'seo';

const navItems: { id: AdminPage; label: string; icon: React.ElementType }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'admissions', label: 'Admission Applications', icon: FileText },
  { id: 'announcements', label: 'Post Info & Notices', icon: Megaphone },
  { id: 'contacts', label: 'Contact Messages', icon: MessageSquare },
  { id: 'blog', label: 'Blog & Articles', icon: BookOpen },
  { id: 'pages', label: 'Page Content', icon: Globe },
  { id: 'seo', label: 'SEO Optimizer', icon: Search },
  { id: 'events', label: 'Gallery & Events', icon: Image },
];

const ROLE_PERMISSIONS: Record<UserRole, {
  label: string;
  badgeBg: string;
  badgeText: string;
  icon: React.ElementType;
  defaultPage: AdminPage;
  allowedPages: AdminPage[];
}> = {
  admin: {
    label: 'Super Admin',
    badgeBg: 'bg-purple-500/20 border-purple-400/30',
    badgeText: 'text-purple-300',
    icon: ShieldCheck,
    defaultPage: 'dashboard',
    allowedPages: ['dashboard', 'admissions', 'announcements', 'contacts', 'blog', 'pages', 'seo', 'events']
  },
  admissions: {
    label: 'Admission Team',
    badgeBg: 'bg-emerald-500/20 border-emerald-400/30',
    badgeText: 'text-emerald-300',
    icon: UserCheck,
    defaultPage: 'admissions',
    allowedPages: ['admissions', 'announcements', 'contacts', 'dashboard']
  },
  seo: {
    label: 'SEO & Marketing',
    badgeBg: 'bg-blue-500/20 border-blue-400/30',
    badgeText: 'text-blue-300',
    icon: Search,
    defaultPage: 'seo',
    allowedPages: ['seo', 'blog', 'announcements', 'pages', 'events']
  }
};

export default function AdminApp() {
  const [session, setSession] = useState<(Session | AdminUserSession) | null>(null);
  const [userRole, setUserRole] = useState<UserRole>('admin');
  const [loading, setLoading] = useState(true);
  const [activePage, setActivePage] = useState<AdminPage>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const localSessStr = localStorage.getItem('mahs-admin-session');
    if (localSessStr) {
      try {
        const parsed = JSON.parse(localSessStr);
        setSession(parsed);
        const detectedRole: UserRole = parsed?.user?.role || (
          parsed?.user?.email?.includes('admission') ? 'admissions' :
          parsed?.user?.email?.includes('seo') || parsed?.user?.email?.includes('marketing') ? 'seo' : 'admin'
        );
        setUserRole(detectedRole);
        const config = ROLE_PERMISSIONS[detectedRole] || ROLE_PERMISSIONS.admin;
        setActivePage(config.defaultPage);
        setLoading(false);
      } catch {
        setLoading(false);
      }
    } else {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          setSession(session);
          const detectedRole: UserRole = (
            session.user.email?.includes('admission') ? 'admissions' :
            session.user.email?.includes('seo') || session.user.email?.includes('marketing') ? 'seo' : 'admin'
          );
          setUserRole(detectedRole);
          const config = ROLE_PERMISSIONS[detectedRole] || ROLE_PERMISSIONS.admin;
          setActivePage(config.defaultPage);
        }
        setLoading(false);
      });
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!localStorage.getItem('mahs-admin-session') && session) {
        setSession(session);
        const detectedRole: UserRole = (
          session.user.email?.includes('admission') ? 'admissions' :
          session.user.email?.includes('seo') || session.user.email?.includes('marketing') ? 'seo' : 'admin'
        );
        setUserRole(detectedRole);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const roleConfig = ROLE_PERMISSIONS[userRole] || ROLE_PERMISSIONS.admin;
  const visibleNavItems = navItems.filter((item) => roleConfig.allowedPages.includes(item.id));

  // Ensure active page is within allowed pages
  useEffect(() => {
    if (!roleConfig.allowedPages.includes(activePage)) {
      setActivePage(roleConfig.defaultPage);
    }
  }, [userRole, roleConfig, activePage]);

  async function handleLogout() {
    localStorage.removeItem('mahs-admin-session');
    await supabase.auth.signOut();
    window.location.reload();
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-10 h-10 border-4 border-primary-700 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) {
    return <AdminLogin onLogin={() => {}} />;
  }

  const ActiveComponent = {
    dashboard: AdminDashboard,
    admissions: AdminAdmissions,
    announcements: AdminAnnouncements,
    contacts: AdminContacts,
    blog: AdminBlog,
    pages: AdminPageContent,
    seo: AdminSEO,
    events: AdminGalleryEvents,
  }[activePage] || AdminDashboard;

  const RoleIcon = roleConfig.icon;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-primary-950 text-white flex flex-col transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:flex-shrink-0 border-r border-primary-900`}>
        {/* Logo */}
        <div className="flex items-center gap-3 p-5 border-b border-white/10">
          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center flex-shrink-0 p-1 shadow-md">
            <img src="/mahalakshmi_nursing_logo.png" alt="Logo" className="w-8 h-8 object-contain" />
          </div>
          <div>
            <div className="text-sm font-heading font-black text-white leading-tight">Admin Console</div>
            <div className="text-[11px] text-green-400 font-semibold leading-tight">Mahalakshmi Nursing</div>
          </div>
        </div>

        {/* Current Active Role Badge */}
        <div className="px-4 pt-4 pb-2">
          <div className={`flex items-center justify-between px-3 py-2 rounded-xl border ${roleConfig.badgeBg}`}>
            <div className="flex items-center gap-2">
              <RoleIcon size={16} className={roleConfig.badgeText} />
              <span className={`text-xs font-bold ${roleConfig.badgeText}`}>{roleConfig.label}</span>
            </div>
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          </div>
        </div>

        {/* Nav */}
        <nav className="p-4 space-y-1.5 flex-1 overflow-y-auto">
          <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 px-3 mb-2">
            Authorized Modules ({visibleNavItems.length})
          </div>
          {visibleNavItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActivePage(item.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activePage === item.id
                  ? 'bg-green-500 text-white shadow-lg shadow-green-500/25 font-bold translate-x-1'
                  : 'text-gray-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <item.icon size={17} />
              <span>{item.label}</span>
              {activePage === item.id && <ChevronRight size={14} className="ml-auto" />}
            </button>
          ))}
        </nav>

        {/* User + Logout */}
        <div className="p-4 border-t border-white/10 mt-auto bg-primary-900/60">
          <div className="flex items-center gap-3 mb-3 px-1">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-green-500 to-emerald-400 flex items-center justify-center text-sm font-bold text-white shadow flex-shrink-0">
              {session.user.email?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="min-w-0">
              <div className="text-xs text-white font-bold truncate">{session.user.email}</div>
              <div className="text-[10px] text-green-300 font-medium">{roleConfig.label}</div>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-red-300 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-xs font-bold transition-colors">
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Sidebar overlay (mobile) */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main content */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 shadow-sm px-6 h-16 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 rounded-xl hover:bg-gray-100 text-gray-700">
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="font-heading font-black text-gray-900 text-lg hidden sm:block">
              {navItems.find((n) => n.id === activePage)?.label}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Active role badge in header */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 border border-gray-200 text-xs font-semibold text-gray-700">
              <Shield size={13} className="text-primary-700" />
              <span>Role: <strong className="text-primary-900">{roleConfig.label}</strong></span>
            </div>

            <a href="/" target="_blank" rel="noopener noreferrer" className="text-xs text-primary-700 hover:text-green-600 bg-primary-50 hover:bg-green-50 px-3.5 py-1.5 rounded-xl border border-primary-100 font-bold flex items-center gap-1.5 transition-all">
              <Globe size={13} /> View Live Website
            </a>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          <ActiveComponent />
        </main>
      </div>
    </div>
  );
}
