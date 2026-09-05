import { useState, useEffect } from 'react';
import { supabase, type PageContent } from '../lib/supabase';
import { Megaphone, Plus, Trash2, Edit, Pin, Tag, Calendar, Globe, Sparkles, CheckCircle, ExternalLink, RefreshCw } from 'lucide-react';

export interface AnnouncementItem {
  id: string;
  title: string;
  category: 'Admission Notice' | 'Course Information' | 'Important Update' | 'Exam / Counseling';
  content: string;
  badge: string;
  target_page: 'all' | 'admission' | 'home' | 'courses';
  link_url?: string;
  image_url?: string;
  is_pinned: boolean;
  is_active: boolean;
  created_at: string;
}

export default function AdminAnnouncements() {
  const [notices, setNotices] = useState<AnnouncementItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AnnouncementItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<AnnouncementItem['category']>('Admission Notice');
  const [content, setContent] = useState('');
  const [badge, setBadge] = useState('New Admission');
  const [targetPage, setTargetPage] = useState<AnnouncementItem['target_page']>('all');
  const [linkUrl, setLinkUrl] = useState('/admission');
  const [imageUrl, setImageUrl] = useState('');
  const [isPinned, setIsPinned] = useState(false);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    loadAnnouncements();
  }, []);

  async function loadAnnouncements() {
    setLoading(true);
    try {
      const { data } = await supabase
        .from('page_content')
        .select('*')
        .eq('page', 'announcements')
        .order('updated_at', { ascending: false });

      if (data && data.length > 0) {
        const items: AnnouncementItem[] = data.map((row: PageContent) => {
          const extra = (row.extra_data as any) || {};
          return {
            id: row.id,
            title: row.title || 'Untitled Notice',
            category: (row.subtitle as AnnouncementItem['category']) || 'Admission Notice',
            content: row.content || '',
            badge: extra.badge || 'Update',
            target_page: extra.target_page || 'all',
            link_url: extra.link_url || '',
            image_url: extra.image_url || '',
            is_pinned: !!extra.is_pinned,
            is_active: extra.is_active !== undefined ? extra.is_active : true,
            created_at: row.updated_at || new Date().toISOString(),
          };
        });
        setNotices(items);
      } else {
        // Default initial announcements if table row is empty
        const defaultNotice: AnnouncementItem = {
          id: 'default-1',
          title: 'Admissions Open for Academic Year 2026-27',
          category: 'Admission Notice',
          content: 'Applications are officially open for B.Sc Cardiac Technology, AOTT, Physician Assistant, MLT, and Emergency Medical Technology. Submit online or visit campus today.',
          badge: 'Admissions 2026-27',
          target_page: 'all',
          link_url: '/admission',
          image_url: 'https://images.pexels.com/photos/3985163/pexels-photo-3985163.jpeg?auto=compress&cs=tinysrgb&w=800',
          is_pinned: true,
          is_active: true,
          created_at: new Date().toISOString(),
        };
        setNotices([defaultNotice]);
      }
    } catch (err) {
      console.error('Error loading announcements:', err);
    } finally {
      setLoading(false);
    }
  }

  function openCreateModal() {
    setEditingItem(null);
    setTitle('');
    setCategory('Admission Notice');
    setContent('');
    setBadge('Admissions 2026-27');
    setTargetPage('all');
    setLinkUrl('/admission');
    setImageUrl('');
    setIsPinned(true);
    setIsActive(true);
    setModalOpen(true);
  }

  function openEditModal(item: AnnouncementItem) {
    setEditingItem(item);
    setTitle(item.title);
    setCategory(item.category);
    setContent(item.content);
    setBadge(item.badge);
    setTargetPage(item.target_page);
    setLinkUrl(item.link_url || '');
    setImageUrl(item.image_url || '');
    setIsPinned(item.is_pinned);
    setIsActive(item.is_active);
    setModalOpen(true);
  }

  async function handleSaveNotice(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setSaving(true);
    const extra_data = {
      badge,
      target_page: targetPage,
      link_url: linkUrl,
      image_url: imageUrl,
      is_pinned: isPinned,
      is_active: isActive,
    };

    if (editingItem && !editingItem.id.startsWith('default')) {
      const { error } = await supabase
        .from('page_content')
        .update({
          title,
          subtitle: category,
          content,
          extra_data,
          updated_at: new Date().toISOString(),
        })
        .eq('id', editingItem.id);

      if (!error) {
        setFeedback('Information notice updated successfully!');
      }
    } else {
      const sectionName = `notice_${Date.now()}`;
      const { error } = await supabase.from('page_content').insert({
        page: 'announcements',
        section: sectionName,
        title,
        subtitle: category,
        content,
        extra_data,
        updated_at: new Date().toISOString(),
      });

      if (!error) {
        setFeedback('New information notice posted live!');
      }
    }

    setSaving(false);
    setModalOpen(false);
    loadAnnouncements();
    setTimeout(() => setFeedback(null), 3000);
  }

  async function handleDeleteNotice(id: string) {
    if (!confirm('Are you sure you want to delete this notice?')) return;
    if (!id.startsWith('default')) {
      await supabase.from('page_content').delete().eq('id', id);
    }
    setNotices((prev) => prev.filter((n) => n.id !== id));
    setFeedback('Notice deleted.');
    setTimeout(() => setFeedback(null), 3000);
  }

  async function togglePin(item: AnnouncementItem) {
    const newPinned = !item.is_pinned;
    if (!item.id.startsWith('default')) {
      await supabase
        .from('page_content')
        .update({
          extra_data: {
            badge: item.badge,
            target_page: item.target_page,
            link_url: item.link_url,
            image_url: item.image_url,
            is_pinned: newPinned,
            is_active: item.is_active,
          },
        })
        .eq('id', item.id);
    }
    setNotices((prev) =>
      prev.map((n) => (n.id === item.id ? { ...n, is_pinned: newPinned } : n))
    );
  }

  async function toggleActive(item: AnnouncementItem) {
    const newActive = !item.is_active;
    if (!item.id.startsWith('default')) {
      await supabase
        .from('page_content')
        .update({
          extra_data: {
            badge: item.badge,
            target_page: item.target_page,
            link_url: item.link_url,
            image_url: item.image_url,
            is_pinned: item.is_pinned,
            is_active: newActive,
          },
        })
        .eq('id', item.id);
    }
    setNotices((prev) =>
      prev.map((n) => (n.id === item.id ? { ...n, is_active: newActive } : n))
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-primary-700 uppercase tracking-widest mb-1">
            <Megaphone size={16} /> Information & Admission Announcements
          </div>
          <h2 className="text-2xl font-heading font-bold text-gray-900">
            Post Information Notices & Bulletins
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Post live announcements, admission alerts, and course information updates directly to the public website.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={loadAnnouncements}
            className="p-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
            title="Refresh"
          >
            <RefreshCw size={16} />
          </button>
          <button
            onClick={openCreateModal}
            className="btn-primary text-sm px-5 py-2.5 flex items-center gap-2 shadow-md hover:scale-105 transition-all"
          >
            <Plus size={16} /> Post New Information
          </button>
        </div>
      </div>

      {feedback && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2 animate-fadeIn">
          <CheckCircle size={16} /> {feedback}
        </div>
      )}

      {/* List of Posted Announcements */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-12 text-center text-gray-400 bg-white rounded-2xl border border-gray-100">
            Loading announcements...
          </div>
        ) : notices.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-gray-100">
            <Megaphone className="mx-auto text-gray-300 mb-3" size={40} />
            <h3 className="text-gray-700 font-bold font-heading">No Announcements Posted Yet</h3>
            <p className="text-gray-400 text-sm mt-1">Click "Post New Information" above to create your first notice.</p>
          </div>
        ) : (
          notices.map((item) => (
            <div
              key={item.id}
              className={`bg-white rounded-2xl border transition-all shadow-sm overflow-hidden p-6 ${
                item.is_pinned ? 'border-primary-300 ring-2 ring-primary-100' : 'border-gray-100'
              } ${!item.is_active ? 'opacity-60 bg-gray-50/50' : ''}`}
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2.5 mb-2">
                    <span className="bg-primary-50 text-primary-700 text-xs font-bold px-2.5 py-1 rounded-full border border-primary-100 flex items-center gap-1">
                      <Tag size={12} /> {item.category}
                    </span>
                    <span className="bg-green-100 text-green-800 text-xs font-bold px-2.5 py-1 rounded-full">
                      {item.badge}
                    </span>
                    {item.is_pinned && (
                      <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                        <Pin size={11} className="fill-amber-800" /> Pinned Notice
                      </span>
                    )}
                    <span className="text-xs text-gray-400 flex items-center gap-1 ml-auto md:ml-0">
                      <Globe size={12} /> Target: <strong className="capitalize text-gray-700">{item.target_page} Page</strong>
                    </span>
                  </div>

                  <h3 className="text-lg font-heading font-bold text-gray-900 mb-2">
                    {item.title}
                  </h3>

                  <p className="text-gray-600 text-sm leading-relaxed mb-4 whitespace-pre-line">
                    {item.content}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar size={13} /> {new Date(item.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                    {item.link_url && (
                      <a
                        href={item.link_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-700 font-semibold hover:underline flex items-center gap-1"
                      >
                        Action Link: {item.link_url} <ExternalLink size={12} />
                      </a>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 border-t md:border-t-0 border-gray-100 pt-3 md:pt-0 justify-end">
                  <button
                    onClick={() => togglePin(item)}
                    className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1 transition-all ${
                      item.is_pinned
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                    title={item.is_pinned ? 'Unpin Notice' : 'Pin to Top'}
                  >
                    <Pin size={14} /> {item.is_pinned ? 'Pinned' : 'Pin'}
                  </button>

                  <button
                    onClick={() => toggleActive(item)}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                      item.is_active
                        ? 'bg-green-50 text-green-700 border-green-200'
                        : 'bg-gray-100 text-gray-500 border-gray-200'
                    }`}
                  >
                    {item.is_active ? 'Live' : 'Hidden'}
                  </button>

                  <button
                    onClick={() => openEditModal(item)}
                    className="p-2 text-primary-700 hover:bg-primary-50 rounded-xl transition-colors"
                    title="Edit Notice"
                  >
                    <Edit size={16} />
                  </button>

                  <button
                    onClick={() => handleDeleteNotice(item.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                    title="Delete Notice"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal for Creating / Editing Notice */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full p-6 md:p-8 max-h-[90vh] overflow-y-auto animate-fadeInUp">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
              <h3 className="text-xl font-heading font-bold text-gray-900 flex items-center gap-2">
                <Sparkles className="text-green-500" size={20} />
                {editingItem ? 'Edit Information Notice' : 'Post New Information / Admission Notice'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveNotice} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Notice Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Admissions Open for Academic Year 2026-27"
                  className="input-field"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Notice Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="input-field"
                  >
                    <option value="Admission Notice">Admission Notice</option>
                    <option value="Course Information">Course Information</option>
                    <option value="Important Update">Important Update</option>
                    <option value="Exam / Counseling">Exam / Counseling</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Badge Tag Text
                  </label>
                  <input
                    type="text"
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    placeholder="e.g. Admissions 2026-27, Urgent"
                    className="input-field"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Target Website Page
                </label>
                <select
                  value={targetPage}
                  onChange={(e) => setTargetPage(e.target.value as any)}
                  className="input-field"
                >
                  <option value="all">Show on All Pages (Home, Admission, Courses)</option>
                  <option value="admission">Admission Page Only</option>
                  <option value="home">Home Page Only</option>
                  <option value="courses">Courses Page Only</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Notice Details / Content *
                </label>
                <textarea
                  required
                  rows={4}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Enter full details of the announcement, admission deadlines, counseling dates, or course information..."
                  className="input-field resize-y"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Action Link URL (Optional)
                  </label>
                  <input
                    type="text"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    placeholder="/admission or custom URL"
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                    Image URL (Optional)
                  </label>
                  <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://..."
                    className="input-field"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-700">
                  <input
                    type="checkbox"
                    checked={isPinned}
                    onChange={(e) => setIsPinned(e.target.checked)}
                    className="w-4 h-4 text-primary-700 rounded border-gray-300"
                  />
                  Pin to Top (Priority Announcement)
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-700">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="w-4 h-4 text-green-600 rounded border-gray-300"
                  />
                  Publish Immediately (Live)
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="btn-outline text-xs px-5 py-2.5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-primary text-xs px-6 py-2.5 flex items-center gap-2"
                >
                  {saving ? 'Publishing...' : 'Publish Information Notice'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
