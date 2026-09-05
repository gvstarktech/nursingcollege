import { useState } from 'react';
import { Eye, EyeOff, Lock, User, AlertCircle, ShieldCheck, UserCheck, Search, CheckCircle2, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';

export type UserRole = 'admin' | 'admissions' | 'seo';

export interface AdminUserSession {
  user: {
    email: string;
    id: string;
    role: UserRole;
    roleLabel: string;
  };
}

interface AdminLoginProps {
  onLogin: () => void;
}

interface RoleOption {
  role: UserRole;
  label: string;
  desc: string;
  icon: React.ElementType;
  color: string;
  activeBorder: string;
  activeBg: string;
  badge: string;
}

const ROLES: RoleOption[] = [
  {
    role: 'admin',
    label: 'Super Admin',
    desc: 'Full administrative access',
    icon: ShieldCheck,
    color: 'text-purple-600',
    activeBorder: 'border-purple-600 ring-2 ring-purple-500/20',
    activeBg: 'bg-purple-50/50',
    badge: 'bg-purple-100 text-purple-700'
  },
  {
    role: 'admissions',
    label: 'Admission Team',
    desc: 'Admissions & inquiries',
    icon: UserCheck,
    color: 'text-emerald-600',
    activeBorder: 'border-emerald-600 ring-2 ring-emerald-500/20',
    activeBg: 'bg-emerald-50/50',
    badge: 'bg-emerald-100 text-emerald-700'
  },
  {
    role: 'seo',
    label: 'SEO Panel',
    desc: 'Rankings & content manager',
    icon: Search,
    color: 'text-blue-600',
    activeBorder: 'border-blue-600 ring-2 ring-blue-500/20',
    activeBg: 'bg-blue-50/50',
    badge: 'bg-blue-100 text-blue-700'
  }
];

async function sha256Salted(input: string): Promise<string> {
  try {
    const enc = new TextEncoder();
    const data = enc.encode('mahs_salt_v2_' + input);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch {
    return '';
  }
}

const ADMIN_HASHES = [
  'd49249059c7b3a8418b84faec5a1d13ac50f38775eaca1498b4de5fd078b02cd',
  'a564805c7299955b658463a8b3d1c98ecb853811fc8a879f4b1477fa4ade5fab'
];
const ADMISSION_HASHES = [
  '51d7c00b1f8a5c07f41ed88c86dc02fade8c79f0e566ffffdd168d652422663b',
  '124fee9833d6f8cfacff576ab78246f8e80e648189cdfb3455f4674192ccd9f5'
];
const SEO_HASHES = [
  '03ce41b8dc88ae532f5722cf8507dfdbcf65e925802dea2f78980adf68229e46',
  '2057b5e4b433c281bf3ae6ea8f6106ec65dcdb80fad725d87ffa7ce5dc8ac248'
];

export default function AdminLogin({ onLogin }: AdminLoginProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole>('admin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const activeRoleData = ROLES.find(r => r.role === selectedRole) || ROLES[0];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    // 1. Primary: Authenticate via Supabase Auth
    try {
      const { data, error: err } = await supabase.auth.signInWithPassword({
        email: cleanEmail.includes('@') ? cleanEmail : `${cleanEmail}@mahs.com`,
        password: cleanPassword
      });

      if (!err && data?.user) {
        const customRole: UserRole = cleanEmail.includes('admission') ? 'admissions' : cleanEmail.includes('seo') ? 'seo' : 'admin';
        const sessionPayload: AdminUserSession = {
          user: {
            email: data.user.email ?? cleanEmail,
            id: data.user.id,
            role: customRole,
            roleLabel: customRole === 'admin' ? 'Super Administrator' : customRole === 'admissions' ? 'Admission Team' : 'SEO & Marketing Panel'
          }
        };
        localStorage.setItem('mahs-admin-session', JSON.stringify(sessionPayload));
        setLoading(false);
        onLogin();
        window.location.reload();
        return;
      }
    } catch {
      // Continue to role hash verification
    }

    // 2. Cryptographic Role Passcode Verification
    const passwordHash = await sha256Salted(cleanPassword);

    if (
      (cleanEmail === 'admin@mahs.com' || cleanEmail === 'admin@mahs' || cleanEmail === 'admin') &&
      ADMIN_HASHES.includes(passwordHash)
    ) {
      const mockSession: AdminUserSession = {
        user: {
          email: cleanEmail.includes('@') ? cleanEmail : 'admin@mahs.com',
          id: 'admin-super-id',
          role: 'admin',
          roleLabel: 'Super Administrator'
        }
      };
      localStorage.setItem('mahs-admin-session', JSON.stringify(mockSession));
      setLoading(false);
      onLogin();
      window.location.reload();
      return;
    }

    if (
      (cleanEmail === 'admission@mahs.com' || cleanEmail === 'admissions@mahs.com' || cleanEmail === 'admission' || cleanEmail === 'admissions') &&
      ADMISSION_HASHES.includes(passwordHash)
    ) {
      const mockSession: AdminUserSession = {
        user: {
          email: cleanEmail.includes('@') ? cleanEmail : 'admission@mahs.com',
          id: 'admissions-team-id',
          role: 'admissions',
          roleLabel: 'Admission Team'
        }
      };
      localStorage.setItem('mahs-admin-session', JSON.stringify(mockSession));
      setLoading(false);
      onLogin();
      window.location.reload();
      return;
    }

    if (
      (cleanEmail === 'seo@mahs.com' || cleanEmail === 'marketing@mahs.com' || cleanEmail === 'seo' || cleanEmail === 'marketing') &&
      SEO_HASHES.includes(passwordHash)
    ) {
      const mockSession: AdminUserSession = {
        user: {
          email: cleanEmail.includes('@') ? cleanEmail : 'seo@mahs.com',
          id: 'seo-panel-id',
          role: 'seo',
          roleLabel: 'SEO & Marketing Panel'
        }
      };
      localStorage.setItem('mahs-admin-session', JSON.stringify(mockSession));
      setLoading(false);
      onLogin();
      window.location.reload();
      return;
    }

    setLoading(false);
    setError('Invalid credentials for this role. Please verify username and password.');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-950 via-primary-900 to-primary-950 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white mb-4 shadow-2xl p-2">
            <img src="/mahalakshmi_nursing_logo.png" alt="Logo" className="w-16 h-16 object-contain" />
          </div>
          <h1 className="text-2xl md:text-3xl font-heading font-black text-white mb-1">
            Admin Portal Sign In
          </h1>
          <p className="text-primary-200 text-sm">Mahalakshmi College of Nursing</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 border border-gray-100">
          {/* Role Selection */}
          <div className="mb-6">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2.5">
              Select Role
            </label>
            <div className="grid grid-cols-3 gap-2">
              {ROLES.map((item) => {
                const Icon = item.icon;
                const isSelected = selectedRole === item.role;
                return (
                  <button
                    key={item.role}
                    type="button"
                    onClick={() => {
                      setSelectedRole(item.role);
                      setError('');
                    }}
                    className={`p-3 rounded-xl border text-left transition-all relative ${
                      isSelected
                        ? `${item.activeBorder} ${item.activeBg} shadow-sm`
                        : 'border-gray-200 bg-gray-50/50 hover:bg-gray-100/70 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <Icon size={16} className={isSelected ? item.color : 'text-gray-500'} />
                      <span className={`font-bold text-xs ${isSelected ? 'text-gray-900' : 'text-gray-700'}`}>
                        {item.label}
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-500 line-clamp-1">
                      {item.desc}
                    </p>
                    {isSelected && (
                      <CheckCircle2 size={13} className={`absolute top-2 right-2 ${item.color}`} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Role Indicator */}
          <div className="flex items-center justify-between py-2 px-3 mb-5 rounded-lg bg-gray-50 border border-gray-100 text-xs">
            <span className="text-gray-600 font-medium">Signing in as:</span>
            <span className={`font-bold px-2 py-0.5 rounded-md ${activeRoleData.badge}`}>
              {activeRoleData.label}
            </span>
          </div>

          {error && (
            <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl p-3.5 mb-5 text-xs font-medium">
              <AlertCircle size={16} className="flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username / Email */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Username / Email
              </label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  autoCapitalize="none"
                  autoCorrect="off"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="input-field pl-9 text-sm w-full"
                  placeholder="Enter username or email"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="input-field pl-9 pr-10 text-sm w-full"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3.5 mt-4 text-sm font-bold shadow-md hover:shadow-lg transition-all"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In as {activeRoleData.label}</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-primary-300 text-xs mt-5">
          🔒 End-to-End Role Based Access Control • Mahalakshmi Group
        </p>
      </div>
    </div>
  );
}
