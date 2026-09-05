import { useState, useEffect } from 'react';
import { supabase, type Blog } from '../lib/supabase';
import { Plus, Edit3, Trash2, X, Save, FileText, CheckCircle2 } from 'lucide-react';
import ImageUploadInput from '../components/ImageUploadInput';

function generateSlug(title: string) {
  const base = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  return base || `post-${Date.now()}`;
}

const LOCAL_STORAGE_KEY = 'mahs_custom_blog_posts';

export default function AdminBlog() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Blog> | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [message, setMessage] = useState({ text: '', type: 'success' });

  useEffect(() => {
    loadBlogs();
  }, []);

  async function loadBlogs() {
    setLoading(true);
    let combinedBlogs: Blog[] = [];

    try {
      // 1. Fetch from Supabase blogs table
      const { data: dbData } = await supabase
        .from('blogs')
        .select('*')
        .order('created_at', { ascending: false });

      if (dbData && dbData.length > 0) {
        combinedBlogs = [...dbData];
      }

      // 2. Fetch from Supabase page_content section custom_blogs
      const { data: pageContentData } = await supabase
        .from('page_content')
        .select('*')
        .eq('page', 'blog')
        .eq('section', 'custom_blogs')
        .maybeSingle();

      if (pageContentData && pageContentData.extra_data && Array.isArray((pageContentData.extra_data as any).blogs)) {
        const extraBlogs = (pageContentData.extra_data as any).blogs as Blog[];
        extraBlogs.forEach((extra) => {
          if (!combinedBlogs.some((b) => b.id === extra.id || b.slug === extra.slug)) {
            combinedBlogs.push(extra);
          }
        });
      }

      // 3. Merge with localStorage backup
      const localData = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (localData) {
        try {
          const localBlogs = JSON.parse(localData) as Blog[];
          localBlogs.forEach((lblg) => {
            if (!combinedBlogs.some((b) => b.id === lblg.id || b.slug === lblg.slug)) {
              combinedBlogs.unshift(lblg);
            }
          });
        } catch {
          // Ignore JSON parse error
        }
      }
    } catch (err) {
      console.error('Error loading blogs:', err);
    } finally {
      setBlogs(combinedBlogs);
      setLoading(false);
    }
  }

  function openNew() {
    setEditing({
      title: '',
      author: 'Admin',
      image_url: '',
      content: '',
    });
    setMessage({ text: '', type: 'success' });
  }

  function openEdit(blog: Blog) {
    setEditing({ ...blog });
    setMessage({ text: '', type: 'success' });
  }

  async function save() {
    if (!editing || !editing.title?.trim() || !editing.content?.trim()) {
      setMessage({ text: 'Please fill in Title and Description.', type: 'error' });
      return;
    }

    setSaving(true);
    setMessage({ text: '', type: 'success' });

    const title = editing.title.trim();
    const content = editing.content.trim();
    const slug = editing.slug || generateSlug(title);
    const excerpt = content.replace(/<[^>]*>/g, '').slice(0, 160) + (content.length > 160 ? '...' : '');
    const id = editing.id || `custom-${Date.now()}`;
    const now = new Date().toISOString();

    const payload: Blog = {
      id,
      title,
      slug,
      excerpt,
      content,
      image_url: editing.image_url?.trim() || 'https://images.pexels.com/photos/3845126/pexels-photo-3845126.jpeg?auto=compress&cs=tinysrgb&w=600',
      category: editing.category || 'Career',
      author: editing.author?.trim() || 'Admin',
      is_published: true,
      published_at: editing.published_at || now,
      created_at: editing.created_at || now,
      updated_at: now,
    };

    let savedSuccessfully = false;

    // 1. Attempt Supabase direct table save
    if (editing.id && !editing.id.startsWith('custom-')) {
      const { error: err } = await supabase.from('blogs').update(payload).eq('id', editing.id);
      if (!err) savedSuccessfully = true;
    } else {
      const { error: err } = await supabase.from('blogs').insert(payload);
      if (!err) savedSuccessfully = true;
    }

    // 2. RLS Fallback: Save to page_content & localStorage
    const updatedList = editing.id
      ? blogs.map((b) => (b.id === editing.id ? payload : b))
      : [payload, ...blogs];

    // Save to localStorage
    const customOnly = updatedList.filter((b) => b.id.startsWith('custom-') || !savedSuccessfully);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(customOnly));

    // Save to page_content table
    await supabase.from('page_content').upsert({
      page: 'blog',
      section: 'custom_blogs',
      extra_data: { blogs: customOnly },
      updated_at: now,
    }, { onConflict: 'page,section' });

    setSaving(false);
    setBlogs(updatedList);
    setEditing(null);
    setMessage({ text: 'Blog post published successfully!', type: 'success' });
  }

  async function deleteBlog(id: string) {
    if (!confirm('Delete this blog post permanently?')) return;
    setDeleting(id);

    // Try deleting from Supabase
    if (!id.startsWith('custom-')) {
      await supabase.from('blogs').delete().eq('id', id);
    }

    const updated = blogs.filter((b) => b.id !== id);
    setBlogs(updated);

    // Update localStorage & page_content fallback
    const customOnly = updated.filter((b) => b.id.startsWith('custom-'));
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(customOnly));
    await supabase.from('page_content').upsert({
      page: 'blog',
      section: 'custom_blogs',
      extra_data: { blogs: customOnly },
      updated_at: new Date().toISOString(),
    }, { onConflict: 'page,section' });

    setDeleting(null);
    setMessage({ text: 'Blog post deleted.', type: 'success' });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-heading font-bold text-gray-900">Blog Management</h2>
          <p className="text-gray-500 text-sm mt-1">Easily publish and manage blog posts with title, author, photo, and description.</p>
        </div>
        <button onClick={openNew} className="btn-primary flex items-center gap-2 text-sm px-5 py-2.5">
          <Plus size={16} /> New Blog Post
        </button>
      </div>

      {message.text && (
        <div className={`flex items-center gap-2.5 rounded-xl p-4 text-sm border ${
          message.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'
        }`}>
          <CheckCircle2 size={16} />
          {message.text}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400">Loading blog posts...</div>
        ) : blogs.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-400 mb-4">No blog posts yet.</p>
            <button onClick={openNew} className="btn-primary text-sm">Create First Post</button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['Photo', 'Title & Description', 'Created By', 'Date Published', 'Actions'].map((h) => (
                    <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {blogs.map((b) => (
                  <tr key={b.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-5 py-4 w-20">
                      <img
                        src={b.image_url || 'https://images.pexels.com/photos/3845126/pexels-photo-3845126.jpeg?auto=compress&cs=tinysrgb&w=300'}
                        alt={b.title}
                        className="w-14 h-12 object-cover rounded-lg border border-gray-200 bg-gray-100"
                      />
                    </td>
                    <td className="px-5 py-4 max-w-md">
                      <div className="font-bold text-gray-900 text-sm">{b.title}</div>
                      <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{b.excerpt || b.content}</p>
                    </td>
                    <td className="px-5 py-4 text-xs font-semibold text-gray-700 whitespace-nowrap">
                      {b.author || 'Admin'}
                    </td>
                    <td className="px-5 py-4 text-xs text-gray-500 whitespace-nowrap">
                      {new Date(b.published_at || b.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(b)} className="p-2 rounded-lg hover:bg-primary-50 text-primary-700 transition-colors" title="Edit Post">
                          <Edit3 size={16} />
                        </button>
                        <button onClick={() => deleteBlog(b.id)} disabled={deleting === b.id} className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors" title="Delete Post">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Editor Modal */}
      {editing !== null && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-6 overflow-hidden" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
              <h3 className="font-heading font-bold text-lg text-gray-900 flex items-center gap-2">
                <FileText size={18} className="text-green-600" />
                {editing.id ? 'Edit Blog Post' : 'New Blog Post'}
              </h3>
              <button onClick={() => setEditing(null)} className="p-1.5 rounded-lg hover:bg-gray-200 text-gray-500 transition-colors">
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              {/* 1. Title */}
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-1.5">
                  1. Post Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={editing.title ?? ''}
                  onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                  className="input-field text-base font-medium"
                  placeholder="Enter a descriptive blog post title..."
                  autoFocus
                />
              </div>

              {/* 2. Author / Created By */}
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-1.5">
                  2. Author / Created By <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={editing.author ?? ''}
                  onChange={(e) => setEditing({ ...editing, author: e.target.value })}
                  className="input-field text-sm font-medium"
                  placeholder="Enter name of person who created/wrote this post (e.g. Admin, Dr. A. Sharma)..."
                />
              </div>

              {/* 3. Photo (Image Upload / URL) */}
              <div>
                <ImageUploadInput
                  label="3. Post Photo / Cover Image *"
                  value={editing.image_url ?? ''}
                  onChange={(url) => setEditing({ ...editing, image_url: url })}
                  placeholder="Upload image file or paste URL..."
                />
              </div>

              {/* 4. Description */}
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-1.5">
                  4. Post Description & Article Content <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={editing.content ?? ''}
                  onChange={(e) => setEditing({ ...editing, content: e.target.value })}
                  rows={8}
                  className="input-field leading-relaxed text-sm"
                  placeholder="Write your article content or post description here..."
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex gap-3 p-6 pt-2 border-t border-gray-100 bg-gray-50/30">
              <button onClick={() => setEditing(null)} className="btn-outline flex-1 py-2.5">
                Cancel
              </button>
              <button onClick={save} disabled={saving} className="btn-green flex-1 flex items-center justify-center gap-2 py-2.5 font-bold">
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Publishing...
                  </>
                ) : (
                  <>
                    <Save size={16} /> Publish Blog Post
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
