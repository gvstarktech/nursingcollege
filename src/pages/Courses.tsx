import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, BookOpen } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { FadeIn, StaggerChildren } from '../components/Animate';
import { SEO } from '../components/SEO';

interface ContentMap {
  [key: string]: { title?: string; subtitle?: string; content?: string; extra_data?: Record<string, unknown> };
}

const allCourses = [
  {
    category: 'Undergraduate Degree Program',
    color: 'border-primary-700',
    badge: 'bg-primary-50 text-primary-700',
    courses: [
      { 
        slug: 'bsc-nursing', 
        name: 'Bachelor of Science in Nursing (B.Sc Nursing)', 
        duration: '4 Years Degree Program', 
        description: 'B.Sc Nursing is a four-year professional degree combining theoretical study and intensive bedside hospital clinical rotations at 10+ bed partner hospitals with 9 specialized simulation labs.' 
      },
    ],
  },
  {
    category: 'Diploma & Post Basic Programs',
    color: 'border-green-600',
    badge: 'bg-green-50 text-green-700',
    courses: [
      { 
        slug: 'gnm-nursing', 
        name: 'General Nursing and Midwifery (GNM)', 
        duration: '3 Years Diploma Program', 
        description: '3-year hands-on diploma course focusing on comprehensive bedside clinical nursing, emergency room support, maternity, and patient recovery care.' 
      },
      { 
        slug: 'post-basic-bsc-nursing', 
        name: 'Post Basic B.Sc. Nursing (P.B.B.Sc)', 
        duration: '2 Years Degree Program', 
        description: 'Designed for registered nurses with GNM qualification to upgrade to a full Bachelor of Science degree for senior hospital supervisor and nursing administrator roles.' 
      },
    ],
  },
];

export default function Courses() {
  const [content, setContent] = useState<ContentMap>({});

  useEffect(() => {
    supabase.from('page_content').select('*').eq('page', 'courses').then(({ data }) => {
      if (data) {
        const map: ContentMap = {};
        data.forEach((item) => { map[item.section] = item; });
        setContent(map);
      }
    });
  }, []);

  const hero = content['hero'];

  const coursesItemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Nursing Programs Offered at Mahalakshmi College of Nursing",
    "description": "INC & TNNMC recognized B.Sc Nursing, GNM, and Post Basic B.Sc programs in Tamil Nadu.",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "B.Sc. Nursing (Bachelor of Science in Nursing)",
        "url": "https://mahalakshmicollegeofnursing.com/courses/bsc-nursing"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "General Nursing and Midwifery (GNM)",
        "url": "https://mahalakshmicollegeofnursing.com/courses/gnm-nursing"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Post Basic B.Sc. Nursing (P.B.B.Sc)",
        "url": "https://mahalakshmicollegeofnursing.com/courses/post-basic-bsc-nursing"
      }
    ]
  };

  return (
    <div className="page-enter">
      <SEO 
        title="Best Nursing Courses in Tamil Nadu (2026) | Mahalakshmi College of Nursing"
        description="Explore B.Sc Nursing, GNM & Post Basic B.Sc courses at Mahalakshmi College of Nursing, Tamil Nadu. INC Code 986, 10+ bed hospital rotations & 100% placements."
        canonicalUrl="https://mahalakshmicollegeofnursing.com/courses"
        keywords={['best nursing courses in tamil nadu', 'best nursing college in tamilnadu', 'BSc Nursing Course Trichy', 'GNM Nursing Admission Tamil Nadu', 'Post Basic BSc Nursing', 'INC Code 986']}
        schema={coursesItemListSchema}
      />
      {/* Hero */}
      <section
        className="relative py-28 text-white overflow-hidden hero-bg-animate"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=1600')", backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="absolute inset-0 bg-primary-900/85" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="animate-fadeInDown text-green-300 font-semibold text-sm uppercase tracking-widest mb-3">{hero?.subtitle ?? 'INC & TNC Recognized Nursing Programs'}</p>
          <h1 className="animate-fadeInUp delay-100 text-4xl md:text-5xl font-heading font-bold mb-4">{hero?.title ?? 'Nursing Academic Programs'}</h1>
          <p className="animate-fadeInUp delay-200 text-gray-200 max-w-2xl mx-auto leading-relaxed">{hero?.content ?? 'Empowering healthcare professionals with state-of-the-art clinical simulation labs and 100% hospital placement support.'}</p>
          <div className="animate-fadeInUp delay-300 flex items-center justify-center gap-2 mt-6 text-sm text-gray-300">
            <Link to="/" className="hover:text-green-300 transition-colors">Home</Link>
            <ChevronRight size={14} />
            <span className="text-green-300">Courses</span>
          </div>
        </div>
      </section>


      {/* Courses Grid */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn direction="up">
            <div className="text-center mb-16">
              <p className="section-subtitle">Academic Programs</p>
              <h2 className="section-title">Nursing Courses & Admissions in Trichy</h2>
              <p className="text-gray-500 mt-3 max-w-xl mx-auto">Prepare for a thriving career in nursing and healthcare with our INC & TNC approved degree and diploma programs.</p>
            </div>
          </FadeIn>

          <div className="space-y-16">
            {allCourses.map((cat) => (
              <div key={cat.category}>
                <FadeIn direction="up">
                  <h2 className="text-2xl font-heading font-bold text-gray-900 mb-8 border-b border-gray-200 pb-3 flex items-center gap-2">
                    <BookOpen className="text-primary-700" size={24} />
                    {cat.category}
                  </h2>
                </FadeIn>
                <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" staggerDelay={80} baseDelay={50}>
                  {cat.courses.map((course) => (
                    <div key={course.name} className={`card p-6 border-l-4 ${cat.color} card-hover group flex flex-col justify-between`}>
                      <div>
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <h3 className="font-heading font-bold text-lg text-gray-900 group-hover:text-primary-700 transition-colors">{course.name}</h3>
                          <span className={`text-xs font-semibold px-3 py-1 rounded-full flex-shrink-0 ${cat.badge}`}>
                            {course.duration}
                          </span>
                        </div>
                        <p className="text-gray-500 text-sm mb-6 leading-relaxed">{course.description}</p>
                      </div>
                      <div className="flex items-center justify-between border-t border-gray-50 pt-4 mt-auto">
                        <Link to={`/courses/${course.slug}`} className="text-primary-700 hover:text-green-600 text-xs font-bold flex items-center gap-1 transition-all hover:gap-1.5">
                          View Details <ChevronRight size={13} />
                        </Link>
                        <Link to="/admission" className="text-green-600 hover:text-primary-700 text-xs font-bold flex items-center gap-1 transition-all hover:gap-1.5">
                          Apply Now <ChevronRight size={13} />
                        </Link>
                      </div>
                    </div>
                  ))}
                </StaggerChildren>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Admission Process */}
      <section className="py-20 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn direction="up">
            <div className="text-center mb-14">
              <p className="section-subtitle">Simple Steps</p>
              <h2 className="section-title">Admission Process</h2>
            </div>
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Submit Application', desc: 'Fill out the online admission form with your personal and academic details.' },
              { step: '02', title: 'Document Verification', desc: 'Upload required documents for verification by our admissions team.' },
              { step: '03', title: 'Merit/Interview', desc: 'Selected candidates are called for a merit review or counseling session.' },
              { step: '04', title: 'Enrollment & Fees', desc: 'Confirm your seat by completing enrollment and paying the admission fees.' },
            ].map((s, i) => (
              <div key={s.step} className="text-center relative" style={{ animation: `fadeInUp 0.6s ease ${200 + i * 120}ms both` }}>
                <div className="w-16 h-16 rounded-full bg-primary-700 text-white text-xl font-heading font-bold flex items-center justify-center mx-auto mb-5 shadow-lg hover:bg-green-500 transition-colors duration-300 hover:scale-110 transition-transform cursor-default">
                  {s.step}
                </div>
                <h3 className="font-heading font-bold text-base text-gray-900 mb-2">{s.title}</h3>
                <p className="text-gray-500 text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
          <FadeIn direction="up" delay={300}>
            <div className="text-center mt-12">
              <Link to="/admission" className="btn-primary text-base px-10 py-3.5 group">
                Start Your Application
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
