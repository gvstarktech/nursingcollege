import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, MapPin, Phone, Mail, Clock, Send, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { FadeIn, StaggerChildren } from '../components/Animate';
import { SEO } from '../components/SEO';

interface ContentMap {
  [key: string]: { title?: string; subtitle?: string; content?: string; extra_data?: Record<string, unknown> };
}

export default function Contact() {
  const [content, setContent] = useState<ContentMap>({});
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    supabase.from('page_content').select('*').eq('page', 'contact').then(({ data }) => {
      if (data) {
        const map: ContentMap = {};
        data.forEach((item) => { map[item.section] = item; });
        setContent(map);
      }
    });

  }, []);

  const hero = content['hero'];
  const info = content['info']?.extra_data as { address?: string; phone?: string; email?: string; hours?: string } | null;

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    const cleanName = form.name.trim().replace(/[\x00-\x1F\x7F]/g, '').slice(0, 100);
    const cleanEmail = form.email.trim().toLowerCase().slice(0, 120);
    const cleanPhone = form.phone ? form.phone.trim().replace(/[^\d+]/g, '').slice(0, 16) : null;
    const cleanSubject = form.subject ? form.subject.trim().replace(/[\x00-\x1F\x7F]/g, '').slice(0, 150) : null;
    const cleanMessage = form.message.trim().replace(/[\x00-\x08\x0B-\x1F\x7F]/g, '').slice(0, 2000);

    if (cleanName.length < 2) {
      setError('Please enter your full name.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (cleanPhone) {
      const digitsOnly = cleanPhone.replace(/\D/g, '');
      if (digitsOnly.length < 10 || digitsOnly.length > 15) {
        setError('Please enter a valid 10-digit phone number.');
        return;
      }
    }

    if (cleanMessage.length < 5) {
      setError('Please enter a message with at least 5 characters.');
      return;
    }

    setLoading(true);
    const { error: err } = await supabase.from('contacts').insert({
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      subject: cleanSubject,
      message: cleanMessage,
    });
    setLoading(false);
    if (err) {
      setError('Failed to send your message. Please try again.');
    } else {
      setSuccess(true);
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    }
  }

  return (
    <div className="page-enter">
      <SEO 
        title="Mahalakshmi College of Nursing | Contact Us - Campus Location & Admissions Desk"
        description="Get in touch with Mahalakshmi College of Nursing in Trichy, Tamil Nadu. Admissions hotline: +91 73588 73106. Visit our campus on Trichy–Salem Highway, Melpathu, Mannachanallur Taluk, Tiruchirappalli."
        canonicalUrl="https://mahalakshmicollegeofnursing.com/contact"
        keywords={['Mahalakshmi College of Nursing', 'Contact Mahalakshmi Nursing College', 'Nursing College Trichy Phone Number', 'Nursing Admission Hotline Trichy', 'Mahalakshmi Campus Address']}
      />
      {/* Hero */}
      <section className="relative py-28 text-white overflow-hidden bg-primary-700">
        <div className="absolute inset-0 bg-cover bg-center opacity-20 hero-bg-animate"
          style={{ backgroundImage: "url('https://images.pexels.com/photos/1170412/pexels-photo-1170412.jpeg?auto=compress&cs=tinysrgb&w=1600')" }} />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="animate-fadeInDown text-green-300 font-semibold text-sm uppercase tracking-widest mb-3">{hero?.subtitle ?? 'We\'re Here to Help'}</p>
          <h1 className="animate-fadeInUp delay-100 text-4xl md:text-5xl font-heading font-bold mb-4">
            {hero?.title ?? 'Contact Us'}
            <span className="block text-lg md:text-xl font-normal text-green-300 mt-2">College Code: 986</span>
          </h1>
          <p className="animate-fadeInUp delay-200 text-gray-200 max-w-2xl mx-auto leading-relaxed">{hero?.content}</p>
          <div className="animate-fadeInUp delay-300 flex items-center justify-center gap-2 mt-6 text-sm text-gray-300">
            <Link to="/" className="hover:text-green-300 transition-colors">Home</Link>
            <ChevronRight size={14} />
            <span className="text-green-300">Contact</span>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-10 bg-green-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-white" staggerDelay={100} direction="up">
            {[
              { icon: MapPin, title: 'Address', value: info?.address ?? 'Trichy–Salem Highway, Thodayur Post, Melpathu Village, Mannachanallur Taluk, Tiruchirappalli, Tamil Nadu' },
              { icon: Phone, title: 'Phone', value: info?.phone ?? '+91 73588 73106' },
              { icon: Mail, title: 'Email', value: info?.email ?? 'info@mahalakshmicollegeofnursing.com' },
              { icon: Clock, title: 'Office Hours', value: info?.hours ?? 'Mon-Sat: 9:00 AM - 5:00 PM' },
            ].map(({ icon: Icon, title, value }) => (
              <div key={title} className="flex items-start gap-4 bg-white/10 rounded-2xl p-5">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                  <Icon size={20} />
                </div>
                <div>
                  <div className="font-semibold text-sm mb-1">{title}</div>
                  <div className="text-green-100 text-xs leading-relaxed">{value}</div>
                </div>
              </div>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* Contact Form + Map */}
      <section className="py-20 bg-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Form */}
            <FadeIn direction="left" duration={700}>
              <div>
              <p className="section-subtitle">Send a Message</p>
              <h2 className="section-title mb-8">Get In Touch</h2>
              {success ? (
                <div className="card p-10 text-center">
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
                    <CheckCircle size={32} className="text-green-500 animate-bounceIn" />
                  </div>
                  <h3 className="text-xl font-heading font-bold text-gray-900 mb-2">Message Sent!</h3>
                  <p className="text-gray-500 mb-6">Thank you for reaching out. We'll get back to you within 24 hours.</p>
                  <button onClick={() => setSuccess(false)} className="btn-primary">Send Another Message</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="card p-8 space-y-5">
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">{error}</div>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Your Name *</label>
                      <input name="name" value={form.name} onChange={handleChange} required className="input-field" placeholder="Full name" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address *</label>
                      <input name="email" value={form.email} onChange={handleChange} required type="email" className="input-field" placeholder="your@email.com" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
                      <input name="phone" value={form.phone} onChange={handleChange} className="input-field" placeholder="+91 XXXXX XXXXX" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Subject</label>
                      <input name="subject" value={form.subject} onChange={handleChange} className="input-field" placeholder="How can we help?" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Message *</label>
                    <textarea name="message" value={form.message} onChange={handleChange} required rows={5} className="input-field resize-none" placeholder="Write your message here..." />
                  </div>
                  <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
                    {loading ? (
                      <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sending...</>
                    ) : (
                      <><Send size={16} /> Send Message</>
                    )}
                  </button>
                </form>
              )}
              </div>
            </FadeIn>

            {/* Map */}
            <FadeIn direction="right" delay={150} duration={700}>
              <div>
              <p className="section-subtitle">Find Us</p>
              <h2 className="section-title mb-8">Our Location</h2>
              <div className="rounded-2xl overflow-hidden shadow-xl h-80 mb-6">
                <iframe
                  title="College Location"
                  src="https://maps.google.com/maps?q=Mahalakshmi%20College%20of%20Nursing%20Trichy&t=&z=15&ie=UTF8&iwloc=&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                />
              </div>
              <div className="card p-6">
                <h3 className="font-heading font-bold text-base text-gray-900 mb-4">Departments</h3>
                <div className="space-y-3 text-sm">
                  {[
                    { dept: 'Admissions Office', phone: '+91 73588 73106', email: 'info@mahalakshmicollegeofnursing.com' },
                  ].map((d) => (
                    <div key={d.dept} className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 py-2 border-b border-gray-100 last:border-0">
                      <span className="font-medium text-gray-700">{d.dept}</span>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span>{d.phone}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
    </div>
  );
}
