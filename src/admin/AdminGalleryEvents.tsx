import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Plus, Trash2, Save, Image, Instagram, AlertCircle, CheckCircle, Edit3, Film, Image as ImageIcon, ExternalLink, RefreshCw } from 'lucide-react';
import ImageUploadInput from '../components/ImageUploadInput';

export interface InstagramEvent {
  title: string;
  url: string;
  imageUrl: string;
  handle: string;
  caption: string;
  postType?: 'post' | 'reel';
}

export function getInstagramEmbedUrl(url: string): string | null {
  if (!url) return null;
  const match = url.match(/instagram\.com\/(?:[^\/]+\/)?(p|reel|tv)\/([A-Za-z0-9_-]+)/i);
  if (match && match[2] && !match[2].startsWith('DF')) {
    const type = match[1].toLowerCase();
    const shortcode = match[2];
    return `https://www.instagram.com/${type}/${shortcode}/embed`;
  }
  return null;
}

export default function AdminGalleryEvents() {
  const [activeTab, setActiveTab] = useState<'gallery' | 'events'>('gallery');
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [events, setEvents] = useState<InstagramEvent[]>([]);
  const [instagramHandle, setInstagramHandle] = useState('mahalakshmicollegeofnursing');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: 'success' });
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // Input states
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newEvent, setNewEvent] = useState<InstagramEvent>({
    title: '',
    url: '',
    imageUrl: '',
    handle: 'mahalakshmicollegeofnursing',
    caption: '',
    postType: 'post',
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      // Load gallery images
      const { data: galleryData } = await supabase
        .from('page_content')
        .select('*')
        .eq('page', 'campus')
        .eq('section', 'gallery')
        .single();

      if (galleryData && galleryData.extra_data && Array.isArray((galleryData.extra_data as any).images)) {
        setGalleryImages((galleryData.extra_data as any).images);
      } else {
        setGalleryImages([
          'https://images.pexels.com/photos/3985163/pexels-photo-3985163.jpeg?auto=compress&cs=tinysrgb&w=600',
          'https://images.pexels.com/photos/3786157/pexels-photo-3786157.jpeg?auto=compress&cs=tinysrgb&w=600',
          'https://images.pexels.com/photos/1170412/pexels-photo-1170412.jpeg?auto=compress&cs=tinysrgb&w=600',
          'https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=600',
          'https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg?auto=compress&cs=tinysrgb&w=600',
          'https://images.pexels.com/photos/1370296/pexels-photo-1370296.jpeg?auto=compress&cs=tinysrgb&w=600',
        ]);
      }

      // Load events
      const { data: eventsData } = await supabase
        .from('page_content')
        .select('*')
        .eq('page', 'campus')
        .eq('section', 'instagram_events')
        .single();

      if (eventsData && eventsData.extra_data) {
        const extra = eventsData.extra_data as any;
        if (Array.isArray(extra.events)) {
          const processed = extra.events.map((ev: InstagramEvent) => ({
            ...ev,
            postType: ev.postType || (ev.url?.includes('/reel/') ? 'reel' : 'post'),
          }));
          setEvents(processed);
        } else {
          setEvents([]);
        }
        if (extra.instagramHandle) {
          setInstagramHandle(extra.instagramHandle);
          setNewEvent((prev) => ({ ...prev, handle: extra.instagramHandle }));
        }
      } else {
        setEvents([]);
      }
    } catch (err) {
      console.error('Error loading gallery/events:', err);
    } finally {
      setLoading(false);
    }
  }

  async function saveGallery() {
    setSaving(true);
    setMessage({ text: '', type: 'success' });
    const { error } = await supabase
      .from('page_content')
      .upsert({
        page: 'campus',
        section: 'gallery',
        extra_data: { images: galleryImages },
        updated_at: new Date().toISOString(),
      }, { onConflict: 'page,section' });

    setSaving(false);
    if (error) {
      setMessage({ text: `Failed to save gallery: ${error.message}`, type: 'error' });
    } else {
      setMessage({ text: 'Gallery saved successfully!', type: 'success' });
    }
  }

  async function persistEvents(updatedEvents: InstagramEvent[], handle: string) {
    // 1. Save to localStorage backup
    localStorage.setItem('mahs_custom_instagram_events', JSON.stringify({
      events: updatedEvents,
      instagramHandle: handle,
    }));

    // 2. Save to Supabase page_content
    await supabase
      .from('page_content')
      .upsert({
        page: 'campus',
        section: 'instagram_events',
        extra_data: { events: updatedEvents, instagramHandle: handle },
        updated_at: new Date().toISOString(),
      }, { onConflict: 'page,section' });
  }

  async function saveEvents() {
    setSaving(true);
    setMessage({ text: '', type: 'success' });
    await persistEvents(events, instagramHandle);
    setSaving(false);
    setMessage({ text: 'Instagram Posts & Reels saved successfully!', type: 'success' });
  }

  function addGalleryImage() {
    if (!newImageUrl.trim()) return;
    if (!newImageUrl.startsWith('http://') && !newImageUrl.startsWith('https://')) {
      setMessage({ text: 'Please enter a valid HTTP or HTTPS image URL.', type: 'error' });
      return;
    }
    setGalleryImages([...galleryImages, newImageUrl.trim()]);
    setNewImageUrl('');
    setMessage({ text: 'Image added to list. Remember to click "Save Gallery"!', type: 'success' });
  }

  function deleteGalleryImage(index: number) {
    setGalleryImages(galleryImages.filter((_, i) => i !== index));
    setMessage({ text: 'Image removed. Remember to click "Save Gallery"!', type: 'success' });
  }

  function handleAddOrUpdateEvent() {
    if (!newEvent.url.trim()) {
      setMessage({ text: 'Please paste the Instagram link (Post or Reel URL).', type: 'error' });
      return;
    }

    const url = newEvent.url.trim();
    const isReel = url.includes('/reel/');
    const defaultTitle = isReel ? 'Campus Video Reel' : 'Instagram Photo Post';
    const defaultImage = isReel
      ? 'https://images.pexels.com/photos/1170412/pexels-photo-1170412.jpeg?auto=compress&cs=tinysrgb&w=600'
      : 'https://images.pexels.com/photos/3985163/pexels-photo-3985163.jpeg?auto=compress&cs=tinysrgb&w=600';

    const itemToSave: InstagramEvent = {
      title: newEvent.title.trim() || defaultTitle,
      url: url,
      imageUrl: newEvent.imageUrl.trim() || defaultImage,
      handle: newEvent.handle.trim() || instagramHandle,
      caption: newEvent.caption.trim() || (isReel ? 'Watch our official campus reel video on Instagram! 🎬' : 'Check out our official campus post on Instagram! 📷'),
      postType: isReel ? 'reel' : (newEvent.postType || 'post'),
    };

    let updatedList: InstagramEvent[] = [];
    if (editingIndex !== null) {
      updatedList = [...events];
      updatedList[editingIndex] = itemToSave;
      setEditingIndex(null);
      setMessage({ text: 'Instagram post/reel updated & saved successfully!', type: 'success' });
    } else {
      updatedList = [itemToSave, ...events];
      setMessage({ text: 'Instagram link added & saved successfully!', type: 'success' });
    }

    setEvents(updatedList);
    persistEvents(updatedList, instagramHandle);

    // Reset form
    setNewEvent({
      title: '',
      url: '',
      imageUrl: '',
      handle: instagramHandle,
      caption: '',
      postType: 'post',
    });
  }

  function startEditEvent(index: number) {
    setEditingIndex(index);
    setNewEvent({ ...events[index] });
    window.scrollTo({ top: 250, behavior: 'smooth' });
  }

  function cancelEdit() {
    setEditingIndex(null);
    setNewEvent({
      title: '',
      url: '',
      imageUrl: '',
      handle: instagramHandle,
      caption: '',
      postType: 'post',
    });
  }

  function deleteEvent(index: number) {
    const updated = events.filter((_, i) => i !== index);
    setEvents(updated);
    if (editingIndex === index) {
      cancelEdit();
    }
    persistEvents(updated, instagramHandle);
    setMessage({ text: 'Event removed and saved.', type: 'success' });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-heading font-bold text-gray-900">Gallery, Instagram Posts & Reels Management</h2>
          <p className="text-gray-500 text-sm mt-1">Upload campus gallery photos and manage official Instagram posts and reels.</p>
        </div>
        <div className="flex gap-2">
          {activeTab === 'gallery' ? (
            <button onClick={saveGallery} disabled={saving} className="btn-primary flex items-center gap-2 text-sm px-5">
              <Save size={16} /> {saving ? 'Saving...' : 'Save Gallery'}
            </button>
          ) : (
            <button onClick={saveEvents} disabled={saving} className="btn-primary flex items-center gap-2 text-sm px-5">
              <Save size={16} /> {saving ? 'Saving...' : 'Save Posts & Reels'}
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex gap-6">
          <button
            onClick={() => { setActiveTab('gallery'); setMessage({ text: '', type: 'success' }); }}
            className={`pb-4 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'gallery' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Image size={16} /> Campus Gallery
          </button>
          <button
            onClick={() => { setActiveTab('events'); setMessage({ text: '', type: 'success' }); }}
            className={`pb-4 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'events' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Instagram size={16} /> Instagram Posts & Reels
          </button>
        </div>
      </div>

      {/* Alert message */}
      {message.text && (
        <div className={`flex items-center gap-3 rounded-xl p-4 text-sm border ${
          message.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'
        }`}>
          {message.type === 'success' ? <CheckCircle size={16} className="flex-shrink-0" /> : <AlertCircle size={16} className="flex-shrink-0" />}
          {message.text}
        </div>
      )}

      {loading ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center text-gray-400">Loading data...</div>
      ) : activeTab === 'gallery' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Add Image Form */}
          <div className="lg:col-span-1">
            <div className="card p-6 border border-gray-100 sticky top-24">
              <h3 className="font-heading font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
                <Plus size={18} className="text-green-500" />
                Add Gallery Image
              </h3>
              <div className="space-y-4">
                <div>
                  <ImageUploadInput
                    label="Gallery Image"
                    value={newImageUrl}
                    onChange={(url) => setNewImageUrl(url)}
                    placeholder="https://images.pexels.com/..."
                  />
                </div>
                <button onClick={addGalleryImage} className="btn-green w-full flex items-center justify-center gap-2 py-2 text-sm font-medium">
                  <Plus size={16} /> Add to Gallery
                </button>
              </div>
            </div>
          </div>

          {/* Gallery Images List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h3 className="font-heading font-bold text-lg text-gray-900 mb-4">Current Gallery Images ({galleryImages.length})</h3>
              {galleryImages.length === 0 ? (
                <div className="py-12 text-center text-gray-400">No images added yet.</div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {galleryImages.map((img, i) => (
                    <div key={i} className="relative rounded-xl overflow-hidden aspect-[4/3] group bg-gray-100 border border-gray-200">
                      <img src={img} alt="Gallery item" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          onClick={() => deleteGalleryImage(i)}
                          className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Global Instagram Handle Banner */}
          <div className="bg-gradient-to-r from-purple-50 via-pink-50 to-amber-50 rounded-2xl p-5 border border-purple-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 p-0.5 text-white flex items-center justify-center shadow-md">
                <Instagram size={20} />
              </div>
              <div>
                <h4 className="font-heading font-bold text-sm text-gray-900">Official Instagram Account Connection</h4>
                <p className="text-xs text-gray-500">Handle used across profile links & header badges</p>
              </div>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs font-bold text-gray-700">@</span>
              <input
                type="text"
                value={instagramHandle}
                onChange={(e) => {
                  setInstagramHandle(e.target.value);
                  setNewEvent((prev) => ({ ...prev, handle: e.target.value }));
                }}
                placeholder="mahalakshmialliedhealthscience"
                className="input-field py-1.5 px-3 text-xs font-bold w-52"
              />
              <a
                href={`https://www.instagram.com/${instagramHandle}/`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1 flex-shrink-0"
              >
                <ExternalLink size={12} /> Visit Profile
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Add / Edit Form - Simplified to ONLY Instagram Link */}
            <div className="lg:col-span-1">
              <div className="card p-6 border border-gray-100 sticky top-24 shadow-md">
                <h3 className="font-heading font-bold text-lg text-gray-900 mb-4 flex items-center justify-between border-b border-gray-100 pb-3">
                  <span className="flex items-center gap-2">
                    {editingIndex !== null ? <Edit3 size={18} className="text-amber-500" /> : <Plus size={18} className="text-green-500" />}
                    {editingIndex !== null ? 'Edit Link' : 'Add Instagram Link'}
                  </span>
                  {editingIndex !== null && (
                    <button onClick={cancelEdit} className="text-xs text-gray-400 hover:text-gray-600 underline">
                      Cancel
                    </button>
                  )}
                </h3>

                <div className="space-y-4">
                  {/* Primary Link Input */}
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-1.5">
                      Instagram Link (Post or Reel) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="url"
                      value={newEvent.url}
                      onChange={(e) => {
                        const url = e.target.value;
                        const detectedType = url.includes('/reel/') ? 'reel' : 'post';
                        setNewEvent({ ...newEvent, url, postType: detectedType });
                      }}
                      placeholder="https://www.instagram.com/reel/... or /p/..."
                      className="input-field border-2 border-green-500/40 focus:border-green-500 text-sm font-medium"
                      autoFocus
                    />
                    <p className="text-xs text-gray-500 mt-1">Just paste your Instagram link here and click Add!</p>
                  </div>

                  {/* Optional Customization Section */}
                  <details className="group border border-gray-200 rounded-xl p-3 bg-gray-50/50 [&_summary::-webkit-details-marker]:none">
                    <summary className="text-xs font-bold text-gray-700 cursor-pointer select-none flex items-center justify-between">
                      <span>⚙️ Optional Details (Title, Image, Caption)</span>
                      <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
                    </summary>
                    <div className="space-y-3 mt-3 pt-3 border-t border-gray-200">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Title / Event Name</label>
                        <input
                          type="text"
                          value={newEvent.title}
                          onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                          placeholder="e.g. Campus Celebration"
                          className="input-field text-xs"
                        />
                      </div>

                      <div>
                        <ImageUploadInput
                          label="Cover Image / Thumbnail"
                          value={newEvent.imageUrl}
                          onChange={(url) => setNewEvent({ ...newEvent, imageUrl: url })}
                          placeholder="Upload image file or paste URL..."
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Caption / Description</label>
                        <textarea
                          value={newEvent.caption}
                          onChange={(e) => setNewEvent({ ...newEvent, caption: e.target.value })}
                          placeholder="Brief caption..."
                          rows={2}
                          className="input-field text-xs resize-none"
                        />
                      </div>
                    </div>
                  </details>

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={handleAddOrUpdateEvent}
                      className="btn-green flex-1 flex items-center justify-center gap-2 py-3 text-sm font-bold shadow-md"
                    >
                      {editingIndex !== null ? <RefreshCw size={16} /> : <Plus size={16} />}
                      {editingIndex !== null ? 'Update Post / Reel' : 'Add Post / Reel'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Posts & Reels List */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-heading font-bold text-lg text-gray-900">
                    Live Instagram Feed Items ({events.length})
                  </h3>
                  <div className="text-xs font-semibold text-gray-400">
                    {events.filter((e) => e.postType === 'reel').length} Reels, {events.filter((e) => e.postType === 'post').length} Posts
                  </div>
                </div>

                {events.length === 0 ? (
                  <div className="py-12 text-center text-gray-400">No posts or reels added yet.</div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {events.map((ev, i) => {
                      const isReel = ev.postType === 'reel' || ev.url?.includes('/reel/');
                      const embedUrl = getInstagramEmbedUrl(ev.url);

                      return (
                        <div key={i} className={`border rounded-2xl overflow-hidden bg-white shadow-sm flex flex-col group relative transition-all ${
                          editingIndex === i ? 'ring-2 ring-amber-500 border-amber-500' : 'border-gray-150'
                        }`}>
                          {/* Control Buttons Header */}
                          <div className="p-3 bg-gray-50/60 border-b border-gray-100 flex items-center justify-between">
                            <div className="font-heading font-bold text-xs text-gray-900 truncate max-w-[150px]" title={ev.title}>
                              {ev.title}
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                                isReel ? 'bg-pink-100 text-pink-700' : 'bg-blue-100 text-blue-700'
                              }`}>
                                {isReel ? <Film size={10} /> : <ImageIcon size={10} />}
                                {isReel ? 'Reel' : 'Post'}
                              </span>
                              <button
                                onClick={() => startEditEvent(i)}
                                className="p-1.5 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                                title="Edit Item"
                              >
                                <Edit3 size={14} />
                              </button>
                              <button
                                onClick={() => deleteEvent(i)}
                                className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete Item"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>

                          {/* Live Embed or Custom Card Content */}
                          {embedUrl ? (
                            <div className="w-full bg-white flex items-center justify-center overflow-hidden p-1 min-h-[420px]">
                              <iframe
                                src={embedUrl}
                                className="w-full h-[440px] border-0 rounded-xl"
                                scrolling="no"
                                allowTransparency={true}
                                title={ev.title}
                              />
                            </div>
                          ) : (
                            <div className="p-3 flex-1 flex flex-col">
                              {/* Insta User line */}
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2 text-xs font-bold text-gray-800">
                                  <Instagram size={14} className="text-pink-600" />
                                  {ev.handle || instagramHandle}
                                </div>
                                <a href={ev.url} target="_blank" rel="noopener noreferrer" className="text-[10px] text-primary-700 font-semibold flex items-center gap-1 hover:underline">
                                  Link <ExternalLink size={10} />
                                </a>
                              </div>

                              {/* Image Thumbnail */}
                              <div className="aspect-video bg-gray-900 rounded-xl overflow-hidden relative group/img mb-3">
                                <img src={ev.imageUrl} alt={ev.title} className="w-full h-full object-cover" />
                                {isReel && (
                                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                    <div className="w-10 h-10 rounded-full bg-white/90 text-pink-600 flex items-center justify-center shadow-lg font-bold text-xs">
                                      🎬
                                    </div>
                                  </div>
                                )}
                              </div>

                              <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed mt-auto">
                                {ev.caption}
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
