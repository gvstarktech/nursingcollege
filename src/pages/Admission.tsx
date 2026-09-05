import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, CheckCircle, User, Megaphone, Calendar, Tag, ShieldCheck } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useTypewriter } from '../hooks/useInView';
import type { AnnouncementItem } from '../admin/AdminAnnouncements';
import { SEO } from '../components/SEO';

const departments = [
  'B.Sc. Nursing (4 Years Degree)',
];

export default function Admission() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([]);
  const [form, setForm] = useState({
    full_name: '', phone: '', city: '', course_applied: '',
  });

  useEffect(() => {
    loadAnnouncements();
  }, []);

  async function loadAnnouncements() {
    try {
      const { data } = await supabase
        .from('page_content')
        .select('*')
        .eq('page', 'announcements')
        .order('updated_at', { ascending: false });

      if (data && data.length > 0) {
        const list: AnnouncementItem[] = data.map((row) => {
          const extra = (row.extra_data as any) || {};
          return {
            id: row.id,
            title: row.title || 'Official Notice',
            category: (row.subtitle as any) || 'Admission Notice',
            content: row.content || '',
            badge: extra.badge || 'Admissions 2026-27',
            target_page: extra.target_page || 'all',
            link_url: extra.link_url || '',
            image_url: extra.image_url || '',
            is_pinned: !!extra.is_pinned,
            is_active: extra.is_active !== undefined ? extra.is_active : true,
            created_at: row.updated_at || new Date().toISOString(),
          };
        }).filter((item) => item.is_active && (item.target_page === 'all' || item.target_page === 'admission'));

        setAnnouncements(list);
      } else {
        // Fallback default announcement
        setAnnouncements([
          {
            id: 'def-1',
            title: 'Official Nursing Admission Announcement 2026-27',
            category: 'Admission Notice',
            content: 'Applications are officially open for INC & TNC approved nursing degree and diploma programs (B.Sc. Nursing, Post Basic B.Sc. Nursing, M.Sc. Nursing, GNM, and ANM). Submit your online inquiry form below or visit our Trichy campus for spot admission counseling.',
            badge: 'Nursing Admissions 2026-27',
            target_page: 'admission',
            is_pinned: true,
            is_active: true,
            created_at: new Date().toISOString(),
          },
        ]);
      }
    } catch (err) {
      console.error(err);
    }
  }

  const collegeName = 'Mahalakshmi College of Nursing';
  const { displayed: typedName } = useTypewriter(collegeName, 50, 400);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    const cleanFullName = form.full_name.trim().replace(/[\x00-\x1F\x7F]/g, '').slice(0, 100);
    const cleanPhone = form.phone.trim().replace(/[^\d+]/g, '').slice(0, 16);
    const cleanCity = form.city.trim().replace(/[\x00-\x1F\x7F]/g, '').slice(0, 80);
    const cleanCourse = form.course_applied.trim().slice(0, 100);

    if (cleanFullName.length < 2) {
      setError('Please enter a valid full name.');
      return;
    }

    const digitsOnly = cleanPhone.replace(/\D/g, '');
    if (digitsOnly.length < 10 || digitsOnly.length > 15) {
      setError('Please enter a valid 10-digit phone number.');
      return;
    }

    if (!cleanCourse) {
      setError('Please select a course.');
      return;
    }

    setLoading(true);
    const { error: err } = await supabase.from('admissions').insert({
      full_name: cleanFullName,
      phone: cleanPhone,
      city: cleanCity,
      course_applied: cleanCourse,
    });
    setLoading(false);
    if (err) {
      setError('Submission failed. Please try again.');
    } else {
      setSuccess(true);
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-20">
        <div className="card p-12 text-center max-w-lg w-full">
          <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={48} className="text-green-500" />
          </div>
          <h2 className="text-3xl font-heading font-bold text-gray-900 mb-3">Thank You!</h2>
          <p className="text-gray-500 mb-2">
            We received your interest for <span className="font-semibold text-primary-700">{form.course_applied}</span>.
          </p>
          <p className="text-gray-600 mb-6 text-lg">
            Our admission team will contact you shortly.
          </p>
          <div className="bg-primary-50 rounded-xl p-4 mb-8 text-sm text-primary-700">
            Reference: <span className="font-bold">MCAHS{Date.now().toString().slice(-8)}</span>
          </div>
          <div className="flex gap-4">
            <Link to="/" className="btn-outline flex-1">Back to Home</Link>
            <Link to="/contact" className="btn-primary flex-1">Contact Us</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-enter">
      <SEO 
        title="Mahalakshmi College of Nursing | B.Sc Nursing Admissions 2026–27 | Trichy"
        description="Join Mahalakshmi College of Nursing, Trichy, for B.Sc Nursing education with experienced faculty, modern nursing laboratories, hospital-based clinical training, scholarships, hostel facilities, and placement assistance. Admissions are open for 2026–27."
        canonicalUrl="https://mahalakshmicollegeofnursing.com/admission"
        keywords={['Mahalakshmi College of Nursing', 'B.Sc Nursing Admissions 2026-27', 'Nursing Admission Trichy 2026', 'BSc Nursing Application Form', 'Direct Nursing Admission Trichy', 'INC Approved Nursing Seat Booking', 'GNM Admission Tamil Nadu']}
      />
      {/* Hero */}
      <section className="relative py-20 text-white bg-primary-700 overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-cover bg-center hero-bg-animate"
          style={{ backgroundImage: "url('https://images.pexels.com/photos/3985163/pexels-photo-3985163.jpeg?auto=compress&cs=tinysrgb&w=1600')" }} />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-green-300 font-semibold text-sm uppercase tracking-widest mb-3">Admissions Open 2026-27</p>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-4 min-h-[1.3em]">
            {typedName}
            <span className="inline-block w-[3px] md:w-[4px] h-[0.8em] bg-green-400 ml-1 animate-pulse align-middle" />
          </h1>
          <p className="text-gray-200 max-w-xl mx-auto">Begin your journey in healthcare. Read official admission bulletins and submit your application online.</p>
          <div className="flex items-center justify-center gap-2 mt-6 text-sm text-gray-300">
            <Link to="/" className="hover:text-green-300">Home</Link>
            <ChevronRight size={14} />
            <span className="text-green-300">Admission</span>
          </div>
        </div>
      </section>

      {/* Main Grid: Posted Information Notices & Admission Form */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Admin Posted Announcements & Information */}
            <div className="lg:col-span-6 space-y-6">
              
              <div className="bg-gradient-to-r from-primary-900 to-primary-800 text-white rounded-3xl p-6 md:p-8 shadow-md relative overflow-hidden">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-2xl bg-green-500/20 border border-green-400/30 flex items-center justify-center">
                    <Megaphone className="text-green-300" size={20} />
                  </div>
                  <div>
                    <h2 className="text-xl font-heading font-bold text-white">Official Information & Bulletins</h2>
                    <p className="text-xs text-primary-200">Posted directly by College Admissions Office</p>
                  </div>
                </div>
              </div>

              {/* Dynamic Notices List */}
              <div className="space-y-4">
                {announcements.map((item) => (
                  <div key={item.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:border-green-300 transition-all">
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                        <Tag size={12} /> {item.badge}
                      </span>
                      <span className="text-[11px] text-gray-400 flex items-center gap-1">
                        <Calendar size={12} /> {new Date(item.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>

                    <h3 className="font-heading font-bold text-gray-900 text-base md:text-lg mb-2">
                      {item.title}
                    </h3>

                    <p className="text-gray-600 text-sm leading-relaxed mb-4 whitespace-pre-line">
                      {item.content}
                    </p>

                    {item.image_url && (
                      <div className="mb-4 rounded-xl overflow-hidden shadow-sm">
                        <img src={item.image_url} alt={item.title} className="w-full h-44 object-cover" />
                      </div>
                    )}

                    <div className="flex items-center justify-between border-t border-gray-50 pt-3 text-xs">
                      <span className="text-primary-700 font-semibold flex items-center gap-1">
                        <ShieldCheck size={14} className="text-green-500" /> Verified College Bulletin
                      </span>
                      {item.link_url && (
                        <a href={item.link_url} className="btn-green text-[11px] px-4 py-1.5 font-bold">
                          View Details
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>

            </div>

            {/* Right Column: Admission Enquiry Form */}
            <div className="lg:col-span-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-6 text-sm">{error}</div>
              )}
              <form onSubmit={handleSubmit}>
                <div className="card p-8 border-t-4 border-primary-700 shadow-md">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-primary-700 text-white flex items-center justify-center font-bold">
                      <User size={18} />
                    </div>
                    <div>
                      <h2 className="text-xl font-heading font-bold text-gray-900">Online Admission Enquiry</h2>
                      <p className="text-xs text-gray-500">Fill your information for instant counselor response</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name *</label>
                      <input name="full_name" value={form.full_name} onChange={handleChange} required className="input-field" placeholder="Enter your full name" />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Department / Course *</label>
                      <select name="course_applied" value={form.course_applied} onChange={handleChange} required className="input-field">
                        <option value="">Select a Department</option>
                        {departments.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">City *</label>
                        <input name="city" value={form.city} onChange={handleChange} required className="input-field" placeholder="Your city" />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone Number *</label>
                        <input name="phone" value={form.phone} onChange={handleChange} required className="input-field" placeholder="+91 XXXXX XXXXX" />
                      </div>
                    </div>
                  </div>

                  <div className="mt-8">
                    <button type="submit" disabled={loading} className="btn-green w-full py-3.5 flex items-center justify-center gap-2 text-base font-bold shadow-md hover:scale-[1.01] transition-all">
                      {loading ? (
                        <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Submitting Application...</>
                      ) : 'Submit Admission Enquiry'}
                    </button>
                  </div>

                  <p className="text-center text-xs text-gray-500 mt-4">
                    Our admissions team will call back within 24 hours.
                  </p>
                </div>
              </form>
            </div>

          </div>

        </div>
      </section>
    </div>
  );
}
