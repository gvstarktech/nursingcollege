import { useState, useEffect } from 'react';
import { supabase, type Admission } from '../lib/supabase';
import { Search, Eye, X } from 'lucide-react';

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  reviewed: 'bg-blue-100 text-blue-700',
  accepted: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
};

export default function AdminAdmissions() {
  const [admissions, setAdmissions] = useState<Admission[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selected, setSelected] = useState<Admission | null>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadAdmissions();
  }, []);

  async function loadAdmissions() {
    const { data } = await supabase.from('admissions').select('*').order('created_at', { ascending: false });
    if (data) setAdmissions(data);
    setLoading(false);
  }

  async function updateStatus(id: string, status: string) {
    setUpdating(true);
    await supabase.from('admissions').update({ status }).eq('id', id);
    setAdmissions((prev) => prev.map((a) => a.id === id ? { ...a, status } : a));
    if (selected?.id === id) setSelected((s) => s ? { ...s, status } : null);
    setUpdating(false);
  }

  const filtered = admissions.filter((a) => {
    const matchStatus = filterStatus === 'all' || a.status === filterStatus;
    const matchSearch = !search ||
      a.full_name.toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase()) ||
      a.course_applied.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const counts = {
    all: admissions.length,
    pending: admissions.filter((a) => a.status === 'pending').length,
    reviewed: admissions.filter((a) => a.status === 'reviewed').length,
    accepted: admissions.filter((a) => a.status === 'accepted').length,
    rejected: admissions.filter((a) => a.status === 'rejected').length,
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-heading font-bold text-gray-900">Admission Applications</h2>
        <p className="text-gray-500 text-sm mt-1">Manage and review student admission applications.</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {(['all', 'pending', 'reviewed', 'accepted', 'rejected'] as const).map((s) => (
          <button key={s}
            onClick={() => setFilterStatus(s)}
            className={`p-4 rounded-xl border-2 transition-all text-left ${filterStatus === s ? 'border-primary-700 bg-primary-50' : 'border-gray-100 bg-white hover:border-gray-200'}`}>
            <div className={`text-2xl font-heading font-bold ${filterStatus === s ? 'text-primary-700' : 'text-gray-900'}`}>{counts[s]}</div>
            <div className="text-xs capitalize text-gray-500 mt-0.5">{s}</div>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="flex gap-4 mb-5">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, email, or course..." className="input-field pl-9 text-sm" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-gray-400">No applications found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['Applicant', 'Course', 'Phone', 'Applied On', 'Status', 'Action'].map((h) => (
                    <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((a) => (
                  <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="font-medium text-gray-900 text-sm">{a.full_name}</div>
                      <div className="text-xs text-gray-500">{a.email}</div>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-700">{a.course_applied}</td>
                    <td className="px-5 py-4 text-sm text-gray-600">{a.phone}</td>
                    <td className="px-5 py-4 text-sm text-gray-500">{new Date(a.created_at).toLocaleDateString('en-IN')}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusColors[a.status]}`}>
                        {a.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <button onClick={() => setSelected(a)} className="flex items-center gap-1 text-primary-700 hover:text-green-600 text-sm font-medium transition-colors">
                        <Eye size={14} /> View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <h3 className="font-heading font-bold text-lg text-gray-900">{selected.full_name}</h3>
                <p className="text-sm text-gray-500">{selected.course_applied}</p>
              </div>
              <div className="flex items-center gap-3">
                <select value={selected.status} onChange={(e) => updateStatus(selected.id, e.target.value)} disabled={updating}
                  className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-700">
                  {['pending', 'reviewed', 'accepted', 'rejected'].map((s) => (
                    <option key={s} value={s} className="capitalize">{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                  ))}
                </select>
                <button onClick={() => setSelected(null)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500">
                  <X size={18} />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              {[
                {
                  title: 'Personal Details', fields: [
                    ['Email', selected.email], ['Phone', selected.phone],
                    ['Date of Birth', selected.dob], ['Gender', selected.gender],
                    ['Category', selected.category], ['Aadhar', selected.aadhar],
                  ],
                },
                {
                  title: 'Address', fields: [
                    ['Address', selected.address], ['City', selected.city],
                    ['State', selected.state], ['PIN', selected.pincode],
                  ],
                },
                {
                  title: 'Academic Details', fields: [
                    ['Course', selected.course_applied], ['Qualification', selected.qualification],
                    ['Percentage', selected.percentage], ['Board', selected.board],
                  ],
                },
              ].map((section) => (
                <div key={section.title}>
                  <h4 className="text-xs font-semibold text-primary-700 uppercase tracking-widest mb-3">{section.title}</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {section.fields.filter(([, v]) => v).map(([label, value]) => (
                      <div key={label as string} className="bg-gray-50 rounded-lg p-3">
                        <div className="text-xs text-gray-500 mb-0.5">{label}</div>
                        <div className="text-sm font-medium text-gray-800">{value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              {selected.message && (
                <div>
                  <h4 className="text-xs font-semibold text-primary-700 uppercase tracking-widest mb-2">Additional Message</h4>
                  <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">{selected.message}</p>
                </div>
              )}
              <div className="text-xs text-gray-400">Submitted on: {new Date(selected.created_at).toLocaleString('en-IN')}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
