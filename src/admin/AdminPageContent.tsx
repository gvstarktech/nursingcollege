import { useState, useEffect } from 'react';
import { supabase, type PageContent } from '../lib/supabase';
import { Save, Edit3, ChevronDown } from 'lucide-react';

const pageOptions = [
  { value: 'home', label: 'Home Page' },
  { value: 'about', label: 'About Page' },
  { value: 'courses', label: 'Courses Page' },
  { value: 'campus', label: 'Campus Page' },
  { value: 'fees', label: 'Fee Payment Page' },
  { value: 'contact', label: 'Contact Page' },
];

export default function AdminPageContent() {
  const [selectedPage, setSelectedPage] = useState('home');
  const [sections, setSections] = useState<PageContent[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<PageContent>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState<string | null>(null);

  useEffect(() => {
    loadSections(selectedPage);
    setEditing(null);
  }, [selectedPage]);

  async function loadSections(page: string) {
    setLoading(true);
    const { data } = await supabase.from('page_content').select('*').eq('page', page).order('section');
    if (data) setSections(data);
    setLoading(false);
  }

  function startEdit(section: PageContent) {
    setEditing(section.id);
    setForm({ ...section });
  }

  function cancelEdit() {
    setEditing(null);
    setForm({});
  }

  async function saveSection() {
    if (!form.id) return;
    setSaving(true);
    const { error } = await supabase.from('page_content').update({
      title: form.title ?? null,
      subtitle: form.subtitle ?? null,
      content: form.content ?? null,
      updated_at: new Date().toISOString(),
    }).eq('id', form.id);
    setSaving(false);
    if (!error) {
      setSections((prev) => prev.map((s) => s.id === form.id ? { ...s, ...form } as PageContent : s));
      setEditing(null);
      setSaved(form.id ?? null);
      setTimeout(() => setSaved(null), 2000);
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-heading font-bold text-gray-900">Page Content Editor</h2>
        <p className="text-gray-500 text-sm mt-1">Edit text content displayed on each public page.</p>
      </div>

      {/* Page selector */}
      <div className="flex flex-wrap gap-2 mb-6">
        {pageOptions.map((p) => (
          <button key={p.value} onClick={() => setSelectedPage(p.value)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${selectedPage === p.value ? 'bg-primary-700 text-white shadow-md' : 'bg-white border border-gray-200 text-gray-600 hover:border-primary-300 hover:text-primary-700'}`}>
            {p.label}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="p-12 text-center text-gray-400 bg-white rounded-2xl">Loading sections...</div>
        ) : sections.length === 0 ? (
          <div className="p-12 text-center text-gray-400 bg-white rounded-2xl">No editable sections found for this page.</div>
        ) : sections.map((section) => (
          <div key={section.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4">
              <div>
                <div className="font-medium text-gray-900 capitalize">{section.section.replace(/_/g, ' ')}</div>
                <div className="text-xs text-gray-400 mt-0.5">{section.page} / {section.section}</div>
              </div>
              <div className="flex items-center gap-2">
                {saved === section.id && (
                  <span className="text-green-600 text-xs font-medium">Saved!</span>
                )}
                <button
                  onClick={() => editing === section.id ? cancelEdit() : startEdit(section)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${editing === section.id ? 'bg-gray-100 text-gray-600' : 'bg-primary-50 text-primary-700 hover:bg-primary-100'}`}>
                  {editing === section.id ? <><ChevronDown size={14} /> Close</> : <><Edit3 size={14} /> Edit</>}
                </button>
              </div>
            </div>

            {editing !== section.id && (
              <div className="px-6 pb-4 space-y-2">
                {section.title && <div className="text-sm"><span className="text-xs text-gray-400 uppercase tracking-wide">Title: </span><span className="text-gray-700">{section.title}</span></div>}
                {section.subtitle && <div className="text-sm"><span className="text-xs text-gray-400 uppercase tracking-wide">Subtitle: </span><span className="text-gray-700">{section.subtitle}</span></div>}
                {section.content && <div className="text-sm"><span className="text-xs text-gray-400 uppercase tracking-wide">Content: </span><span className="text-gray-600 line-clamp-2">{section.content}</span></div>}
              </div>
            )}

            {editing === section.id && (
              <div className="px-6 pb-6 border-t border-gray-100 pt-5 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Title</label>
                  <input value={form.title ?? ''} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input-field text-sm" placeholder="Section title" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Subtitle / Tagline</label>
                  <input value={form.subtitle ?? ''} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} className="input-field text-sm" placeholder="Subtitle or tagline" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Content</label>
                  <textarea value={form.content ?? ''} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={5} className="input-field resize-y text-sm" placeholder="Main content text..." />
                </div>
                {section.extra_data && (
                  <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-3 text-xs text-yellow-700">
                    Note: This section has structured data (stats, cards, etc.) that can only be edited directly in the database admin for now.
                  </div>
                )}
                <div className="flex gap-3 pt-2">
                  <button onClick={cancelEdit} className="btn-outline flex-1 text-sm py-2">Cancel</button>
                  <button onClick={saveSection} disabled={saving} className="btn-primary flex-1 text-sm py-2 flex items-center justify-center gap-2">
                    {saving ? <><div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</> : <><Save size={14} /> Save Changes</>}
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
