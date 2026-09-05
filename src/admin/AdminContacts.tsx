import { useState, useEffect } from 'react';
import { supabase, type Contact } from '../lib/supabase';
import { Search, X, Mail, MailOpen } from 'lucide-react';

export default function AdminContacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterRead, setFilterRead] = useState<'all' | 'unread' | 'read'>('all');
  const [selected, setSelected] = useState<Contact | null>(null);

  useEffect(() => {
    loadContacts();
  }, []);

  async function loadContacts() {
    const { data } = await supabase.from('contacts').select('*').order('created_at', { ascending: false });
    if (data) setContacts(data);
    setLoading(false);
  }

  async function markAsRead(id: string) {
    await supabase.from('contacts').update({ is_read: true }).eq('id', id);
    setContacts((prev) => prev.map((c) => c.id === id ? { ...c, is_read: true } : c));
    if (selected?.id === id) setSelected((s) => s ? { ...s, is_read: true } : null);
  }

  async function openContact(contact: Contact) {
    setSelected(contact);
    if (!contact.is_read) markAsRead(contact.id);
  }

  const filtered = contacts.filter((c) => {
    const matchRead = filterRead === 'all' || (filterRead === 'read' ? c.is_read : !c.is_read);
    const matchSearch = !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase()) || (c.subject ?? '').toLowerCase().includes(search.toLowerCase());
    return matchRead && matchSearch;
  });

  const unreadCount = contacts.filter((c) => !c.is_read).length;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-heading font-bold text-gray-900">Contact Messages</h2>
        <p className="text-gray-500 text-sm mt-1">
          Messages from the Contact Us form.
          {unreadCount > 0 && <span className="ml-2 inline-flex items-center gap-1 bg-primary-700 text-white text-xs px-2 py-0.5 rounded-full"><Mail size={11} /> {unreadCount} unread</span>}
        </p>
      </div>

      <div className="flex gap-4 mb-5">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, email, or subject..." className="input-field pl-9 text-sm" />
        </div>
        <div className="flex gap-2">
          {(['all', 'unread', 'read'] as const).map((f) => (
            <button key={f}
              onClick={() => setFilterRead(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${filterRead === f ? 'bg-primary-700 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-gray-400">No messages found.</div>
        ) : (
          <div className="divide-y divide-gray-50">
            {filtered.map((c) => (
              <div key={c.id}
                className={`flex items-start gap-4 p-5 hover:bg-gray-50 cursor-pointer transition-colors ${!c.is_read ? 'bg-blue-50/50' : ''}`}
                onClick={() => openContact(c)}>
                <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${!c.is_read ? 'bg-primary-700 text-white' : 'bg-gray-100 text-gray-500'}`}>
                  {!c.is_read ? <Mail size={16} /> : <MailOpen size={16} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className={`text-sm font-medium ${!c.is_read ? 'text-gray-900' : 'text-gray-600'}`}>{c.name}</span>
                    <span className="text-xs text-gray-400 flex-shrink-0">{new Date(c.created_at).toLocaleDateString('en-IN')}</span>
                  </div>
                  <div className={`text-xs mb-1 ${!c.is_read ? 'font-semibold text-primary-700' : 'text-gray-500'}`}>{c.subject || '(No subject)'}</div>
                  <p className="text-xs text-gray-500 line-clamp-1">{c.message}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <h3 className="font-heading font-bold text-lg text-gray-900">{selected.subject || '(No subject)'}</h3>
                <p className="text-sm text-gray-500">From: {selected.name}</p>
              </div>
              <button onClick={() => setSelected(null)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {[
                  ['Name', selected.name], ['Email', selected.email],
                  ['Phone', selected.phone ?? '-'], ['Date', new Date(selected.created_at).toLocaleString('en-IN')],
                ].map(([label, value]) => (
                  <div key={label} className="bg-gray-50 rounded-lg p-3">
                    <div className="text-xs text-gray-500 mb-0.5">{label}</div>
                    <div className="text-sm font-medium text-gray-800">{value}</div>
                  </div>
                ))}
              </div>
              <div>
                <h4 className="text-xs font-semibold text-primary-700 uppercase tracking-widest mb-2">Message</h4>
                <p className="text-sm text-gray-700 bg-gray-50 rounded-xl p-4 leading-relaxed whitespace-pre-wrap">{selected.message}</p>
              </div>
              <a href={`mailto:${selected.email}?subject=Re: ${selected.subject ?? 'Your query'}`}
                className="btn-primary w-full text-center text-sm block">
                Reply via Email
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
