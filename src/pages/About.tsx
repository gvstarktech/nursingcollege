import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, BookOpen, Target, Award, Users, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { FadeIn, StaggerChildren } from '../components/Animate';
import { SEO } from '../components/SEO';
import { PracticeHospitalsMarquee } from '../components/PracticeHospitals';

interface ContentMap {
  [key: string]: { title?: string; subtitle?: string; content?: string; extra_data?: Record<string, unknown> };
}

export default function About() {
  const [content, setContent] = useState<ContentMap>({});

  useEffect(() => {
    supabase.from('page_content').select('*').eq('page', 'about').then(({ data }) => {
      if (data) {
        const map: ContentMap = {};
        data.forEach((item) => { map[item.section] = item; });
        setContent(map);
      }
    });

  }, []);

  const hero = content['hero'];
  const vm = content['vision_mission'];
  const vmData = vm?.extra_data as { vision?: string; mission?: string } | null;
  const principal = content['principal_message'];

  const milestones = [
    { year: '2021', event: 'Mahalakshmi College of Nursing Established (Estd. 2021)' },
    { year: '2021', event: 'Founded under the leadership of Chairman Mr. Ravi as part of Mahalakshmi Group of Institutions' },
    { year: '2021', event: 'Recognized by INC (Indian Nursing Council) & TNC (Tamil Nadu Nurses Council)' },
    { year: '2021', event: 'Affiliated with The Tamil Nadu Dr. M.G.R. Medical University, Chennai' },
    { year: '2022', event: 'Hands-on Clinical Posting Partnership with NABH-Accredited Rathna Hospital, Trichy' },
    { year: '2024', event: 'Inauguration of Advanced OSCE Nursing Simulation Laboratories' },
    { year: '2026', event: 'Top-Ranked Nursing Institution in Trichy, Tamil Nadu' },
  ];

  return (
    <div className="page-enter">
      <SEO 
        title="Mahalakshmi College of Nursing | About Us - INC & TNNMC Recognized Institute"
        description="Learn about Mahalakshmi College of Nursing in Trichy. Estd. 2021 under Chairman Mr. Ravi. INC & TNNMC approved B.Sc. Nursing, P.B.B.Sc., M.Sc. Nursing & GNM with clinical simulation labs and Rathna Hospital postings."
        canonicalUrl="https://mahalakshmicollegeofnursing.com/about"
        keywords={['Mahalakshmi College of Nursing', 'About Mahalakshmi Nursing College', 'INC Recognized Nursing College Trichy', 'Chairman Mr. Ravi Mahalakshmi Group', 'Best Nursing Institution Tamil Nadu']}
      />
      {/* Hero */}
      <section
        className="relative py-28 bg-primary-700 text-white overflow-hidden hero-bg-animate"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=1600')", backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="absolute inset-0 bg-primary-900/85" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="animate-fadeInDown text-green-300 font-semibold text-sm uppercase tracking-widest mb-3">{hero?.subtitle ?? 'Part of Mahalakshmi Group of Institutions'}</p>
          <h1 className="animate-fadeInUp delay-100 text-4xl md:text-5xl font-heading font-bold mb-4">
            {hero?.title ?? 'About Mahalakshmi College of Nursing'}
            <span className="block text-lg md:text-xl font-normal text-green-300 mt-2">Best Nursing College in Trichy, Tamil Nadu (Estd. 2021)</span>
          </h1>
          <p className="animate-fadeInUp delay-200 text-gray-200 max-w-2xl mx-auto leading-relaxed">{hero?.content ?? 'Under the leadership of Chairman Mr. Ravi, established in 2021 to shape competent and compassionate nursing professionals combining theoretical learning with practical brilliance at NABH-accredited Rathna Hospital, Trichy.'}</p>
          <div className="animate-fadeInUp delay-300 flex items-center justify-center gap-2 mt-6 text-sm text-gray-300">
            <Link to="/" className="hover:text-green-300 transition-colors">Home</Link>
            <ChevronRight size={14} />
            <span className="text-green-300">About Us</span>
          </div>
        </div>
      </section>

      {/* Official Accreditation & University Affiliation Section */}
      <section className="py-10 bg-primary-900 text-white border-b border-primary-800 shadow-inner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/15">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="inline-block bg-green-500 text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  INC & TNC Recognized | M.G.R. University Affiliated
                </div>
                <h2 className="text-xl md:text-2xl font-heading font-bold text-white">
                  Best Nursing College in Trichy, Tamil Nadu (Estd. 2021)
                </h2>
                <p className="text-sm text-gray-200 leading-relaxed max-w-3xl">
                  Part of <strong>Mahalakshmi Group of Institutions</strong>, under the leadership of <strong>Chairman Mr. Ravi</strong>, Mahalakshmi College of Nursing was established in 2021. Students gain hands-on clinical training at <strong>NABH-accredited Rathna Hospital, Trichy</strong>, ensuring excellent practical exposure and clinical brilliance.
                </p>
              </div>
              <div className="flex flex-wrap md:flex-col gap-2.5 flex-shrink-0 text-center">
                <div className="bg-white text-primary-900 px-4 py-2 rounded-xl text-xs font-bold shadow">
                  Estd. 2021
                </div>
                <div className="bg-green-500 text-white px-4 py-2 rounded-xl text-xs font-bold shadow">
                  NABH Clinical Partner
                </div>
                <div className="bg-primary-700 text-white px-4 py-2 rounded-xl text-xs font-bold border border-primary-600">
                  College Code: 986
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-20 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn direction="up">
            <div className="text-center mb-14">
              <p className="section-subtitle">Our Foundation</p>
              <h2 className="section-title">{vm?.title ?? 'Vision & Mission'}</h2>
            </div>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FadeIn direction="left" delay={100}>
              <div className="card p-8 border-t-4 border-primary-700 card-hover">
                <div className="w-14 h-14 rounded-2xl bg-primary-50 flex items-center justify-center mb-5 animate-float-slow">
                  <Eye size={26} className="text-primary-700" />
                </div>
                <h3 className="font-heading font-bold text-xl text-primary-700 mb-3">Our Vision</h3>
                <p className="text-gray-600 leading-relaxed">
                  {vmData?.vision ?? 'To be a premier institution of global distinction in nursing education, clinical research, and compassionate healthcare service.'}
                </p>
              </div>
            </FadeIn>
            <FadeIn direction="right" delay={200}>
              <div className="card p-8 border-t-4 border-green-500 card-hover">
                <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center mb-5 animate-float">
                  <Target size={26} className="text-green-600" />
                </div>
                <h3 className="font-heading font-bold text-xl text-green-600 mb-3">Our Mission</h3>
                <p className="text-gray-600 leading-relaxed">
                  {vmData?.mission ?? 'To empower nursing students with evidence-based clinical knowledge, advanced OSCE simulation skills, patient empathy, and high moral standards.'}
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Chairman's Message */}
      <section className="py-20 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <FadeIn direction="left" duration={700} className="lg:col-span-5">
              <div className="sticky top-28">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-gradient-to-b from-primary-900 to-primary-950 p-2">
                  <img
                    src="/Chairman.webp"
                    alt="R. Ravi - Chairman of Mahalakshmi Group of Institutions"
                    className="rounded-2xl w-full h-[450px] object-cover object-top"
                  />
                  <div className="absolute bottom-6 left-6 right-6 bg-primary-950/90 backdrop-blur-md rounded-2xl p-5 border border-white/10 shadow-xl text-white">
                    <div className="font-heading font-bold text-xl text-amber-300">R. Ravi</div>
                    <div className="text-green-400 text-sm font-semibold tracking-wide">Chairman</div>
                    <div className="text-gray-300 text-xs mt-0.5">Mahalakshmi Group of Institutions</div>
                  </div>
                </div>
              </div>
            </FadeIn>

            <FadeIn direction="right" delay={150} duration={700} className="lg:col-span-7">
              <div>
                <span className="text-green-600 font-semibold text-sm uppercase tracking-widest">Leadership Vision</span>
                <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary-900 mt-2 mb-6">Chairman's Message</h2>
                
                <div className="prose prose-slate max-w-none text-gray-700 space-y-5 text-base leading-relaxed">
                  <p>
                    Welcome to <strong className="text-primary-800 font-semibold">Mahalakshmi College of Nursing</strong>, an institution dedicated to nurturing compassionate healthcare professionals through excellence in nursing education, ethical values, and clinical expertise. It gives me immense pleasure to welcome aspiring students and their families to our institution, where academic excellence meets human care. Our college is committed to preparing future nurses who are not only highly skilled professionals but also compassionate caregivers capable of making a meaningful difference in the lives of individuals and communities.
                  </p>
                  
                  <p>
                    Healthcare is one of the most essential pillars of society, and nurses play a vital role in ensuring quality patient care. As the healthcare industry continues to evolve with advancements in medical science, technology, and patient-centered care, the demand for qualified, confident, and compassionate nursing professionals has never been greater. At Mahalakshmi College of Nursing, we strive to empower our students with the knowledge, clinical competence, critical thinking, and ethical values required to excel in this noble profession.
                  </p>

                  <div className="my-6 bg-primary-50/60 border-l-4 border-primary-700 p-5 rounded-r-2xl">
                    <h3 className="text-lg font-heading font-bold text-primary-900 mb-2">The Importance of Nursing Education in Today's Healthcare Environment</h3>
                    <p className="text-gray-700 text-sm leading-relaxed mb-0">
                      The modern healthcare system requires nursing professionals who possess not only clinical expertise but also leadership qualities, empathy, communication skills, and the ability to adapt to rapidly changing healthcare technologies. From preventive healthcare and community wellness to critical care and specialized medical services, nurses have become indispensable in every aspect of patient care.
                    </p>
                  </div>

                  <p>
                    At Mahalakshmi College of Nursing, our academic programs are thoughtfully designed to combine classroom learning with extensive hands-on clinical training. Through state-of-the-art laboratories, experienced faculty members, hospital-based practical exposure, and evidence-based learning methodologies, our students develop the confidence and competence needed to serve patients with professionalism and compassion.
                  </p>

                  <p>
                    We strongly believe that nursing is more than a profession—it is a lifelong commitment to humanity. Therefore, we emphasize discipline, integrity, empathy, teamwork, and continuous learning throughout the educational journey. Our objective is to develop healthcare professionals who uphold the highest standards of patient care while contributing to the advancement of the healthcare sector and the well-being of society.
                  </p>

                  <p>
                    As healthcare continues to embrace innovation, digital technologies, and global standards, Mahalakshmi College of Nursing remains committed to providing an education that prepares students for successful careers both nationally and internationally. We encourage every student to pursue excellence, embrace lifelong learning, and become leaders who inspire positive change in healthcare.
                  </p>

                  <p>
                    I warmly invite you to become a part of Mahalakshmi College of Nursing and embark on a journey of knowledge, service, and professional excellence. Together, let us shape a healthier future through dedication, compassion, and quality nursing education.
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200 flex items-center justify-between">
                  <div>
                    <div className="text-xs uppercase tracking-widest font-bold text-gray-400 mb-1">Best Wishes,</div>
                    <div className="font-heading font-bold text-xl text-primary-900">R. Ravi</div>
                    <div className="text-green-600 font-semibold text-sm">Chairman</div>
                    <div className="text-gray-500 text-xs">Mahalakshmi Group of Institutions</div>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Principal's Message */}
      <section className="py-20 bg-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <FadeIn direction="left" duration={700} className="lg:col-span-5">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-gradient-to-b from-primary-900 to-primary-950 p-2 max-w-md mx-auto lg:mx-0">
                <img
                  src="/nursing_principal.jpeg"
                  alt="Principal - Mahalakshmi College of Nursing"
                  className="rounded-2xl w-full h-[420px] object-cover object-top"
                />
                <div className="absolute bottom-6 left-6 right-6 bg-primary-950/90 backdrop-blur-md rounded-2xl p-4 border border-white/10 shadow-xl text-white">
                  <div className="font-heading font-bold text-lg text-amber-300">{principal?.subtitle || 'Prof. Vasantha Rengasamy'}</div>
                  <div className="text-green-400 text-sm font-semibold tracking-wide">Principal</div>
                  <div className="text-gray-300 text-xs mt-0.5">Mahalakshmi College of Nursing</div>
                </div>
              </div>
            </FadeIn>
            <FadeIn direction="right" delay={150} duration={700} className="lg:col-span-7">
              <div>
                <p className="section-subtitle">Leadership</p>
                <h2 className="section-title mb-6">{principal?.title || "Principal's Message"}</h2>
                <div className="relative">
                  <div className="text-6xl text-green-200 font-serif leading-none mb-2 font-bold animate-float-slow">"</div>
                  <p className="text-gray-600 leading-relaxed text-lg italic -mt-4">
                    {principal?.content || 'Welcome to Mahalakshmi College of Nursing. Nursing is more than a profession—it is a noble calling centered on human dignity, clinical competence, and healing care. We prepare our students for leading healthcare careers across top hospitals globally.'}
                  </p>
                  <div className="text-6xl text-green-200 font-serif leading-none text-right -mb-4">"</div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Milestones */}
      <section className="py-20 bg-primary-700 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn direction="up">
            <div className="text-center mb-14">
              <p className="text-green-300 font-semibold text-sm uppercase tracking-widest mb-2">Our Journey</p>
              <h2 className="text-3xl md:text-4xl font-heading font-bold">Key Milestones</h2>
            </div>
          </FadeIn>
          <StaggerChildren className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6" staggerDelay={100} baseDelay={100}>
            {milestones.map((m, i) => (
              <div key={i} className="text-center group">
                <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-3 text-white font-bold text-sm group-hover:scale-110 group-hover:bg-white group-hover:text-green-600 transition-all duration-300">
                  {m.year}
                </div>
                <p className="text-gray-200 text-sm font-medium">{m.event}</p>
              </div>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn direction="up">
            <div className="text-center mb-14">
              <p className="section-subtitle">What Defines Us</p>
              <h2 className="section-title">Our Core Values</h2>
            </div>
          </FadeIn>
          <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8" staggerDelay={120} baseDelay={50}>
            {[
              { icon: Award, title: 'Excellence', desc: 'Striving for the highest standards in education and practice.' },
              { icon: Users, title: 'Compassion', desc: 'Nurturing empathetic and patient-centered caregivers.' },
              { icon: BookOpen, title: 'Integrity', desc: 'Upholding ethical values in all aspects of education and service.' },
              { icon: Target, title: 'Innovation', desc: 'Embracing new methods and technologies in healthcare education.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="text-center p-8 rounded-2xl bg-gradient-to-br from-gray-50 to-primary-50 border border-primary-100 hover:shadow-lg transition-all duration-300 group card-hover">
                <div className="w-16 h-16 rounded-full bg-primary-700 text-white flex items-center justify-center mx-auto mb-5 group-hover:bg-green-500 transition-colors duration-300 group-hover:scale-110 transition-transform">
                  <Icon size={26} />
                </div>
                <h3 className="font-heading font-bold text-lg text-primary-700 mb-2">{title}</h3>
                <p className="text-gray-500 text-sm">{desc}</p>
              </div>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* Practice Hospitals Marquee */}
      <PracticeHospitalsMarquee />

      {/* CTA */}
      <section className="py-16 bg-green-500 text-white text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/5 translate-x-1/2 -translate-y-1/2" />
        <FadeIn direction="up">
          <div className="max-w-3xl mx-auto px-4 relative z-10">
            <h2 className="text-3xl font-heading font-bold mb-4">Be Part of Our Legacy</h2>
            <p className="text-green-100 mb-8">Join thousands of healthcare professionals who started their journey at Mahalakshmi College.</p>
            <Link to="/admission" className="bg-white text-green-600 hover:bg-green-50 font-bold px-8 py-3 rounded-lg inline-flex items-center gap-2 transition-all hover:-translate-y-0.5 hover:shadow-lg active:scale-95">
              Apply for Admission <ChevronRight size={16} />
            </Link>
          </div>
        </FadeIn>
      </section>
    </div>
  );
}
